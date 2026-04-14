import { useLocation } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/posts': 'Posts',
  '/calendar': 'Calendário',
  '/generate': 'Gerar com IA',
  '/integrations': 'Integrações',
  '/analytics': 'Analytics',
  '/settings': 'Configurações',
}

export function Header() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'Postador Auto'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar..."
              className="h-9 w-64 rounded-lg border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-xs font-bold text-white">
            DJ
          </div>
        </div>
      </div>
    </header>
  )
}
