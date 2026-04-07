"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from "recharts";
import {
  scoreTrends,
  engineBreakdown,
  competitorData,
  categoryDistribution,
  queries,
  brandMentions,
} from "@/lib/mock-data";
import { TrendingUp, Zap, Eye, Search, Link2, ArrowUpRight, Activity } from "lucide-react";

// AEO Score Gauge SVG
function ScoreGauge({ score }: { score: number }) {
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return "#10b981";
    if (s >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative flex flex-col items-center">
      <svg width="200" height="110" viewBox="0 0 200 110">
        {/* Background track */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="rgba(99,102,241,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Colored progress */}
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: `drop-shadow(0 0 8px ${getColor(score)}80)`,
          }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = -180 + (tick / 100) * 180;
          const rad = (angle * Math.PI) / 180;
          const x1 = 100 + 78 * Math.cos(rad);
          const y1 = 100 + 78 * Math.sin(rad);
          const x2 = 100 + 86 * Math.cos(rad);
          const y2 = 100 + 86 * Math.sin(rad);
          return (
            <line
              key={tick}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(99,102,241,0.2)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      <div className="absolute bottom-0 text-center">
        <div className="mono text-5xl font-bold leading-none" style={{ color: getColor(score) }}>
          {score}
        </div>
        <div className="text-xs mt-1" style={{ color: "#484f68" }}>AEO SCORE</div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-3 py-2.5 text-xs"
        style={{
          background: "#0d0e1a",
          border: "1px solid rgba(99,102,241,0.2)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div className="font-medium mb-1.5" style={{ color: "#9ca3af" }}>{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: "#6b7280" }}>{p.name}:</span>
            <span className="mono font-medium" style={{ color: "#e2e8f0" }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function KPICard({
  label,
  value,
  delta,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string;
  delta: string;
  icon: any;
  color: string;
  delay: number;
}) {
  return (
    <div
      className={`glass-card rounded-xl p-5 animate-fade-in-up-${delay}`}
      style={{ borderColor: `${color}15` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${color}12`, border: `1px solid ${color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: "#10b981" }}
        >
          <ArrowUpRight className="w-3 h-3" />
          {delta}
        </div>
      </div>
      <div className="mono text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs" style={{ color: "#484f68" }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"trend" | "engines">("trend");

  const mentionRate = Math.round(
    (brandMentions.filter((m) => m.mentioned).length / brandMentions.length) * 100
  );

  const radarData = competitorData.map((c) => ({
    name: c.name === "Your Brand" ? "You" : c.name.replace("Competitor ", ""),
    ChatGPT: c.chatgpt,
    Perplexity: c.perplexity,
    Gemini: c.gemini,
    Claude: c.claude,
  }));

  return (
    <div className="p-8 grid-pattern min-h-screen" style={{ background: "transparent" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }} />
            <h1 className="text-xl font-semibold" style={{ color: "#e2e8f0" }}>
              Dashboard
            </h1>
          </div>
          <p className="text-xs ml-3.5" style={{ color: "#484f68" }}>
            AI answer engine visibility — last updated Mar 30, 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#34d399" }}
          >
            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#10b981" }} />
            5 engines live
          </div>
          <button
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
              border: "1px solid rgba(99,102,241,0.3)",
              color: "#a5b4fc",
            }}
          >
            Run Analysis
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard label="AEO Visibility Score" value="68" delta="+12%" icon={Zap} color="#6366f1" delay={1} />
        <KPICard label="Brand Mentions" value="8" delta="+3" icon={Eye} color="#10b981" delay={2} />
        <KPICard label="Queries Tracked" value="10" delta="+2" icon={Search} color="#8b5cf6" delay={3} />
        <KPICard label="Mention Rate" value={`${mentionRate}%`} delta="+8%" icon={Activity} color="#f59e0b" delay={4} />
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Score Gauge */}
        <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center animate-fade-in-up-2">
          <div className="text-xs font-medium mb-4 tracking-widest" style={{ color: "#484f68" }}>
            OVERALL AEO SCORE
          </div>
          <ScoreGauge score={68} />
          <div className="mt-5 w-full grid grid-cols-3 gap-2">
            {[
              { label: "vs last month", value: "+12", color: "#10b981" },
              { label: "Industry avg", value: "52", color: "#6366f1" },
              { label: "Your rank", value: "#1", color: "#f59e0b" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mono text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] leading-tight mt-0.5" style={{ color: "#343650" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend / Engine chart */}
        <div className="glass-card rounded-xl p-6 col-span-2 animate-fade-in-up-3">
          <div className="flex items-center justify-between mb-5">
            <div className="text-xs font-medium tracking-widest" style={{ color: "#484f68" }}>
              VISIBILITY TREND
            </div>
            <div className="flex gap-1">
              {(["trend", "engines"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3 py-1 rounded text-xs font-medium transition-all capitalize"
                  style={
                    activeTab === tab
                      ? { background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }
                      : { color: "#484f68", border: "1px solid transparent" }
                  }
                >
                  {tab === "trend" ? "Over Time" : "By Engine"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "trend" ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={scoreTrends}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#484f68" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#484f68" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGrad)" name="AEO Score" dot={false} activeDot={{ r: 4, fill: "#6366f1" }} />
                <Area type="monotone" dataKey="chatgpt" stroke="#10b981" strokeWidth={1.5} fill="none" name="ChatGPT" dot={false} strokeDasharray="4 4" />
                <Area type="monotone" dataKey="claude" stroke="#ec4899" strokeWidth={1.5} fill="none" name="Claude" dot={false} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engineBreakdown} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                <XAxis dataKey="engine" tick={{ fontSize: 10, fill: "#484f68" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#484f68" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} name="Score">
                  {engineBreakdown.map((entry, index) => (
                    <rect key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Competitor radar */}
        <div className="glass-card rounded-xl p-6 animate-fade-in-up-4">
          <div className="text-xs font-medium tracking-widest mb-5" style={{ color: "#484f68" }}>
            COMPETITOR COMPARISON
          </div>
          <div className="space-y-3">
            {competitorData.map((c, i) => {
              const isYou = c.name === "Your Brand";
              return (
                <div key={c.name} className="flex items-center gap-3">
                  <div
                    className="text-xs font-medium w-24 truncate"
                    style={{ color: isYou ? "#a5b4fc" : "#484f68" }}
                  >
                    {isYou ? "You" : c.name}
                  </div>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.08)" }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${c.overall}%`,
                        background: isYou
                          ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                          : "rgba(99,102,241,0.25)",
                        boxShadow: isYou ? "0 0 6px rgba(99,102,241,0.4)" : "none",
                      }}
                    />
                  </div>
                  <div className="mono text-xs font-semibold w-8 text-right" style={{ color: isYou ? "#a5b4fc" : "#343650" }}>
                    {c.overall}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engine breakdown */}
        <div className="glass-card rounded-xl p-6 animate-fade-in-up-5">
          <div className="text-xs font-medium tracking-widest mb-5" style={{ color: "#484f68" }}>
            ENGINE BREAKDOWN
          </div>
          <div className="space-y-3">
            {engineBreakdown.map((e) => (
              <div key={e.engine} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: e.color, boxShadow: `0 0 6px ${e.color}80` }}
                />
                <span className="text-xs flex-1" style={{ color: "#6b7280" }}>{e.engine}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${e.score}%`, background: e.color, opacity: 0.7 }}
                  />
                </div>
                <span className="mono text-xs font-semibold w-6 text-right" style={{ color: e.color }}>
                  {e.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category distribution */}
        <div className="glass-card rounded-xl p-6 animate-fade-in-up-6">
          <div className="text-xs font-medium tracking-widest mb-5" style={{ color: "#484f68" }}>
            QUERY CATEGORIES
          </div>
          <div className="space-y-2.5">
            {categoryDistribution.map((cat) => {
              const total = categoryDistribution.reduce((s, c) => s + c.value, 0);
              const pct = Math.round((cat.value / total) * 100);
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: cat.fill }} />
                  <span className="text-xs flex-1 truncate" style={{ color: "#6b7280" }}>{cat.name}</span>
                  <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, background: cat.fill, opacity: 0.8 }}
                    />
                  </div>
                  <span className="mono text-xs w-6 text-right" style={{ color: "#343650" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
