"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { FilterOptions } from "@/app/dashboard/bakanes/page"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  currentFilters: FilterOptions
  onApplyFilters: (filters: FilterOptions) => void
}

export default function FilterModal({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApplyFilters(filters)
  }

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      status: "all",
      dateFrom: "",
      dateTo: "",
    }
    setFilters(resetFilters)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="all"
                  checked={filters.status === "all"}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value as any })
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Todos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={filters.status === "active"}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value as any })
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={filters.status === "inactive"}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value as any })
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Inactivo</span>
              </label>
            </div>
          </div>

          {/* Fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha desde
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha hasta
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-[#1E1B4D] text-white rounded-lg hover:bg-[#16132e] transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}