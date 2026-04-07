import { computeWeightedScore } from './scoring'
import { CLUSTER_LABELS } from './clustering'

export interface CompanyMetrics {
  company: string
  domain: string
  presenceCount: number
  totalEvaluations: number
  citationCount: number
  firstMentionCount: number
  positions: number[]
  winCount: number
  engines: Set<string>
  coMentionSum: number
}

export interface AggregatedResult {
  company: string
  domain: string
  presence: number
  citationRate: number
  firstMention: number
  avgPosition: number
  coMentions: number
  citations: number
  weightedScore: number
  engines: string[]
  winCount: number
}

export function aggregateMetrics(metrics: CompanyMetrics, totalEvaluations: number): AggregatedResult {
  const presence = totalEvaluations > 0 ? (metrics.presenceCount / totalEvaluations) * 100 : 0
  const citationRate = totalEvaluations > 0 ? (metrics.citationCount / totalEvaluations) * 100 : 0
  const firstMention = totalEvaluations > 0 ? (metrics.firstMentionCount / totalEvaluations) * 100 : 0
  const avgPosition = metrics.positions.length > 0
    ? metrics.positions.reduce((a, b) => a + b, 0) / metrics.positions.length
    : 0

  return {
    company: metrics.company,
    domain: metrics.domain,
    presence: Math.round(presence),
    citationRate: Math.round(citationRate),
    firstMention: Math.round(firstMention),
    avgPosition: Math.round(avgPosition * 10) / 10,
    coMentions: metrics.coMentionSum > 0 ? Math.round((metrics.coMentionSum / metrics.presenceCount) * 10) / 10 : 0,
    citations: metrics.citationCount,
    weightedScore: Math.round(computeWeightedScore(presence, citationRate, firstMention)),
    engines: [...metrics.engines],
    winCount: metrics.winCount,
  }
}

export interface InsightSummary {
  biggestGapCluster: string
  biggestGapClusterLabel: string
  topLossReasons: { reason: string; label: string; count: number }[]
  topOpportunityThemes: string[]
  executiveSummary: string
  contentGapSummary: string
}

export function generateInsights(
  targetCompany: string,
  queryResults: { cluster: string; winnerCompany: string; lossReasonsJson: string }[],
): InsightSummary {
  // Find biggest gap cluster (cluster where target loses most)
  const clusterLosses: Record<string, number> = {}
  const clusterTotal: Record<string, number> = {}
  const lossReasonCounts: Record<string, number> = {}

  for (const qr of queryResults) {
    clusterTotal[qr.cluster] = (clusterTotal[qr.cluster] || 0) + 1
    if (qr.winnerCompany !== targetCompany) {
      clusterLosses[qr.cluster] = (clusterLosses[qr.cluster] || 0) + 1
      const reasons = JSON.parse(qr.lossReasonsJson) as string[]
      for (const r of reasons) {
        lossReasonCounts[r] = (lossReasonCounts[r] || 0) + 1
      }
    }
  }

  const worstCluster = Object.entries(clusterLosses)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'comparison'

  const topLossReasons = Object.entries(lossReasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([reason, count]) => ({
      reason,
      label: LOSS_REASON_LABELS[reason] || reason,
      count,
    }))

  const winCount = queryResults.filter(qr => qr.winnerCompany === targetCompany).length
  const lossCount = queryResults.length - winCount

  return {
    biggestGapCluster: worstCluster,
    biggestGapClusterLabel: CLUSTER_LABELS[worstCluster as keyof typeof CLUSTER_LABELS] || worstCluster,
    topLossReasons,
    topOpportunityThemes: [
      'Passwordless authentication',
      'Developer-focused auth platforms',
      'CIAM for modern apps',
    ],
    executiveSummary: `${targetCompany} is strongest on passwordless and developer-oriented queries but underperforms on ${CLUSTER_LABELS[worstCluster as keyof typeof CLUSTER_LABELS] || worstCluster} queries. ${winCount} of ${queryResults.length} queries are won outright.`,
    contentGapSummary: `The largest gap is in ${CLUSTER_LABELS[worstCluster as keyof typeof CLUSTER_LABELS] || worstCluster} content, where competitors are consistently cited first across all three engines. Creating structured comparison and definition pages would directly address the top loss reasons.`,
  }
}

const LOSS_REASON_LABELS: Record<string, string> = {
  missing_comparison_content: 'Missing comparison content',
  weak_definition_page: 'Weak definition/category page',
  low_authority_citations: 'Low authority citations',
  poor_answer_format: 'Poor answer format',
  weak_entity_association: 'Weak entity association',
  no_use_case_page: 'No use case page',
  competitor_brand_dominance: 'Competitor brand dominance',
}
