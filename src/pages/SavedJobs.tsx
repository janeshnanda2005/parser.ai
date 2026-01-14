import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSavedJobs, SavedJob } from '../hooks/useSavedJobs'

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

// Job Card Component
function SavedJobCard({ job, onRemove }: { job: SavedJob; onRemove: (id: string) => void }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="group relative bg-gradient-to-br from-white/5 to-violet-500/5 backdrop-blur-sm border border-violet-500/20 rounded-2xl p-6 hover:border-violet-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-600/0 group-hover:from-violet-500/5 group-hover:to-purple-600/5 rounded-2xl transition-all duration-300"></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              <span className="truncate">{job.title}</span>
            </h3>
            {job.company && (
              <p className="text-violet-300 mt-1">{job.company}</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {job.applyUrl && (
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Apply
              </a>
            )}
            
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemove(job.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Remove from saved"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          {job.location && (
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </div>
          )}
          
          {job.salary && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.salary}
            </div>
          )}

          {job.description && (
            <p className="text-slate-400 text-sm mt-3 line-clamp-3">
              {job.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
          <span>Saved on {formatDate(job.savedAt)}</span>
          {job.query && (
            <span className="px-2 py-1 bg-violet-500/10 text-violet-400 rounded-full">
              Search: {job.query}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SavedJobs() {
  const { user, logout } = useAuth()
  const { savedJobs, isLoading, removeJob, clearAllJobs, jobCount } = useSavedJobs()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/50 to-slate-950 flex flex-col relative overflow-hidden">
      {/* Animated Star Background */}
      <StarField />
      
      {/* Top Navigation Bar */}
      <nav className="relative z-10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/search" className="flex items-center gap-3">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/30">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                  <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" opacity="0.5" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
              </span>
              <span className="text-lg font-semibold text-white">Parser.ai</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/search"
              className="px-4 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Jobs
            </Link>
          </div>

          {/* User Menu */}
          <div className="relative">
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
                  <Link
                    to="/search"
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Jobs
                  </Link>
                  <Link
                    to="/saved-jobs"
                    className="w-full px-4 py-2 text-left text-sm text-violet-300 bg-violet-500/10 flex items-center gap-3"
                    onClick={() => setShowUserMenu(false)}
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
                  </Link>
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
      <header className="relative z-10 pt-8 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-violet-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                Saved Jobs
              </h1>
              <p className="text-slate-400 mt-2">
                {jobCount === 0 
                  ? "No jobs saved yet. Start exploring!" 
                  : `You have ${jobCount} job${jobCount !== 1 ? 's' : ''} saved`}
              </p>
            </div>

            {jobCount > 0 && (
              <div>
                {showClearConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        clearAllJobs()
                        setShowClearConfirm(false)
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block relative">
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                  <div className="absolute inset-2 rounded-full border-2 border-violet-500/30 animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-4 rounded-full border-2 border-violet-500/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-violet-500 rounded-full animate-pulse shadow-lg shadow-violet-500/50" />
                  </div>
                </div>
              </div>
              <p className="text-violet-200 text-lg mt-6">Loading your saved jobs...</p>
            </div>
          ) : savedJobs.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="relative w-28 h-28 mx-auto mb-6">
                {/* Orbital rings */}
                <div className="absolute inset-0 rounded-full border border-violet-500/20 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-2 rounded-full border border-violet-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="absolute inset-4 rounded-full border border-violet-500/40 animate-[spin_10s_linear_infinite]"></div>
                
                {/* Center icon */}
                <div className="absolute inset-6 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-violet-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text mb-3">No Saved Jobs Yet</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Start exploring job opportunities and save the ones that interest you. They'll appear here for easy access.
              </p>
              
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start Searching
              </Link>
            </div>
          ) : (
            /* Job Cards */
            <div className="grid gap-4">
              {savedJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <SavedJobCard job={job} onRemove={removeJob} />
                </div>
              ))}
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
