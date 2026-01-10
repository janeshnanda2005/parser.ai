from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv

# Fix langchain attribute issues
import langchain
if not hasattr(langchain, 'verbose'):
    langchain.verbose = False
if not hasattr(langchain, 'debug'):
    langchain.debug = False
if not hasattr(langchain, 'llm_cache'):
    langchain.llm_cache = None

from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()

# Global variables for RAG components (lazy loaded)
vectorstore = None
retriever = None
llm = None

def get_data_dir():
    """Get the data directory path"""
    return os.path.join(os.path.dirname(__file__), 'data')

def get_faiss_dir():
    """Get the FAISS index directory path"""
    return os.path.join(os.path.dirname(__file__), 'faiss_index')

def initialize_rag():
    """Initialize the RAG components (embeddings, vectorstore, LLM)"""
    global vectorstore, retriever, llm
    
    if vectorstore is not None:
        return  # Already initialized
    
    try:
        from langchain_huggingface import HuggingFaceEmbeddings
        from langchain_community.vectorstores import FAISS
        
        OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
        
        # Load embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Load FAISS index
        faiss_path = get_faiss_dir()
        if os.path.exists(os.path.join(faiss_path, "index.faiss")):
            vectorstore = FAISS.load_local(faiss_path, embeddings, allow_dangerous_deserialization=True)
            retriever = vectorstore.as_retriever(search_kwargs={"k": 10})
        
        # Initialize LLM
        llm = ChatOpenAI(
            model="deepseek/deepseek-r1-0528:free",
            temperature=0.6,
            openai_api_key=os.getenv("OPENROUTER_API_KEY"),
            openai_api_base=OPENROUTER_BASE_URL,
            max_tokens=30000,
            default_headers={
                "HTTP-Referer": os.getenv("VERCEL_URL", "http://localhost:3000"),
                "X-Title": "Job Tracker RAG App"
            },
        )
        
        print("RAG components initialized successfully!")
    except Exception as e:
        print(f"Error initializing RAG: {e}")

def rag_answer(query: str) -> str:
    """Get RAG-based answer for a job query"""
    global retriever, llm
    
    initialize_rag()
    
    if retriever is None or llm is None:
        return "RAG system not initialized. Please try again later."
    
    relevant_docs = retriever.invoke(query)
    context = "\n".join([doc.page_content for doc in relevant_docs])
    
    prompt = f"""
    Answer the question based on the context below and give the accurate result from this and list down the jobs as bullet points and give a detailed description about the job:

    Context: {context}

    Question: {query}

    Answer:
    - If you don't know the answer, tell the user that you don't know the answer for the specific question.
    - If you don't have the salary, please reason it yourself and give a predicted salary range for the job.
    - Also give the link to apply to a job if available in the context.(this should be clickable link)
    - Give the required skills for the job. 
    - Provide a brief JD (Job Description) summary for the job role.
    - Format the answer in markdown for better readability.
    - Use bullet points where necessary.
    - Be concise and to the point.
    """
    
    response = llm.invoke(prompt)
    clean_response = response.content.replace("**", "")
    return clean_response

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    """Get all jobs from data files"""
    jobs = []
    data_dir = get_data_dir()
    
    if not os.path.exists(data_dir):
        return jsonify([]), 200
    
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            filepath = os.path.join(data_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    jobs.extend(data)
                else:
                    jobs.append(data)
    
    return jsonify(jobs), 200

@app.route('/api/jobs/<category>', methods=['GET'])
def get_jobs_by_category(category):
    """Get jobs by category (e.g., 'software', 'devops')"""
    data_dir = get_data_dir()
    filename = f"{category}_jobs.json"
    filepath = os.path.join(data_dir, filename)
    
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data), 200
    else:
        return jsonify({"error": f"Category '{category}' not found"}), 404

@app.route('/api/search', methods=['POST'])
def search_jobs():
    """Search jobs using RAG-based query"""
    data = request.get_json()
    
    if not data or 'query' not in data:
        return jsonify({"error": "Query is required"}), 400
    
    query = data['query']
    
    if not query.strip():
        return jsonify({"error": "Query cannot be empty"}), 400
    
    try:
        search_query = f"{query} jobs list them out"
        answer = rag_answer(search_query)
        return jsonify({
            "query": query,
            "answer": answer
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Vercel serverless handler
def handler(request):
    return app(request)
