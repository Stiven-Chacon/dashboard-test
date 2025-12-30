"use client"

import { useState, useCallback } from "react"
import { categoriesApi, type CategoriesListResponse } from "@/src/api/categories.api"

export const useCategories = () => {
  const [data, setData] = useState<CategoriesListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async (pageNumber: number = 1, pageSize: number = 10) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await categoriesApi.getList(pageNumber, pageSize)
      setData(response)
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    fetchCategories,
  }
}