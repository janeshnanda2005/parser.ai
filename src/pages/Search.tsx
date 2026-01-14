import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useSavedJobs } from '../hooks/useSavedJobs'

// Login Modal Component
function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      onClose()
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-900 via-violet-950/50 to-slate-900 border border-violet-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-violet-500/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
              <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white text-center mb-2">Sign in to Search</h3>
        <p className="text-slate-400 text-center mb-6">
          Create a free account or sign in to start discovering your dream job opportunities.
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
        </button>

        {/* Alternative link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/register')}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            New here? Create an account →
          </button>
        </div>
      </div>
    </div>
  )
}

// Animated stars background component
function StarField() {
  const [stars] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      {/* Nebula effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
    </div>
  )
}

// Parse markdown-like content into structured sections
function parseRAGResponse(text: string) {
  const lines = text.split('\n')
  const sections: Array<{
    type: 'heading' | 'subheading' | 'bullet' | 'paragraph' | 'link' | 'salary' | 'divider'
    content: string
    level?: number
  }> = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Check for job title patterns (usually numbered or bold)
    if (/^\d+\.\s/.test(trimmed) || /^#{1,3}\s/.test(trimmed)) {
      sections.push({ type: 'heading', content: trimmed.replace(/^[\d.#]+\s*/, '').replace(/^-\s*/, '') })
    }
    // Check for salary info
    else if (/salary|₹|rs\.?|inr|lpa|per annum|per month/i.test(trimmed)) {
      sections.push({ type: 'salary', content: trimmed.replace(/^[-•*]\s*/, '') })
    }
    // Check for links
    else if (/https?:\/\/|www\.|apply|link/i.test(trimmed)) {
      sections.push({ type: 'link', content: trimmed.replace(/^[-•*]\s*/, '') })
    }
    // Bullet points
    else if (/^[-•*]\s/.test(trimmed)) {
      sections.push({ type: 'bullet', content: trimmed.replace(/^[-•*]\s*/, '') })
    }
    // Sub-sections (company, location, etc.)
    else if (/^(company|location|experience|skills|description|jd|job description|requirements):/i.test(trimmed)) {
      sections.push({ type: 'subheading', content: trimmed })
    }
    // Divider patterns
    else if (/^[-=_]{3,}$/.test(trimmed)) {
      sections.push({ type: 'divider', content: '' })
    }
    // Regular paragraph
    else {
      sections.push({ type: 'paragraph', content: trimmed })
    }
  }

  return sections
}

// Extract URL from text
function extractUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/i)
  return urlMatch ? urlMatch[0] : null
}

// Extract job info from sections for saving
function extractJobInfo(sections: ReturnType<typeof parseRAGResponse>): {
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  description?: string;
  applyUrl?: string;
} {
  let title = ''
  let company: string | undefined
  let location: string | undefined
  let salary: string | undefined
  let description: string | undefined
  let applyUrl: string | undefined

  for (const section of sections) {
    if (section.type === 'heading' && !title) {
      title = section.content
    } else if (section.type === 'subheading') {
      const lower = section.content.toLowerCase()
      if (lower.startsWith('company:')) {
        company = section.content.split(':').slice(1).join(':').trim()
      } else if (lower.startsWith('location:')) {
        location = section.content.split(':').slice(1).join(':').trim()
      }
    } else if (section.type === 'salary') {
      salary = section.content
    } else if (section.type === 'link') {
      const url = extractUrl(section.content)
      if (url) applyUrl = url
    } else if (section.type === 'paragraph' && !description) {
      description = section.content
    }
  }

  return { title, company, location, salary, description, applyUrl }
}

