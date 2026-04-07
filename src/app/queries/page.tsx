"use client";

import { useState } from "react";
import { queries as initialQueries, type Query } from "@/lib/mock-data";
import { Plus, Play, Trash2, Search, CheckCircle2, XCircle, X, Loader2, Tag } from "lucide-react";

const CATEGORIES = ["All", "CRM", "Lead Gen", "Marketing Automation", "ABM", "Demand Gen", "Analytics", "Intent Data", "Sales Alignment", "Email"];
const ENGINES = ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"];

const engineDotColor: Record<string, string> = {
  ChatGPT: "#10b981",
  Perplexity: "#6366f1",
  Gemini: "#f59e0b",
  Claude: "#ec4899",
  "Google AI": "#3b82f6",
};

const categoryColor = (cat: string) => {
  const map: Record<string, string> = {
    CRM: "#6366f1", "Lead Gen": "#10b981", "Marketing Automation": "#f59e0b",
    ABM: "#ec4899", "Demand Gen": "#8b5cf6", Analytics: "#3b82f6",
    "Intent Data": "#14b8a6", "Sales Alignment": "#f97316", Email: "#84cc16",
  };
  return map[cat] || "#6b7280";
};

export default function QueriesPage() {
  const [queryList, setQueryList] = useState<Query[]>(initialQueries);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuery, setNewQuery] = useState("");
  const [newCategory, setNewCategory] = useState("CRM");
  const [selectedEngines, setSelectedEngines] = useState<string[]>(ENGINES);
  const [runningQueries, setRunningQueries] = useState<Set<string>>(new Set());

  const filtered = queryList.filter((q) => {
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = () => {
    if (!newQuery.trim()) return;
    const q: Query = {
      id: `q${Date.now()}`,
      text: newQuery,
      category: newCategory,
      engines: selectedEngines,
      lastRun: "Never",
      brandMentioned: false,
      competitorsMentioned: [],
    };
    setQueryList([q, ...queryList]);
    setNewQuery("");
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => setQueryList(queryList.filter((q) => q.id !== id));

  const handleRun = (id: string) => {
    setRunningQueries((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setRunningQueries((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setQueryList((prev) => prev.map((q) =>
        q.id === id ? { ...q, lastRun: new Date().toISOString().split("T")[0], brandMentioned: Math.random() > 0.4 } : q
      ));
    }, 2000);
  };

  const mentionedCount = queryList.filter((q) => q.brandMentioned).length;

  return (
    <div className="p-8 min-h-screen grid-pattern" style={{ background: "transparent" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }} />
            <h1 className="text-xl font-semibold" style={{ color: "#1e2030" }}>Query Manager</h1>
          </div>
          <p className="text-xs ml-3.5" style={{ color: "#94a3b8" }}>
            Track how AI engines respond to queries relevant to your brand
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => filtered.forEach((q) => handleRun(q.id))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", color: "#059669" }}>
            <Play className="w-3.5 h-3.5" />Run All
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#6366f1" }}>
            <Plus className="w-3.5 h-3.5" />Add Query
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6 animate-fade-in-up-1">
        {[
          { label: "Total Queries", value: queryList.length, color: "#6366f1" },
          { label: "Brand Mentioned", value: mentionedCount, color: "#10b981" },
          { label: "Brand Missing", value: queryList.length - mentionedCount, color: "#ef4444" },
          { label: "Engines Active", value: ENGINES.length, color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="mono text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: "#94a3b8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3 mb-5 animate-fade-in-up-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
          <input type="text" placeholder="Search queries..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg text-xs outline-none transition-all w-64"
            style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.15)", color: "#374151" }} />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all"
              style={selectedCategory === cat
                ? { background: "rgba(99,102,241,0.12)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.25)" }
                : { background: "rgba(99,102,241,0.04)", color: "#94a3b8", border: "1px solid rgba(99,102,241,0.08)" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden animate-fade-in-up-3"
        style={{ border: "1px solid rgba(99,102,241,0.1)", background: "rgba(255,255,255,0.85)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
              {["Query", "Category", "Engines", "Brand", "Last Run", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-semibold tracking-widest"
                  style={{ color: "#94a3b8" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((q) => (
              <tr key={q.id} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)" }}
                className="transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                <td className="px-5 py-3.5">
                  <p className="text-sm" style={{ color: "#374151" }}>{q.text}</p>
                  {q.competitorsMentioned.length > 0 && (
                    <p className="text-[10px] mt-1" style={{ color: "#94a3b8" }}>
                      Also mentions: {q.competitorsMentioned.join(", ")}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full"
                    style={{ background: `${categoryColor(q.category)}12`,
                      color: categoryColor(q.category), border: `1px solid ${categoryColor(q.category)}25` }}>
                    {q.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1">
                    {q.engines.map((e) => (
                      <div key={e} className="w-2 h-2 rounded-full" title={e}
                        style={{ background: engineDotColor[e] || "#6b7280", boxShadow: `0 0 3px ${engineDotColor[e]}60` }} />
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {q.brandMentioned ? (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#10b981" }}>
                      <CheckCircle2 className="w-3.5 h-3.5" /><span>Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#ef4444" }}>
                      <XCircle className="w-3.5 h-3.5" /><span>No</span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="mono text-xs" style={{ color: "#94a3b8" }}>{q.lastRun}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleRun(q.id)} disabled={runningQueries.has(q.id)}
                      className="p-1.5 rounded-lg transition-all disabled:opacity-50"
                      style={{ color: "#94a3b8" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#10b981"; (e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = ""; }}>
                      {runningQueries.has(q.id) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg transition-all"
                      style={{ color: "#94a3b8" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = ""; }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: "#94a3b8" }}>
            <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No queries found</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(30,32,48,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full max-w-md animate-fade-in-up"
            style={{ background: "#ffffff", border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 24px 64px rgba(99,102,241,0.15)" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" style={{ color: "#6366f1" }} />
                <h2 className="text-sm font-semibold" style={{ color: "#1e2030" }}>New Query</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ color: "#94a3b8" }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#64748b" }}>Query Text</label>
                <input type="text" value={newQuery} onChange={(e) => setNewQuery(e.target.value)}
                  placeholder="e.g., What is the best CRM for startups?"
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "#f8f9fd", border: "1px solid rgba(99,102,241,0.15)", color: "#374151" }}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#64748b" }}>Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: "#f8f9fd", border: "1px solid rgba(99,102,241,0.15)", color: "#374151" }}>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#64748b" }}>Engines</label>
                <div className="flex flex-wrap gap-2">
                  {ENGINES.map((eng) => {
                    const active = selectedEngines.includes(eng);
                    return (
                      <button key={eng}
                        onClick={() => setSelectedEngines(active ? selectedEngines.filter((x) => x !== eng) : [...selectedEngines, eng])}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={active
                          ? { background: `${engineDotColor[eng]}12`, color: engineDotColor[eng], border: `1px solid ${engineDotColor[eng]}30` }
                          : { background: "rgba(99,102,241,0.04)", color: "#94a3b8", border: "1px solid rgba(99,102,241,0.1)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: active ? engineDotColor[eng] : "#94a3b8" }} />
                        {eng}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-lg text-xs font-medium"
                style={{ background: "#f5f7ff", color: "#94a3b8", border: "1px solid rgba(99,102,241,0.1)" }}>
                Cancel
              </button>
              <button onClick={handleAdd} disabled={!newQuery.trim()}
                className="flex-1 py-2 rounded-lg text-xs font-medium disabled:opacity-40"
                style={{ background: "rgba(99,102,241,0.12)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.25)" }}>
                Add Query
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
