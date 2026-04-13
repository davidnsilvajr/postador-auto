"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/posts": "Posts",
  "/calendar": "Calendario",
  "/generate": "Gerar com IA",
  "/integrations": "Integracoes",
  "/analytics": "Analytics",
  "/settings": "Configuracoes",
};

export default function Header() {
  const pathname = usePathname();
  const pageTitle = routeLabels[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-[hsl(var(--background))]/80 px-6 backdrop-blur-md">
      {/* Left: page title + mobile menu */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-foreground">{pageTitle}</h2>
      </div>

      {/* Right: search, notifications, avatar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-64 rounded-lg border bg-secondary px-9 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-2 rounded-lg border bg-secondary p-1.5 pl-2 transition-colors hover:border-primary/50">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-violet-500 text-xs font-semibold text-white">
            DJ
          </div>
          <span className="hidden text-sm font-medium text-foreground md:inline-block">David Jr</span>
        </button>
      </div>
    </header>
  );
}
