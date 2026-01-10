import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

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
function JobResultCard({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <div 
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {children}
    </div>
  )
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      setError('Please enter a job role')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg text-sm font-bold">
              JT
            </span>
            <span className="text-lg font-semibold text-white">JobTrackr</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3b82f6&color=fff`}
                alt={user?.name}
                className="w-8 h-8 rounded-lg"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.role || 'Job Seeker'}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800 border border-white/10 shadow-xl z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Saved Jobs
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                </div>
                <div className="py-2 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-8 pb-8 px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Job Finder AI
          </h1>
          <p className="text-blue-200 text-lg max-w-md mx-auto">
            Welcome back, <span className="font-semibold">{user?.name?.split(' ')[0]}</span>! Let's find your next opportunity.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter job role (e.g., Data Scientist, DevOps Engineer...)"
                className="w-full px-6 py-5 pr-32 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
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
                {loading ? 'Searching' : 'Search'}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block">
                <svg className="animate-spin h-12 w-12 text-blue-400 mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-blue-200 text-lg">AI is finding jobs for "{query}"...</p>
              <p className="text-slate-400 text-sm mt-2">This may take a few seconds</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Results for "{query}"</h2>
                    <p className="text-slate-400 text-sm">{groupedJobs.length > 1 ? `${groupedJobs.length} jobs found` : 'AI-generated recommendations'}</p>
                  </div>
                </div>
              </div>

              {/* Job Cards */}
              {groupedJobs.length > 1 ? (
                <div className="grid gap-4">
                  {groupedJobs.map((group, index) => (
                    <JobResultCard key={index} index={index}>
                      {group.map((section, sectionIndex) => (
                        <RenderSection key={sectionIndex} section={section} />
                      ))}
                    </JobResultCard>
                  ))}
                </div>
              ) : (
                /* Single block result */
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
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
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search for a Job Role</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                Type any job role above and press search to get AI-powered job recommendations
              </p>
              
              {/* Quick suggestions */}
              <div className="mt-8">
                <p className="text-slate-500 text-sm mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Data Scientist', 'DevOps Engineer', 'Frontend Developer', 'Machine Learning'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 text-sm transition-colors"
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
      <footer className="py-4 text-center text-slate-500 text-sm">
        Powered by AI • Job Finder
      </footer>
    </div>
  )
}
