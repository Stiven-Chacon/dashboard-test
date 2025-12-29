"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/useAuth"
import Header from "@/src/components/dashboard/Header"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")

    if (!token) {
      router.push("/login")
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    </div>
  )
}
