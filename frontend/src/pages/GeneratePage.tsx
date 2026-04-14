import { useState } from 'react'
import {
  Wand2,
  Copy,
  Check,
  ImageIcon,
  Clock,
  Sparkles,
  Hash,
  PenLine,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface GeneratedContent {
  caption: string
  hashtags: string[]
  variations: string[]
  bestTimes: string[]
}

const toneOptions = [
  { label: 'Profissional', value: 'profissional' },
  { label: 'Casual', value: 'casual' },
  { label: 'Divertido', value: 'divertido' },
  { label: 'Inspirador', value: 'inspirador' },
  { label: 'Urgente', value: 'urgente' },
]

const platforms = ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube']
const languages = ['Português (BR)', 'Inglês', 'Espanhol']

const mockGenerated: GeneratedContent = {
  caption: 'Transforme sua rotina de cuidados! Nossa nova linha de produtos naturais chegou para revolucionar o seu dia a dia. Feita com ingredientes 100% orgânicos e sustentáveis, cada item foi pensado para trazer mais bem-estar e qualidade de vida para você e sua família. Aproveite o lançamento com 20% de desconto! #CuidadosNaturais #BemEstar',
  hashtags: [
    '#CuidadosNaturais',
    '#BemEstar',
    '#ProdutosOrganicos',
    '#VidaSaudavel',
    '#Sustentabilidade',
    '#Lancamento',
  ],
  variations: [
    'Descubra o poder dos produtos naturais em sua rotina! Nossa nova linha chegou com tudo. 20% OFF no lançamento!',
    'Sua pele merece o melhor! Conheça nossa nova coleção de cuidados naturais, feita com ingredientes orgânicos selecionados.',
  ],
  bestTimes: ['8:00 AM', '12:30 PM', '7:00 PM'],
}

export function GeneratePage() {
  const [topic, setTopic] = useState('')
  const [campaign, setCampaign] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram'])
  const [tone, setTone] = useState('profissional')
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [includeImage, setIncludeImage] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<GeneratedContent | null>(null)
  const [copied, setCopied] = useState(false)

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    setResult(null)
    setTimeout(() => {
      setResult(mockGenerated)
      setIsGenerating(false)
    }, 2000)
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.caption + '\n\n' + result.hashtags.join(' '))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gerar com IA</h1>
        <p className="text-muted-foreground">Crie conteúdo para suas redes sociais com inteligência artificial</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          {/* Topic */}
          <div>
            <label className="mb-2 block text-sm font-medium">Tópico *</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Sobre o que deseja criar o post? Ex: Lançamento de novo produto, promoção especial..."
              rows={4}
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
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
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    selectedPlatforms.includes(platform)
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  {platform}
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
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Image toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Gerar sugestão de imagem</p>
                <p className="text-xs text-muted-foreground">Incluir prompt para IA de imagens</p>
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
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  includeImage ? 'left-5.5 translate-x-0' : 'left-0.5'
                )}
                style={{ transform: includeImage ? 'translateX(0.5rem)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all',
              isGenerating || !topic.trim()
                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
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
                <p className="text-muted-foreground">A IA está criando seu post</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Caption */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <PenLine className="h-4 w-4 text-primary" />
                    Legenda
                  </h4>
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-line">{result.caption}</p>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Hash className="h-4 w-4 text-primary" />
                    Hashtags Sugeridas
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

                {/* Variations */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Variações
                  </h4>
                  <div className="space-y-2">
                    {result.variations.map((variation, idx) => (
                      <div key={idx} className="rounded-lg border border-border bg-secondary/30 p-3">
                        <p className="text-sm">{variation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best times */}
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <Clock className="h-4 w-4 text-primary" />
                    Melhores Horários
                  </h4>
                  <div className="flex gap-3">
                    {result.bestTimes.map((time, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border bg-secondary/30 px-4 py-2 text-sm font-medium"
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    <Check className="h-4 w-4" />
                    Aprovar e Agendar
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
