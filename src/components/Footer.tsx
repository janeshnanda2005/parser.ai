import { Link } from 'react-router-dom'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/home' },
      { label: 'Pricing', to: '/home#pricing' },
      { label: 'Integrations', to: '/home#integrations' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/#about' },
      { label: 'Careers', to: '/#careers' },
      { label: 'Contact', to: '/#contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: '/#blog' },
      { label: 'Help Center', to: '/#help' },
      { label: 'Privacy', to: '/#privacy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-white">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-500/30">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                  <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
              Parser.ai
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Parser.ai is your AI-powered command center for job hunting. Discover opportunities across the universe of tech careers with intelligent search and insights.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
                  {section.title}
                </h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="transition hover:text-violet-400">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Parser.ai. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/#privacy" className="hover:text-violet-400">
              Privacy
            </Link>
            <Link to="/#terms" className="hover:text-violet-400">
              Terms
            </Link>
            <Link to="/#security" className="hover:text-violet-400">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
