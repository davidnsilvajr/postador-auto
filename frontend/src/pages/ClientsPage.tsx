import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Pencil,
  Users,
  Save,
  X,
  Building2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { api, type Persona, type Guideline } from '@/lib/api'

const toneOptions = [
  { label: 'Profissional', value: 'profissional' },
  { label: 'Casual', value: 'casual' },
  { label: 'Divertido', value: 'divertido' },
  { label: 'Inspirador', value: 'inspirador' },
  { label: 'Urgente', value: 'urgente' },
]

interface FormState {
  name: string
  industry: string
  description: string
  tone_of_voice: string
  target_audience: string
  company_info: string
  website: string
  primary_color: string
  brand_voice_description: string
  keywords: string
  do_not_say: string
  must_include: string
}

const emptyForm: FormState = {
  name: '',
  industry: '',
  description: '',
  tone_of_voice: 'profissional',
  target_audience: '',
  company_info: '',
  website: '',
  primary_color: '#7C3AED',
  brand_voice_description: '',
  keywords: '',
  do_not_say: '',
  must_include: '',
}

const toList = (s: string) =>
  s.split(',').map((x) => x.trim()).filter(Boolean)
const fromList = (l?: string[]) => (l && l.length ? l.join(', ') : '')

function getGuideline(p: Persona): Guideline {
  const g = p.brand_guidelines
  if (Array.isArray(g)) return g[0] ?? {}
  return g ?? {}
}

export function ClientsPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setPersonas(await api.listPersonas())
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setLogoFile(null)
    setShowForm(true)
  }

  const openEdit = (p: Persona) => {
    const g = getGuideline(p)
    setEditingId(p.id)
    setForm({
      name: p.name ?? '',
      industry: p.industry ?? '',
      description: p.description ?? '',
      tone_of_voice: p.tone_of_voice ?? 'profissional',
      target_audience: p.target_audience ?? '',
      company_info: p.company_info ?? '',
      website: p.website ?? '',
      primary_color: g.primary_color || '#7C3AED',
      brand_voice_description: g.brand_voice_description ?? '',
      keywords: fromList(g.keywords),
      do_not_say: fromList(g.do_not_say),
      must_include: fromList(g.must_include),
    })
    setLogoFile(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setLogoFile(null)
  }

  const set = (k: keyof FormState, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    setError(null)
    try {
      const brandFields = {
        name: form.name,
        industry: form.industry,
        description: form.description,
        tone_of_voice: form.tone_of_voice,
        target_audience: form.target_audience,
        company_info: form.company_info,
        website: form.website,
      }
      const guideline: Guideline = {
        primary_color: form.primary_color,
        brand_voice_description: form.brand_voice_description,
        keywords: toList(form.keywords),
        do_not_say: toList(form.do_not_say),
        must_include: toList(form.must_include),
      }

      let id = editingId
      if (id) {
        await api.updatePersona(id, brandFields)
      } else {
        const created = await api.createPersona(brandFields)
        id = created.id
      }
      if (id) {
        await api.saveGuideline(id, guideline)
        if (logoFile) await api.uploadLogo(id, logoFile)
      }
      closeForm()
      await load()
    } catch (e: any) {
      setError(e.message ?? 'Erro ao salvar cliente')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este cliente/persona? Os posts vinculados também serão removidos.'))
      return
    try {
      await api.deletePersona(id)
      await load()
    } catch (e: any) {
      setError(e.message ?? 'Erro ao excluir')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes / Personas</h1>
          <p className="text-muted-foreground">
            Cadastre o que cada cliente faz, o tom de comunicação e os dados da empresa.
            A IA usa isso para gerar posts fiéis a cada marca.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {editingId ? 'Editar cliente' : 'Novo cliente'}
            </h3>
            <button
              onClick={closeForm}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nome do cliente / marca *">
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Ex: Rocco Fitness"
                className={inputCls}
              />
            </Field>
            <Field label="Segmento / indústria">
              <input
                value={form.industry}
                onChange={(e) => set('industry', e.target.value)}
                placeholder="Ex: Academia, Moda, Restaurante"
                className={inputCls}
              />
            </Field>

            <Field label="O que o cliente faz (descrição)" full>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Descreva o negócio, produtos/serviços, proposta de valor..."
                rows={3}
                className={cn(inputCls, 'resize-none')}
              />
            </Field>

            <Field label="Tom de comunicação">
              <select
                value={form.tone_of_voice}
                onChange={(e) => set('tone_of_voice', e.target.value)}
                className={inputCls}
              >
                {toneOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cor principal da marca">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => set('primary_color', e.target.value)}
                  className="h-10 w-16 cursor-pointer rounded-lg border border-border bg-transparent"
                />
                <span className="text-sm text-muted-foreground">{form.primary_color}</span>
              </div>
            </Field>

            <Field label="Público-alvo" full>
              <input
                value={form.target_audience}
                onChange={(e) => set('target_audience', e.target.value)}
                placeholder="Ex: Mulheres 25-40 anos interessadas em vida saudável"
                className={inputCls}
              />
            </Field>

            <Field label="Dados da empresa (contato, localização, diferenciais)" full>
              <textarea
                value={form.company_info}
                onChange={(e) => set('company_info', e.target.value)}
                placeholder="Endereço, telefone, horário, diferenciais, CTA padrão..."
                rows={2}
                className={cn(inputCls, 'resize-none')}
              />
            </Field>

            <Field label="Site">
              <input
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </Field>
            <Field label="Descrição da voz da marca">
              <input
                value={form.brand_voice_description}
                onChange={(e) => set('brand_voice_description', e.target.value)}
                placeholder="Ex: Amigável, motivadora, usa gírias fitness"
                className={inputCls}
              />
            </Field>

            <Field label="Palavras-chave (separadas por vírgula)">
              <input
                value={form.keywords}
                onChange={(e) => set('keywords', e.target.value)}
                placeholder="saúde, treino, bem-estar"
                className={inputCls}
              />
            </Field>
            <Field label="Logo">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:text-foreground"
              />
            </Field>

            <Field label="Não dizer (separado por vírgula)">
              <input
                value={form.do_not_say}
                onChange={(e) => set('do_not_say', e.target.value)}
                placeholder="palavrão, promessa milagrosa"
                className={inputCls}
              />
            </Field>
            <Field label="Sempre incluir (separado por vírgula)">
              <input
                value={form.must_include}
                onChange={(e) => set('must_include', e.target.value)}
                placeholder="@perfil, #marca"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
                saving || !form.name.trim()
                  ? 'cursor-not-allowed bg-muted text-muted-foreground'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingId ? 'Salvar alterações' : 'Criar cliente'}
            </button>
            <button
              onClick={closeForm}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando...
        </div>
      ) : personas.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">Nenhum cliente cadastrado</p>
          <p className="text-muted-foreground">Cadastre seu primeiro cliente para gerar posts</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p) => {
            const g = getGuideline(p)
            const color = g.primary_color || '#7C3AED'
            return (
              <div key={p.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{p.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {p.industry || 'Sem segmento'}
                    </p>
                  </div>
                </div>
                {p.description && (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tone_of_voice && (
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                      {p.tone_of_voice}
                    </span>
                  )}
                  {p.target_audience && (
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                      🎯 {p.target_audience.slice(0, 24)}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs font-medium transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-lg border border-border bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

function Field({
  label,
  children,
  full,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
