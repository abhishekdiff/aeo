// ── Mock Data for AEO Pulse ──

export interface Query {
  id: string;
  text: string;
  category: string;
  engines: string[];
  lastRun: string;
  brandMentioned: boolean;
  competitorsMentioned: string[];
}

export interface EngineResult {
  engine: string;
  mentioned: boolean;
  position: "top" | "middle" | "bottom" | "none";
  snippet: string;
  sources: string[];
  timestamp: string;
}

export interface BrandMention {
  query: string;
  engine: string;
  mentioned: boolean;
  sentiment: "positive" | "neutral" | "negative";
  snippet: string;
  date: string;
}

export interface ContentGap {
  query: string;
  category: string;
  yourBrand: boolean;
  competitors: { name: string; mentioned: boolean }[];
  suggestedAction: string;
  priority: "high" | "medium" | "low";
}

export interface SourceAttribution {
  url: string;
  page: string;
  citedBy: string[];
  citationCount: number;
  lastCited: string;
  trend: "up" | "down" | "stable";
}

export interface ScoreTrend {
  date: string;
  score: number;
  chatgpt: number;
  perplexity: number;
  gemini: number;
  claude: number;
  googleAI: number;
}

// ── AEO Score Trends ──
export const scoreTrends: ScoreTrend[] = [
  { date: "Jan", score: 32, chatgpt: 35, perplexity: 28, gemini: 30, claude: 38, googleAI: 29 },
  { date: "Feb", score: 36, chatgpt: 38, perplexity: 32, gemini: 33, claude: 40, googleAI: 37 },
  { date: "Mar", score: 34, chatgpt: 36, perplexity: 30, gemini: 35, claude: 37, googleAI: 32 },
  { date: "Apr", score: 41, chatgpt: 44, perplexity: 38, gemini: 39, claude: 43, googleAI: 41 },
  { date: "May", score: 45, chatgpt: 48, perplexity: 42, gemini: 43, claude: 47, googleAI: 45 },
  { date: "Jun", score: 48, chatgpt: 50, perplexity: 45, gemini: 47, claude: 51, googleAI: 48 },
  { date: "Jul", score: 52, chatgpt: 55, perplexity: 48, gemini: 50, claude: 54, googleAI: 51 },
  { date: "Aug", score: 55, chatgpt: 58, perplexity: 52, gemini: 53, claude: 57, googleAI: 56 },
  { date: "Sep", score: 58, chatgpt: 60, perplexity: 55, gemini: 56, claude: 61, googleAI: 58 },
  { date: "Oct", score: 61, chatgpt: 64, perplexity: 58, gemini: 59, claude: 63, googleAI: 60 },
  { date: "Nov", score: 64, chatgpt: 67, perplexity: 61, gemini: 62, claude: 66, googleAI: 63 },
  { date: "Dec", score: 68, chatgpt: 71, perplexity: 65, gemini: 66, claude: 70, googleAI: 67 },
];

// ── Engine Visibility Breakdown ──
export const engineBreakdown = [
  { engine: "ChatGPT", score: 71, color: "#10b981", mentions: 142, queries: 200 },
  { engine: "Perplexity", score: 65, color: "#6366f1", mentions: 130, queries: 200 },
  { engine: "Gemini", score: 66, color: "#f59e0b", mentions: 132, queries: 200 },
  { engine: "Claude", score: 70, color: "#ec4899", mentions: 140, queries: 200 },
  { engine: "Google AI", score: 67, color: "#3b82f6", mentions: 134, queries: 200 },
];

// ── Competitor Comparison ──
export const competitorData = [
  { name: "Your Brand", chatgpt: 71, perplexity: 65, gemini: 66, claude: 70, googleAI: 67, overall: 68 },
  { name: "Competitor A", chatgpt: 62, perplexity: 70, gemini: 58, claude: 55, googleAI: 63, overall: 62 },
  { name: "Competitor B", chatgpt: 55, perplexity: 52, gemini: 60, claude: 58, googleAI: 54, overall: 56 },
  { name: "Competitor C", chatgpt: 48, perplexity: 45, gemini: 50, claude: 47, googleAI: 49, overall: 48 },
  { name: "Competitor D", chatgpt: 40, perplexity: 38, gemini: 42, claude: 41, googleAI: 39, overall: 40 },
];

