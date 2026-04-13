"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Sparkles,
  Puzzle,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const routes = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: FileText, label: "Posts", href: "/posts" },
  { icon: CalendarDays, label: "Calendario", href: "/calendar" },
  { icon: Sparkles, label: "Gerar com IA", href: "/generate" },
  { icon: Puzzle, label: "Integracoes", href: "/integrations" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Configuracoes", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 z-40 hidden w-72 flex-col border-r bg-[hsl(var(--background))] lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-violet-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Postador Auto</h1>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Social Media</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.label}
              href={route.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {route.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="h-5 w-5" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
