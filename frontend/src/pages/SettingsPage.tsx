import { useState } from 'react'
import {
  Save,
  Palette,
  Bell,
  Shield,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Key,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SettingsTab = 'general' | 'brands' | 'notifications' | 'security'

interface Brand {
  id: number
  name: string
  color: string
  guidelines: string
}

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

interface ApiKey {
  id: number
  name: string
  prefix: string
  created: string
}

const tabItems: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'general', label: 'Geral', icon: Save },
  { key: 'brands', label: 'Marcas', icon: Palette },
  { key: 'notifications', label: 'Notificações', icon: Bell },
  { key: 'security', label: 'Segurança', icon: Shield },
]

const initialNotifications: NotificationSetting[] = [
  { id: 'post-published', label: 'Post publicado', description: 'Receber notificação quando um post for publicado', enabled: true },
  { id: 'post-failed', label: 'Erro na publicação', description: 'Receber notificação quando um post falhar', enabled: true },
  { id: 'reminder', label: 'Lembrete de agendamento', description: 'Receber lembrete 1h antes da publicação', enabled: true },
  { id: 'weekly-report', label: 'Relatório semanal', description: 'Receber resumo semanal de métricas por e-mail', enabled: false },
  { id: 'mention', label: 'Menções', description: 'Receber notificação quando alguém mencionar sua marca', enabled: true },
  { id: 'new-comment', label: 'Novos comentários', description: 'Notificação quando houver novos comentários nos posts', enabled: false },
]

const initialApiKeys: ApiKey[] = [
  { id: 1, name: 'Chave principal', prefix: 'pk_live_••••', created: '01 Mar 2026' },
  { id: 2, name: 'Chave integração', prefix: 'sk_test_••••', created: '15 Mar 2026' },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')

  // General
  const [companyName, setCompanyName] = useState('Postador Auto')
  const [email, setEmail] = useState('david@postadorauto.com')
  const [timezone, setTimezone] = useState('America/Sao_Paulo')
  const [defaultLanguage, setDefaultLanguage] = useState('pt-BR')

  // Brands
  const [brands, setBrands] = useState<Brand[]>([
    { id: 1, name: 'Rocco Fitness', color: '#7C3AED', guidelines: 'Tom profissional, focado em saúde e bem-estar.' },
    { id: 2, name: 'Casa Rocco', color: '#EC4899', guidelines: 'Tom casual e acolhedor, decoração e lifestyle.' },
  ])
  const [showAddBrand, setShowAddBrand] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandColor, setNewBrandColor] = useState('#7C3AED')
  const [newBrandGuidelines, setNewBrandGuidelines] = useState('')

  // Notifications
  const [notifications, setNotifications] = useState<NotificationSetting[]>(initialNotifications)

  // Security
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )
  }

  const addBrand = () => {
    if (!newBrandName.trim()) return
    const newBrand: Brand = {
      id: Date.now(),
      name: newBrandName,
      color: newBrandColor,
      guidelines: newBrandGuidelines,
    }
    setBrands((prev) => [...prev, newBrand])
    setNewBrandName('')
    setNewBrandColor('#7C3AED')
    setNewBrandGuidelines('')
    setShowAddBrand(false)
  }

  const removeBrand = (id: number) => {
    setBrands((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta</p>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card/50 p-1">
        {tabItems.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6 text-lg font-semibold">Configurações Gerais</h3>
          <div className="grid gap-6 max-w-xl">
            <div>
              <label className="mb-2 block text-sm font-medium">Nome da Empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Fuso Horário</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                <option value="America/Manaus">Manaus (GMT-4)</option>
                <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Idioma Padrão</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="pt-BR">Português (BR)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {/* Brands */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Marcas</h3>
              <button
                onClick={() => setShowAddBrand(!showAddBrand)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nova Marca
              </button>
            </div>

            {showAddBrand && (
              <div className="mb-6 rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium">Nome da Marca</label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="Ex: Minha Marca"
                      className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Cor</label>
                    <input
                      type="color"
                      value={newBrandColor}
                      onChange={(e) => setNewBrandColor(e.target.value)}
                      className="h-10 w-16 cursor-pointer rounded-lg border border-border"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Diretrizes</label>
                  <textarea
                    value={newBrandGuidelines}
                    onChange={(e) => setNewBrandGuidelines(e.target.value)}
                    placeholder="Descreva as diretrizes da marca, tom de voz, estilo visual..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Logo</label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border p-6 text-center transition-colors hover:bg-secondary/20">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {newBrandName ? 'Upload de logo para ' + newBrandName : 'Clique para fazer upload da logo'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addBrand}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Adicionar Marca
                  </button>
                  <button
                    onClick={() => setShowAddBrand(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: brand.color }}
                  >
                    {brand.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{brand.name}</h4>
                      <input
                        type="color"
                        value={brand.color}
                        className="h-6 w-8 cursor-pointer rounded border-0"
                        readOnly
                      />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{brand.guidelines}</p>
                  </div>
                  <button
                    onClick={() => removeBrand(brand.id)}
                    className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-6 text-lg font-semibold">Notificações</h3>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-sm">{notification.label}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                </div>
                <button
                  onClick={() => toggleNotification(notification.id)}
                  className={cn(
                    'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                    notification.enabled ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <span
                    className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: notification.enabled ? 'translateX(1.25rem)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Password Change */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-6 text-lg font-semibold">Alterar Senha</h3>
            <div className="grid gap-4 max-w-md">
              {/* Current Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">Senha Atual</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* New Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">Nova Senha</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">Confirmar Nova Senha</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <Shield className="h-4 w-4" />
                Atualizar Senha
              </button>
            </div>
          </div>

          {/* API Keys */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Chaves de API</h3>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Key className="h-4 w-4" />
                Gerar Nova Chave
              </button>
            </div>
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-sm">{key.name}</p>
                    <div className="flex items-center gap-3">
                      <code className="rounded bg-secondary/50 px-2 py-0.5 text-xs font-mono text-muted-foreground">
                        {key.prefix}
                      </code>
                      <span className="text-xs text-muted-foreground">Criada em {key.created}</span>
                    </div>
                  </div>
                  <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    Regenerar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
