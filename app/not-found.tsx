"use client"

import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 */}
        <div className="space-y-2">
          <h1 className="text-8xl font-light text-gray-900 tracking-tight">
            404
          </h1>
          <div className="w-16 h-0.5 bg-gray-900 mx-auto" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-medium text-gray-900">
            Página no encontrada
          </h2>
          <p className="text-gray-500 leading-relaxed">
            La página que buscas no existe
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <Home size={18} />
            Volver al inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Página anterior
          </button>
        </div>
      </div>
    </div>
  )
}