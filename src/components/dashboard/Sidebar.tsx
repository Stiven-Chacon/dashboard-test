import { Home, TrendingUp, Users, DollarSign, Store, Award, FileText, Grid, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

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

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] flex flex-col">
      {/* Logo Section */}
      <div className="border-b border-gray-200">
        <img 
          src="/BackgroundSidebar.svg" 
          alt="be kind network" 
          className="w-full h-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
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
  )
}