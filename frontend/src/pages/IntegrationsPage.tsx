import { useEffect, useState } from 'react'
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  LogOut,
  Plug,
  Wrench,
  Mail,
  Database,
  Calendar,
  Image,
  Check,
  Loader2,
  AlertCircle,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { api, type SocialAccount } from '@/lib/api'

type Tab = 'social' | 'tools'

interface PlatformDef {
  id: string
  name: string
  icon: React.ElementType
  color: string
  needsPageId: boolean
  pageIdLabel?: string
  helpUrl?: string
}

const platformDefs: PlatformDef[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    needsPageId: true,
    pageIdLabel: 'IG Business Account ID',
    helpUrl: 'https://developers.facebook.com/docs/instagram-api/getting-started',
  },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500', needsPageId: true, pageIdLabel: 'Page ID' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', needsPageId: false },
  { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: 'text-sky-400', needsPageId: false },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', needsPageId: false },
]

const toolIntegrations = [
  { id: 'mailchimp', name: 'Mailchimp', icon: Mail, color: 'text-yellow-400', description: 'Integração com e-mail marketing' },
  { id: 'shopify', name: 'Shopify', icon: Database, color: 'text-green-400', description: 'Conecte sua loja virtual' },
  { id: 'notion', name: 'Notion', icon: Calendar, color: 'text-white', description: 'Sincronize seu calendário de conteúdo' },
  { id: 'canva', name: 'Canva', icon: Image, color: 'text-purple-400', description: 'Acesse templates e designs' },
]

export function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('social')
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [token, setToken] = useState('')
  const [pageId, setPageId] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setAccounts(await api.listAccounts())
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar contas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const accountFor = (platform: string) =>
    accounts.find((a) => a.platform === platform)

  const openConnect = (platform: string) => {
    setConnecting(platform)
    setToken('')
    setPageId('')
    setError(null)
  }

  const submitConnect = async (def: PlatformDef) => {
    if (!token.trim() || (def.needsPageId && !pageId.trim())) return
    setBusy(true)
    setError(null)
    try {
      await api.connectAccount({
        platform: def.id,
        access_token: token.trim(),
        page_id: def.needsPageId ? pageId.trim() : undefined,
      })
      setConnecting(null)
      await load()
    } catch (e: any) {
      setError(e.message ?? 'Erro ao conectar')
    } finally {
      setBusy(false)
    }
  }

  const disconnect = async (id: string) => {
    setBusy(true)
    try {
      await api.disconnectAccount(id)
      await load()
    } catch (e: any) {
      setError(e.message ?? 'Erro ao desconectar')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integrações</h1>
        <p className="text-muted-foreground">Conecte suas redes sociais para publicar direto da plataforma</p>
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

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {activeTab === 'social' && (
        <>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              Para o Instagram, é preciso uma conta <strong>Business/Creator</strong> vinculada a
              uma Página do Facebook e um <strong>token de acesso</strong> com os escopos{' '}
              <code className="font-mono text-xs">instagram_basic</code>,{' '}
              <code className="font-mono text-xs">instagram_content_publish</code> e{' '}
              <code className="font-mono text-xs">pages_show_list</code> (gerados no Meta for
              Developers). Cole o token e o IG Business Account ID abaixo.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {platformDefs.map((def) => {
                const account = accountFor(def.id)
                const isConnected = !!account
                const isOpen = connecting === def.id
                return (
                  <div key={def.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-secondary', def.color)}>
                        <def.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{def.name}</h3>
                        <span className={cn('text-xs', isConnected ? 'text-emerald-400' : 'text-muted-foreground')}>
                          {isConnected ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                    </div>

                    {isConnected ? (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 rounded-lg bg-secondary/30 px-3 py-2">
                          <Check className="h-4 w-4 text-emerald-400" />
                          <span className="truncate text-sm">
                            {account?.username || account?.page_id || 'Conta conectada'}
                          </span>
                        </div>
                        <button
                          onClick={() => account && disconnect(account.id)}
                          disabled={busy}
                          className="w-full rounded-lg border border-border bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                          <LogOut className="mr-1.5 inline-block h-3.5 w-3.5" />
                          Desconectar
                        </button>
                      </div>
                    ) : isOpen ? (
                      <div className="mt-4 space-y-3">
                        {def.needsPageId && (
                          <input
                            value={pageId}
                            onChange={(e) => setPageId(e.target.value)}
                            placeholder={def.pageIdLabel}
                            className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        )}
                        <input
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder="Token de acesso"
                          type="password"
                          className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitConnect(def)}
                            disabled={busy || !token.trim() || (def.needsPageId && !pageId.trim())}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                          >
                            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Salvar
                          </button>
                          <button
                            onClick={() => setConnecting(null)}
                            className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openConnect(def.id)}
                        className="mt-4 w-full rounded-lg bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25"
                      >
                        Conectar
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'tools' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolIntegrations.map((tool) => (
            <div key={tool.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-secondary', tool.color)}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25">
                Em breve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
