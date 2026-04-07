"use client";

import { useState } from "react";
import { contentGaps } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, ChevronDown, ChevronRight, Lightbulb } from "lucide-react";

const PRIORITIES = ["All", "high", "medium", "low"];

const priorityConfig = {
  high: {
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    color: "#f87171",
    accentBorder: "#ef4444",
    labelBg: "rgba(239,68,68,0.12)",
    icon: "🔴",
  },
  medium: {
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.15)",
    color: "#fbbf24",
    accentBorder: "#f59e0b",
    labelBg: "rgba(245,158,11,0.12)",
    icon: "🟡",
  },
  low: {
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.15)",
    color: "#60a5fa",
    accentBorder: "#3b82f6",
    labelBg: "rgba(59,130,246,0.12)",
    icon: "🔵",
  },
};

export default function GapsPage() {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filtered = contentGaps.filter(
    (g) => priorityFilter === "All" || g.priority === priorityFilter
  );

  const counts = {
    high: contentGaps.filter((g) => g.priority === "high").length,
    medium: contentGaps.filter((g) => g.priority === "medium").length,
    low: contentGaps.filter((g) => g.priority === "low").length,
  };

  return (
    <div className="p-8 min-h-screen grid-pattern" style={{ background: "transparent" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #ef4444, #f97316)" }} />
            <h1 className="text-xl font-semibold" style={{ color: "#e2e8f0" }}>Content Gap Analysis</h1>
          </div>
          <p className="text-xs ml-3.5" style={{ color: "#484f68" }}>
            Queries where competitors appear in AI answers but your brand doesn't
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-in-up-1">
        <div className="glass-card rounded-xl p-5">
          <div className="mono text-3xl font-bold text-white mb-1">{contentGaps.length}</div>
          <div className="text-xs" style={{ color: "#484f68" }}>Total Gaps Identified</div>
        </div>
        {(["high", "medium", "low"] as const).map((p) => {
          const cfg = priorityConfig[p];
          return (
            <div
              key={p}
              className="rounded-xl p-5 cursor-pointer transition-all"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              onClick={() => setPriorityFilter(priorityFilter === p ? "All" : p)}
            >
              <div className="mono text-3xl font-bold mb-1" style={{ color: cfg.color }}>{counts[p]}</div>
              <div className="text-xs capitalize font-medium" style={{ color: cfg.color, opacity: 0.7 }}>{p} Priority</div>
            </div>
          );
        })}
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-2 mb-5 animate-fade-in-up-2">
        <span className="text-[10px] tracking-widest font-semibold" style={{ color: "#343650" }}>FILTER</span>
        {PRIORITIES.map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className="px-3 py-1 rounded-full text-[10px] font-medium capitalize transition-all"
            style={
              priorityFilter === p
                ? { background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }
                : { color: "#484f68", border: "1px solid rgba(255,255,255,0.04)" }
            }
          >
            {p}
          </button>
        ))}
      </div>

      {/* Gap Cards */}
      <div className="space-y-3 animate-fade-in-up-3">
        {filtered.map((gap, i) => {
          const cfg = priorityConfig[gap.priority];
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl cursor-pointer transition-all"
              style={{
                background: isExpanded ? cfg.bg : "rgba(7,8,15,0.6)",
                border: `1px solid ${isExpanded ? cfg.border : "rgba(99,102,241,0.06)"}`,
                borderLeft: `3px solid ${isExpanded ? cfg.accentBorder : "rgba(99,102,241,0.15)"}`,
              }}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              <div className="px-5 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: cfg.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: "#c9d1e0" }}>{gap.query}</p>
                      <span
                        className="text-[10px] font-medium mt-1 inline-block"
                        style={{ color: "#484f68" }}
                      >
                        {gap.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-semibold px-2 py-1 rounded-full capitalize"
                      style={{ background: cfg.labelBg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {gap.priority}
                    </span>
                    {isExpanded
                      ? <ChevronDown className="w-3.5 h-3.5" style={{ color: "#484f68" }} />
                      : <ChevronRight className="w-3.5 h-3.5" style={{ color: "#484f68" }} />
                    }
                  </div>
                </div>

                {/* Competitor status grid */}
                <div className="flex items-center gap-3 ml-7 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                    <span className="text-xs font-medium" style={{ color: "#ef4444" }}>Your Brand</span>
                  </div>
                  <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.06)" }} />
                  {gap.competitors.map((c) => (
                    <div key={c.name} className="flex items-center gap-1.5">
                      {c.mentioned ? (
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" style={{ color: "#374151" }} />
                      )}
                      <span
                        className="text-xs"
                        style={{ color: c.mentioned ? "#34d399" : "#374151" }}
                      >
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {isExpanded && (
                <div
                  className="mx-5 mb-4 p-4 rounded-lg flex items-start gap-3"
                  style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}
                >
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#818cf8" }} />
                  <div>
                    <p className="text-[10px] mb-1.5 tracking-widest font-semibold" style={{ color: "#484f68" }}>
                      RECOMMENDED ACTION
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>{gap.suggestedAction}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#343650" }}>
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No gaps found for selected priority</p>
          </div>
        )}
      </div>
    </div>
  );
}
