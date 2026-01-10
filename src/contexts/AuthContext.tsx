import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'jobtrackr_user'
const USERS_KEY = 'jobtrackr_users'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // Get all registered users
  const getUsers = (): Record<string, { password: string; user: User }> => {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : {}
  }

  // Save users to localStorage
  const saveUsers = (users: Record<string, { password: string; user: User }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getUsers()
    const userData = users[email.toLowerCase()]

    if (userData && userData.password === password) {
      setUser(userData.user)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData.user))
      return true
    }

    return false
  }

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getUsers()
    const emailLower = email.toLowerCase()

    // Check if user already exists
    if (users[emailLower]) {
      return false
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: emailLower,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`
    }

    users[emailLower] = { password, user: newUser }
    saveUsers(users)

    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
