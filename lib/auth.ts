"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, JSX } from "react"
import { API_URL } from "./config"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "patient" | "doctor" | "admin"
  dateOfBirth?: string
  gender?: string
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      if (!data.success || !data.data?.user) {
        throw new Error("Invalid response format")
      }

      const userData = data.data.user
      setUser(userData)
      return userData
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed")
      }

      if (!responseData.success || !responseData.data?.user) {
        throw new Error("Invalid response format")
      }

      setUser(responseData.data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      setUser(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  }

  return React.createElement(AuthContext.Provider, { value: contextValue }, children)
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
