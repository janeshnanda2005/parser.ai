import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface AuthPageProps {
  variant: 'login' | 'register'
}

const headline: Record<AuthPageProps['variant'], string> = {
  login: 'Sign in and ship your next chapter',
  register: 'Create your JobTrackr workspace',
}

const subtext: Record<AuthPageProps['variant'], string> = {
  login: 'Welcome back! Review your pipeline, prep your portfolio, and keep momentum.',
  register: 'Join in minutes and sync your applications across devices. Cancel anytime, no credit card needed.',
}

const alternateCopy: Record<AuthPageProps['variant'], { text: string; link: string; to: string }> = {
  login: { text: "Don't have an account?", link: 'Create one', to: '/register' },
  register: { text: 'Already on JobTrackr?', link: 'Log in', to: '/login' },
}

export default function AuthPage({ variant }: AuthPageProps) {
  const isLogin = variant === 'login'
  const alternate = alternateCopy[variant]
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Frontend Engineering'
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password)
        if (success) {
          navigate('/search')
        } else {
          setError('Invalid email or password')
        }
      } else {
        if (!formData.name.trim()) {
          setError('Please enter your name')
          setIsLoading(false)
          return
        }
        if (!formData.email.trim()) {
          setError('Please enter your email')
          setIsLoading(false)
          return
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }

        const success = await register(formData.name, formData.email, formData.password, formData.role)
        if (success) {
          navigate('/search')
        } else {
          setError('An account with this email already exists')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto flex min-h-screen flex-col justify-center px-4 py-16">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
            <div className="bg-white px-10 py-12 text-slate-900 md:px-14">
              <Link to="/" className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                  JT
                </span>
                <span className="text-lg font-semibold">JobTrackr</span>
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

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="name">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Maya Fernandes"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="maya@product.dev"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                      Password
                    </label>
                    {isLogin && (
                      <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="role">
                      Role focus
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option>Product Design</option>
                      <option>Frontend Engineering</option>
                      <option>Fullstack Engineering</option>
                      <option>Backend Engineering</option>
                      <option>Product Management</option>
                      <option>Data Science</option>
                      <option>Machine Learning</option>
                      <option>DevOps</option>
                      <option>Other</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {isLogin ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                Or continue with
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { name: 'Google', icon: '🔍' },
                  { name: 'GitHub', icon: '🐙' },
                  { name: 'LinkedIn', icon: '💼' },
                  { name: 'Microsoft', icon: '🪟' }
                ].map((provider) => (
                  <button
                    key={provider.name}
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span className="text-base">{provider.icon}</span>
                    {provider.name}
                  </button>
                ))}
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
                <Link to={alternate.to} className="font-semibold text-blue-600 hover:text-blue-700">
                  {alternate.link}
                </Link>
              </div>
            </div>

            <div className="relative hidden flex-col justify-between border-l border-white/10 bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-slate-900/40 p-10 text-white md:flex">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-100">What members say</p>
                <p className="mt-4 text-lg leading-relaxed text-blue-50">
                  "The AI-powered job search helped me find roles I never would have discovered. I landed my dream job in just 3 weeks!"
                </p>
                <div className="mt-6 text-sm font-semibold text-white">Rohan Mehta</div>
                <div className="text-xs text-blue-100">Staff Engineer • Notion alum</div>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-sm text-blue-50 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Platform Features</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-300" />
                    <span>AI-powered job recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-300" />
                    <span>Search across multiple job boards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-300" />
                    <span>Track applications & interviews</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-purple-300" />
                    <span>Smart salary insights & predictions</span>
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
