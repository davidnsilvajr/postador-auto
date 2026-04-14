import {
  TrendingUp,
  Users,
  MousePointerClick,
  Percent,
  Instagram,
  Facebook,
  Linkedin,
  ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryCardProps {
  title: string
  value: string
  icon: React.ElementType
  trend: number
  color: string
}

function SummaryCard({ title, value, icon: Icon, trend, color }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <ArrowUpRight className="h-3 w-3" />
          {trend}%
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  )
}

const summaryCards: SummaryCardProps[] = [
  { title: 'Impressões', value: '48.2K', icon: TrendingUp, trend: 12.5, color: 'bg-blue-500' },
  { title: 'Alcance', value: '12.8K', icon: Users, trend: 8.3, color: 'bg-purple-500' },
  { title: 'Engajamento', value: '3.2K', icon: MousePointerClick, trend: 5.7, color: 'bg-emerald-500' },
  { title: 'Taxa de Engajamento', value: '2.8%', icon: Percent, trend: 1.2, color: 'bg-amber-500' },
]

const weeklyData = [
  { day: 'Seg', value: 4200 },
  { day: 'Ter', value: 5800 },
  { day: 'Qua', value: 3400 },
  { day: 'Qui', value: 7200 },
  { day: 'Sex', value: 8500 },
  { day: 'Sáb', value: 6100 },
  { day: 'Dom', value: 4800 },
]

const maxWeeklyValue = Math.max(...weeklyData.map((d) => d.value))

const platformProgress = [
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-500', progress: 78, posts: 24 },
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-500', progress: 65, posts: 18 },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-400', progress: 52, posts: 12 },
]

interface TopPost {
  id: number
  title: string
  platform: string
  impressions: string
  engagement: string
  date: string
}

const topPosts: TopPost[] = [
  { id: 1, title: 'Lançamento coleção verão', platform: 'instagram', impressions: '12.4K', engagement: '4.2%', date: '10 Abr' },
  { id: 2, title: 'Dicas de produtividade', platform: 'linkedin', impressions: '8.7K', engagement: '3.8%', date: '08 Abr' },
  { id: 3, title: 'Behind the scenes', platform: 'instagram', impressions: '7.2K', engagement: '3.5%', date: '05 Abr' },
  { id: 4, title: 'Promoção especial', platform: 'facebook', impressions: '5.1K', engagement: '2.9%', date: '03 Abr' },
  { id: 5, title: 'Tutorial novo produto', platform: 'instagram', impressions: '4.8K', engagement: '2.7%', date: '01 Abr' },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Métricas e desempenho das suas publicações</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Weekly Chart + Platform Progress */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-6 font-semibold">Impressões Semanais</h3>
          <div className="flex items-end justify-between gap-3">
            {weeklyData.map((item) => {
              const heightPercent = (item.value / maxWeeklyValue) * 100
              return (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {(item.value / 1000).toFixed(1)}K
                  </span>
                  <div className="flex h-48 w-full items-end justify-center">
                    <div
                      className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Platform Progress */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6 font-semibold">Desempenho por Plataforma</h3>
          <div className="space-y-5">
            {platformProgress.map((platform) => (
              <div key={platform.name}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <platform.icon className={cn('h-5 w-5', platform.color.replace('bg-', 'text-'))} />
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{platform.posts} posts</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn('h-full rounded-full transition-all', platform.color)}
                    style={{ width: `${platform.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{platform.progress}% do objetivo</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-semibold">Top Posts</h3>
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
                  Impressões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Engajamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-secondary/20">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {post.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-muted-foreground">
                    {post.platform}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {post.impressions}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      {post.engagement}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                    {post.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
