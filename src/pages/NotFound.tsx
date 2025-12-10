import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 px-4 py-24 text-center">
      <div className="max-w-lg space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          404 — Page not found
        </span>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">We lost this view in the interview loop</h1>
        <p className="text-sm text-slate-500 md:text-base">
          It looks like the page you&apos;re trying to reach has moved or no longer exists. Head back to the dashboard or explore featured roles.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Return to dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
