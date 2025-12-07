export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <ul className="flex gap-6">
          <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
          <li><a href="/jobs" className="hover:text-blue-400 transition">Jobs</a></li>
          <li><a href="/applications" className="hover:text-blue-400 transition">Applications</a></li>
        </ul>
      </div>
    </nav>
  )
}
