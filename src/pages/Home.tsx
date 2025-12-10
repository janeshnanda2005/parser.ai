import { Link } from 'react-router-dom'
import JobCard from '../components/JobCard.tsx'
import { jobEntries } from '../data/jobs.ts'
import { userProfile } from '../data/user.ts'

const spotlightItems = [
  {
    label: 'Active loops',
    value: '3',
    trend: '+1',
    descriptor: 'week over week',
  },
  {
    label: 'Avg. response time',
    value: '48h',
    trend: '-12h',
    descriptor: 'faster than last week',
  },
  {
    label: 'Warm referrals',
    value: '5',
    trend: '+2',
    descriptor: 'awaiting follow-up',
  },
]

export default function Home() {
  return (
    <div className="bg-slate-50 pb-24 pt-10">
      <section className="container mx-auto grid gap-8 px-4 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Today&apos;s plan</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
                Welcome back, {userProfile.name.split(' ')[0]}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Curated board based on what&apos;s moving this week. Stay sharp and keep momentum.
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              View profile
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {spotlightItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{item.label}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">{item.value}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                    {item.trend}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{item.descriptor}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white shadow-lg">
          <div className="flex flex-col gap-6 px-7 py-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="h-full w-full rounded-2xl object-cover"
                />
                <span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Ready
                </span>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.30em] text-blue-200">Portfolio spotlight</p>
                <h2 className="text-xl font-semibold text-white">{userProfile.name}</h2>
                <p className="text-sm text-blue-100">{userProfile.title}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{userProfile.about}</p>
            <div className="flex flex-wrap gap-2">
              {userProfile.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                  {skill}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="uppercase tracking-[0.25em] text-blue-200">Applications</p>
                <p className="mt-2 text-2xl font-bold text-white">{userProfile.metrics.applications}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="uppercase tracking-[0.25em] text-emerald-200">Interviews</p>
                <p className="mt-2 text-2xl font-bold text-white">{userProfile.metrics.interviews}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="uppercase tracking-[0.25em] text-amber-200">Offers</p>
                <p className="mt-2 text-2xl font-bold text-white">{userProfile.metrics.offers}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="uppercase tracking-[0.25em] text-purple-200">Referrals</p>
                <p className="mt-2 text-2xl font-bold text-white">{userProfile.metrics.referrals}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {userProfile.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-blue-100 transition hover:border-white/30 hover:text-white"
                >
                  {link.label}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3 w-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-12 grid gap-10 px-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Forward momentum</p>
              <h2 className="text-2xl font-semibold text-slate-900">Active opportunities</h2>
            </div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Export board
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7m9 0h-5m5 16H4m0-16v16m7-16v4a2 2 0 0 0 2 2h4" />
              </svg>
            </Link>
          </div>
          <div className="space-y-4">
            {jobEntries.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">This week&apos;s agenda</p>
            <ul className="mt-5 space-y-4">
              {userProfile.timeline.map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{item.time}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">Stay on brand</p>
            <p className="mt-2 text-xs text-blue-600">
              Refresh your case study deck with the new storytelling template designed for PM interviews.
            </p>
            <button className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Open template
            </button>
          </div>
        </aside>
      </section>
    </div>
  )
}
