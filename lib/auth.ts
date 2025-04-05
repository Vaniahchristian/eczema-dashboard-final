"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, JSX, useEffect } from "react"
import { API_URL } from "./config"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "patient" | "doctor" | "admin"
  dateOfBirth?: string
  gender?: string
  profileImage?: string
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

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=604800; SameSite=Lax`
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(() => {
    // Try to get user from localStorage during initialization
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user")
      return savedUser ? JSON.parse(savedUser) : null
    }
    return null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

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
      const token = data.data.token

      // Store token in localStorage and cookie
      localStorage.setItem("token", token)
      setCookie("token", token)
      setCookie("userRole", userData.role)
      
      // Set user data
      setUser(userData)
      return userData
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed")
      throw error
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

      const userData = responseData.data.user
      const token = responseData.data.token

      // Store token in localStorage and cookie
      localStorage.setItem("token", token)
      setCookie("token", token)
      setCookie("userRole", userData.role)

      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear all auth data
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      deleteCookie("token")
      deleteCookie("userRole")
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
