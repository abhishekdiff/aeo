'use client'
import { useState, useEffect, use } from 'react'
import { AppShell } from '@/components/AppShell'
import { MetricCard } from '@/components/ui/MetricCard'
import { Tabs } from '@/components/ui/Tabs'
import { ShareOfVoiceTable } from '@/components/ShareOfVoiceTable'
import { QueryTable } from '@/components/QueryTable'
import { RecommendationCard } from '@/components/RecommendationCard'
import { InsightPanel } from '@/components/InsightPanel'
import { ClusterChart } from '@/components/ClusterChart'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowLeft, Trophy, Target, Zap, BarChart2, FileText } from 'lucide-react'
import Link from 'next/link'
import { CLUSTER_LABELS } from '@/lib/clustering'

interface ResultsData {
  hasRun: boolean
  project: {
    id: string
    name: string
    targetCompany: string
    targetDomain: string
    selectedEngines: string[]
    competitors: { company: string; domain: string }[]
  }
  run?: { id: string; status: string; completedAt: string }
  summary?: {
    totalQuestions: number
    weightedScore: number
    winningQuestions: number
    engines: string[]
  }
  shareOfVoice?: Array<{
    company: string
    domain: string
    weightedScore: number
    presence: number
    citations: number
    firstMention: number
    engines: string[]
    avgPosition: number
    coMentions: number
    winCount: number
  }>
  queryResults?: Array<{
    id: string
    queryId: string
    queryText: string
    cluster: string
    targetPresent: boolean
    targetFirstMention: boolean
    targetAvgPosition: number
    winnerCompany: string
    lossReasons: string[]
    recommendedActions: string[]
  }>
  recommendations?: Array<{
    id: string
    title: string
    priority: number
    type: string
    pageType: string
    suggestedFormat: string
    rationale: string
    outline: string[]
  }>
  insights?: {
    biggestGapCluster: string
    biggestGapClusterLabel: string
    topLossReasons: { reason: string; label: string; count: number }[]
    topOpportunityThemes: string[]
    executiveSummary: string
    contentGapSummary: string
  }
  clusterStats?: Record<string, { total: number; wins: number; queries: string[] }>
}

const TABS = [
  { id: 'rankings', label: 'Competitor Rankings' },
  { id: 'queries', label: 'Topics & Questions' },
  { id: 'winning', label: 'Winning' },
  { id: 'recommendations', label: 'Recommendations' },
]

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('rankings')

  useEffect(() => {
    fetch(`/api/projects/${id}/results`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    )
  }

  if (!data) {
    return (
      <AppShell>
        <p className="text-red-600">Failed to load results.</p>
      </AppShell>
    )
  }

  if (!data.hasRun) {
    return (
      <AppShell>
        <EmptyState
          title="No analysis run yet"
          description="Run analysis from the setup page to see results."
          action={
            <Link
              href={`/projects/${id}/setup`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Go to Setup
            </Link>
          }
        />
      </AppShell>
    )
  }

  const { project, summary, shareOfVoice, queryResults, recommendations, insights, clusterStats } = data

  const winningQueries = queryResults?.filter(q => q.winnerCompany === project.targetCompany) || []
  const losingQueries = queryResults?.filter(q => q.winnerCompany !== project.targetCompany) || []

  const clusterData = clusterStats
    ? Object.entries(clusterStats).map(([cluster, stats]) => ({ cluster, ...stats }))
    : []

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {project.targetCompany} · {project.targetDomain}
          </p>
        </div>
        <Link
          href={`/projects/${id}/setup`}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
        >
          Setup
        </Link>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Questions"
            value={summary.totalQuestions}
            icon={<FileText size={18} />}
          />
          <MetricCard
            label="Weighted Score"
            value={`${summary.weightedScore}%`}
            subtext={`${project.targetCompany}`}
            icon={<Target size={18} />}
          />
          <MetricCard
            label="Winning Questions"
            value={summary.winningQuestions}
            subtext={`of ${summary.totalQuestions}`}
            icon={<Trophy size={18} />}
          />
          <MetricCard
            label="Engines"
            value={summary.engines.length}
            subtext={summary.engines.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ')}
            icon={<Zap size={18} />}
          />
        </div>
      )}

      {/* Insights panel */}
      {insights && (
        <div className="mb-8">
          <InsightPanel
            executiveSummary={insights.executiveSummary}
            contentGapSummary={insights.contentGapSummary}
            biggestGapClusterLabel={insights.biggestGapClusterLabel}
            topLossReasons={insights.topLossReasons}
            topOpportunityThemes={insights.topOpportunityThemes}
          />
        </div>
      )}

      {/* Tabs */}
      <Tabs tabs={TABS.map(t => {
        const counts: Record<string, number> = {
          rankings: shareOfVoice?.length || 0,
          queries: queryResults?.length || 0,
          winning: winningQueries.length,
          recommendations: recommendations?.length || 0,
        }
        return { ...t, count: counts[t.id] }
      })} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab content */}
      {activeTab === 'rankings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Share of Voice</h3>
              <p className="text-xs text-gray-400 mt-0.5">Weighted score = 40% presence + 30% citation rate + 30% first mention</p>
            </div>
            {shareOfVoice && (
              <ShareOfVoiceTable rows={shareOfVoice} targetCompany={project.targetCompany} />
            )}
          </div>

          {clusterData.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Performance by Cluster</h3>
              <p className="text-xs text-gray-400 mb-4">Queries won by {project.targetCompany} vs. losses per topic cluster</p>
              <ClusterChart data={clusterData} targetCompany={project.targetCompany} />
            </div>
          )}
        </div>
      )}

      {activeTab === 'queries' && queryResults && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">All Queries</h3>
            <p className="text-xs text-gray-400 mt-0.5">Click a row to expand loss reasons and recommended actions</p>
          </div>
          <div className="p-5">
            <QueryTable rows={queryResults} targetCompany={project.targetCompany} />
          </div>
        </div>
      )}

      {activeTab === 'winning' && (
        <div className="space-y-4">
          {winningQueries.length === 0 ? (
            <EmptyState title="No winning queries" description="Run analysis to see where the target company wins." />
          ) : (
            winningQueries.map(q => (
              <div key={q.id} className="bg-white rounded-xl border border-green-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-2">{q.queryText}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Won</Badge>
                      <Badge variant="default">{CLUSTER_LABELS[q.cluster as keyof typeof CLUSTER_LABELS] || q.cluster}</Badge>
                      {q.targetFirstMention && <Badge variant="success">1st Mention</Badge>}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>Avg position</p>
                    <p className="font-semibold text-green-700 text-sm">#{q.targetAvgPosition}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {insights && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
              <p className="text-sm text-amber-800 font-medium">
                Biggest gap: <span className="font-bold">{insights.biggestGapClusterLabel}</span> queries
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Focus content creation here for the highest impact on AEO visibility.
              </p>
            </div>
          )}
          {(recommendations || []).map(rec => (
            <RecommendationCard key={rec.id} {...rec} />
          ))}
        </div>
      )}
    </AppShell>
  )
}
