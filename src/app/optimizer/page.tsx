"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, XCircle, AlertTriangle, Copy, RotateCcw, Loader2, FileText, Zap } from "lucide-react";

interface OptimizationResult {
  overallScore: number;
  checks: { label: string; passed: boolean; tip: string }[];
  suggestions: string[];
  optimizedSnippet: string;
}

const SAMPLE_CONTENT = `Our platform helps businesses manage their customer relationships more effectively. We provide tools for sales teams to track leads and close deals faster. Our solution integrates with popular tools and offers reporting capabilities.

Key features include:
- Contact management
- Pipeline tracking
- Email integration
- Basic reporting

Get started today and see how we can help your business grow.`;

function analyzeContent(content: string): OptimizationResult {
  const wordCount = content.split(/\s+/).length;
  const hasStructuredData = /^\s*[-•*]\s/m.test(content) || /^\s*\d+\.\s/m.test(content);
  const hasDefinition = /\bis\b.*\bthat\b|\brefers to\b|\bdefined as\b/i.test(content);
  const hasStats = /\d+%|\d+x|\$\d+/i.test(content);
  const hasCTA = /get started|sign up|learn more|try|contact us/i.test(content);
  const hasComparison = /compared to|versus|vs\.|better than|unlike/i.test(content);
  const hasHeading = /^#+\s|^[A-Z][A-Za-z\s]+:$/m.test(content);
  const hasFAQ = /\?$/m.test(content);
  const isLongEnough = wordCount > 100;
  const hasAuthoritativeTone = /research shows|according to|studies indicate|data suggests|experts recommend/i.test(content);

  const checks = [
    { label: "Structured formatting (lists/bullets)", passed: hasStructuredData, tip: "Use bullet points, numbered lists, or tables — AI engines prefer structured, scannable content." },
    { label: "Clear definitions present", passed: hasDefinition, tip: "Include clear 'X is...' or 'X refers to...' definitions that AI can directly quote." },
    { label: "Data points & statistics", passed: hasStats, tip: "Add specific numbers, percentages, or benchmarks to increase citation-worthiness." },
    { label: "Comparison language", passed: hasComparison, tip: "Include comparisons (e.g., 'compared to', 'versus') to appear in comparison queries." },
    { label: "FAQ-style questions", passed: hasFAQ, tip: "Add question-and-answer pairs that mirror how users query AI engines." },
    { label: "Section headings", passed: hasHeading, tip: "Use clear H2/H3 headings so AI engines can extract specific sections." },
    { label: "Authoritative tone", passed: hasAuthoritativeTone, tip: "Reference research, data, or expert opinions to signal authority to AI engines." },
    { label: "Sufficient depth (100+ words)", passed: isLongEnough, tip: "AI engines prefer comprehensive content. Aim for at least 300+ words per topic." },
    { label: "Call-to-action present", passed: hasCTA, tip: "While CTAs are fine, ensure the primary value is informational — AI engines deprioritize overtly promotional content." },
  ];

  const passed = checks.filter((c) => c.passed).length;
  const overallScore = Math.round((passed / checks.length) * 100);
  const suggestions: string[] = [];
  if (!hasDefinition) suggestions.push("Add a clear definition: '[Your product] is a [category] platform that [key differentiator].'");
  if (!hasStats) suggestions.push("Include 2–3 specific data points (e.g., '73% of B2B buyers prefer...' or 'reduces churn by 40%').");
  if (!hasComparison) suggestions.push("Add a comparison section: 'Compared to traditional CRMs, [brand] offers...'");
  if (!hasFAQ) suggestions.push("Add an FAQ section with 3–5 questions that mirror how prospects query AI engines.");
  if (!hasAuthoritativeTone) suggestions.push("Reference industry research or benchmarks to establish topical authority.");
  if (!hasHeading) suggestions.push("Break content into clear sections with descriptive headings.");

  const optimizedSnippet = `## What is [Your Brand]?\n\n[Your Brand] is a comprehensive B2B customer engagement platform that combines CRM, marketing automation, and revenue intelligence. According to industry research, companies using integrated platforms see 35% higher win rates.\n\n### Key Capabilities\n\n- **Contact & Account Management** — Unified view of every prospect interaction\n- **AI-Powered Pipeline Tracking** — Predictive deal scoring with 92% accuracy\n- **Multi-Channel Automation** — Email, LinkedIn, and ad orchestration in one workflow\n- **Advanced Revenue Analytics** — Real-time attribution across all marketing touchpoints\n\n### How does [Your Brand] compare to alternatives?\n\nCompared to traditional CRMs like Competitor A, [Your Brand] offers native intent data integration and AI-driven account prioritization.\n\n### Frequently Asked Questions\n\n**What types of companies use [Your Brand]?**\nMid-market and enterprise B2B companies in SaaS, financial services, and professional services.\n\n**How does [Your Brand] pricing work?**\n[Your Brand] offers tiered pricing starting at $X/month, with custom enterprise plans.`;

  return { overallScore, checks, suggestions, optimizedSnippet };
}

