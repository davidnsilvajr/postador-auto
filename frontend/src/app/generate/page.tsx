"use client";

import { useState } from "react";
import { Wand2, RefreshCw, Check, Copy, Image, ImageIcon } from "lucide-react";

const platforms = [
  { id: "instagram", name: "Instagram", emoji: "📸" },
  { id: "facebook", name: "Facebook", emoji: "👍" },
  { id: "twitter", name: "Twitter/X", emoji: "🐦" },
  { id: "linkedin", name: "LinkedIn", emoji: "💼" },
  { id: "tiktok", name: "TikTok", emoji: "🎵" },
  { id: "youtube", name: "YouTube", emoji: "▶️" },
];

const tones = [
  { id: "professional", label: "Profissional" },
  { id: "casual", label: "Casual" },
  { id: "humorous", label: "Humorístico" },
  { id: "inspirational", label: "Inspiracional" },
  { id: "educational", label: "Educacional" },
  { id: "promotional", label: "Promocional" },
];

const generatedResults = {
  caption: "🚀 Descubra como transformar sua presença digital com estratégias que realmente funcionam! Nossos especialistas compartilham as melhores práticas para conquistar mais engajamento e conversões. #MarketingDigital #SocialMedia #Crescimento",
  hashtags: ["#MarketingDigital", "#SocialMedia", "#Conteúdo", "#BrandingDigital", "#Engajamento", "#GrowthHacking"],
  imagePrompt: "Professional social media post with modern gradient background (purple and blue tones), clean typography saying 'Transform Your Digital Presence', geometric shapes and subtle tech patterns",
  variations: [
    "💡 Sabia que 73% dos consumidores descobrem novos produtos pelas redes sociais? Descubra como aproveitar essa tendência e levar sua marca ao próximo nível!",
    "Seu conteúdo precisa de um upgrade? Nós temos a receita secreta: consistência + autenticidade + estratégia = crescimento real. Vamos juntos? 📈",
    "De zero a 10k seguidores: o caminho é mais simples do que você imagina. Aprenda as estratégias que funcionam de verdade 🎯",
  ],
  bestTimes: ["09:00", "12:00", "18:00", "19:00", "20:00"],
};

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [campaign, setCampaign] = useState("");
  const [language, setLanguage] = useState("pt-BR");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "facebook", "linkedin"]);
  const [selectedTone, setSelectedTone] = useState("professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(0);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsGenerating(false);
    setHasResults(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gerar Conteúdo com IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A IA cria texto, hashtags e imagens adaptados à sua marca
        </p>
      </div>

      {/* Generator Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Input Form */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Briefing</h3>

          {/* Topic */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Tema / Tópico <span className="text-red-400">*</span>
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Lançamento do novo produto de skincare... Dicas de produtividade para empreendedores..."
              className="min-h-[100px] w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Campaign */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Campanha <span className="text-muted-foreground text-xs">(opcional)</span>
            </label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="Ex: Verão 2026, Black Friday..."
              className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Platforms */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Plataformas</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selectedPlatforms.includes(p.id)
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{p.emoji}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tone of Voice */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Tom de Voz</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTone(t.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selectedTone === t.id
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="pt-PT">Português (PT)</option>
              <option value="en">Inglês</option>
              <option value="es">Espanhol</option>
            </select>
          </div>

          {/* Generate Image Toggle */}
          <div className="mb-6 flex items-center justify-between rounded-lg border bg-secondary p-3">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Gerar imagem com IA</p>
                <p className="text-xs text-muted-foreground">DALL-E 3 para criar imagem do post</p>
              </div>
            </div>
            <button
              onClick={() => setGenerateImage(!generateImage)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                generateImage ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  generateImage ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Gerando...
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
        <div className="space-y-4">
          {hasResults ? (
            <>
              {/* Generated Caption */}
              <div className="rounded-xl border bg-card p-6">
                <h3 className="mb-3 text-lg font-semibold text-foreground">Conteúdo Gerado</h3>

                {/* Main caption */}
                <div className="mb-4 rounded-lg border bg-secondary p-4">
                  <p className="whitespace-pre-wrap text-sm text-foreground">{generatedResults.caption}</p>
                </div>

                {/* Copy button */}
                <div className="mb-4 flex gap-2">
                  <button className="inline-flex items-center gap-1 rounded-md border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <Copy className="h-3 w-3" /> Copiar
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700">
                    <Check className="h-3 w-3" /> Aprovar & Agendar
                  </button>
                </div>

                {/* Hashtags */}
                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-foreground">Hashtags sugeridas:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedResults.hashtags.map((tag, i) => (
                      <span key={i} className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs text-violet-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Prompt */}
                {generateImage && (
                  <div className="mb-4 rounded-lg border border-dashed bg-secondary/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Prompt da imagem:</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{generatedResults.imagePrompt}</p>
                  </div>
                )}

                {/* Variations */}
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Variações:</p>
                  <div className="space-y-2">
                    {generatedResults.variations.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariation(i)}
                        className={`w-full rounded-lg border p-3 text-left text-xs transition-colors ${
                          selectedVariation === i
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Best posting times */}
                <div className="mt-4 rounded-lg border bg-secondary p-3">
                  <p className="mb-1.5 text-xs font-medium text-foreground">Melhores horários para publicar:</p>
                  <div className="flex flex-wrap gap-2">
                    {generatedResults.bestTimes.map((time) => (
                      <span key={time} className="rounded-lg bg-card px-2.5 py-1 text-xs text-muted-foreground">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-20">
              <div className="mb-4 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 p-4">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Pronto para criar?</h3>
              <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
                Preencha o briefing à esquerda e a IA vai gerar conteúdo otimizado para suas redes sociais
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}