"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()


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

  return 
}