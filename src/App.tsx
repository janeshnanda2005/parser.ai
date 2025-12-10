import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.tsx'
import Home from './pages/Home.tsx'
import Landing from './pages/Landing.tsx'
import Profile from './pages/Profile.tsx'
import AuthPage from './pages/AuthPage.tsx'
import NotFound from './pages/NotFound.tsx'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="login" element={<AuthPage variant="login" />} />
      <Route path="register" element={<AuthPage variant="register" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App