// Component to render a single section
function RenderSection({ section }: { section: ReturnType<typeof parseRAGResponse>[0] }) {
  switch (section.type) {
    case 'heading':
      return (
        <div className="mt-6 first:mt-0">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {section.content}
          </h3>
        </div>
      )
    case 'subheading':
      return (
        <div className="mt-3">
          <span className="text-blue-400 font-medium">{section.content.split(':')[0]}:</span>
          <span className="text-slate-300 ml-1">{section.content.split(':').slice(1).join(':')}</span>
        </div>
      )
    case 'salary':
      return (
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {section.content}
          </span>
        </div>
      )
    case 'link': {
      const url = extractUrl(section.content)
      return (
        <div className="mt-2">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Apply Now
            </a>
          ) : (
            <span className="text-blue-400 text-sm">{section.content}</span>
          )}
        </div>
      )
    }
    case 'bullet':
      return (
        <div className="mt-1 flex items-start gap-2 text-slate-300 text-sm">
          <span className="text-blue-400 mt-1">•</span>
          <span>{section.content}</span>
        </div>
      )
    case 'divider':
      return <hr className="my-4 border-white/10" />
    case 'paragraph':
    default:
      return <p className="mt-2 text-slate-300 text-sm leading-relaxed">{section.content}</p>
  }
}

