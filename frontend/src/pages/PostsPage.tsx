import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Eye,
  Check,
  Trash2,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Post {
  id: number
  brand: string
  caption: string
  platforms: string[]
  status: string
  date: string
  selected: boolean
}

interface FilterTab {
  label: string
  count: number
  key: string
}

const filterTabs: FilterTab[] = [
  { label: 'Todos', count: 47, key: 'todos' },
  { label: 'Pendentes', count: 12, key: 'pendente' },
  { label: 'Aprovados', count: 18, key: 'aprovado' },
  { label: 'Agendados', count: 8, key: 'agendado' },
  { label: 'Publicados', count: 9, key: 'publicado' },
  { label: 'Rascunhos', count: 4, key: 'rascunho' },
]

const statusConfig: Record<string, { color: string; label: string }> = {
  pendente: { color: 'bg-amber-500/10 text-amber-400', label: 'Pendente' },
  aprovado: { color: 'bg-blue-500/10 text-blue-400', label: 'Aprovado' },
  agendado: { color: 'bg-purple-500/10 text-purple-400', label: 'Agendado' },
  publicado: { color: 'bg-emerald-500/10 text-emerald-400', label: 'Publicado' },
  rascunho: { color: 'bg-muted text-muted-foreground', label: 'Rascunho' },
}

const platformConfig: Record<string, { icon: React.ElementType; color: string }> = {
  instagram: { icon: Instagram, color: 'text-pink-500' },
  facebook: { icon: Facebook, color: 'text-blue-500' },
  linkedin: { icon: Linkedin, color: 'text-blue-400' },
  twitter: { icon: Twitter, color: 'text-sky-400' },
  youtube: { icon: Youtube, color: 'text-red-500' },
}

const initialPosts: Post[] = [
  {
    id: 1,
    brand: 'Rocco Fitness',
    caption: 'Transforme seu corpo com nosso novo programa de treinos. Resultados garantidos em 30 dias! Venha conhecer.',
    platforms: ['instagram', 'facebook'],
    status: 'publicado',
    date: '12 Abr 2026',
    selected: false,
  },
  {
    id: 2,
    brand: 'TechStart',
    caption: 'Dicas essenciais de produtividade para quem trabalha com tecnologia. Confira o thread completo no nosso blog.',
    platforms: ['linkedin', 'twitter'],
    status: 'agendado',
    date: '13 Abr 2026',
    selected: false,
  },
  {
    id: 3,
    brand: 'Casa Rocco',
    caption: 'Promoção especial de Dia das Mães! Confira as ofertas exclusivas que preparamos com muito carinho.',
    platforms: ['instagram', 'facebook'],
    status: 'pendente',
    date: '14 Abr 2026',
    selected: false,
  },
  {
    id: 4,
    brand: 'Rocco Fitness',
    caption: 'Behind the scenes do shooting da nova coleção. Bastidores incríveis que vocês vão adorar!',
    platforms: ['instagram'],
    status: 'aprovado',
    date: '11 Abr 2026',
    selected: false,
  },
  {
    id: 5,
    brand: 'TechStart',
    caption: 'Webinar gratuito: Inteligência Artificial aplicada aos negócios. Inscreva-se agora e garanta sua vaga!',
    platforms: ['linkedin', 'youtube'],
    status: 'rascunho',
    date: '15 Abr 2026',
    selected: false,
  },
  {
    id: 6,
    brand: 'Casa Rocco',
    caption: 'Novidades na decoração! Confira as tendências para o outono/inverno 2026.',
    platforms: ['instagram', 'facebook'],
    status: 'pendente',
    date: '16 Abr 2026',
    selected: false,
  },
]

export function PostsPage() {
  const [activeFilter, setActiveFilter] = useState('todos')
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  const filteredPosts =
    activeFilter === 'todos'
      ? posts
      : posts.filter((p) => p.status === activeFilter)

  const toggleSelect = (id: number) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    )
  }

  const toggleSelectAll = () => {
    const allSelected = filteredPosts.every((p) => p.selected)
    const selectedIds = new Set(filteredPosts.map((p) => p.id))
    setPosts((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id) ? { ...p, selected: !allSelected } : p
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">Gerencie todas as suas publicações</p>
        </div>
        <Link
          to="/generate"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo Post
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card/50 p-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeFilter === tab.key
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs',
                activeFilter === tab.key
                  ? 'bg-primary/25 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Post cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => {
          const status = statusConfig[post.status]

          return (
            <div
              key={post.id}
              className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Checkbox */}
              <div className="absolute left-3 top-3">
                <input
                  type="checkbox"
                  checked={post.selected}
                  onChange={() => toggleSelect(post.id)}
                  className="h-4 w-4 rounded border-border bg-secondary text-primary focus:ring-primary focus:ring-offset-0"
                />
              </div>

              {/* Brand */}
              <p className="mb-1 ml-6 text-sm font-semibold text-muted-foreground">
                {post.brand}
              </p>

              {/* Caption */}
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed">
                {post.caption}
              </p>

              {/* Platforms */}
              <div className="mb-3 flex items-center gap-1.5">
                {post.platforms.map((platform) => {
                  const config = platformConfig[platform]
                  if (!config) return null
                  const Icon = config.icon
                  return (
                    <div
                      key={platform}
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-lg bg-secondary',
                        config.color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  {status && (
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', status.color)}>
                      {status.label}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{post.date}</span>
              </div>

              {/* Hover actions */}
              <div className="absolute right-3 top-3 hidden gap-1 group-hover:flex">
                <button className="rounded-lg bg-card/90 p-1.5 text-muted-foreground shadow transition-colors hover:bg-secondary hover:text-foreground">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="rounded-lg bg-card/90 p-1.5 text-muted-foreground shadow transition-colors hover:bg-emerald-500/10 hover:text-emerald-400">
                  <Check className="h-4 w-4" />
                </button>
                <button className="rounded-lg bg-card/90 p-1.5 text-muted-foreground shadow transition-colors hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
