"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Eye } from "lucide-react";

const calendarData: Record<string, { id: number; title: string; time: string; platform: string; status: string }[]> = {
  "2026-04-06": [{ id: 10, title: "Dica de segunda", time: "09:00", platform: "Instagram", status: "published" }],
  "2026-04-08": [
    { id: 11, title: "Carrossel: Top 5 ferramentas", time: "12:00", platform: "Instagram", status: "published" },
    { id: 12, title: "Update de produto", time: "18:00", platform: "LinkedIn", status: "published" },
  ],
  "2026-04-10": [
    { id: 13, title: "Behind the scenes", time: "10:00", platform: "TikTok", status: "published" },
  ],
  "2026-04-13": [
    { id: 1, title: "Promoção de verão 2026", time: "09:00", platform: "Instagram", status: "scheduled" },
    { id: 14, title: "Webinar de marketing digital", time: "14:00", platform: "LinkedIn", status: "scheduled" },
  ],
  "2026-04-14": [
    { id: 15, title: "Lançamento produto novo", time: "09:00", platform: "Facebook", status: "approved" },
  ],
  "2026-04-15": [
    { id: 16, title: "Depoimento de cliente", time: "12:00", platform: "Instagram", status: "pending" },
  ],
  "2026-04-16": [
    { id: 17, title: "Tutorial passo a passo", time: "10:00", platform: "YouTube", status: "draft" },
    { id: 18, title: "Meme do dia", time: "18:00", platform: "Twitter", status: "draft" },
  ],
  "2026-04-17": [
    { id: 19, title: "Case de sucesso", time: "09:00", platform: "LinkedIn", status: "scheduled" },
  ],
  "2026-04-20": [
    { id: 20, title: "Live Q&A", time: "19:00", platform: "Instagram", status: "scheduled" },
    { id: 21, title: "Receita da semana", time: "12:00", platform: "Facebook", status: "approved" },
  ],
};

const statusColors: Record<string, string> = {
  published: "bg-green-500",
  scheduled: "bg-blue-500",
  approved: "bg-emerald-500",
  pending: "bg-yellow-500",
  draft: "bg-muted-foreground",
};

const statusLabels: Record<string, string> = {
  published: "Publicado",
  scheduled: "Agendado",
  approved: "Aprovado",
  pending: "Pendente",
  draft: "Rascunho",
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const formatKey = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendário</h1>
          <p className="mt-1 text-sm text-muted-foreground">Visualize seus agendamentos por data</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <button onClick={prevMonth} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold capitalize text-foreground">{monthName}</h2>
          <button onClick={nextMonth} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div key={day} className="py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (!day) {
              return <div key={`empty-${i}`} className="min-h-24 border-b border-r border-border/30" />;
            }

            const key = formatKey(currentYear, currentMonth, day);
            const dayPosts = calendarData[key] || [];
            const todayClass = isToday(day) ? "ring-2 ring-primary bg-primary/10" : "";

            return (
              <div
                key={key}
                className={`relative min-h-24 cursor-pointer border-b border-r border-border/30 p-2 transition-colors hover:bg-secondary/30 ${todayClass}`}
                onClick={() => setSelectedDay(selectedDay === key ? null : key)}
              >
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday(day) ? "bg-primary text-white" : "text-muted-foreground"
                }`}>
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-center gap-1 truncate">
                      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${statusColors[post.status]}`} />
                      <span className="truncate text-[10px] text-muted-foreground">{post.title}</span>
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">+{dayPosts.length - 3} mais</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && calendarData[selectedDay] && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Posts em {new Date(selectedDay + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
          </h3>
          <div className="space-y-3">
            {calendarData[selectedDay].map((post) => (
              <div key={post.id} className="flex items-center justify-between rounded-lg border bg-secondary p-4">
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${statusColors[post.status]}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.platform} • {post.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    statusColors[post.status].replace("bg-", "bg-").replace("500", "500/20") + " " +
                    statusColors[post.status].replace("bg-", "text-").replace("500", "400") + " border"
                  }`}>
                    {statusLabels[post.status]}
                  </span>
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-card hover:text-foreground" title="Visualizar">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 rounded-xl border bg-card p-4">
        {Object.entries(statusLabels).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${statusColors[status]}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}