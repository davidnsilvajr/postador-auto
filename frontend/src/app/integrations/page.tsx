"use client";

import { useState } from "react";
import { Link, Trash2, CheckCircle, ExternalLink } from "lucide-react";

interface SocialIntegration {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  connected: boolean;
  account?: string;
  lastSync?: string;
}

const integrations: SocialIntegration[] = [
  { id: "instagram", name: "Instagram", description: "Posts, Stories, Reels e carrosséis", icon: "📸", color: "from-pink-500 to-purple-600", connected: true, account: "@minhamarca", lastSync: "há 5 min" },
  { id: "facebook", name: "Facebook", description: "Posts e publicações de página", icon: "👍", color: "from-blue-600 to-blue-700", connected: true, account: "Minha Página", lastSync: "há 10 min" },
  { id: "linkedin", name: "LinkedIn", description: "Artigos e posts profissionais", icon: "💼", color: "from-blue-700 to-blue-800", connected: true, account: "Minha Empresa", lastSync: "há 15 min" },
  { id: "twitter", name: "X / Twitter", description: "Tweets e threads", icon: "🐦", color: "from-gray-700 to-gray-900", connected: false },
  { id: "tiktok", name: "TikTok", description: "Vídeos curtos e trending", icon: "🎵", color: "from-gray-900 to-pink-600", connected: false },
  { id: "youtube", name: "YouTube", description: "Vídeos e Shorts", icon: "▶️", color: "from-red-600 to-red-700", connected: true, account: "Meu Canal", lastSync: "há 1h" },
];

const otherTools = [
  { id: "canva", name: "Canva", description: "Templates de design para posts", icon: "🎨", color: "from-teal-500 to-cyan-500" },
  { id: "google-analytics", name: "Google Analytics", description: "Dados de tráfego e conversões", icon: "📊", color: "from-yellow-500 to-orange-500" },
  { id: "bitly", name: "Bitly", description: "Encurtamento de URLs com tracking", icon: "🔗", color: "from-blue-500 to-indigo-500" },
];

export default function IntegrationsPage() {
  const [selectedTab, setSelectedTab] = useState<"social" | "tools">("social");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conecte suas redes sociais e ferramentas externas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        <button
          onClick={() => setSelectedTab("social")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedTab === "social" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Redes Sociais
        </button>
        <button
          onClick={() => setSelectedTab("tools")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedTab === "tools" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Ferramentas Externas
        </button>
      </div>

      {/* Social Media Integrations */}
      {selectedTab === "social" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:border-primary/50"
            >
              {/* Connected Badge */}
              {integration.connected && (
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Conectado
                </div>
              )}

              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${integration.color} p-3`}>
                <span className="text-2xl">{integration.icon}</span>
              </div>

              <h3 className="mb-1 text-lg font-bold text-foreground">{integration.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{integration.description}</p>

              {integration.connected ? (
                <div className="space-y-3">
                  {integration.account && (
                    <div className="flex items-center justify-between rounded-lg bg-secondary p-2.5">
                      <span className="text-sm text-foreground">{integration.account}</span>
                    </div>
                  )}
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground">Última sincronização: {integration.lastSync}</p>
                  )}
                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg border bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                      Configuracoes
                    </button>
                    <button className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-500">
                  <Link className="h-4 w-4" />
                  Conectar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* External Tools */}
      {selectedTab === "tools" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {otherTools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-xl border bg-card p-6 transition-all hover:border-primary/50"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${tool.color} p-3`}>
                <span className="text-2xl">{tool.icon}</span>
              </div>

              <h3 className="mb-1 text-lg font-bold text-foreground">{tool.name}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{tool.description}</p>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                <ExternalLink className="h-4 w-4" />
                Conectar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}