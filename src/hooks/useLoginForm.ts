"use client"

import { useState, useCallback } from "react"
import { validateLogin } from "@/src/utils/validators"
import { useAuth } from "@/src/hooks/useAuth"

export function useLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)

  const { login, isLoading } = useAuth()

  const submit = useCallback(async () => {
    setFormError(null)

    const validationErrors = validateLogin(email, password)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    const result = await login({
      username: email,
      password,
    })

    if (!result.success) {
      setFormError(result.error ?? "Credenciales inválidas")
    }
  }, [email, password, login])

  return {
    email,
    password,
    showPassword,
    errors,
    formError,
    isLoading,
    setEmail,
    setPassword,
    setShowPassword,
    submit,
  }
}
