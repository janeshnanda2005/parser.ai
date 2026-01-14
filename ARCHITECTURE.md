# Parser.ai - Complete Architecture & Implementation Guide

## 🎯 Project Overview

**Parser.ai** is an AI-powered job discovery platform that uses semantic search to help users find relevant job opportunities. Instead of keyword matching, it understands the context and meaning behind job searches.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Search  │  │  Auth    │  │  Saved   │  │   Auth       │   │
│  │  Page    │  │  Page    │  │  Jobs    │  │   Context    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │             │             │               │            │
│       ▼             ▼             ▼               ▼            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    Supabase Client                       │  │
│  │         (Authentication + Database Operations)           │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE (Backend)                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   Auth       │    │  saved_jobs  │    │  Row Level       │  │
│  │  (Google)    │    │   Table      │    │  Security        │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PYTHON BACKEND (FastAPI)                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   /search    │    │    FAISS     │    │   Groq LLM       │  │
│  │   Endpoint   │───▶│   Vector DB  │───▶│   (Llama 3)      │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│                    ┌──────────────────┐                        │
│                    │   Job Data JSON  │                        │
│                    │   (25 categories)│                        │
│                    └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool & Dev Server |
| React Router | 7.x | Client-side Routing |
| Tailwind CSS | 4.x | Styling |
| Supabase JS | 2.x | Auth & Database Client |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | REST API Framework |
| FAISS | Vector Similarity Search |
| Sentence Transformers | Text Embeddings |
| Groq API | LLM for RAG responses |
| Adzuna API | Job Data Source |

### Database (Supabase)
| Table | Purpose |
|-------|---------|
| `auth.users` | User authentication (managed by Supabase) |
| `saved_jobs` | User's saved job listings |

---

## 📁 Project Structure

```
job_tracker_based_on_websites/
├── src/                          # Frontend Source Code
│   ├── App.tsx                   # Main App with Routes
│   ├── main.tsx                  # React Entry Point
│   ├── index.css                 # Global Styles
│   │
│   ├── components/               # Reusable UI Components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── JobCard.tsx
│   │   ├── Button.tsx
│   │   └── ...
│   │
│   ├── pages/                    # Page Components
│   │   ├── Search.tsx            # Main search page (public)
│   │   ├── AuthPage.tsx          # Login/Register
│   │   ├── SavedJobs.tsx         # View saved jobs
│   │   ├── Landing.tsx           # Marketing page
│   │   └── ...
│   │
│   ├── contexts/                 # React Contexts
│   │   └── AuthContext.tsx       # Authentication state
│   │
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useSavedJobs.ts       # Supabase saved jobs
│   │   └── useLocalStorage.ts
│   │
│   ├── lib/                      # External Libraries Config
│   │   └── supabase.ts           # Supabase client
│   │
│   └── services/                 # API Services
│       └── api.ts                # Backend API calls
│
├── backend/                      # Python Backend
│   ├── main.py                   # FastAPI Server
│   ├── faiss_manager.py          # Vector Search Logic
│   ├── data_api_adzuna.py        # Job Data Fetcher
│   ├── requirements.txt          # Python Dependencies
│   ├── data/                     # Job Data JSONs
│   └── faiss_index/              # Vector Index Files
│
├── api/                          # Vercel Serverless (optional)
│   └── index.py
│
└── Config Files
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    └── vercel.json
```

---

## 🔐 Authentication Flow

```
User clicks "Sign in with Google"
           │
           ▼
┌─────────────────────────┐
│  Supabase OAuth         │
│  signInWithOAuth({      │
│    provider: 'google'   │
│  })                     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Google OAuth Consent   │
│  Screen                 │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Redirect back to app   │
│  with session token     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  AuthContext updates    │
│  - isAuthenticated=true │
│  - user object set      │
└─────────────────────────┘
```

**Key Files:**
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/lib/supabase.ts` - Supabase client configuration

---

## 🔍 Search Flow (RAG Pipeline)

```
User enters: "remote python developer jobs"
                    │
                    ▼