// ── Queries ──
export const queries: Query[] = [
  { id: "q1", text: "What is the best CRM for mid-market SaaS companies?", category: "CRM", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-15", brandMentioned: true, competitorsMentioned: ["Competitor A", "Competitor B"] },
  { id: "q2", text: "How to improve B2B lead generation?", category: "Lead Gen", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-15", brandMentioned: true, competitorsMentioned: ["Competitor A"] },
  { id: "q3", text: "Best marketing automation tools for enterprise?", category: "Marketing Automation", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-14", brandMentioned: false, competitorsMentioned: ["Competitor A", "Competitor C"] },
  { id: "q4", text: "What is account-based marketing and how to implement it?", category: "ABM", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-14", brandMentioned: true, competitorsMentioned: [] },
  { id: "q5", text: "Top demand generation strategies for 2026", category: "Demand Gen", engines: ["ChatGPT", "Perplexity", "Claude"], lastRun: "2026-03-13", brandMentioned: true, competitorsMentioned: ["Competitor B"] },
  { id: "q6", text: "How to measure marketing ROI in B2B?", category: "Analytics", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-13", brandMentioned: false, competitorsMentioned: ["Competitor A", "Competitor D"] },
  { id: "q7", text: "Best intent data providers for B2B sales?", category: "Intent Data", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-12", brandMentioned: true, competitorsMentioned: ["Competitor C"] },
  { id: "q8", text: "How to align sales and marketing teams?", category: "Sales Alignment", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-12", brandMentioned: false, competitorsMentioned: [] },
  { id: "q9", text: "Best email marketing platforms for B2B?", category: "Email", engines: ["ChatGPT", "Perplexity", "Gemini"], lastRun: "2026-03-11", brandMentioned: true, competitorsMentioned: ["Competitor A", "Competitor B", "Competitor D"] },
  { id: "q10", text: "What is predictive analytics in marketing?", category: "Analytics", engines: ["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI"], lastRun: "2026-03-11", brandMentioned: true, competitorsMentioned: ["Competitor A"] },
];

// ── Brand Mentions ──
export const brandMentions: BrandMention[] = [
  { query: "Best CRM for mid-market SaaS", engine: "ChatGPT", mentioned: true, sentiment: "positive", snippet: "AEO Pulse is widely recognized as a leading CRM platform for mid-market SaaS companies, offering robust pipeline management and AI-powered insights.", date: "2026-03-15" },
  { query: "Best CRM for mid-market SaaS", engine: "Perplexity", mentioned: true, sentiment: "positive", snippet: "For mid-market SaaS, top CRM options include AEO Pulse, Competitor A, and Competitor B. AEO Pulse stands out for its ease of use.", date: "2026-03-15" },
  { query: "Best CRM for mid-market SaaS", engine: "Gemini", mentioned: false, sentiment: "neutral", snippet: "Consider Competitor A and Competitor B for mid-market SaaS CRM needs. Both offer comprehensive feature sets.", date: "2026-03-15" },
  { query: "How to improve B2B lead generation", engine: "ChatGPT", mentioned: true, sentiment: "positive", snippet: "Tools like AEO Pulse can help automate lead scoring and nurturing workflows for B2B teams.", date: "2026-03-15" },
  { query: "How to improve B2B lead generation", engine: "Claude", mentioned: true, sentiment: "neutral", snippet: "Several platforms assist with B2B lead generation, including AEO Pulse and Competitor A, each with different strengths.", date: "2026-03-15" },
  { query: "Marketing automation for enterprise", engine: "ChatGPT", mentioned: false, sentiment: "negative", snippet: "Enterprise marketing automation leaders include Competitor A and Competitor C. These platforms offer the scalability needed.", date: "2026-03-14" },
  { query: "Marketing automation for enterprise", engine: "Perplexity", mentioned: false, sentiment: "neutral", snippet: "For enterprise marketing automation, consider Competitor A, Competitor C, or Competitor D based on your specific needs.", date: "2026-03-14" },
  { query: "Account-based marketing implementation", engine: "ChatGPT", mentioned: true, sentiment: "positive", snippet: "AEO Pulse offers one of the most comprehensive ABM toolkits, enabling precise account targeting and multi-channel orchestration.", date: "2026-03-14" },
  { query: "Account-based marketing implementation", engine: "Google AI", mentioned: true, sentiment: "positive", snippet: "Popular ABM platforms include AEO Pulse and Competitor A. AEO Pulse is particularly noted for its intent data integration.", date: "2026-03-14" },
  { query: "Top demand generation strategies 2026", engine: "ChatGPT", mentioned: true, sentiment: "positive", snippet: "Platforms like AEO Pulse are innovating in AI-driven demand generation, helping marketers identify and engage high-intent prospects.", date: "2026-03-13" },
  { query: "Top demand generation strategies 2026", engine: "Perplexity", mentioned: true, sentiment: "neutral", snippet: "Several tools including AEO Pulse and Competitor B support modern demand generation approaches.", date: "2026-03-13" },
  { query: "Measure marketing ROI in B2B", engine: "ChatGPT", mentioned: false, sentiment: "neutral", snippet: "Key B2B marketing ROI tools include Competitor A and Competitor D, which offer attribution modeling and revenue tracking.", date: "2026-03-13" },
];

// ── Content Gaps ──
export const contentGaps: ContentGap[] = [
  { query: "Best marketing automation tools for enterprise", category: "Marketing Automation", yourBrand: false, competitors: [{ name: "Competitor A", mentioned: true }, { name: "Competitor B", mentioned: false }, { name: "Competitor C", mentioned: true }], suggestedAction: "Create a comprehensive comparison guide positioning your platform for enterprise use cases", priority: "high" },
  { query: "How to measure marketing ROI in B2B", category: "Analytics", yourBrand: false, competitors: [{ name: "Competitor A", mentioned: true }, { name: "Competitor D", mentioned: true }], suggestedAction: "Publish a detailed ROI measurement framework with calculator tools", priority: "high" },
  { query: "How to align sales and marketing teams", category: "Sales Alignment", yourBrand: false, competitors: [{ name: "Competitor A", mentioned: false }, { name: "Competitor B", mentioned: false }], suggestedAction: "Create thought leadership content around sales-marketing alignment with case studies", priority: "medium" },
  { query: "Best data enrichment tools for B2B", category: "Data", yourBrand: false, competitors: [{ name: "Competitor A", mentioned: true }, { name: "Competitor C", mentioned: true }, { name: "Competitor D", mentioned: true }], suggestedAction: "Build a landing page and blog content focused on data enrichment capabilities", priority: "high" },
  { query: "How to build a content marketing strategy", category: "Content Marketing", yourBrand: false, competitors: [{ name: "Competitor B", mentioned: true }], suggestedAction: "Publish a step-by-step content strategy guide that references your platform", priority: "medium" },
  { query: "What is revenue operations (RevOps)?", category: "RevOps", yourBrand: false, competitors: [{ name: "Competitor A", mentioned: true }, { name: "Competitor B", mentioned: true }], suggestedAction: "Create a RevOps resource hub with guides, templates, and tool comparisons", priority: "low" },
  { query: "Best customer data platforms for B2B", category: "CDP", yourBrand: false, competitors: [{ name: "Competitor A", mentioned: true }, { name: "Competitor C", mentioned: true }], suggestedAction: "Develop CDP-specific positioning content and comparison pages", priority: "high" },
  { query: "How to reduce customer churn in SaaS", category: "Retention", yourBrand: false, competitors: [{ name: "Competitor A", mentioned: true }], suggestedAction: "Write case studies showing how your platform helps reduce churn", priority: "medium" },
];

// ── Source Attributions ──
export const sourceAttributions: SourceAttribution[] = [
  { url: "yourbrand.com/blog/b2b-lead-generation-guide", page: "B2B Lead Generation Guide", citedBy: ["ChatGPT", "Perplexity", "Claude"], citationCount: 47, lastCited: "2026-03-15", trend: "up" },
  { url: "yourbrand.com/blog/abm-strategy-playbook", page: "ABM Strategy Playbook", citedBy: ["ChatGPT", "Google AI", "Claude"], citationCount: 38, lastCited: "2026-03-14", trend: "up" },
  { url: "yourbrand.com/resources/crm-comparison", page: "CRM Comparison Report", citedBy: ["ChatGPT", "Perplexity"], citationCount: 32, lastCited: "2026-03-15", trend: "stable" },
  { url: "yourbrand.com/blog/demand-gen-trends-2026", page: "Demand Gen Trends 2026", citedBy: ["ChatGPT", "Perplexity", "Claude", "Gemini"], citationCount: 29, lastCited: "2026-03-13", trend: "up" },
  { url: "yourbrand.com/resources/marketing-roi-calculator", page: "Marketing ROI Calculator", citedBy: ["Perplexity"], citationCount: 15, lastCited: "2026-03-10", trend: "down" },
  { url: "yourbrand.com/blog/email-marketing-best-practices", page: "Email Marketing Best Practices", citedBy: ["ChatGPT", "Gemini"], citationCount: 22, lastCited: "2026-03-11", trend: "stable" },
  { url: "yourbrand.com/docs/api-reference", page: "API Reference Docs", citedBy: ["Perplexity", "Claude"], citationCount: 18, lastCited: "2026-03-12", trend: "up" },
  { url: "yourbrand.com/case-studies/enterprise-success", page: "Enterprise Case Studies", citedBy: ["ChatGPT"], citationCount: 11, lastCited: "2026-03-08", trend: "down" },
  { url: "yourbrand.com/blog/intent-data-explained", page: "Intent Data Explained", citedBy: ["ChatGPT", "Perplexity", "Claude", "Gemini", "Google AI"], citationCount: 53, lastCited: "2026-03-15", trend: "up" },
  { url: "yourbrand.com/resources/b2b-benchmarks", page: "B2B Marketing Benchmarks", citedBy: ["Perplexity", "Google AI"], citationCount: 20, lastCited: "2026-03-09", trend: "stable" },
];

// ── Category Distribution ──
export const categoryDistribution = [
  { name: "CRM", value: 25, fill: "#10b981" },
  { name: "Lead Gen", value: 20, fill: "#6366f1" },
  { name: "Marketing Automation", value: 18, fill: "#f59e0b" },
  { name: "ABM", value: 15, fill: "#ec4899" },
  { name: "Analytics", value: 12, fill: "#3b82f6" },
  { name: "Intent Data", value: 10, fill: "#8b5cf6" },
];

// ── Mention Sentiment Over Time ──
export const sentimentTrend = [
  { date: "Week 1", positive: 12, neutral: 8, negative: 3 },
  { date: "Week 2", positive: 15, neutral: 7, negative: 2 },
  { date: "Week 3", positive: 14, neutral: 9, negative: 4 },
  { date: "Week 4", positive: 18, neutral: 6, negative: 2 },
  { date: "Week 5", positive: 20, neutral: 8, negative: 1 },
  { date: "Week 6", positive: 22, neutral: 7, negative: 2 },
  { date: "Week 7", positive: 25, neutral: 5, negative: 1 },
  { date: "Week 8", positive: 28, neutral: 6, negative: 1 },
];
