"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/hooks/auth/useAuth"
import Header from "@/src/components/dashboard/Header"
import Sidebar from "@/src/components/dashboard/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      <div className="flex">
        <Sidebar onLogout={logout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 sm:pt-6 lg:pt-8 min-h-[calc(100vh-64px)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}