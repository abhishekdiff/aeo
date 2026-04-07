"use client";

import { useState } from "react";
import { sourceAttributions } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link2, TrendingUp, TrendingDown, Minus, ExternalLink, ArrowUpDown } from "lucide-react";

type SortKey = "citationCount" | "lastCited" | "page";
type SortDir = "asc" | "desc";

const engineBadge: Record<string, { bg: string; color: string; border: string }> = {
  ChatGPT: { bg: "rgba(16,185,129,0.08)", color: "#059669", border: "rgba(16,185,129,0.18)" },
  Perplexity: { bg: "rgba(99,102,241,0.08)", color: "#6366f1", border: "rgba(99,102,241,0.18)" },
  Gemini: { bg: "rgba(245,158,11,0.08)", color: "#d97706", border: "rgba(245,158,11,0.18)" },
  Claude: { bg: "rgba(236,72,153,0.08)", color: "#db2777", border: "rgba(236,72,153,0.18)" },
  "Google AI": { bg: "rgba(59,130,246,0.08)", color: "#2563eb", border: "rgba(59,130,246,0.18)" },
};

const trendIcon = (trend: string) => {
  switch (trend) {
    case "up": return <TrendingUp className="w-3.5 h-3.5" style={{ color: "#10b981" }} />;
    case "down": return <TrendingDown className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />;
    default: return <Minus className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />;
  }
};

const barColors = ["#6366f1", "#8b5cf6", "#a78bfa", "#818cf8", "#7c3aed", "#6d28d9", "#4f46e5", "#4338ca"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2.5 text-xs"
      style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 4px 16px rgba(99,102,241,0.1)" }}>
      <div className="font-medium mb-1" style={{ color: "#64748b" }}>{label}</div>
      <div className="flex items-center gap-2">
        <span style={{ color: "#94a3b8" }}>Citations:</span>
        <span className="mono font-bold" style={{ color: "#6366f1" }}>{payload[0].value}</span>
      </div>
    </div>
  );
};

export default function AttributionPage() {
  const [sortKey, setSortKey] = useState<SortKey>("citationCount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) { setSortDir(sortDir === "asc" ? "desc" : "asc"); }
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = [...sourceAttributions].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "citationCount") return (a.citationCount - b.citationCount) * dir;
    if (sortKey === "lastCited") return a.lastCited.localeCompare(b.lastCited) * dir;
    return a.page.localeCompare(b.page) * dir;
  });

  const totalCitations = sourceAttributions.reduce((s, a) => s + a.citationCount, 0);
  const upTrending = sourceAttributions.filter((s) => s.trend === "up").length;
  const topPage = [...sourceAttributions].sort((a, b) => b.citationCount - a.citationCount)[0];

  const chartData = [...sourceAttributions]
    .sort((a, b) => b.citationCount - a.citationCount)
    .slice(0, 8)
    .map((s) => ({ name: s.page.length > 22 ? s.page.slice(0, 22) + "…" : s.page, citations: s.citationCount }));

  return (
    <div className="p-8 min-h-screen grid-pattern" style={{ background: "transparent" }}>
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #3b82f6, #6366f1)" }} />
            <h1 className="text-xl font-semibold" style={{ color: "#1e2030" }}>Source Attribution</h1>
          </div>
          <p className="text-xs ml-3.5" style={{ color: "#94a3b8" }}>
            Track which of your pages are being cited by AI answer engines
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-in-up-1">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
            <span className="text-[10px] tracking-widest font-semibold" style={{ color: "#94a3b8" }}>TOTAL CITATIONS</span>
          </div>
          <div className="mono text-3xl font-bold" style={{ color: "#1e2030" }}>{totalCitations}</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
            <span className="text-[10px] tracking-widest font-semibold" style={{ color: "#94a3b8" }}>TRENDING UP</span>
          </div>
          <div className="mono text-3xl font-bold" style={{ color: "#10b981" }}>{upTrending}</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] tracking-widest font-semibold" style={{ color: "#94a3b8" }}>PAGES TRACKED</span>
          </div>
          <div className="mono text-3xl font-bold" style={{ color: "#1e2030" }}>{sourceAttributions.length}</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="text-[10px] tracking-widest font-semibold mb-2" style={{ color: "#94a3b8" }}>TOP CITED PAGE</div>
          <div className="text-sm font-medium truncate" style={{ color: "#6366f1" }}>{topPage.page}</div>
          <div className="mono text-xs mt-1" style={{ color: "#94a3b8" }}>{topPage.citationCount} citations</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 mb-5 animate-fade-in-up-2">
        <div className="text-xs font-semibold tracking-widest mb-5" style={{ color: "#94a3b8" }}>
          CITATIONS BY PAGE (TOP 8)
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false}
              angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="citations" radius={[3, 3, 0, 0]} name="Citations">
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl overflow-hidden animate-fade-in-up-3"
        style={{ border: "1px solid rgba(99,102,241,0.1)", background: "rgba(255,255,255,0.85)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
              {[
                { label: "Page", key: "page" as SortKey },
                { label: "Cited By", key: null },
                { label: "Citations", key: "citationCount" as SortKey },
                { label: "Trend", key: null },
                { label: "Last Cited", key: "lastCited" as SortKey },
              ].map((col) => (
                <th key={col.label}
                  className="text-left px-5 py-3 text-[10px] font-semibold tracking-widest"
                  style={{ color: "#94a3b8", cursor: col.key ? "pointer" : "default" }}
                  onClick={() => col.key && toggleSort(col.key)}>
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.key && (
                      <ArrowUpDown className="w-2.5 h-2.5"
                        style={{ color: sortKey === col.key ? "#6366f1" : "#c0c8db" }} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                className="transition-all">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-sm" style={{ color: "#374151" }}>{s.page}</div>
                  <div className="flex items-center gap-1 mt-0.5 text-[10px]" style={{ color: "#94a3b8" }}>
                    <span className="truncate max-w-xs">{s.url}</span>
                    <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {s.citedBy.map((engine) => {
                      const eb = engineBadge[engine];
                      return (
                        <span key={engine} className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                          style={eb ? { background: eb.bg, color: eb.color, border: `1px solid ${eb.border}` }
                            : { background: "rgba(107,114,128,0.08)", color: "#6b7280" }}>
                          {engine}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1 rounded-full"
                      style={{ width: `${Math.round((s.citationCount / 53) * 48)}px`,
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6)", minWidth: "4px" }} />
                    <span className="mono text-sm font-bold" style={{ color: "#1e2030" }}>{s.citationCount}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">{trendIcon(s.trend)}</td>
                <td className="px-5 py-3.5">
                  <span className="mono text-xs" style={{ color: "#94a3b8" }}>{s.lastCited}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
