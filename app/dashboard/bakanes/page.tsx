"use client"

import { useEffect, useState, useMemo } from "react"
import { useCategories } from "@/src/hooks/auth/dashboard/bakanes/useCategories"
import CategoryModal from "@/src/components/dashboard/CategoryModal"
import FilterModal from "@/src/components/dashboard/FilterModal"
import type { Category } from "@/src/api/categories.api"
import { mockCategoriesData } from "@/src/data/mockCategoriesData"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  AlertCircle,
  Plus,
  Code,
  X,
} from "lucide-react"

const TABS = [
  { id: "categorias", label: "Categorías" },
  { id: "tipos", label: "Tipos" },
  { id: "evidencias", label: "Evidencias" },
] as const

export interface FilterOptions {
  status: "all" | "active" | "inactive"
  dateFrom: string
  dateTo: string
}

export default function CategoriesTable() {
  const [activeTab, setActiveTab] = useState("categorias")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showDebugData, setShowDebugData] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    dateFrom: "",
    dateTo: "",
  })

  const { data, isLoading, error, fetchCategories } = useCategories()

  useEffect(() => {
    fetchCategories(currentPage, pageSize)
  }, [currentPage, pageSize, fetchCategories])

  // Filter and search logic
  const filteredCategories = useMemo(() => {
    const categories = showDebugData
      ? mockCategoriesData.data.data
      : data?.data?.data || []

    return categories.filter((category) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && category.status === 1) ||
        (filters.status === "inactive" && category.status === 0)

      // Date range filter
      const categoryDate = new Date(category.createdAt)
      const matchesDateFrom =
        !filters.dateFrom || categoryDate >= new Date(filters.dateFrom)
      const matchesDateTo =
        !filters.dateTo || categoryDate <= new Date(filters.dateTo)

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
    })
  }, [showDebugData, data, searchTerm, filters])

  // Pagination for filtered data
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredCategories.slice(startIndex, endIndex)
  }, [filteredCategories, currentPage, pageSize])

  const totalPages = Math.ceil(filteredCategories.length / pageSize)
  const totalElements = filteredCategories.length

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  const handleSuccess = () => {
    fetchCategories(currentPage, pageSize)
  }

  const toggleDebugData = () => {
    setShowDebugData(!showDebugData)
  }

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setIsFilterModalOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      dateFrom: "",
      dateTo: "",
    })
    setCurrentPage(1)
  }

  const hasActiveFilters =
    filters.status !== "all" || filters.dateFrom !== "" || filters.dateTo !== ""

  const handleClearSearch = () => {
    setSearchTerm("")
    setCurrentPage(1)
  }

  // Loading State
  if (isLoading && !showDebugData) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Categorías
        </h1>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  // Error State
  if (error && !showDebugData) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Categorías
          </h1>
          <button
            onClick={toggleDebugData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <Code className="w-4 h-4" />
            Data de prueba
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <p className="text-red-800 font-bold text-xl mb-2">
            ¡Ups! Error en el servidor
          </p>
          <p className="text-red-600 text-sm mb-4">
            No pudimos cargar las categorías
          </p>
          <button
            onClick={() => fetchCategories(currentPage, pageSize)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Empty State
  if (filteredCategories.length === 0 && !showDebugData && !searchTerm && !hasActiveFilters) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Categorías
            </h1>
            <button
              onClick={toggleDebugData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Code className="w-4 h-4" />
              Data de prueba
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-2">No hay categorías</p>
            <p className="text-gray-500 text-sm mb-4">
              Comienza creando tu primera categoría
            </p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-[#1E1B4D] text-white rounded-lg hover:bg-[#16132e] transition-colors"
            >
              Crear categoría
            </button>
          </div>
        </div>
        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          category={selectedCategory}
          onSuccess={handleSuccess}
        />
      </>
    )
  }

  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalElements)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Categorías
          </h1>
          <button
            onClick={toggleDebugData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
          >
            <Code className="w-4 h-4" />
            {showDebugData ? "Usar data real" : "Data de prueba"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 md:gap-8 border-b border-gray-200 mb-4 md:mb-6 flex-shrink-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 md:mb-6 gap-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E1B4D]" />
              <input
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 pr-10 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E1B4D] focus:border-[#1E1B4D] outline-none text-sm text-[#1E1B4D] placeholder:text-[#1E1B4D]"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-[#1E1B4D] w-full sm:w-auto border border-gray-300"
              >
                <Filter className="w-4 h-4" />
                Filtros
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-[#1E1B4D] text-white rounded-lg hover:bg-[#16132e] transition-colors text-sm font-medium w-full sm:w-auto"
          >
            Crear categoría
          </button>
        </div>

        {/* Results info */}
        {(searchTerm || hasActiveFilters) && (
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {filteredCategories.length} resultado
            {filteredCategories.length !== 1 ? "s" : ""}
            {searchTerm && ` para "${searchTerm}"`}
          </div>
        )}

        {/* No results found */}
        {filteredCategories.length === 0 && (searchTerm || hasActiveFilters) && (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium mb-2">
              No se encontraron resultados
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Intenta ajustar los filtros o buscar con otros términos
            </p>
            <div className="flex gap-2">
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Limpiar búsqueda
                </button>
              )}
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#1E1B4D] text-white rounded-lg hover:bg-[#16132e] transition-colors text-sm"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table for Desktop - Cards for Mobile */}
      {paginatedCategories.length > 0 && (
        <div className="flex-1 mb-6">
          {/* Desktop Table View */}
          <div className="hidden md:flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden max-h-[calc(100vh-350px)]">
            <div className="overflow-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Nombre de la categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Ícono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Fecha de creación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          style={{ backgroundColor: category.color }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            category.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {category.status === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {category.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(category.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Editar"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Enlazar"
                          >
                            <LinkIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for Desktop */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4 flex-shrink-0 bg-white">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Resultados por página</span>
                <select
                  value={pageSize}
                  onChange={(e) =>
                    handlePageSizeChange(Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {startIndex} - {endIndex} de {totalElements}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Primera página"
                  >
                    <ChevronsLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Última página"
                  >
                    <ChevronsRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden flex flex-col gap-4 max-h-[calc(100vh-350px)] overflow-auto pb-4">
            {paginatedCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          category.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.status === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {category.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Editar"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                      aria-label="Enlazar"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile Pagination */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-auto flex-shrink-0">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {startIndex} - {endIndex} de {totalElements}
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Primera página"
                  >
                    <ChevronsLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="px-4 py-1 text-sm font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Última página"
                  >
                    <ChevronsRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </>
  )
}