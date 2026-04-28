import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
  updateUser: (user: User) => void

}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("moneda_token")
    const storedUser = localStorage.getItem("moneda_user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const response = await fetch("http://localhost:3333/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro ao fazer login.")
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem("moneda_token", data.token)
    localStorage.setItem("moneda_user", JSON.stringify(data.user))
  }

  async function register(name: string, email: string, password: string) {
    const response = await fetch("http://localhost:3333/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro ao criar conta.")
    }

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem("moneda_token", data.token)
    localStorage.setItem("moneda_user", JSON.stringify(data.user))
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem("moneda_token")
    localStorage.removeItem("moneda_user")
  }

  function updateUser(updatedUser: User) {
    setUser(updatedUser)
    localStorage.setItem("moneda_user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!token,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro do AuthProvider")
  return context
}