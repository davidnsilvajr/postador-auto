"use client";

import { useState } from "react";
import { Plus, Filter, Eye, Check, X, Trash2, Calendar } from "lucide-react";

const posts = [
  { id: 1, brand: "Marca A", caption: "Promoção de verão 2026 - Nova coleção disponível! 🌊☀️", platforms: ["Instagram", "Facebook"], status: "scheduled", date: "13 Abr 2026, 09:00" },
  { id: 2, brand: "Marca A", caption: "Dicas de produtividade para empreendedores: 5 hábitos que mudaram meu dia", platforms: ["LinkedIn"], status: "published", date: "12 Abr 2026, 14:30" },
  { id: 3, brand: "Marca B", caption: "Bastidores da nossa equipe criando conteúdo - #vamosjuntos", platforms: ["TikTok", "Instagram"], status: "pending", date: "12 Abr 2026, 10:15" },
  { id: 4, brand: "Marca A", caption: "Lançamento do novo produto - Save the date! 🚀", platforms: ["Facebook", "Instagram", "LinkedIn"], status: "approved", date: "11 Abr 2026, 18:00" },
  { id: 5, brand: "Marca C", caption: "Tutorial: Como usar nossa plataforma em 3 passos simples", platforms: ["YouTube"], status: "draft", date: "11 Abr 2026, 12:00" },
  { id: 6, brand: "Marca B", caption: "Depoimento de cliente: Como triplicamos nossas vendas online", platforms: ["Instagram", "Facebook"], status: "scheduled", date: "10 Abr 2026, 09:00" },
  { id: 7, brand: "Marca A", caption: "Carrossel: 10 ferramentas gratuitas para social media", platforms: ["Instagram"], status: "published", date: "09 Abr 2026, 12:00" },
  { id: 8, brand: "Marca C", caption: "Behind the scenes: How we create our content", platforms: ["TikTok"], status: "rejected", date: "08 Abr 2026, 15:00" },
];

const statusConfig = {
  published: { label: "Publicado", className: "bg-green-500/20 text-green-400 border border-green-500/20" },
  scheduled: { label: "Agendado", className: "bg-blue-500/20 text-blue-400 border border-blue-500/20" },
  pending: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20" },
  approved: { label: "Aprovado", className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground border border-border" },
  rejected: { label: "Rejeitado", className: "bg-red-500/20 text-red-400 border border-red-500/20" },
};

const platformEmoji: Record<string, string> = {
  Instagram: "📸",
  Facebook: "👍",
  LinkedIn: "💼",
  TikTok: "🎵",
  YouTube: "▶️",
  Twitter: "🐦",
};

const filters = ["Todos", "Pendente", "Aprovado", "Agendado", "Publicado", "Rascunho", "Rejeitado"];

export default function PostsPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);

  const statusFilterMap: Record<string, string> = {
    "Pendente": "pending",
    "Aprovado": "approved",
    "Agendado": "scheduled",
    "Publicado": "published",
    "Rascunho": "draft",
    "Rejeitado": "rejected",
  };

  const filtered = activeFilter === "Todos"
    ? posts
    : posts.filter(p => p.status === statusFilterMap[activeFilter]);

  const counts = {
    all: posts.length,
    pending: posts.filter(p => p.status === "pending").length,
    approved: posts.filter(p => p.status === "approved").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
    published: posts.filter(p => p.status === "published").length,
    draft: posts.filter(p => p.status === "draft").length,
    rejected: posts.filter(p => p.status === "rejected").length,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie e aprove suas publicações</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Novo Post
          </button>
        </div>
      </div>

      {/* Count Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("Todos")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeFilter === "Todos" ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          Todos ({counts.all})
        </button>
        {Object.entries(counts).map(([key, count]) => {
          if (key === "all") return null;
          const label = statusConfig[key as keyof typeof statusConfig]?.label || key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(label)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === label ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
          <span className="text-sm text-muted-foreground">{selectedPosts.length} selecionado(s)</span>
          <button className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">
            <Check className="h-3 w-3" /> Aprovar
          </button>
          <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
            <Calendar className="h-3 w-3" /> Agendar
          </button>
          <button className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700">
            <Trash2 className="h-3 w-3" /> Excluir
          </button>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((post) => {
          const status = statusConfig[post.status as keyof typeof statusConfig];
          const isSelected = selectedPosts.includes(post.id);

          return (
            <div
              key={post.id}
              className={`group relative rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:shadow-primary/5 ${
                isSelected ? "border-primary ring-1 ring-primary/30" : ""
              }`}
            >
              {/* Checkbox */}
              <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      setSelectedPosts((prev) =>
                        prev.includes(post.id)
                          ? prev.filter((id) => id !== post.id)
                          : [...prev, post.id]
                      )
                    }
                    className="h-4 w-4 rounded border-border bg-secondary text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-medium text-muted-foreground">{post.brand}</span>
                </label>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}>
                  {status.label}
                </span>
              </div>

              {/* Caption */}
              <p className="mb-4 line-clamp-2 text-sm text-foreground">{post.caption}</p>

              {/* Platforms */}
              <div className="mb-3 flex gap-1.5">
                {post.platforms.map((p) => (
                  <span key={p} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {platformEmoji[p] || "📱"} {p}
                  </span>
                ))}
              </div>

              {/* Date + Actions */}
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Visualizar">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-green-500/20 hover:text-green-400" title="Aprovar">
                    <Check className="h-4 w-4" />
                  </button>
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-red-500/20 hover:text-red-400" title="Excluir">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16">
          <p className="text-lg font-medium text-muted-foreground">Nenhum post encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground/70">Tente alterar o filtro ou crie um novo post</p>
        </div>
      )}
    </div>
  );
}