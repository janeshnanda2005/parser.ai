import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pipeline } from '@xenova/transformers';
import logger from './logger.js';
import { config } from './config.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FAISS_INDEX_PATH = path.join(__dirname, 'faiss_index');
const EMBEDDINGS_FILE = path.join(FAISS_INDEX_PATH, 'embeddings.json');
const METADATA_FILE = path.join(FAISS_INDEX_PATH, 'metadata.json');
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

let extractor = null;
let vectorStore = null;
let initialized = false;

/**
 * Initialize the embedding model
 */
async function initializeModel() {
    if (extractor) return extractor;
    logger.info('Initializing embedding model...');
    extractor = await pipeline('feature-extraction', EMBEDDING_MODEL);
    return extractor;
}

/**
 * Generate embeddings for texts
 */
async function generateEmbeddings(texts) {
    const model = await initializeModel();
    const embeddings = await model(texts, { pooling: 'mean', normalize: true });
    
    // Convert to array if single text
    if (texts.length === 1) {
        return [Array.from(embeddings.data)];
    }
    
    return embeddings.tolist ? embeddings.tolist() : 
           Array.from(embeddings).map(e => Array.from(e.data));
}

/**
 * Load documents from data directory
 */
function loadDocuments() {
    const dataDir = path.join(__dirname, 'data');
    const documents = [];
    
    try {
        const files = fs.readdirSync(dataDir);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                const filePath = path.join(dataDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(content);
                
                if (Array.isArray(data)) {
                    documents.push(...data);
                } else {
                    documents.push(data);
                }
            }
        }
        
        logger.info(`Loaded ${documents.length} documents from data directory`);
        return documents;
    } catch (error) {
        logger.error('Error loading documents', error);
        return [];
    }
}

/**
 * Split documents into chunks
 */
function splitDocuments(documents, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    
    for (const doc of documents) {
        let text = '';
        
        if (typeof doc === 'string') {
            text = doc;
        } else if (typeof doc === 'object') {
            // Convert document object to text representation
            text = JSON.stringify(doc);
        }
        
        // Split into chunks
        for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
            const chunk = text.substring(i, i + chunkSize);
            if (chunk.trim()) {
                chunks.push({
                    content: chunk,
                    metadata: {
                        source: doc.source || 'job_data',
                        type: typeof doc
                    }
                });
            }
        }
    }
    
    logger.info(`Created ${chunks.length} chunks from documents`);
    return chunks;
}

/**
 * Create and save vectorstore
 */
async function createAndSaveVectorstore() {
    try {
        logger.info('Loading documents...');
        const documents = loadDocuments();
        
        logger.info('Splitting documents into chunks...');
        const chunks = splitDocuments(documents);
        
        logger.info('Generating embeddings...');
        const texts = chunks.map(c => c.content);
        const embeddings = await generateEmbeddings(texts);
        
        // Ensure FAISS index directory exists
        if (!fs.existsSync(FAISS_INDEX_PATH)) {
            fs.mkdirSync(FAISS_INDEX_PATH, { recursive: true });
        }
        
        // Save embeddings and metadata
        const vectorStore = {
            embeddings,
            chunks: chunks.map((c, idx) => ({
                id: idx,
                content: c.content,
                embedding_index: idx,
                metadata: c.metadata
            }))
        };
        
        fs.writeFileSync(EMBEDDINGS_FILE, JSON.stringify(vectorStore, null, 2));
        fs.writeFileSync(METADATA_FILE, JSON.stringify({
            model: EMBEDDING_MODEL,
            created_at: new Date().toISOString(),
            total_chunks: chunks.length,
            embedding_dimension: embeddings[0].length
        }, null, 2));
        
        logger.info('Vectorstore saved successfully!');
        return vectorStore;
    } catch (error) {
        logger.error('Error creating vectorstore', error);
        throw error;
    }
}

/**
 * Load vectorstore from disk
 */
async function loadVectorstore() {
    try {
        if (!fs.existsSync(EMBEDDINGS_FILE)) {
            logger.info('Vectorstore not found, creating new one...');
            return await createAndSaveVectorstore();
        }
        
        logger.info('Loading vectorstore from disk...');
        const data = fs.readFileSync(EMBEDDINGS_FILE, 'utf-8');
        const vectorStore = JSON.parse(data);
        logger.info('Vectorstore loaded successfully!');
        return vectorStore;
    } catch (error) {
        logger.error('Error loading vectorstore', error);
        throw error;
    }
}

/**
 * Initialize vectorstore (get or create)
 */
export async function getOrCreateVectorstore(forceRecreate = false) {
    if (vectorStore && !forceRecreate) {
        return vectorStore;
    }
    
    if (forceRecreate && fs.existsSync(EMBEDDINGS_FILE)) {
        fs.unlinkSync(EMBEDDINGS_FILE);
    }
    
    vectorStore = await loadVectorstore();
    return vectorStore;
}

/**
 * Perform similarity search
 */
export async function similaritySearch(query, k = 10) {
    try {
        if (!vectorStore) {
            vectorStore = await getOrCreateVectorstore();
        }
        
        // Generate embedding for query
        const queryEmbedding = await generateEmbeddings([query]);
        const queryVec = queryEmbedding[0];
        
        // Calculate similarity (dot product)
        const similarities = vectorStore.chunks.map((chunk, idx) => ({
            ...chunk,
            similarity: cosineSimilarity(queryVec, vectorStore.embeddings[idx])
        }));
        
        // Sort by similarity and return top k
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, k);
    } catch (error) {
        logger.error('Error in similarity search', error);
        return [];
    }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Initialize FAISS manager
 */
export async function initialize() {
    if (initialized) return true;
    
    try {
        await initializeModel();
        vectorStore = await getOrCreateVectorstore();
        initialized = true;
        logger.info('FAISS manager initialized successfully!');
        return true;
    } catch (error) {
        logger.error('Failed to initialize FAISS manager', error);
        return false;
    }
}

export { similaritySearch as retrieveDocuments };
