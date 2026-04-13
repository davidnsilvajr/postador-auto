"use client";

import { Sparkles, Calendar, Clock, CheckCircle, AlertCircle, Zap, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; up: boolean };
}

const stats: StatCard[] = [
  { label: "Pendentes", value: 12, icon: Clock, color: "text-yellow-400", trend: { value: 8, up: true } },
  { label: "Agendados", value: 34, icon: Calendar, color: "text-blue-400", trend: { value: 12, up: true } },
  { label: "Publicados", value: 156, icon: CheckCircle, color: "text-green-400", trend: { value: 23, up: true } },
  { label: "Pendente Aprovacao", value: 5, icon: AlertCircle, color: "text-orange-400", trend: { value: 2, up: false } },
];

interface QuickAction {
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Gerar conteudo com IA",
    description: "Crie publicacoes automaticamente com inteligencia artificial",
    icon: Sparkles,
    href: "/generate",
    color: "from-violet-600 to-purple-600",
  },
  {
    label: "Novo agendamento",
    description: "Agende uma nova publicacao para suas redes sociais",
    icon: Plus,
    href: "/schedule",
    color: "from-blue-600 to-cyan-600",
  },
  {
    label: "Ver calendario",
    description: "Visualize todos os seus agendamentos no calendario",
    icon: Calendar,
    href: "/calendar",
    color: "from-emerald-600 to-teal-600",
  },
];

interface RecentPost {
  id: string;
  title: string;
  platform: string;
  status: "published" | "scheduled" | "pending" | "draft";
  date: string;
}

const recentPosts: RecentPost[] = [
  { id: "1", title: "Promocao de verao 2026 - Nova colecao disponivel!", platform: "Instagram", status: "scheduled", date: "13 Abr 2026, 09:00" },
  { id: "2", title: "Dicas de produtividade para empreendedores", platform: "LinkedIn", status: "published", date: "12 Abr 2026, 14:30" },
  { id: "3", title: "Bastidores da nossa equipe criando conteudo", platform: "TikTok", status: "pending", date: "12 Abr 2026, 10:15" },
  { id: "4", title: "Lancamento do novo produto - Save the date!", platform: "Facebook", status: "published", date: "11 Apr 2026, 18:00" },
  { id: "5", title: "Tutorial: Como usar nossa plataforma", platform: "YouTube", status: "draft", date: "11 Apr 2026, 12:00" },
];

const statusConfig = {
  published: { label: "Publicado", className: "bg-green-500/20 text-green-400 border-green-500/20" },
  scheduled: { label: "Agendado", className: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
  pending: { label: "Pendente", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" },
  draft: { label: "Rascunho", className: "bg-muted text-muted-foreground border-border" },
};

const platformColors: Record<string, string> = {
  Instagram: "text-pink-400",
  LinkedIn: "text-blue-400",
  TikTok: "text-white",
  Facebook: "text-blue-500",
  YouTube: "text-red-400",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Ola, David! <span className="text-primary">👋</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Aqui esta o resumo das suas publicacoes e agendamentos.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border bg-card p-6 transition-colors hover:bg-card/80">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              {stat.trend && (
                <p className={`mt-1 text-xs ${stat.trend.up ? "text-green-400" : "text-red-400"}`}>
                  {stat.trend.up ? "+" : "-"}{stat.trend.value} esta semana
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Acoes rapidas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className={`relative z-10`}>
                  <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${action.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {action.label}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ChevronRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:right-3" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Publicacoes recentes</h2>
          <Link href="/posts" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Postagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Plataforma</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <p className="max-w-sm truncate text-sm text-foreground">{post.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${platformColors[post.platform] || "text-foreground"}`}>
                      {post.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusConfig[post.status].className}`}>
                      {statusConfig[post.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Connection Status */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Status das conexoes</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { name: "Instagram", connected: true },
            { name: "Facebook", connected: true },
            { name: "LinkedIn", connected: true },
            { name: "TikTok", connected: false },
            { name: "YouTube", connected: true },
          ].map((platform) => (
            <div
              key={platform.name}
              className="flex flex-col items-center gap-2 rounded-lg border bg-muted/50 p-4 text-center"
            >
              <div className={`h-3 w-3 rounded-full ${platform.connected ? "bg-green-400 shadow-lg shadow-green-400/40" : "bg-red-400"}`} />
              <span className="text-sm font-medium">{platform.name}</span>
              <span className={`text-xs ${platform.connected ? "text-green-400" : "text-red-400"}`}>
                {platform.connected ? "Conectado" : "Desconectado"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
