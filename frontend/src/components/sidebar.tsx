import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Calendar,
  Wand2,
  Plug,
  BarChart3,
  Settings,
  Users,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface NavItem {
  label: string
  path: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Posts', path: '/posts', icon: FileText },
  { label: 'Calendario', path: '/calendar', icon: Calendar },
  { label: 'Clientes', path: '/clients', icon: Users },
  { label: 'Gerar com IA', path: '/generate', icon: Wand2 },
  { label: 'Integracoes', path: '/integrations', icon: Plug },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Configuracoes', path: '/settings', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : '??'

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Postador Auto</h1>
            <p className="text-xs text-muted-foreground">Automacao Social</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
            const Icon = item.icon

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-border px-3 py-4 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-3 py-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-xs font-bold text-white">
                {initials}
              </div>
              <span className="truncate text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}