┌─────────────────────────────────────┐
│  Frontend: api.searchJobs(query)    │
│  POST /search { query: "..." }      │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Backend: Embed query using         │
│  SentenceTransformer                │
│  "all-MiniLM-L6-v2"                 │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  FAISS: Find top-k similar jobs     │
│  using cosine similarity            │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Groq LLM: Generate natural         │
│  language response with job details │
│  (RAG - Retrieval Augmented Gen)    │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Frontend: Parse & display results  │
│  in JobResultCard components        │
└─────────────────────────────────────┘
```

**Key Files:**
- `src/services/api.ts` - API client
- `backend/main.py` - FastAPI endpoints
- `backend/faiss_manager.py` - Vector search

---

## 💾 Saved Jobs Flow

```
User clicks "Save Job"
         │
         ▼
┌────────────────────────────┐
│  useSavedJobs.saveJob()    │
│  - Check if already saved  │
│  - Insert into Supabase    │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  Supabase Insert           │
│  INSERT INTO saved_jobs    │
│  (user_id, title, ...)     │
└────────────┬───────────────┘
             │
             ▼
┌────────────────────────────┐
│  Row Level Security        │
│  Ensures user_id matches   │
│  authenticated user        │
└────────────────────────────┘
```

**Database Schema:**
```sql
saved_jobs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  salary TEXT,
  description TEXT,
  apply_url TEXT,
  query TEXT,
  saved_at TIMESTAMP
)
```

**Key Files:**
- `src/hooks/useSavedJobs.ts` - Supabase operations
- `src/pages/SavedJobs.tsx` - Display saved jobs

---

## 🛣 Routing Structure

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | Redirect | No | Redirects to `/search` |
| `/search` | Search.tsx | No* | Main search page |
| `/login` | AuthPage.tsx | No | Login with Google |
| `/register` | AuthPage.tsx | No | Register with Google |
| `/saved-jobs` | SavedJobs.tsx | Yes | View saved jobs |

*Search page is public, but searching requires authentication (shows login modal)

---

## 🎨 UI/UX Features

### Theme
- **Dark mode** with space theme
- **Violet/Purple gradients** as accent colors
- **Animated star background** on search page
- **Glass morphism** effects (backdrop-blur)

### Components
- `StarField` - Animated background stars
- `LoginModal` - In-page authentication prompt
- `JobResultCard` - Styled job listing display
- `SavedJobCard` - Saved job with remove option

---

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000  # Backend URL
```

### Backend (.env)
```env
GROQ_API_KEY=your-groq-api-key
ADZUNA_APP_ID=your-adzuna-app-id
ADZUNA_API_KEY=your-adzuna-api-key
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Render/Railway)
1. Deploy `backend/` folder
2. Set environment variables
3. Configure `Procfile`: `web: uvicorn main:app --host 0.0.0.0 --port $PORT`

### Database (Supabase)
- Already hosted, no deployment needed
- Configure RLS policies for security

---

## 📊 Data Flow Summary

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │───▶│  React   │───▶│  FastAPI │───▶│  FAISS   │
│  Input   │    │  Frontend│    │  Backend │    │  Search  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                               │
                     ▼                               ▼
               ┌──────────┐                    ┌──────────┐
               │ Supabase │                    │  Groq    │
               │ (Auth +  │                    │  LLM     │
               │  Data)   │                    └──────────┘
               └──────────┘
```

---

## 🧪 Testing the App

1. **Start Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend:**
   ```bash
   npm install
   npm run dev
   ```

3. **Test Flow:**
   - Open http://localhost:3000
   - Try searching (will prompt login)
   - Sign in with Google
   - Search for jobs
   - Save a job
   - Check Supabase Table Editor for saved data

---

## 📚 Key Concepts Used

| Concept | Where Used |
|---------|------------|
| React Context | AuthContext for global auth state |
| Custom Hooks | useSavedJobs for database operations |
| Protected Routes | SavedJobs page requires auth |
| OAuth 2.0 | Google Sign-in via Supabase |
| RAG (Retrieval Augmented Generation) | Search backend |
| Vector Embeddings | FAISS similarity search |
| Row Level Security | Supabase data isolation |
| Responsive Design | Tailwind breakpoints (sm:, md:) |

---

## 🔮 Future Improvements

- [ ] Add job application tracking (Applied, Interview, Offer stages)
- [ ] Email notifications for new matching jobs
- [ ] Resume upload and parsing
- [ ] AI-powered resume tailoring
- [ ] Job comparison feature
- [ ] Analytics dashboard for job search insights
