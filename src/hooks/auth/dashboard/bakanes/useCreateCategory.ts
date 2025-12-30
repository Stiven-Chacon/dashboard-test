"use client"

import { useState } from "react"
import { categoriesApi, type CreateCategoryPayload } from "@/src/api/categories.api"

interface FormErrors {
  name?: string
  description?: string
  categoryId?: string
}

export const useCreateCategory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (payload: CreateCategoryPayload): boolean => {
    const newErrors: FormErrors = {}

    if (!payload.name || payload.name.trim().length === 0) {
      newErrors.name = "El nombre es obligatorio"
    } else if (payload.name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres"
    }

    if (!payload.description || payload.description.trim().length === 0) {
      newErrors.description = "La descripción es obligatoria"
    } else if (payload.description.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createCategory = async (payload: CreateCategoryPayload) => {
    if (!validateForm(payload)) {
      return { success: false, error: "Por favor corrige los errores" }
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await categoriesApi.create(payload)
      return { success: true, data: result }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear la categoría"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    errors,
    createCategory,
    setErrors,
  }
}