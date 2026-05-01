# Backend Node.js - Quick Start Guide

## 🚀 Get Started in 2 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env: Add your OPENROUTER_API_KEY

# 3. Start development server
npm run dev

# Server running at http://localhost:5000 ✅
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `index.js` | Main server & all API routes |
| `faiss-manager.js` | Vector embeddings & search |
| `rag-engine.js` | LLM integration & AI responses |
| `adzuna-api.js` | Job data fetching |
| `config.js` | Configuration management |
| `logger.js` | Structured logging |

## 📋 npm Commands

```bash
npm start              # Production mode
npm run dev            # Development (auto-reload)
npm test              # Run test suite
```

## 🔌 API Quick Reference

```bash
# Health check
curl http://localhost:5000/health

# Get all jobs
curl http://localhost:5000/api/jobs | jq '.[0]'

# Get jobs by category
curl http://localhost:5000/api/jobs/software | jq '.[]'

# Search jobs (RAG)
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"python developer"}'

# Similarity search
curl -X POST http://localhost:5000/api/similarity-search \
  -H "Content-Type: application/json" \
  -d '{"query":"machine learning","k":5}'
```

## 🐳 Docker

```bash
# Build image
docker build -t job-tracker-backend .

# Run container
docker run -p 5000:5000 \
  -e OPENROUTER_API_KEY=your_key \
  job-tracker-backend

# Or use Docker Compose
docker-compose up
```

## ⚙️ Environment Variables

```env
OPENROUTER_API_KEY=sk_...  # Required: LLM API key
PORT=5000                   # Optional: Server port
NODE_ENV=development        # Optional: development/production
LLM_MODEL=xiaomi/mimo-v2-flash:free  # Optional: Model name
LOG_LEVEL=INFO             # Optional: DEBUG/INFO/WARN/ERROR
```

## 📊 Directory Structure

```
backend/
├── index.js                    # Main server
├── faiss-manager.js           # Vector store
├── rag-engine.js              # LLM integration
├── adzuna-api.js              # Job API
├── config.js                  # Configuration
├── logger.js                  # Logging
├── package.json               # Dependencies
├── .env.example               # Environment template
├── data/                      # Job data
├── data_files/                # Industry data
├── faiss_index/               # Vector embeddings
├── logs/                      # Application logs
└── Dockerfile                 # Container config
```

## 🔍 Debugging

```bash
# Show logs
tail -f logs/app_*.log

# Debug mode
LOG_LEVEL=DEBUG npm run dev

# Check port usage
lsof -ti:5000

# Test with curl
curl -v http://localhost:5000/health
```

## ⚡ Performance Tips

1. **First run**: Model initialization takes 1-2 minutes (normal)
2. **Caching**: Embeddings cached in `faiss_index/` (survives restarts)
3. **Memory**: ~800MB baseline, increases with requests
4. **Concurrency**: Node.js handles thousands of concurrent connections

## 🚨 Troubleshooting

### Port already in use
```bash
PORT=3001 npm start
```

### Module not found
```bash
npm install
# or
rm -rf node_modules package-lock.json && npm install
```

### API key not working
- Check `.env` file
- Verify key is active in OpenRouter dashboard
- No extra spaces or newlines in value

### Slow first request
- Expected: Model downloads on first use (~400MB)
- Check internet connection
- View logs: `LOG_LEVEL=DEBUG npm run dev`

## 📖 Documentation

- **README_NODE.md** - Complete guide
- **MIGRATION_GUIDE.md** - Python → Node.js migration
- **COMPLETION_REPORT.md** - What was rewritten
- **Code comments** - Inline documentation

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific endpoint
curl http://localhost:5000/health
```

## 🔄 Common Workflows

### Development with auto-reload
```bash
npm run dev
# Edit files → auto-restart
```

### Monitor logs in real-time
```bash
tail -f logs/app_$(date +%Y-%m-%d).log
```

### Fresh vectorstore rebuild
```bash
rm -rf faiss_index/
npm start  # Recreates index from data files
```

## 🎯 Next Steps

1. **Install** → `npm install`
2. **Configure** → Add `OPENROUTER_API_KEY` to `.env`
3. **Start** → `npm run dev`
4. **Test** → `npm test` or curl endpoints
5. **Deploy** → `npm start` or Docker

## 📞 Support

- Check logs: `logs/app_*.log`
- Debug mode: `LOG_LEVEL=DEBUG npm run dev`
- Test endpoint: `curl http://localhost:5000/health`
- Read docs: `README_NODE.md`, `MIGRATION_GUIDE.md`

---

**Ready to go?** Run `npm install && npm run dev` 🚀