// Job Card Component for better visual display
function JobResultCard({ children, index, onSave, isSaved }: { 
  children: React.ReactNode; 
  index: number;
  onSave?: () => void;
  isSaved?: boolean;
}) {
  return (
    <div 
      className="group relative bg-gradient-to-br from-white/5 to-violet-500/5 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-6 hover:border-violet-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-600/0 group-hover:from-violet-500/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-300"></div>
      <div className="relative">
        {/* Save button */}
        {onSave && (
          <button
            onClick={onSave}
            className={`absolute top-0 right-0 p-2 rounded-lg transition-all ${
              isSaved 
                ? 'text-violet-400 bg-violet-500/20' 
                : 'text-slate-400 hover:text-violet-400 hover:bg-violet-500/10'
            }`}
            title={isSaved ? 'Job saved' : 'Save job'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  const { user, logout, isAuthenticated } = useAuth()
  const { saveJob, isJobSaved, jobCount } = useSavedJobs()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      setError('Please enter a job role')
      return
    }

    // Check if user is authenticated before searching
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await api.searchJobs(query)
      setResult(response.answer)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results')
    } finally {
      setLoading(false)
    }
  }

  // Parse and group the result into job listings
  const parsedSections = useMemo(() => {
    if (!result) return []
    return parseRAGResponse(result)
  }, [result])

  // Group sections by job (split at headings)
  const groupedJobs = useMemo(() => {
    const groups: Array<typeof parsedSections> = []
    let currentGroup: typeof parsedSections = []

    for (const section of parsedSections) {
      if (section.type === 'heading' && currentGroup.length > 0) {
        groups.push(currentGroup)
        currentGroup = [section]
      } else {
        currentGroup.push(section)
      }
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup)
    }

    return groups
  }, [parsedSections])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/50 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Animated Star Background */}
      <StarField />
      
      {/* Top Navigation Bar */}
      <nav className="relative z-10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" opacity="0.5" />
              </svg>
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
            </span>
            <span className="text-lg font-semibold text-white">Parser.ai</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Saved Jobs Link */}
                <Link
                  to="/saved-jobs"
                  className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-violet-500/20 transition-all hover:border-violet-500/40 text-slate-300 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-medium">Saved Jobs</span>
                  {jobCount > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-violet-500/30 text-violet-300 rounded-full">
                      {jobCount}
                    </span>
                  )}
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 border border-violet-500/20">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff`}
                    alt={user?.name}
                    className="w-7 h-7 rounded-lg"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white leading-tight">{user?.name}</p>
                    <p className="text-xs text-slate-400 leading-tight">{user?.role || 'User'}</p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all text-red-400 hover:text-red-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-medium">Sign out</span>
                </button>
              </>
            ) : (
              <>
                {/* Sign In Button */}
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-violet-500/20 transition-all hover:border-violet-500/40 text-slate-300 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm font-medium">Sign in</span>
                </button>

                {/* Get Started Button */}
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-violet-500/25"
                >
                  <span className="text-sm font-medium">Get Started</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-8 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-2xl mb-6 shadow-lg shadow-violet-600/40 relative">
            <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-white" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
              <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
            {/* Orbital ring */}
            <div className="absolute inset-0 rounded-2xl border border-violet-400/30 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Parser</span>
            <span className="text-white">.ai</span>
          </h1>
          <p className="text-violet-200/80 text-lg max-w-md mx-auto">
            {isAuthenticated ? (
              <>Welcome back, <span className="font-semibold text-violet-300">{user?.name?.split(' ')[0]}</span>! Let's explore the universe of opportunities.</>
            ) : (
              <>Discover your dream job with AI-powered semantic search.</>
            )}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the galaxy... (e.g., Data Scientist, ML Engineer...)"
                  className="w-full px-6 py-5 pr-36 rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-violet-500/30 text-white text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-violet-800 disabled:to-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/30"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  {loading ? 'Scanning' : 'Search'}
                </button>
              </div>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-3 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block relative">
                {/* Orbital animation */}
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                  <div className="absolute inset-2 rounded-full border-2 border-violet-500/30 animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-4 rounded-full border-2 border-violet-500/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-violet-500 rounded-full animate-pulse shadow-lg shadow-violet-500/50" />
                  </div>
                </div>
              </div>
              <p className="text-violet-200 text-lg mt-6">Scanning the universe for "{query}"...</p>
              <p className="text-slate-400 text-sm mt-2">Our AI is analyzing millions of opportunities</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Discovered for "{query}"</h2>
                    <p className="text-slate-400 text-sm">{groupedJobs.length > 1 ? `${groupedJobs.length} opportunities found` : 'AI-curated recommendations'}</p>
                  </div>
                </div>
              </div>

              {/* Job Cards */}
              {groupedJobs.length > 1 ? (
                <div className="grid gap-4">
                  {groupedJobs.map((group, index) => {
                    const jobInfo = extractJobInfo(group)
                    const saved = isJobSaved(jobInfo.title, jobInfo.company)
                    return (
                      <JobResultCard 
                        key={index} 
                        index={index}
                        isSaved={saved}
                        onSave={() => {
                          if (!saved && jobInfo.title) {
                            saveJob({
                              ...jobInfo,
                              query: query,
                            })
                          }
                        }}
                      >
                        {group.map((section, sectionIndex) => (
                          <RenderSection key={sectionIndex} section={section} />
                        ))}
                      </JobResultCard>
                    )
                  })}
                </div>
              ) : (
                /* Single block result */
                <div className="bg-white/5 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-6 hover:border-violet-500/40 transition-colors">
                  <div className="prose prose-invert max-w-none">
                    {parsedSections.map((section, index) => (
                      <RenderSection key={index} section={section} />
                    ))}
                  </div>
                </div>
              )}

              {/* Raw text toggle for debugging */}
              <details className="mt-6">
                <summary className="text-slate-500 text-sm cursor-pointer hover:text-slate-400">
                  View raw response
                </summary>
                <pre className="mt-2 p-4 bg-black/30 rounded-lg text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
                  {result}
                </pre>
              </details>
            </div>
          )}

          {/* Empty State */}
          {!result && !loading && !error && (
            <div className="text-center py-16">
              <div className="relative w-28 h-28 mx-auto mb-6">
                {/* Orbital rings */}
                <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-2 rounded-full border border-violet-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute inset-4 rounded-full border border-violet-500/40 animate-[spin_10s_linear_infinite]"></div>
                
                {/* Center icon */}
                <div className="absolute inset-6 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-violet-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text mb-3">Explore the Universe of Jobs</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Enter any job role above and let Parser.ai navigate through thousands of opportunities to find your perfect match
              </p>
              
              {/* Quick suggestions */}
              <div className="mt-8">
                <p className="text-slate-500 text-sm mb-3">🚀 Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Data Scientist', 'DevOps Engineer', 'Frontend Developer', 'Machine Learning'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 hover:border-violet-400/50 rounded-full text-violet-300 text-sm transition-all duration-300 hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <span className="text-slate-500 text-sm">Powered by </span>
        <span className="bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text font-semibold">Parser.ai</span>
        <span className="text-slate-500 text-sm"> • AI-Powered Job Discovery</span>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}
