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
  // Set SameSite=None and Secure for cross-domain cookies
  document.cookie = `${name}=${value}; path=/; max-age=604800; SameSite=None; Secure`
}

const deleteCookie = (name: string) => {
  // Set SameSite=None and Secure when deleting cross-domain cookies
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure`
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
        credentials: "include", // Important for cookie-based auth
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

      // Store in both cookies and localStorage for maximum compatibility
      setCookie("token", token)
      setCookie("userRole", userData.role)
      
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      
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

      // Store token in cookies and user data in localStorage
      setCookie("token", token)
      setCookie("userRole", userData.role)
      localStorage.setItem("user", JSON.stringify(userData))

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

export function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
