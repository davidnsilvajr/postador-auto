"use client";

import { useState } from "react";
import { Save, Upload, Plus, Trash2, Palette, Globe, Shield, Bell } from "lucide-react";

const tabs = [
  { id: "general", label: "Geral", icon: Globe },
  { id: "brands", label: "Marcas", icon: Palette },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "security", label: "Segurança", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie suas preferências e informações da conta
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Informações da Conta</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nome completo</label>
              <input
                type="text"
                defaultValue="David Jr"
                className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                defaultValue="david@email.com"
                className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Fuso horário</label>
              <select className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                <option>America/Sao_Paulo (GMT-3)</option>
                <option>America/Manaus (GMT-4)</option>
                <option>America/Noronha (GMT-2)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Idioma padrão</label>
              <select className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
                <option>Português (BR)</option>
                <option>English</option>
                <option>Español</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Salvar alterações
            </button>
          </div>
        </div>
      )}

      {/* Brands Settings */}
      {activeTab === "brands" && <BrandsTab />}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Preferências de Notificação</h3>
          <div className="space-y-4">
            <NotificationToggle label="Publicações realizadas" description="Receba confirmação quando um post for publicado" defaultChecked />
            <NotificationToggle label="Posts pendentes de aprovação" description="Notifique quando houver posts aguardando aprovação" defaultChecked />
            <NotificationToggle label="Falhas em publicações" description="Alertas quando uma publicação falhar" defaultChecked />
            <NotificationToggle label="Relatório semanal" description="Resumo semanal de analytics por email" defaultChecked />
            <NotificationToggle label="Trending topics" description="Sugestões de tópicos em alta para sua indústria" defaultChecked={false} />
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Alterar Senha</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Senha atual</label>
                <input type="password" className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Nova senha</label>
                <input type="password" className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Confirmar nova senha</label>
                <input type="password" className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
                Atualizar senha
              </button>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">API Keys</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border bg-secondary p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Anthropic API Key</p>
                  <p className="text-xs text-muted-foreground">sk-ant-api03-***-***</p>
                </div>
                <button className="text-sm text-primary hover:text-primary/80">Editar</button>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-secondary p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">OpenAI API Key</p>
                  <p className="text-xs text-muted-foreground">sk-proj-***-***</p>
                </div>
                <button className="text-sm text-primary hover:text-primary/80">Editar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BrandsTab() {
  const [brands] = useState([
    { id: 1, name: "Minha Empresa", industry: "Tecnologia", logo: "" },
    { id: 2, name: "Marca Secundária", industry: "Moda", logo: "" },
  ]);

  return (
    <div className="space-y-6">
      {/* Existing Brands */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-foreground">Suas Marcas</h3>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Nova Marca
          </button>
        </div>
        <div className="divide-y divide-border/50">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-lg font-bold text-primary">
                  {brand.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{brand.name}</p>
                  <p className="text-sm text-muted-foreground">{brand.industry}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80">
                  Editar
                </button>
                <button className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Guidelines Preview */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Manual da Marca (Guidelines)</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Selecionar marca</label>
            <select className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none">
              {brands.map((b) => (
                <option key={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Tom de voz</label>
            <input
              type="text"
              defaultValue="Profissional e acessível"
              className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Cor primária</label>
            <div className="flex gap-2">
              <input type="color" defaultValue="#7C3AED" className="h-9 w-14 rounded border" />
              <input
                type="text"
                defaultValue="#7C3AED"
                className="flex-1 rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Cor secundária</label>
            <div className="flex gap-2">
              <input type="color" defaultValue="#3B82F6" className="h-9 w-14 rounded border" />
              <input
                type="text"
                defaultValue="#3B82F6"
                className="flex-1 rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Logos</label>
            <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border/50 bg-secondary/30 p-6">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Arraste arquivos ou clique para fazer upload</p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou SVG (max 10MB). Recomendado: square, horizontal, icon.</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Descrição da voz da marca</label>
            <textarea
              defaultValue="Usamos linguagem direta mas acolhedora. Evitamos jargões técnicos desnecessários. Sempre buscamos educar antes de vender."
              className="min-h-[80px] w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Palavras-chave</label>
            <input
              type="text"
              defaultValue="inovação, tecnologia, acessível, crescimento"
              className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">NÃO usar (palavras proibidas)</label>
            <input
              type="text"
              defaultValue="gambiarra, amador, barato"
              className="w-full rounded-lg border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
            <Save className="h-4 w-4" />
            Salvar Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between rounded-lg border bg-secondary p-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}