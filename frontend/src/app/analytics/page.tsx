"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, Users, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

const summaryData = {
  period: "Últimos 30 dias",
  totalPosts: 89,
  impressions: 124567,
  reach: 89432,
  engagement: 12345,
  engagementRate: 9.8,
  followers: 15678,
  followerGrowth: 234,
};

const platformStats = [
  { name: "Instagram", posts: 34, impressions: 45678, engagement: 4567, engagementRate: 10.2, likes: 3456, comments: 567, shares: 234 },
  { name: "Facebook", posts: 20, impressions: 23456, engagement: 1234, engagementRate: 5.3, likes: 987, comments: 123, shares: 87 },
  { name: "LinkedIn", posts: 15, impressions: 34567, engagement: 3456, engagementRate: 10.0, likes: 2345, comments: 456, shares: 345 },
  { name: "TikTok", posts: 10, impressions: 12345, engagement: 2345, engagementRate: 19.0, likes: 1890, comments: 234, shares: 123 },
  { name: "YouTube", posts: 10, impressions: 8521, engagement: 743, engagementRate: 8.7, likes: 456, comments: 123, shares: 87 },
];

const topPosts = [
  { id: 1, title: "Top 10 dicas de marketing", platform: "Instagram", impressions: 12345, engagement: 2345, engagementRate: 19.0, date: "12 Abr 2026" },
  { id: 2, title: "Lançamento produto novo", platform: "LinkedIn", impressions: 9876, engagement: 1234, engagementRate: 12.5, date: "10 Abr 2026" },
  { id: 3, title: "Tutorial passo a passo", platform: "TikTok", impressions: 8765, engagement: 1567, engagementRate: 17.9, date: "09 Abr 2026" },
  { id: 4, title: "Behind the scenes", platform: "Instagram", impressions: 7654, engagement: 987, engagementRate: 12.9, date: "08 Abr 2026" },
  { id: 5, title: "Case de sucesso", platform: "Facebook", impressions: 6543, engagement: 654, engagementRate: 10.0, date: "07 Abr 2026" },
];

const weeklyData = [
  { day: "Seg", posts: 3, impressions: 12000 },
  { day: "Ter", posts: 2, impressions: 8500 },
  { day: "Qua", posts: 4, impressions: 15000 },
  { day: "Qui", posts: 1, impressions: 6700 },
  { day: "Sex", posts: 3, impressions: 11200 },
  { day: "Sáb", posts: 2, impressions: 9800 },
  { day: "Dom", posts: 1, impressions: 4500 },
];

const maxImpressions = Math.max(...weeklyData.map((d) => d.impressions));

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Métricas e performance das suas publicações
          </p>
        </div>
        {/* Period Selector */}
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {["7d", "30d", "90d", "12m"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : p === "90d" ? "90 dias" : "12 meses"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Impressões"
          value={summaryData.impressions.toLocaleString("pt-BR")}
          icon={Eye}
          trend={{ value: "+12.5%", up: true }}
          color="text-blue-400"
        />
        <SummaryCard
          label="Alcance"
          value={summaryData.reach.toLocaleString("pt-BR")}
          icon={Users}
          trend={{ value: "+8.3%", up: true }}
          color="text-green-400"
        />
        <SummaryCard
          label="Engajamento"
          value={summaryData.engagement.toLocaleString("pt-BR")}
          icon={Heart}
          trend={{ value: "-2.1%", up: false }}
          color="text-pink-400"
        />
        <SummaryCard
          label="Taxa de Engajamento"
          value={`${summaryData.engagementRate}%`}
          icon={BarChart3}
          trend={{ value: "+0.5%", up: true }}
          color="text-purple-400"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Chart */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Impressões por Dia da Semana</h3>
          <div className="flex items-end gap-3">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {(day.impressions / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-purple-500 transition-all"
                  style={{ height: `${(day.impressions / maxImpressions) * 160}px`, minHeight: 20 }}
                />
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Performance por Plataforma</h3>
          <div className="space-y-4">
            {platformStats.map((platform) => (
              <div key={platform.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{platform.name}</span>
                  <span className="text-sm text-muted-foreground">{platform.engagementRate}% eng.</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(platform.engagementRate * 5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts Table */}
      <div className="rounded-xl border bg-card">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">Top Posts</h3>
          <p className="text-sm text-muted-foreground">Posts com maior taxa de engajamento</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Post</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Plataforma</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Impressões</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Engajamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Taxa</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {topPosts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-muted/30">
                  <td className="max-w-xs px-6 py-4">
                    <p className="truncate text-sm text-foreground">{post.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-muted-foreground">{post.platform}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">{post.impressions.toLocaleString("pt-BR")}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">{post.engagement.toLocaleString("pt-BR")}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${post.engagementRate >= 15 ? "text-green-400" : post.engagementRate >= 10 ? "text-blue-400" : "text-muted-foreground"}`}>
                      {post.engagementRate}%
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
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: { value: string; up: boolean };
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 transition-colors hover:bg-card/80">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      <p className={`mt-1 text-xs font-medium ${trend.up ? "text-green-400" : "text-red-400"}`}>
        {trend.up ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}{" "}
        {trend.value} vs período anterior
      </p>
    </div>
  );
}