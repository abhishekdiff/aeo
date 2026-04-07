"use client";

import { useState } from "react";
import { brandMentions, sentimentTrend } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Eye, ThumbsUp, ThumbsDown, Activity, ChevronDown, ChevronRight } from "lucide-react";

const ENGINES = ["All", "ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"];
const SENTIMENTS = ["All", "positive", "neutral", "negative"];

const engineColors: Record<string, string> = {
  ChatGPT: "#10b981",
  Perplexity: "#6366f1",
  Gemini: "#f59e0b",
  Claude: "#ec4899",
  "Google AI": "#3b82f6",
};

const sentimentStyle = (s: string) => ({
  positive: { bg: "rgba(16,185,129,0.08)", color: "#059669", border: "rgba(16,185,129,0.18)" },
  neutral: { bg: "rgba(107,114,128,0.08)", color: "#6b7280", border: "rgba(107,114,128,0.18)" },
  negative: { bg: "rgba(239,68,68,0.08)", color: "#ef4444", border: "rgba(239,68,68,0.18)" },
}[s] || { bg: "rgba(107,114,128,0.08)", color: "#6b7280", border: "rgba(107,114,128,0.18)" });

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2.5 text-xs"
      style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 4px 16px rgba(99,102,241,0.1)" }}>
      <div className="font-medium mb-1.5" style={{ color: "#64748b" }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span style={{ color: "#94a3b8" }}>{p.name}:</span>
          <span className="mono font-medium" style={{ color: "#1e2030" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MonitoringPage() {
  const [engineFilter, setEngineFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = brandMentions.filter((m) => {
    const matchesEngine = engineFilter === "All" || m.engine === engineFilter;
    const matchesSentiment = sentimentFilter === "All" || m.sentiment === sentimentFilter;
    return matchesEngine && matchesSentiment;
  });

  const totalMentions = brandMentions.length;
  const positiveMentions = brandMentions.filter((m) => m.mentioned && m.sentiment === "positive").length;
  const missingCount = brandMentions.filter((m) => !m.mentioned).length;
  const mentionRate = Math.round((brandMentions.filter((m) => m.mentioned).length / totalMentions) * 100);

  return (
    <div className="p-8 min-h-screen grid-pattern" style={{ background: "transparent" }}>
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #10b981, #34d399)" }} />
            <h1 className="text-xl font-semibold" style={{ color: "#1e2030" }}>Brand Monitoring</h1>
          </div>
          <p className="text-xs ml-3.5" style={{ color: "#94a3b8" }}>
            How AI engines mention your brand across tracked queries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-in-up-1">
        {[
          { label: "Total Responses", value: totalMentions, icon: Eye, color: "#6366f1" },
          { label: "Positive Mentions", value: positiveMentions, icon: ThumbsUp, color: "#10b981" },
          { label: "Brand Missing", value: missingCount, icon: ThumbsDown, color: "#ef4444" },
          { label: "Mention Rate", value: `${mentionRate}%`, icon: Activity, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              <span className="text-[10px] tracking-widest font-semibold" style={{ color: "#94a3b8" }}>
                {s.label.toUpperCase()}
              </span>
            </div>
            <div className="mono text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-6 mb-6 animate-fade-in-up-2">
        <div className="text-xs font-semibold tracking-widest mb-5" style={{ color: "#94a3b8" }}>
          SENTIMENT TREND — LAST 8 WEEKS
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sentimentTrend} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
            <Bar dataKey="positive" stackId="a" fill="#10b981" name="Positive" />
            <Bar dataKey="neutral" stackId="a" fill="#d1d5e8" name="Neutral" />
            <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mb-5 animate-fade-in-up-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-widest font-semibold" style={{ color: "#94a3b8" }}>ENGINE</span>
          <div className="flex gap-1">
            {ENGINES.map((e) => (
              <button key={e} onClick={() => setEngineFilter(e)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all"
                style={engineFilter === e
                  ? { background: "rgba(99,102,241,0.12)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.25)" }
                  : { color: "#94a3b8", border: "1px solid rgba(99,102,241,0.08)" }}>
                {e}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-widest font-semibold" style={{ color: "#94a3b8" }}>SENTIMENT</span>
          <div className="flex gap-1">
            {SENTIMENTS.map((s) => (
              <button key={s} onClick={() => setSentimentFilter(s)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium capitalize transition-all"
                style={sentimentFilter === s
                  ? { background: "rgba(99,102,241,0.12)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.25)" }
                  : { color: "#94a3b8", border: "1px solid rgba(99,102,241,0.08)" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 animate-fade-in-up-4">
        {filtered.map((m, i) => {
          const ss = sentimentStyle(m.sentiment);
          const isExpanded = expandedIndex === i;
          return (
            <div key={i} className="rounded-xl cursor-pointer transition-all"
              style={{ background: isExpanded ? "#ffffff" : "rgba(255,255,255,0.85)",
                border: `1px solid ${isExpanded ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)"}`,
                boxShadow: isExpanded ? "0 2px 12px rgba(99,102,241,0.08)" : "none" }}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}>
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: m.mentioned ? "#10b981" : "#ef4444",
                      boxShadow: `0 0 5px ${m.mentioned ? "#10b98160" : "#ef444460"}` }} />
                  <div>
                    <p className="text-sm" style={{ color: "#374151" }}>{m.query}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: `${engineColors[m.engine] || "#6b7280"}12`,
                          color: engineColors[m.engine] || "#6b7280" }}>
                        {m.engine}
                      </span>
                      <span className="text-[10px]" style={{ color: "#94a3b8" }}>{m.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full"
                    style={{ background: m.mentioned ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                      color: m.mentioned ? "#059669" : "#ef4444",
                      border: `1px solid ${m.mentioned ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)"}` }}>
                    {m.mentioned ? "Mentioned" : "Not Mentioned"}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full capitalize"
                    style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                    {m.sentiment}
                  </span>
                  {isExpanded
                    ? <ChevronDown className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
                    : <ChevronRight className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />}
                </div>
              </div>
              {isExpanded && (
                <div className="mx-5 mb-4 p-4 rounded-lg"
                  style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)" }}>
                  <p className="text-[10px] mb-2 tracking-widest font-semibold" style={{ color: "#94a3b8" }}>
                    AI RESPONSE SNIPPET
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{m.snippet}</p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#94a3b8" }}>
            <Eye className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No mentions match the current filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
