"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Eye,
  GitCompareArrows,
  Sparkles,
  Link2,
  Zap,
  Settings,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, description: "Overview & scores" },
  { href: "/queries", label: "Query Manager", icon: Search, description: "Track queries" },
  { href: "/monitoring", label: "Brand Monitoring", icon: Eye, description: "Mention tracking" },
  { href: "/gaps", label: "Content Gaps", icon: GitCompareArrows, description: "Competitor analysis" },
  { href: "/optimizer", label: "Content Optimizer", icon: Sparkles, description: "AEO scoring" },
  { href: "/attribution", label: "Source Attribution", icon: Link2, description: "Citation tracking" },
];

const engines = [
  { name: "ChatGPT", color: "#10b981", status: "active" },
  { name: "Perplexity", color: "#6366f1", status: "active" },
  { name: "Gemini", color: "#f59e0b", status: "active" },
  { name: "Claude", color: "#ec4899", status: "active" },
  { name: "Google AI", color: "#3b82f6", status: "active" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fd 100%)",
        borderRight: "1px solid rgba(99, 102, 241, 0.1)",
        boxShadow: "2px 0 12px rgba(99, 102, 241, 0.05)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid rgba(99, 102, 241, 0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            }}
          >
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight leading-none" style={{ color: "#1e2030" }}>AEO Pulse</div>
            <div className="text-[9px] tracking-widest mt-0.5" style={{ color: "#a0aabf" }}>
              ANSWER ENGINE OPT.
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="text-[9px] font-semibold tracking-widest px-3 mb-3" style={{ color: "#c0c8db" }}>
          NAVIGATION
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                isActive ? "nav-active" : ""
              }`}
              style={
                isActive
                  ? { color: "#4f46e5" }
                  : { color: "#94a3b8" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = "#6366f1";
                  (e.currentTarget as HTMLElement).style.background = "rgba(99, 102, 241, 0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  (e.currentTarget as HTMLElement).style.background = "";
                }
              }}
            >
              <item.icon
                className="w-4 h-4 flex-shrink-0 transition-all"
                style={{ color: isActive ? "#6366f1" : "inherit" }}
              />
              <span className="font-medium text-xs leading-none">{item.label}</span>
              {isActive && (
                <div
                  className="absolute right-3 w-1 h-1 rounded-full"
                  style={{ background: "#6366f1" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Engine Status */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(99, 102, 241, 0.08)" }}>
        <div className="text-[9px] font-semibold tracking-widest mb-3" style={{ color: "#c0c8db" }}>
          CONNECTED ENGINES
        </div>
        <div className="space-y-2">
          {engines.map((engine) => (
            <div key={engine.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full pulse-dot"
                  style={{ background: engine.color, boxShadow: `0 0 4px ${engine.color}80` }}
                />
                <span className="text-[11px]" style={{ color: "#6b7280" }}>{engine.name}</span>
              </div>
              <span className="text-[9px] font-medium" style={{ color: "#10b981" }}>LIVE</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-3 py-3" style={{ borderTop: "1px solid rgba(99, 102, 241, 0.08)" }}>
        <div className="flex items-center gap-1">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#6366f1";
              (e.currentTarget as HTMLElement).style.background = "rgba(99, 102, 241, 0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#94a3b8";
              (e.currentTarget as HTMLElement).style.background = "";
            }}
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs transition-all"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#6366f1";
              (e.currentTarget as HTMLElement).style.background = "rgba(99, 102, 241, 0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#94a3b8";
              (e.currentTarget as HTMLElement).style.background = "";
            }}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", color: "#6366f1" }}
          >
            U
          </div>
        </div>
      </div>
    </aside>
  );
}
