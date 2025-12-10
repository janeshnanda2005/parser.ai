import { Link } from 'react-router-dom'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto flex min-h-screen flex-col justify-center px-4 py-16">
        <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
            <div className="bg-white px-10 py-12 text-slate-900 md:px-14">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                  JT
                </span>
                <span className="text-lg font-semibold">JobTrackr</span>
              </div>

              <div className="mt-8 space-y-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{headline[variant]}</h1>
                <p className="text-sm text-slate-500 md:text-base">{subtext[variant]}</p>
              </div>

              <form className="mt-10 space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700" htmlFor="name">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
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
                    placeholder="maya@product.dev"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
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
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option>Product Design</option>
                      <option>Frontend Engineering</option>
                      <option>Fullstack Engineering</option>
                      <option>Product Management</option>
                      <option>Data Science</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  {isLogin ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                Or continue with
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Google', 'GitHub', 'LinkedIn', 'Figma'].map((provider) => (
                  <button
                    key={provider}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-xs">{provider[0]}</span>
                    {provider}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-xs text-slate-500">
                By continuing, you agree to our{' '}
                <a href="#terms" className="font-semibold text-slate-900 underline offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="font-semibold text-slate-900 underline offset-2">
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
                  “The interview board keeps me honest about prep. I love walking into loops with a crystal-clear plan instead of scattered notes.”
                </p>
                <div className="mt-6 text-sm font-semibold text-white">Rohan Mehta</div>
                <div className="text-xs text-blue-100">Staff Engineer • Notion alum</div>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-sm text-blue-50">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Today&apos;s focus</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-emerald-300" />
                    <span>Rehearse Nebula UI product teardown · 25 min</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-300" />
                    <span>Send follow-up email to Drift hiring manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-amber-300" />
                    <span>Update salary benchmarks for Relaywave offer review</span>
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
