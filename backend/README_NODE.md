# Job Tracker Backend - Node.js Version

This is a complete Node.js rewrite of the Python backend for the Job Tracker application with RAG (Retrieval-Augmented Generation) capabilities.

## Features

- **Express.js Server** - Fast and scalable HTTP server
- **RAG System** - Retrieve relevant job postings and generate AI-powered answers using LLMs
- **Vector Embeddings** - Local embeddings using Xenova transformers (no external API needed)
- **Job Search** - Full-text and semantic search capabilities
- **CORS Enabled** - Ready for frontend integration
- **Multiple Endpoints** - Health check, job retrieval, category filtering, semantic search

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- OpenRouter API key (for LLM features)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_key_here
   PORT=5000
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## Project Structure

```
backend/
├── index.js                 # Main Express server
├── faiss-manager.js        # Vector store & embeddings management
├── rag-engine.js           # LLM integration & RAG logic
├── adzuna-api.js           # Adzuna API integration
├── data/                   # Job data by category (JSON files)
├── data_files/             # Industry-specific job data
├── faiss_index/            # Vector embeddings index
├── package.json            # Dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Get All Jobs
```
GET /api/jobs
```
Retrieves all jobs from all data files.

### Get Jobs by Category
```
GET /api/jobs/:category
```
Get jobs for a specific category (e.g., `/api/jobs/software`).

### Search Jobs (RAG)
```
POST /api/search
Content-Type: application/json

{
  "query": "machine learning jobs in pune"
}
```
Uses RAG system to find relevant jobs and generate AI-powered answers.

### Similarity Search
```
POST /api/similarity-search
Content-Type: application/json

{
  "query": "python developer",
  "k": 10
}
```
Performs semantic similarity search on job postings.

## Key Changes from Python Backend

| Feature | Python | Node.js |
|---------|--------|--------|
| Framework | Flask | Express.js |
| Embeddings | sentence-transformers | Xenova/transformers |
| Vector DB | FAISS (C++) | JSON-based embeddings |
| JSON Storage | File-based | File-based (same) |
| HTTP Client | requests | axios/fetch |
| Environment | dotenv | dotenv |

## Module Descriptions

### index.js
Main Express server with all API routes. Handles:
- CORS for frontend requests
- Route handlers for all endpoints
- Error handling middleware
- Server initialization

### faiss-manager.js
Vector store and embeddings management:
- Model initialization (lazy loading)
- Document loading from data files
- Chunk splitting with overlap
- Embedding generation using transformers
- Similarity search implementation
- Vector store persistence

### rag-engine.js
RAG system and LLM integration:
- OpenRouter API integration
- Prompt engineering for job-specific queries
- Context retrieval and merging
- Response formatting

### adzuna-api.js
Adzuna job API integration:
- Job fetching by category
- Batch fetching for all categories
- File-based storage
- API credential verification

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| OPENROUTER_API_KEY | API key for OpenRouter LLM service | Yes (for RAG) |
| PORT | Server port | No (default: 5000) |
| LLM_MODEL | Model to use from OpenRouter | No (default: xiaomi/mimo-v2-flash:free) |
| NODE_ENV | Environment mode | No (default: development) |

## Performance Notes

1. **First Run**: The first API call will initialize the embedding model and create the vector index. This may take 1-2 minutes on first load.

2. **Memory Usage**: The embedding model requires ~400MB of memory. Ensure your deployment environment has sufficient resources.

3. **Model Caching**: Xenova transformers will cache the model locally. Subsequent restarts will be faster.

## Troubleshooting

### Module not found errors
```bash
npm install
```

### Port already in use
```bash
PORT=3001 npm start
```

### CORS errors
- Verify CORS middleware is enabled in index.js
- Check frontend domain matches HTTP-Referer header

### Slow first request
- The embedding model initializes on first use
- This is normal; subsequent requests will be faster
- Consider pre-warming the system with a test query on server startup

## Data Files

The backend expects job data in JSON format in the `data/` directory:
- `{category}_jobs.json` - Main job data files
- Files in `data_files/` - Industry-specific job data
- `faiss_index/` - Persisted vector embeddings

## Migration Notes

This Node.js version maintains compatibility with existing data files and API contracts. All data from the Python backend transfers without modification.

### What Changed
- Framework: Flask → Express.js
- Dependencies: Python packages → NPM packages
- Embeddings: Python FAISS → Xenova transformers
- None of the data formats changed

### What Stayed the Same
- All API endpoints and responses
- Data file structure and format
- RAG system logic and prompting
- Vector embedding dimension (384)

## Development

### Running in development mode
```bash
npm run dev
```
Auto-reloads on file changes.

### Running tests
```bash
npm test
```

### Building for production
The server is production-ready as-is. For containerization:
```dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Deployment

### Heroku/Railway
```bash
# Set environment variables
railway link
railway set OPENROUTER_API_KEY=your_key

# Deploy
git push heroku main
```

### Docker
```bash
docker build -t job-tracker-backend .
docker run -p 5000:5000 -e OPENROUTER_API_KEY=your_key job-tracker-backend
```

### Traditional Server
```bash
npm install
npm start
```

Use PM2 or similar for process management:
```bash
npm install -g pm2
pm2 start index.js --name "job-tracker"
```

## License

MIT
