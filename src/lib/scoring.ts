// Deterministic scoring logic for AEO results

export interface CompanyScore {
  company: string
  domain: string
  presence: number       // 0-100
  citationRate: number   // 0-100
  firstMention: number   // 0-100
  avgPosition: number    // 1-N (lower is better)
  coMentions: number
  citations: number
  weightedScore: number  // 0-100
  engines: string[]
  winCount: number
}

export function computeWeightedScore(presence: number, citationRate: number, firstMention: number): number {
  return 0.4 * presence + 0.3 * citationRate + 0.3 * firstMention
}

export const LOSS_REASON_LABELS: Record<string, string> = {
  missing_comparison_content: 'Missing comparison content',
  weak_definition_page: 'Weak definition/category page',
  low_authority_citations: 'Low authority citations',
  poor_answer_format: 'Poor answer format',
  weak_entity_association: 'Weak entity association',
  no_use_case_page: 'No use case page',
  competitor_brand_dominance: 'Competitor brand dominance',
}

export const ACTION_LABELS: Record<string, string> = {
  create_comparison_page: 'Create comparison page',
  create_definition_page: 'Create definition/category page',
  create_best_of_page: 'Create best-of list page',
  create_use_case_page: 'Create use case page',
  add_faq_section: 'Add FAQ section',
  improve_structured_formatting: 'Improve structured formatting',
  strengthen_topic_authority: 'Strengthen topic authority',
  publish_integration_page: 'Publish integration page',
}
