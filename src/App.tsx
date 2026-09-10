import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Search from './pages/Search'
import SavedJobs from './pages/SavedJobs'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route path="/search" element={<Search />} />
      <Route path="/saved-jobs" element={<SavedJobs />} />
      <Route path="*" element={<Navigate to="/search" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App