import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // OpenRouter API
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
    model: process.env.LLM_MODEL || 'xiaomi/mimo-v2-flash:free',
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.6'),
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '30000')
  },
  
  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000'
  },
  
  // Embeddings
  embeddings: {
    model: process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2',
    chunkSize: parseInt(process.env.CHUNK_SIZE || '1000'),
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '200')
  },
  
  // Search
  search: {
    defaultK: parseInt(process.env.SEARCH_DEFAULT_K || '10'),
    maxK: parseInt(process.env.SEARCH_MAX_K || '50')
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'INFO'
  }
};

/**
 * Validate required configuration
 */
export function validateConfig() {
  const errors = [];
  
  if (!config.openrouter.apiKey) {
    errors.push('OPENROUTER_API_KEY environment variable is required');
  }
  
  if (errors.length > 0) {
    logger.error('Configuration validation failed');
    errors.forEach(err => logger.error(`  - ${err}`));
    return false;
  }
  
  return true;
}

/**
 * Get config summary (safe for logging, excludes secrets)
 */
export function getConfigSummary() {
  return {
    port: config.port,
    nodeEnv: config.nodeEnv,
    openrouter: {
      model: config.openrouter.model,
      temperature: config.openrouter.temperature,
      maxTokens: config.openrouter.maxTokens
    },
    embeddings: config.embeddings,
    search: config.search,
    logging: config.logging
  };
}

export default config;
