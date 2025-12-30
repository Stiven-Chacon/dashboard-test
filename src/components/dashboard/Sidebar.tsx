"use client"

import { Home, TrendingUp, Users, DollarSign, Store, Award, FileText, Grid, LogOut, Menu, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"

interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: TrendingUp, label: "Impacto Social", path: "/dashboard/impacto-social" },
    { icon: Users, label: "Comunidad", path: "/dashboard/comunidad" },
    { icon: DollarSign, label: "Sponsors", path: "/dashboard/sponsors" },
    { icon: Store, label: "Marketplace", path: "/dashboard/marketplace" },
    { icon: Award, label: "Bakanes", path: "/dashboard/bakanes" },
    { icon: FileText, label: "Contenidos", path: "/dashboard/contenidos" },
    { icon: Grid, label: "Categorías de acciones", path: "/dashboard/categorias" },
  ]

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleNavigate = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      {!isMobileMenuOpen && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      )}

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-16 left-0
          w-64 bg-white 
          border-r border-gray-200 
          h-[calc(100vh-64px)]
          flex flex-col
          transition-transform duration-300 ease-in-out
          z-40
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Botón cerrar móvil - dentro del sidebar */}
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={20} className="text-gray-700" />
          </button>
        )}

        {/* Logo Section */}
        <div className="border-b border-gray-200">
          <img 
            src="/BackgroundSidebar.svg" 
            alt="be kind network" 
            className="w-full h-auto"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-blue-50 text-[#1E1B4D] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}