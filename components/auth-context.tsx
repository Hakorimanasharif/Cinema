"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cinemax-8yem.onrender.com'

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    const storedUserRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null

    if (storedToken && storedUserRaw) {
      try {
        // Check if token is expired
        const decoded = JSON.parse(atob(storedToken.split('.')[1]))
        const currentTime = Date.now() / 1000
        if (decoded.exp && decoded.exp > currentTime) {
          const parsed = JSON.parse(storedUserRaw)
          if (parsed && typeof parsed === 'object') {
            setToken(storedToken)
            setUser(parsed)
          }
        } else {
          // Token expired, clear it
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      } catch {
        // Corrupt token or user data — clear it
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }

      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' }
      }

      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
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
