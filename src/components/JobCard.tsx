import type { JobEntry } from '../data/jobs.ts'

interface JobCardProps {
  job: JobEntry
}

const statusStyles: Record<JobEntry['status'], string> = {
  Applied: 'bg-blue-50 text-blue-600 border-blue-200',
  Interviewing: 'bg-amber-50 text-amber-600 border-amber-200',
  Offer: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Saved: 'bg-purple-50 text-purple-600 border-purple-200',
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-inner">
            <img src={job.companyLogo} alt={job.company} className="h-9 w-9 object-contain" loading="lazy" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{job.company}</p>
            <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">{job.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{job.location}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{job.type}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>{job.postedAt}</span>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[job.status]}`}>
          {job.status}
        </span>
      </header>

      <p className="mt-4 text-sm leading-relaxed text-slate-600">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <footer className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Compensation</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{job.salary}</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300">
            Save role
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800">
            View brief
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>
    </article>
  )
}