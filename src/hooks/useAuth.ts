"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authApi, type LoginCredentials } from "@/src/api/auth.api"

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await authApi.login(credentials)

        if (data.token) {
          localStorage.setItem("auth_token", data.token)
          router.push("/dashboard")
          return { success: true }
        } else {
          throw new Error("No se recibió token de autenticación")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    router.push("/login")
  }, [router])

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("auth_token")
  }, [])

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    error,
  }
}
