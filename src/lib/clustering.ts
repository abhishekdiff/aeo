// Deterministic query clustering using keyword rules

export type ClusterType = 'definition' | 'comparison' | 'best_tools' | 'use_case' | 'integration' | 'alternatives'

const CLUSTER_RULES: { cluster: ClusterType; keywords: string[] }[] = [
  {
    cluster: 'comparison',
    keywords: ['vs', 'versus', 'compare', 'difference between', 'compared to'],
  },
  {
    cluster: 'alternatives',
    keywords: ['alternative', 'alternatives', 'instead of', 'replacement', 'replace'],
  },
  {
    cluster: 'definition',
    keywords: ['what is', 'what are', 'define', 'definition', 'meaning of', 'explain'],
  },
  {
    cluster: 'best_tools',
    keywords: ['best', 'top', 'leading', 'recommended', 'platforms', 'vendors', 'tools', 'solutions'],
  },
  {
    cluster: 'use_case',
    keywords: ['for developers', 'for enterprise', 'for startup', 'use case', 'used for', 'supports', 'how to use'],
  },
  {
    cluster: 'integration',
    keywords: ['integrate', 'integration', 'connect', 'api', 'sdk', 'plugin', 'setup'],
  },
]

export function clusterQuery(queryText: string): ClusterType {
  const lower = queryText.toLowerCase()
  for (const rule of CLUSTER_RULES) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) return rule.cluster
    }
  }
  return 'best_tools'
}

export const CLUSTER_LABELS: Record<ClusterType, string> = {
  definition: 'Definition',
  comparison: 'Comparison',
  best_tools: 'Best Tools',
  use_case: 'Use Case',
  integration: 'Integration',
  alternatives: 'Alternatives',
}
