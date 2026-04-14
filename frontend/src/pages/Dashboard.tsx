import { Link } from 'react-router-dom'
import {
  Clock,
  CalendarDays,
  CheckCircle2,
  Hourglass,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Wand2,
  BarChart3,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Check,
  AlertCircle,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number
  icon: React.ElementType
  trend: { value: number; up: boolean }
  color: string
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
            trend.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          )}
        >
          {trend.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend.value}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  )
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ElementType
  to: string
  gradient: string
}

function QuickAction({ title, description, icon: Icon, to, gradient }: QuickActionProps) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card/80"
    >
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', gradient)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

const statusBadgeMap: Record<string, { color: string; label: string }> = {
  publicado: { color: 'bg-emerald-500/10 text-emerald-400', label: 'Publicado' },
  agendado: { color: 'bg-blue-500/10 text-blue-400', label: 'Agendado' },
  pendente: { color: 'bg-amber-500/10 text-amber-400', label: 'Pendente' },
  rascunho: { color: 'bg-muted text-muted-foreground', label: 'Rascunho' },
}

const platformIconMap: Record<string, { icon: React.ElementType; color: string }> = {
  instagram: { icon: Instagram, color: 'text-pink-500' },
  facebook: { icon: Facebook, color: 'text-blue-500' },
  linkedin: { icon: Linkedin, color: 'text-blue-400' },
  twitter: { icon: Twitter, color: 'text-sky-400' },
}

const stats: StatCardProps[] = [
  { title: 'Pendentes', value: 12, icon: Clock, trend: { value: 8, up: false }, color: 'bg-amber-500' },
  { title: 'Agendados', value: 34, icon: CalendarDays, trend: { value: 12, up: true }, color: 'bg-blue-500' },
  { title: 'Publicados', value: 156, icon: CheckCircle2, trend: { value: 24, up: true }, color: 'bg-emerald-500' },
  { title: 'Pendente Aprov.', value: 5, icon: Hourglass, trend: { value: 3, up: false }, color: 'bg-purple-500' },
]

const quickActions: QuickActionProps[] = [
  {
    title: 'Novo Post',
    description: 'Criar e agendar publicação',
    icon: FileText,
    to: '/posts',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
  },
  {
    title: 'Gerar com IA',
    description: 'Criar conteúdo inteligente',
    icon: Wand2,
    to: '/generate',
    gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
  },
  {
    title: 'Ver Analytics',
    description: 'Métricas e desempenho',
    icon: BarChart3,
    to: '/analytics',
    gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
  },
]

interface RecentPost {
  id: number
  title: string
  platform: string
  status: string
  date: string
}

const recentPosts: RecentPost[] = [
  { id: 1, title: 'Lançamento coleção verão', platform: 'instagram', status: 'publicado', date: '12 Abr 2026' },
  { id: 2, title: 'Dicas de produtividade', platform: 'linkedin', status: 'agendado', date: '13 Abr 2026' },
  { id: 3, title: 'Promoção Dia das Mães', platform: 'facebook', status: 'pendente', date: '14 Abr 2026' },
  { id: 4, title: 'Behind the scenes', platform: 'instagram', status: 'publicado', date: '11 Abr 2026' },
  { id: 5, title: 'Webinar gratuito', platform: 'twitter', status: 'rascunho', date: '15 Abr 2026' },
]

interface PlatformConnection {
  name: string
  icon: React.ElementType
  connected: boolean
  color: string
}

const platforms: PlatformConnection[] = [
  { name: 'Instagram', icon: Instagram, connected: true, color: 'text-pink-500' },
  { name: 'Facebook', icon: Facebook, connected: true, color: 'text-blue-500' },
  { name: 'LinkedIn', icon: Linkedin, connected: true, color: 'text-blue-400' },
  { name: 'Twitter', icon: Twitter, connected: false, color: 'text-sky-400' },
]

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">Olá, David! 👋</h1>
        <p className="mt-1 text-muted-foreground">Aqui está o resumo da sua conta hoje.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Ações Rápidas</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <QuickAction key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Posts & Platforms */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="font-semibold">Posts Recentes</h3>
              <Link to="/posts" className="text-sm text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Plataforma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentPosts.map((post) => {
                    const status = statusBadgeMap[post.status]
                    const platform = platformIconMap[post.platform]
                    const PlatformIcon = platform?.icon

                    return (
                      <tr key={post.id} className="transition-colors hover:bg-secondary/20">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          {post.title}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {PlatformIcon && (
                            <PlatformIcon className={cn('h-5 w-5', platform.color)} />
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {status && (
                            <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', status.color)}>
                              {status.label}
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                          {post.date}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Platform Connections */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="font-semibold">Conexões</h3>
            <Link to="/integrations" className="text-sm text-primary hover:underline">
              Gerenciar
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary/20"
              >
                <div className="flex items-center gap-3">
                  <platform.icon className={cn('h-6 w-6', platform.color)} />
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
                {platform.connected ? (
                  <div className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-xs text-amber-400">Desconectado</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
