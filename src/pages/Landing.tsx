import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Unified Pipeline',
    description: 'See every application, interview, and offer at a glance with our pipeline view.',
    icon: '🗂️',
  },
  {
    title: 'Smart Alerts',
    description: 'Stay ahead with reminders for follow-ups, take-home deadlines, and interviews.',
    icon: '⏰',
  },
  {
    title: 'Company Intel',
    description: 'Research culture, salary bands, and interview prep cheat-sheets in one place.',
    icon: '🧠',
  },
]

const testimonials = [
  {
    quote:
      'JobTrackr turned my chaotic Notion doc into a streamlined workflow. I landed my offer in four weeks.',
    name: 'Alisha Verma',
    role: 'Senior Frontend Engineer, Luma AI',
  },
  {
    quote:
      'I loved the interview readiness view. Being able to prep per company with curated insights was a game changer.',
    name: 'Leo Marsh',
    role: 'Staff Engineer, Dashlane',
  },
]

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="container mx-auto flex flex-col items-center gap-10 px-4 pb-24 pt-16 text-center md:flex-row md:items-start md:text-left">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Built for modern job hunters
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Ship your next career move with confidence
          </h1>
          <p className="max-w-xl text-lg text-slate-600 md:text-xl">
            JobTrackr gives you a focused space to manage every application, prep for interviews, and never miss a follow-up. Designed for developers who want clarity, not chaos.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Start free trial
            </Link>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            >
              Explore dashboard
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
            <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-lg text-blue-600">
                350+
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Growth teams onboarded</p>
                <p className="text-xs text-slate-500">From early startups to unicorns</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-lg text-emerald-600">
                86%
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Faster offer cycles</p>
                <p className="text-xs text-slate-500">For candidates using our prep flows</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-xl backdrop-blur">
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-left">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pipeline</span>
                <span>Week 32</span>
              </div>
              <div className="mt-6 space-y-4 text-sm text-white">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Upcoming</p>
                  <p className="mt-2 text-base font-semibold">Frontend Pairing at Luma AI</p>
                  <p className="mt-1 text-sm text-blue-100">Wed, 2:30 PM • 75 min</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">In Review</p>
                  <p className="mt-2 text-base font-semibold">Offer discussion at Formstack</p>
                  <p className="mt-1 text-sm text-emerald-100">Drafting negotiation points</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Action</p>
                  <p className="mt-2 text-base font-semibold">Follow up with Drift</p>
                  <p className="mt-1 text-sm text-amber-100">Sent take-home on Monday</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 w-full max-w-[240px] -translate-x-1/2 rounded-2xl border border-white bg-white p-4 shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Momentum</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-[2px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900">
                    7
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Active interview loops</p>
                  <p className="text-xs text-slate-500">Track prep focus by company</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
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
        <div className="rounded-3xl bg-slate-900 px-6 py-12 text-white md:px-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
                Success stories
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Loved by ambitious builders switching teams and leveling up
              </h2>
              <p className="mt-4 text-sm text-blue-100">
                Craft interview flows, follow up with clarity, and negotiate using market insights.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition hover:bg-white hover:text-slate-900"
              >
                View playbook
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm leading-relaxed text-blue-50">“{testimonial.quote}”</p>
                  <div className="mt-4 text-sm font-semibold text-white">{testimonial.name}</div>
                  <div className="text-xs text-blue-200">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
