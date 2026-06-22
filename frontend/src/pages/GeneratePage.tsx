import { useEffect, useState } from 'react'
import {
  Wand2,
  Copy,
  Check,
  ImageIcon,
  Clock,
  Sparkles,
  Hash,
  PenLine,
  Loader2,
  AlertCircle,
  Save,
  Send,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { api, type Persona, type GeneratedContent } from '@/lib/api'

const toneOptions = [
  { label: 'Profissional', value: 'profissional' },
  { label: 'Casual', value: 'casual' },
  { label: 'Divertido', value: 'divertido' },
  { label: 'Inspirador', value: 'inspirador' },
  { label: 'Urgente', value: 'urgente' },
]

const platforms = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Twitter', value: 'twitter' },
]

const languages = [
  { label: 'Português (BR)', value: 'pt-BR' },
  { label: 'Inglês', value: 'en' },
  { label: 'Espanhol', value: 'es' },
]

export function GeneratePage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [personaId, setPersonaId] = useState('')
  const [topic, setTopic] = useState('')
  const [campaign, setCampaign] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [tone, setTone] = useState('profissional')
  const [language, setLanguage] = useState('pt-BR')
  const [includeImage, setIncludeImage] = useState(true)

  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GeneratedContent | null>(null)
  const [activeCaption, setActiveCaption] = useState('instagram')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [savingDraft, setSavingDraft] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    api
      .listPersonas()
      .then((list) => {
        setPersonas(list)
        if (list.length) setPersonaId(list[0].id)
      })
      .catch((e) => setError(e.message ?? 'Erro ao carregar clientes'))
  }, [])

  // Pre-preenche o tom a partir da persona escolhida
  useEffect(() => {
    const p = personas.find((x) => x.id === personaId)
    if (p?.tone_of_voice && toneOptions.some((t) => t.value === p.tone_of_voice)) {
      setTone(p.tone_of_voice)
    }
  }, [personaId, personas])

  const togglePlatform = (value: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    )
  }

  const captionText = (r: GeneratedContent) =>
    r.captions?.[activeCaption] || r.caption || Object.values(r.captions ?? {})[0] || ''

  const handleGenerate = async () => {
    if (!personaId || !topic.trim()) return
    setIsGenerating(true)
    setResult(null)
    setError(null)
    setNotice(null)
    try {
      const data = await api.generate({
        brand_id: personaId,
        topic,
        campaign: campaign || undefined,
        tone,
        platforms: selectedPlatforms,
        language,
        generate_image: includeImage,
      })
      setResult(data)
      setActiveCaption(
        selectedPlatforms.find((p) => data.captions?.[p]) ??
          Object.keys(data.captions ?? {})[0] ??
          'instagram'
      )
    } catch (e: any) {
      setError(e.message ?? 'Erro ao gerar conteúdo')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(
      captionText(result) + '\n\n' + result.hashtags.join(' ')
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const buildPostPayload = (status: string) => ({
    brand_id: personaId,
    caption: result ? captionText(result) : '',
    hashtags: result?.hashtags ?? [],
    platforms: selectedPlatforms,
    media: result?.image_url
      ? [{ type: 'image', url: result.image_url, alt_text: topic }]
      : [],
    campaign: campaign || '',
    status,
  })

  const handleSaveDraft = async () => {
    if (!result) return
    setSavingDraft(true)
    setError(null)
    setNotice(null)
    try {
      await api.createPost(buildPostPayload('draft'))
      setNotice('Rascunho salvo! Veja em Posts.')
    } catch (e: any) {
      setError(e.message ?? 'Erro ao salvar rascunho')
    } finally {
      setSavingDraft(false)
    }
  }

  const handlePublishInstagram = async () => {
    if (!result) return
    if (!result.image_url) {
      setError('O Instagram exige uma imagem. Gere o conteúdo com imagem ativada.')
      return
    }
    setPublishing(true)
    setError(null)
    setNotice(null)
    try {
      const post = await api.createPost(buildPostPayload('approved'))
      const res = await api.publishNow(post.id, ['instagram'])
      const ig = (res as any)?.instagram
      if (ig && ig.error) {
        setError(`Instagram: ${ig.error}`)
      } else {
        setNotice('Publicado no Instagram! 🎉')
      }
    } catch (e: any) {
      setError(e.message ?? 'Erro ao publicar')
    } finally {
      setPublishing(false)
    }
  }

  const noPersonas = personas.length === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gerar com IA</h1>
        <p className="text-muted-foreground">
          Escolha o cliente, escreva um prompt curto e gere imagem, legenda e hashtags.
        </p>
      </div>

      {noPersonas && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Você ainda não cadastrou nenhum cliente/persona.
          </span>
          <Link
            to="/clients"
            className="rounded-lg bg-amber-500/20 px-3 py-1.5 font-medium text-amber-200 hover:bg-amber-500/30"
          >
            Cadastrar cliente
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          {/* Persona */}
          <div>
            <label className="mb-2 block text-sm font-medium">Cliente / Persona *</label>
            <select
              value={personaId}
              onChange={(e) => setPersonaId(e.target.value)}
              disabled={noPersonas}
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              {noPersonas && <option>Nenhum cliente cadastrado</option>}
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="mb-2 block text-sm font-medium">Prompt / Tópico *</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Lançamento da nova linha natural com 20% de desconto"
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Campaign */}
          <div>
            <label className="mb-2 block text-sm font-medium">Campanha (opcional)</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="Nome da campanha"
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="mb-2 block text-sm font-medium">Plataformas</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  onClick={() => togglePlatform(platform.value)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    selectedPlatforms.includes(platform.value)
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  {platform.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="mb-2 block text-sm font-medium">Tom de voz</label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTone(option.value)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    tone === option.value
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="mb-2 block text-sm font-medium">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Image toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Gerar imagem</p>
                <p className="text-xs text-muted-foreground">Criar imagem com IA para o post</p>
              </div>
            </div>
            <button
              onClick={() => setIncludeImage(!includeImage)}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors',
                includeImage ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{ transform: includeImage ? 'translateX(1.25rem)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim() || !personaId}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all',
              isGenerating || !topic.trim() || !personaId
                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Gerar Conteúdo
              </>
            )}
          </button>
        </div>

        {/* Right: Results */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-semibold">Resultado</h3>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {notice && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                <Check className="h-4 w-4 shrink-0" />
                {notice}
              </div>
            )}

            {!result && !isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <PenLine className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium">Nenhum conteúdo gerado</p>
                <p className="text-muted-foreground">Preencha o formulário e clique em gerar</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-primary/15">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium">Gerando conteúdo...</p>
                <p className="text-muted-foreground">A IA está criando imagem, legenda e hashtags</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Image */}
                {result.image_url && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Imagem
                    </h4>
                    <img
                      src={result.image_url}
                      alt="Imagem gerada"
                      className="w-full rounded-lg border border-border"
                    />
                  </div>
                )}

                {/* Caption with per-platform tabs */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <PenLine className="h-4 w-4 text-primary" />
                      Legenda
                    </h4>
                    {Object.keys(result.captions ?? {}).length > 1 && (
                      <div className="flex gap-1">
                        {Object.keys(result.captions).map((p) => (
                          <button
                            key={p}
                            onClick={() => setActiveCaption(p)}
                            className={cn(
                              'rounded-md px-2 py-0.5 text-xs font-medium capitalize transition-colors',
                              activeCaption === p
                                ? 'bg-primary/15 text-primary'
                                : 'text-muted-foreground hover:bg-secondary'
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <p className="whitespace-pre-line text-sm leading-relaxed">
                      {captionText(result)}
                    </p>
                  </div>
                </div>

                {/* Hashtags */}
                {result.hashtags?.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Hash className="h-4 w-4 text-primary" />
                      Hashtags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variations */}
                {result.variations?.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Variações
                    </h4>
                    <div className="space-y-2">
                      {result.variations.map((variation, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-border bg-secondary/30 p-3"
                        >
                          <p className="text-sm">{variation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best times */}
                {result.best_posting_times?.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Clock className="h-4 w-4 text-primary" />
                      Melhores Horários
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {result.best_posting_times.map((time, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-border bg-secondary/30 px-4 py-2 text-sm font-medium"
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={savingDraft}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    {savingDraft ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Salvar rascunho
                  </button>
                  <button
                    onClick={handlePublishInstagram}
                    disabled={publishing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {publishing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Publicar no Instagram
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
