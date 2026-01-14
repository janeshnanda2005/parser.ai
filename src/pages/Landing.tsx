import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Semantic Search',
    description: 'AI understands what you mean, not just what you type. Find roles that truly match your skills.',
    icon: '🔭',
  },
  {
    title: 'Real-time Discovery',
    description: 'Jobs from across the galaxy, indexed and analyzed by our AI to surface the best matches.',
    icon: '🚀',
  },
  {
    title: 'Smart Insights',
    description: 'Get AI-powered summaries, salary predictions, and company culture analysis instantly.',
    icon: '🧠',
  },
]

const testimonials = [
  {
    quote:
      'Parser.ai turned my chaotic job search into a streamlined workflow. I landed my offer in four weeks.',
    name: 'Alisha Verma',
    role: 'Senior Frontend Engineer, Luma AI',
  },
  {
    quote:
      'The AI-powered search is incredible. Being able to discover roles with curated insights was a game changer.',
    name: 'Leo Marsh',
    role: 'Staff Engineer, Dashlane',
  },
]

export default function Landing() {
  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute h-2 w-2 rounded-full bg-white/20 top-[10%] left-[15%] animate-pulse" />
        <div className="absolute h-1 w-1 rounded-full bg-white/30 top-[20%] left-[80%] animate-pulse delay-100" />
        <div className="absolute h-1.5 w-1.5 rounded-full bg-purple-400/30 top-[60%] left-[10%] animate-pulse delay-200" />
        <div className="absolute h-1 w-1 rounded-full bg-white/20 top-[40%] left-[90%] animate-pulse delay-300" />
        <div className="absolute h-2 w-2 rounded-full bg-blue-400/20 top-[80%] left-[70%] animate-pulse delay-500" />
        <div className="absolute h-1 w-1 rounded-full bg-white/30 top-[15%] left-[50%] animate-pulse delay-700" />
        <div className="absolute h-1.5 w-1.5 rounded-full bg-violet-400/30 top-[70%] left-[30%] animate-pulse delay-1000" />
      </div>
      
      <section className="container relative mx-auto flex flex-col items-center gap-10 px-4 pb-24 pt-16 text-center md:flex-row md:items-start md:text-left">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 border border-violet-500/30 px-4 py-1 text-sm font-semibold text-violet-300">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Job Discovery
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Navigate the <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">universe</span> of opportunities
          </h1>
          <p className="max-w-xl text-lg text-slate-400 md:text-xl">
            Parser.ai uses intelligent search to discover your perfect role across the tech galaxy. Find jobs that match your skills, not just keywords.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:-translate-y-0.5 hover:shadow-violet-500/50"
            >
              Launch your search
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Explore jobs
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-left">
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/20 text-lg text-violet-300">
                10K+
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Jobs indexed</p>
                <p className="text-xs text-slate-500">Across the tech universe</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/20 text-lg text-emerald-300">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Smart matching</p>
                <p className="text-xs text-slate-500">Semantic search powered</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI Search Active
                </span>
                <span>Parser.ai</span>
              </div>
              <div className="mt-6 space-y-4 text-sm text-white">
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Top Match</p>
                  <p className="mt-2 text-base font-semibold">Senior ML Engineer at OpenAI</p>
                  <p className="mt-1 text-sm text-violet-200">95% skill match • Remote</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">New Today</p>
                  <p className="mt-2 text-base font-semibold">Full Stack Dev at Stripe</p>
                  <p className="mt-1 text-sm text-emerald-200">88% match • San Francisco</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Trending</p>
                  <p className="mt-2 text-base font-semibold">AI Research at Anthropic</p>
                  <p className="mt-1 text-sm text-amber-200">92% match • Remote</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 w-full max-w-[240px] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-800/90 p-4 shadow-2xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">AI Status</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 p-[2px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Scanning 25K+ jobs</p>
                  <p className="text-xs text-slate-400">Finding your perfect match</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container relative mx-auto px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/10">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-400">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-violet-900/50 via-purple-900/50 to-indigo-900/50 border border-white/10 px-6 py-12 md:px-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
                Success stories
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Trusted by engineers exploring new frontiers
              </h2>
              <p className="mt-4 text-sm text-slate-400">
                Join thousands who've discovered their dream roles with Parser.ai.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/20 px-5 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/30"
              >
                Start exploring
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-sm leading-relaxed text-blue-50">“{testimonial.quote}”</p>
                  <div className="mt-4 text-sm font-semibold text-white">{testimonial.name}</div>
                  <div className="text-xs text-slate-400">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
