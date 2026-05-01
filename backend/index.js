import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { similaritySearch, initialize as initializeFaiss } from './faiss-manager.js';
import { ragAnswer } from './rag-engine.js';
import { config, validateConfig, getConfigSummary } from './config.js';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.path}`, { 
            statusCode: res.statusCode, 
            duration: `${duration}ms` 
        });
    });
    next();
});

// Validate configuration on startup
if (!validateConfig()) {
    logger.error('Configuration validation failed');
    process.exit(1);
}

// Global state
let ragInitialized = false;

logger.info('Server starting', getConfigSummary());

/**
 * Initialize RAG system on first use
 */
async function ensureRagInitialized() {
    if (ragInitialized) return true;
    
    try {
        logger.info('Initializing RAG system...');
        const success = await initializeFaiss();
        if (success) {
            ragInitialized = true;
            logger.info('RAG system initialized successfully');
            return true;
        }
        logger.error('RAG initialization returned false');
        return false;
    } catch (error) {
        logger.error('Failed to initialize RAG', error);
        return false;
    }
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

/**
 * Get all jobs from data files
 */
app.get('/api/jobs', (req, res) => {
    try {
        const jobs = [];
        const dataDir = path.join(__dirname, 'data');
        
        if (!fs.existsSync(dataDir)) {
            logger.warn('Data directory not found');
            return res.status(404).json({ error: 'Data directory not found' });
        }
        
        const files = fs.readdirSync(dataDir);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const filePath = path.join(dataDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const data = JSON.parse(content);
                    
                    if (Array.isArray(data)) {
                        jobs.push(...data);
                    } else {
                        jobs.push(data);
                    }
                } catch (fileError) {
                    logger.warn(`Error reading file ${file}`, fileError);
                }
            }
        }
        
        logger.info(`Retrieved ${jobs.length} jobs`);
        res.json(jobs);
    } catch (error) {
        logger.error('Error getting jobs', error);
        res.status(500).json({ error: 'Failed to retrieve jobs' });
    }
});

/**
 * Get jobs by category
 */
app.get('/api/jobs/:category', (req, res) => {
    try {
        const { category } = req.params;
        const dataDir = path.join(__dirname, 'data');
        const filename = `${category}_jobs.json`;
        const filePath = path.join(dataDir, filename);
        
        if (!fs.existsSync(filePath)) {
            logger.warn(`Category '${category}' not found`);
            return res.status(404).json({ error: `Category '${category}' not found` });
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        res.json(data);
    } catch (error) {
        logger.error('Error getting jobs by category', error);
        res.status(500).json({ error: 'Failed to retrieve jobs' });
    }
});

/**
 * Search jobs using RAG
 */
app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        
        // Validation
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ error: 'Query is required' });
        }
        
        if (!query.trim()) {
            return res.status(400).json({ error: 'Query cannot be empty' });
        }
        
        // Ensure RAG is initialized
        const initialized = await ensureRagInitialized();
        if (!initialized) {
            return res.status(500).json({ error: 'RAG system failed to initialize' });
        }
        
        // Perform search
        const searchQuery = `${query} jobs list them out`;
        logger.info(`Searching for: ${searchQuery}`);
        
        const answer = await ragAnswer(searchQuery);
        logger.debug(`Got answer of length: ${answer.length}`);
        
        res.json({
            query,
            answer
        });
    } catch (error) {
        logger.error('Error searching jobs', error);
        res.status(500).json({ error: error.message || 'Search failed' });
    }
});

/**
 * Similarity search endpoint (for testing)
 */
app.post('/api/similarity-search', async (req, res) => {
    try {
        const { query, k = 10 } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        
        const results = await similaritySearch(query, k);
        logger.info(`Found ${results.length} similarity results for query`);
        res.json({ query, results });
    } catch (error) {
        logger.error('Error in similarity search', error);
        res.status(500).json({ error: error.message || 'Similarity search failed' });
    }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
    logger.error('Unhandled error', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: config.isDevelopment ? err.message : undefined
    });
});

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

/**
 * Start server
 */
const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
    logger.info('Environment: ' + config.nodeEnv);
    logger.info('RAG will initialize on first search request');
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error);
    process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection at promise', { reason, promise });
    process.exit(1);
});

export default app;
