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
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                JT
              </span>
              JobTrackr
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-500">
              JobTrackr is your personal command center for tech job hunting. Organize applications, monitor progress, and stay interview-ready with smart insights.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                  {section.title}
                </h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-500">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="transition hover:text-blue-600">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} JobTrackr. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/#privacy" className="hover:text-blue-600">
              Privacy
            </Link>
            <Link to="/#terms" className="hover:text-blue-600">
              Terms
            </Link>
            <Link to="/#security" className="hover:text-blue-600">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
