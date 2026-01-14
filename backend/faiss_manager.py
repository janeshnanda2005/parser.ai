
import os
import numpy as np
from sentence_transformers import SentenceTransformer
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader, JSONLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.embeddings import Embeddings

# Constants
FAISS_INDEX_PATH = os.path.join(os.path.dirname(__file__), "faiss_index")
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"


class LocalEmbeddings(Embeddings):
    """Custom embeddings class using sentence-transformers directly"""
    def __init__(self, model_name: str):
        self.model = SentenceTransformer(model_name)
    
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()
    
    def embed_query(self, text: str) -> list[float]:
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding.tolist()


def load_documents():
    """Load documents from data directories"""
    backend_dir = os.path.dirname(__file__)
    
    loader = DirectoryLoader(
        os.path.join(backend_dir,"data"),
        glob="**/*.json",
        loader_cls=JSONLoader,
        show_progress=True,
        loader_kwargs=({"content_key":"text"})
    )

    documents = loader.load()
    print(f"Loaded {len(documents)} documents.")
    


def create_and_save_vectorstore():
    """Create FAISS vectorstore from documents and save it locally"""
    print("Loading documents...")
    documents = load_documents()
    
    print("Splitting documents into chunks...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")
    
    print("Creating embeddings and vectorstore...")
    embeddings = LocalEmbeddings(EMBEDDING_MODEL)
    vectorstore = FAISS.from_documents(chunks, embeddings)
    
    print(f"Saving vectorstore to {FAISS_INDEX_PATH}...")
    vectorstore.save_local(FAISS_INDEX_PATH)
    print("Vectorstore saved successfully!")
    
    return vectorstore


def load_vectorstore():
    """Load FAISS vectorstore from local storage for inference"""
    embeddings = LocalEmbeddings(EMBEDDING_MODEL)
    print(f"Loading vectorstore from {FAISS_INDEX_PATH}...")
    vectorstore = FAISS.load_local(
        FAISS_INDEX_PATH, 
        embeddings, 
        allow_dangerous_deserialization=True
    )
    print("Vectorstore loaded successfully!")
    return vectorstore


def get_or_create_vectorstore(force_recreate=False):
    """
    Get vectorstore - load from disk if exists, otherwise create and save.
    
    Args:
        force_recreate: If True, recreate the vectorstore even if it exists
    
    Returns:
        FAISS vectorstore instance
    """
    return load_vectorstore()


def similarity_search(query: str, k: int = 10):
    """
    Perform similarity search on the vectorstore
    
    Args:
        query: Search query string
        k: Number of results to return
    
    Returns:
        List of similar documents
    """
    vectorstore = load_vectorstore()
    docs = vectorstore.similarity_search(query, k=k)
    return docs



if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="FAISS Vector Store Manager")
    parser.add_argument("--rebuild", action="store_true", help="Force rebuild the index")
    parser.add_argument("--search", type=str, help="Test search query")
    args = parser.parse_args()
    
    if args.rebuild:
        print("Rebuilding FAISS index...")
        create_and_save_vectorstore()
    elif args.search:
        print(f"Searching for: {args.search}")
        results = similarity_search(args.search)
        for i, doc in enumerate(results, 1):
            print(f"\n--- Result {i} ---")
            print(doc.page_content[:500])
    else:
        vectorstore = get_or_create_vectorstore()
        print(f"Vectorstore ready with index at: {FAISS_INDEX_PATH}")
