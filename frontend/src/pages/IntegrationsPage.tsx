import { useState } from 'react'
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Settings,
  LogOut,
  Plug,
  Wrench,
  Mail,
  Database,
  Calendar,
  Image,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'social' | 'tools'

interface SocialIntegration {
  id: string
  name: string
  icon: React.ElementType
  color: string
  connected: boolean
  account?: string
  lastSync?: string
}

interface ToolIntegration {
  id: string
  name: string
  icon: React.ElementType
  color: string
  connected: boolean
  description: string
}

const socialIntegrations: SocialIntegration[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    connected: true,
    account: '@rocco_fitness',
    lastSync: 'há 5 min',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-500',
    connected: true,
    account: 'Casa Rocco',
    lastSync: 'há 12 min',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-400',
    connected: true,
    account: 'TechStart Corp.',
    lastSync: 'há 2h',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: Twitter,
    color: 'text-sky-400',
    connected: false,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-500',
    connected: true,
    account: 'Canal Rocco',
    lastSync: 'há 1 dia',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
      <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.12V9.01a6.32 6.32 0 0 0-.82-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.15a8.27 8.27 0 0 0 4.84 1.56V7.27a4.86 4.86 0 0 1-1.08-.58z"/>
      </svg>
    ),
    color: 'text-white',
    connected: false,
  },
]

const toolIntegrations: ToolIntegration[] = [
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: Mail,
    color: 'text-yellow-400',
    connected: true,
    description: 'Integração com e-mail marketing',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: Database,
    color: 'text-green-400',
    connected: false,
    description: 'Conecte sua loja virtual',
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: Calendar,
    color: 'text-white',
    connected: false,
    description: 'Sincronize seu calendário de conteúdo',
  },
  {
    id: 'canva',
    name: 'Canva',
    icon: Image,
    color: 'text-purple-400',
    connected: true,
    description: 'Acesse templates e designs diretamente',
  },
]

export function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('social')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="text-muted-foreground">Conecte suas redes sociais e ferramentas favoritas</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-card/50 p-1">
        <button
          onClick={() => setActiveTab('social')}
          className={cn(
            'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'social'
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )}
        >
          <Plug className="h-4 w-4" />
          Redes Sociais
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={cn(
            'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'tools'
              ? 'bg-primary/15 text-primary'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          )}
        >
          <Wrench className="h-4 w-4" />
          Ferramentas
        </button>
      </div>

      {/* Social Integrations */}
      {activeTab === 'social' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socialIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-secondary', integration.color)}>
                    <integration.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <span
                      className={cn(
                        'text-xs',
                        integration.connected ? 'text-emerald-400' : 'text-muted-foreground'
                      )}
                    >
                      {integration.connected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>

              {integration.connected ? (
                <div className="mt-4 space-y-3">
                  {integration.account && (
                    <div className="flex items-center gap-2 rounded-lg bg-secondary/30 px-3 py-2">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm">{integration.account}</span>
                    </div>
                  )}
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Última sincronização: {integration.lastSync}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary">
                      <Settings className="mr-1.5 inline-block h-3.5 w-3.5" />
                      Configurar
                    </button>
                    <button className="flex-1 rounded-lg border border-border bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20">
                      <LogOut className="mr-1.5 inline-block h-3.5 w-3.5" />
                      Desconectar
                    </button>
                  </div>
                </div>
              ) : (
                <button className="mt-4 w-full rounded-lg bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25">
                  Conectar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tool Integrations */}
      {activeTab === 'tools' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolIntegrations.map((tool) => (
            <div
              key={tool.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start gap-3">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-secondary', tool.color)}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </div>

              <div className="mt-4">
                {tool.connected ? (
                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary">
                      <Settings className="mr-1.5 inline-block h-3.5 w-3.5" />
                      Configurar
                    </button>
                    <button className="flex-1 rounded-lg border border-border bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20">
                      <LogOut className="mr-1.5 inline-block h-3.5 w-3.5" />
                      Desconectar
                    </button>
                  </div>
                ) : (
                  <button className="w-full rounded-lg bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25">
                    Conectar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
