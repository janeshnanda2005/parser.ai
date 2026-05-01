import dotenv from 'dotenv';
import { similaritySearch } from './faiss-manager.js';
import logger from './logger.js';

dotenv.config();

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.LLM_MODEL || 'xiaomi/mimo-v2-flash:free';

/**
 * Call OpenRouter API for LLM response
 */
async function callLLM(prompt) {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY environment variable not set');
    }
    
    try {
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Job Tracker RAG App'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.6,
                max_tokens: 30000
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`LLM API error: ${error.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response from LLM';
    } catch (error) {
        logger.error('Error calling LLM', error);
        throw error;
    }
}

/**
 * Generate RAG-based answer for a job query
 */
export async function ragAnswer(query) {
    try {
        // Retrieve relevant documents using similarity search
        logger.debug('Retrieving relevant documents...');
        const relevantDocs = await similaritySearch(query, 10);
        
        // Build context from retrieved documents
        const context = relevantDocs
            .map(doc => doc.content)
            .join('\n---\n');
        
        // Build prompt
        const prompt = `
Answer the question based on the context below and give the accurate result from this and list down the jobs as bullet points and give a detailed description about the job:

Context: ${context}

Question: ${query}

Answer:
- If you don't know the answer, tell the user that you don't know the answer for the specific question.
- If you don't have the salary, please reason it yourself and give a predicted salary range for the job given in Indian rupee term (only give the salary range) no other thing should be in salary's placeholder.
- Also give the link to apply to a job if available in the context. (this should be clickable link)
- Give the required skills for the job.
- Provide a brief JD (Job Description) summary for the job role.
- Format the answer in markdown for better readability.
- Use bullet points where necessary.
- Be concise and to the point.
`;
        
        // Call LLM
        logger.debug('Generating response from LLM...');
        const response = await callLLM(prompt);
        
        // Clean response (remove extra asterisks if present)
        const cleanResponse = response.replace(/\*\*/g, '');
        
        return cleanResponse;
    } catch (error) {
        logger.error('Error generating RAG answer', error);
        throw error;
    }
}

/**
 * Batch RAG answers for multiple queries
 */
export async function ragAnswerBatch(queries) {
    try {
        const answers = await Promise.all(
            queries.map(q => ragAnswer(q))
        );
        return answers;
    } catch (error) {
        logger.error('Error in batch RAG answers', error);
        throw error;
    }
}

/**
 * Simple chat with context
 */
export async function simpleChat(message, context = '') {
    try {
        const prompt = context 
            ? `Context: ${context}\n\nMessage: ${message}`
            : message;
        
        return await callLLM(prompt);
    } catch (error) {
        logger.error('Error in simple chat', error);
        throw error;
    }
}

export { callLLM };
