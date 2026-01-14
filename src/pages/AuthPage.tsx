import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface AuthPageProps {
  variant: 'login' | 'register'
}

const headline: Record<AuthPageProps['variant'], string> = {
  login: 'Welcome back to the universe',
  register: 'Launch your Parser.ai journey',
}

const subtext: Record<AuthPageProps['variant'], string> = {
  login: 'Your AI-powered job search awaits. Continue discovering opportunities.',
  register: 'Join thousands exploring the tech galaxy. Find roles that match your skills, not just keywords.',
}

const alternateCopy: Record<AuthPageProps['variant'], { text: string; link: string; to: string }> = {
  login: { text: "Don't have an account?", link: 'Create one', to: '/register' },
  register: { text: 'Already on Parser.ai?', link: 'Log in', to: '/login' },
}

export default function AuthPage({ variant }: AuthPageProps) {
  const alternate = alternateCopy[variant]
  const { signInWithGoogle } = useAuth()

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    const result = await signInWithGoogle()

    if (!result.success) {
      setError(result.error || 'Failed to sign in with Google')
      setIsLoading(false)
    }
    // If successful, Supabase will redirect automatically
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto flex min-h-screen flex-col justify-center px-4 py-16">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
            <div className="bg-white px-10 py-12 text-slate-900 md:px-14">
              <Link to="/" className="flex items-center gap-3">
                <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/30">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                    <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" opacity="0.5" />
                  </svg>
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
                </span>
                <span className="text-lg font-semibold">Parser.ai</span>
              </Link>

              <div className="mt-8 space-y-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{headline[variant]}</h1>
                <p className="text-sm text-slate-500 md:text-base">{subtext[variant]}</p>
              </div>

              {error && (
                <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 px-6 py-4 text-base font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  Continue with Google
                </button>
              </div>

              <p className="mt-6 text-xs text-slate-500">
                By continuing, you agree to our{' '}
                <a href="#terms" className="font-semibold text-slate-900 underline underline-offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="font-semibold text-slate-900 underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </p>

              <div className="mt-8 text-sm text-slate-500">
                {alternate.text}{' '}
                <Link to={alternate.to} className="font-semibold text-violet-600 hover:text-violet-700">
                  {alternate.link}
                </Link>
              </div>
            </div>

            <div className="relative hidden flex-col justify-between border-l border-white/10 bg-gradient-to-br from-violet-600/30 via-purple-600/30 to-indigo-900/50 p-10 text-white md:flex overflow-hidden">
              {/* Stars background */}
              <div className="absolute inset-0">
                <div className="absolute h-1 w-1 rounded-full bg-white/40 top-[10%] left-[20%] animate-pulse" />
                <div className="absolute h-1.5 w-1.5 rounded-full bg-violet-300/40 top-[30%] left-[80%] animate-pulse delay-200" />
                <div className="absolute h-1 w-1 rounded-full bg-white/30 top-[60%] left-[15%] animate-pulse delay-500" />
                <div className="absolute h-1 w-1 rounded-full bg-white/40 top-[80%] left-[60%] animate-pulse delay-700" />
                <div className="absolute h-1.5 w-1.5 rounded-full bg-purple-300/30 top-[45%] left-[40%] animate-pulse delay-1000" />
              </div>
              
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200">What members say</p>
                <p className="mt-4 text-lg leading-relaxed text-white/90">
                  "Parser.ai's semantic search found roles I never knew existed. The AI understood what I wanted, not just what I typed."
                </p>
                <div className="mt-6 text-sm font-semibold text-white">Rohan Mehta</div>
                <div className="text-xs text-violet-200">Staff Engineer • Ex-Notion</div>
              </div>

              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 text-sm text-white/80 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200">Platform Features</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                    <span>AI-powered semantic job search</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
                    <span>Natural language queries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                    <span>Real-time job discovery</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-pink-400 shadow-lg shadow-pink-400/50" />
                    <span>Smart matching & insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
