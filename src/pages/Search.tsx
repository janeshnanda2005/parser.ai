import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useSavedJobs } from '../hooks/useSavedJobs'

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
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const { user, logout } = useAuth()
  const { saveJob, isJobSaved, jobCount } = useSavedJobs()
  const navigate = useNavigate()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = async () => {
    setShowUserMenu(false)
    await logout()
    navigate('/login')
  }

  const handleGoToSavedJobs = () => {
    setShowUserMenu(false)
    navigate('/saved-jobs')
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

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-violet-500/20 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10"
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
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900/95 border border-violet-500/20 shadow-xl shadow-violet-500/10 backdrop-blur-xl z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    type="button"
                    onClick={handleGoToSavedJobs}
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved Jobs
                    {jobCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-violet-500/30 text-violet-300 rounded-full">
                        {jobCount}
                      </span>
                    )}
                  </button>
                </div>
                <div className="py-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 cursor-pointer"
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
            Welcome back, <span className="font-semibold text-violet-300">{user?.name?.split(' ')[0]}</span>! Let's explore the universe of opportunities.
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
    </div>
  )
}
