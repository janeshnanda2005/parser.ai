import { Link } from 'react-router-dom'
import { userProfile } from '../data/user.ts'
import { jobEntries } from '../data/jobs.ts'

const highlights = [
  {
    title: 'Impact storytelling',
    description: 'Led platform redesign at Stratly, improving onboarding activation by 23% and reducing support tickets by 18% in the first quarter.',
    link: '#case-study-1',
  },
  {
    title: 'Design systems',
    description: 'Defined an adaptive design system spanning marketing and product surfaces, enabling faster experiment velocity for growth squads.',
    link: '#case-study-2',
  },
]

export default function Profile() {
  return (
    <div className="bg-slate-50 pb-24 pt-12">
      <section className="container mx-auto grid gap-12 px-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="h-24 w-24 rounded-3xl object-cover shadow-lg"
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-blue-600">Candidate profile</p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900">{userProfile.name}</h1>
                  <p className="text-sm text-slate-500">{userProfile.title}</p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {userProfile.availability}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-900">{userProfile.location}</span>
                <div className="flex gap-3 text-xs">
                  {userProfile.links.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 hover:text-blue-700">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-slate-600">{userProfile.about}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <article key={highlight.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Focus area</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{highlight.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
                <Link to={highlight.link} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  View case study
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Interview timeline</h2>
            <ul className="mt-4 space-y-4">
              {userProfile.timeline.map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-200/60 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{item.time}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pipeline metrics</p>
            <div className="mt-4 grid gap-4">
              <MetricCard label="Applications sent" value={userProfile.metrics.applications} accent="text-blue-600" />
              <MetricCard label="Interviews active" value={userProfile.metrics.interviews} accent="text-emerald-600" />
              <MetricCard label="Offers on table" value={userProfile.metrics.offers} accent="text-purple-600" />
              <MetricCard label="Warm referrals" value={userProfile.metrics.referrals} accent="text-amber-600" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recent boards</p>
            <div className="mt-4 space-y-4">
              {jobEntries.slice(0, 3).map((job) => (
                <div key={job.id} className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-inner">
                    <img src={job.companyLogo} alt={job.company} className="h-8 w-8 object-contain" loading="lazy" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.company}</p>
                    <div className="mt-1 inline-flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5">{job.status}</span>
                      <span>{job.postedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-700">Interview prep kit</p>
            <p className="mt-2 text-xs text-blue-600">
              Download the latest panel prep workbook: prompts, culture Q&A, and salary benchmarking templates in one place.
            </p>
            <button className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Download kit
            </button>
          </div>
        </aside>
      </section>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: number
  accent: string
}

function MetricCard({ label, value, accent }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  )
}