function ScoreRing({ score }: { score: number }) {
  const getColor = (s: number) => s >= 70 ? "#10b981" : s >= 40 ? "#f59e0b" : "#ef4444";
  const color = getColor(score);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="8" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 5px ${color}60)`, transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="text-center">
        <div className="mono text-xl font-bold leading-none" style={{ color }}>{score}%</div>
      </div>
    </div>
  );
}

export default function OptimizerPage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => { setResult(analyzeContent(content)); setIsAnalyzing(false); }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="p-8 min-h-screen grid-pattern" style={{ background: "transparent" }}>
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-4 rounded-full" style={{ background: "linear-gradient(180deg, #8b5cf6, #ec4899)" }} />
            <h1 className="text-xl font-semibold" style={{ color: "#1e2030" }}>Content Optimizer</h1>
          </div>
          <p className="text-xs ml-3.5" style={{ color: "#94a3b8" }}>
            Analyze and optimize your content for AI answer engine visibility
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-4 animate-fade-in-up-1">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
                <span className="text-xs font-semibold tracking-widest" style={{ color: "#94a3b8" }}>YOUR CONTENT</span>
              </div>
              <button onClick={() => setContent(SAMPLE_CONTENT)}
                className="flex items-center gap-1.5 text-xs transition-all px-2.5 py-1 rounded-lg"
                style={{ color: "#6366f1", border: "1px solid rgba(99,102,241,0.18)" }}>
                <RotateCcw className="w-3 h-3" />Load Sample
              </button>
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your blog post, landing page copy, or any content you want to optimize for AI answer engines..."
              className="w-full h-72 p-4 rounded-lg text-sm resize-none outline-none leading-relaxed"
              style={{ background: "#f8f9fd", border: "1px solid rgba(99,102,241,0.12)",
                color: "#374151", caretColor: "#6366f1" }} />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <span className="mono text-xs" style={{ color: "#94a3b8" }}>{wordCount} words</span>
                {wordCount > 0 && (
                  <div className="h-1 w-24 rounded-full" style={{ background: "rgba(99,102,241,0.08)" }}>
                    <div className="h-1 rounded-full transition-all"
                      style={{ width: `${Math.min((wordCount / 300) * 100, 100)}%`,
                        background: wordCount >= 300 ? "#10b981" : "#6366f1" }} />
                  </div>
                )}
                {wordCount > 0 && wordCount < 300 && (
                  <span className="text-xs" style={{ color: "#94a3b8" }}>target: 300+</span>
                )}
              </div>
              <button onClick={handleAnalyze} disabled={!content.trim() || isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                  border: "1px solid rgba(99,102,241,0.25)", color: "#6366f1" }}>
                {isAnalyzing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing...</>
                  : <><Sparkles className="w-3.5 h-3.5" /> Analyze Content</>}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 animate-fade-in-up-2">
          {!result && !isAnalyzing && (
            <div className="glass-card rounded-xl p-14 flex flex-col items-center justify-center text-center"
              style={{ minHeight: "360px" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}>
                <Zap className="w-7 h-7" style={{ color: "#c7cce8" }} />
              </div>
              <p className="text-sm" style={{ color: "#94a3b8" }}>Paste content and click Analyze</p>
              <p className="text-xs mt-1" style={{ color: "#c0c8db" }}>Get your AEO readiness score & recommendations</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="glass-card rounded-xl p-14 flex flex-col items-center justify-center"
              style={{ minHeight: "360px" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#6366f1" }} />
              </div>
              <p className="text-sm" style={{ color: "#94a3b8" }}>Analyzing content...</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <>
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-5 mb-5">
                  <ScoreRing score={result.overallScore} />
                  <div>
                    <div className="text-xs font-semibold tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                      AEO READINESS SCORE
                    </div>
                    <div className="text-sm" style={{ color: "#64748b" }}>
                      {result.overallScore >= 70 ? "Strong AEO readiness"
                        : result.overallScore >= 40 ? "Needs improvement" : "Significant gaps found"}
                    </div>
                    <div className="mt-2 text-xs" style={{ color: "#94a3b8" }}>
                      {result.checks.filter((c) => c.passed).length}/{result.checks.length} checks passed
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {result.checks.map((check, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      {check.passed
                        ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#10b981" }} />
                        : <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#d1d5db" }} />}
                      <div>
                        <p className="text-xs" style={{ color: check.passed ? "#374151" : "#94a3b8" }}>{check.label}</p>
                        {!check.passed && <p className="text-[10px] mt-0.5" style={{ color: "#c0c8db" }}>{check.tip}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.suggestions.length > 0 && (
                <div className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
                    <span className="text-xs font-semibold tracking-widest" style={{ color: "#94a3b8" }}>IMPROVEMENTS</span>
                  </div>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="p-3 rounded-lg text-xs leading-relaxed"
                        style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)", color: "#64748b" }}>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: "#8b5cf6" }} />
                    <span className="text-xs font-semibold tracking-widest" style={{ color: "#94a3b8" }}>OPTIMIZED TEMPLATE</span>
                  </div>
                  <button onClick={() => handleCopy(result.optimizedSnippet)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{ background: copied ? "rgba(16,185,129,0.08)" : "rgba(99,102,241,0.08)",
                      color: copied ? "#059669" : "#6366f1",
                      border: `1px solid ${copied ? "rgba(16,185,129,0.18)" : "rgba(99,102,241,0.18)"}` }}>
                    <Copy className="w-3 h-3" />{copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="text-xs leading-relaxed overflow-auto max-h-60 p-4 rounded-lg whitespace-pre-wrap"
                  style={{ background: "#f8f9fd", border: "1px solid rgba(99,102,241,0.08)",
                    color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
                  {result.optimizedSnippet}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
