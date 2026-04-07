import { prisma } from './prisma'
import { clusterQuery } from './clustering'
import { computeWeightedScore } from './scoring'

// Seeded mock data for deterministic results
// Structure: queryIndex -> engineName -> { winner, companies: [{company, domain, position}] }

interface MockEngineResult {
  winner: string
  companies: { company: string; domain: string; position: number }[]
}

// Returns mock results for a given query text and engine
function getMockResult(queryText: string, engine: string, targetCompany: string, competitors: { company: string; domain: string }[]): MockEngineResult {
  const lower = queryText.toLowerCase()
  const allCompanies = [
    { company: targetCompany, domain: competitors[0]?.domain ? '' : 'descope.com' },
    ...competitors
  ]

  // Descope-specific seeded logic
  // Passwordless / developer queries: Descope wins
  if (lower.includes('passwordless') || lower.includes('developer') || lower.includes('descope')) {
    return {
      winner: targetCompany,
      companies: [
        { company: targetCompany, domain: 'descope.com', position: 1 },
        { company: competitors[0]?.company || 'Okta', domain: competitors[0]?.domain || 'okta.com', position: 2 },
        { company: competitors[1]?.company || 'Auth0', domain: competitors[1]?.domain || 'auth0.com', position: 3 },
      ]
    }
  }

  // Comparison queries: Okta wins
  if (lower.includes('vs') || lower.includes('versus') || lower.includes('compare') || lower.includes('alternative')) {
    if (engine === 'openai') {
      return {
        winner: competitors[1]?.company || 'Auth0',
        companies: [
          { company: competitors[1]?.company || 'Auth0', domain: competitors[1]?.domain || 'auth0.com', position: 1 },
          { company: competitors[0]?.company || 'Okta', domain: competitors[0]?.domain || 'okta.com', position: 2 },
          { company: targetCompany, domain: 'descope.com', position: 3 },
        ]
      }
    }
    return {
      winner: competitors[0]?.company || 'Okta',
      companies: [
        { company: competitors[0]?.company || 'Okta', domain: competitors[0]?.domain || 'okta.com', position: 1 },
        { company: competitors[1]?.company || 'Auth0', domain: competitors[1]?.domain || 'auth0.com', position: 2 },
        { company: targetCompany, domain: 'descope.com', position: 3 },
      ]
    }
  }

  // Enterprise / CIAM / SSO queries: Okta wins
  if (lower.includes('enterprise') || lower.includes('ciam') || lower.includes('sso') || lower.includes('best')) {
    if (engine === 'gemini') {
      return {
        winner: competitors[1]?.company || 'Auth0',
        companies: [
          { company: competitors[1]?.company || 'Auth0', domain: competitors[1]?.domain || 'auth0.com', position: 1 },
          { company: competitors[0]?.company || 'Okta', domain: competitors[0]?.domain || 'okta.com', position: 2 },
          { company: targetCompany, domain: 'descope.com', position: 4 },
        ]
      }
    }
    return {
      winner: competitors[0]?.company || 'Okta',
      companies: [
        { company: competitors[0]?.company || 'Okta', domain: competitors[0]?.domain || 'okta.com', position: 1 },
        { company: competitors[1]?.company || 'Auth0', domain: competitors[1]?.domain || 'auth0.com', position: 2 },
        { company: targetCompany, domain: 'descope.com', position: 3 },
      ]
    }
  }

  // Default: Auth0 wins
  return {
    winner: competitors[1]?.company || 'Auth0',
    companies: [
      { company: competitors[1]?.company || 'Auth0', domain: competitors[1]?.domain || 'auth0.com', position: 1 },
      { company: competitors[0]?.company || 'Okta', domain: competitors[0]?.domain || 'okta.com', position: 2 },
      { company: targetCompany, domain: 'descope.com', position: 3 },
    ]
  }
}

function getLossReasons(queryText: string, cluster: string): string[] {
  const lower = queryText.toLowerCase()
  if (cluster === 'comparison') return ['missing_comparison_content', 'competitor_brand_dominance']
  if (cluster === 'best_tools') return ['weak_entity_association', 'low_authority_citations']
  if (cluster === 'definition') return ['weak_definition_page', 'poor_answer_format']
  if (cluster === 'alternatives') return ['missing_comparison_content', 'no_use_case_page']
  return ['weak_entity_association', 'poor_answer_format']
}

function getRecommendedActions(lossReasons: string[]): string[] {
  const map: Record<string, string> = {
    missing_comparison_content: 'create_comparison_page',
    weak_definition_page: 'create_definition_page',
    low_authority_citations: 'strengthen_topic_authority',
    poor_answer_format: 'improve_structured_formatting',
    weak_entity_association: 'strengthen_topic_authority',
    no_use_case_page: 'create_use_case_page',
    competitor_brand_dominance: 'create_best_of_page',
  }
  return [...new Set(lossReasons.map(r => map[r] || 'strengthen_topic_authority'))]
}

export async function runMockAnalysis(projectId: string): Promise<string> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { competitors: true, queries: true },
  })

  if (!project) throw new Error('Project not found')

  // Create analysis run
  const run = await prisma.analysisRun.create({
    data: {
      projectId,
      mode: 'mock',
      status: 'running',
      startedAt: new Date(),
    }
  })

  try {
    const engines = JSON.parse(project.selectedEngines) as string[]
    const selectedEngines = engines.length > 0 ? engines : ['openai', 'claude', 'gemini']

    // Process each query
    for (const query of project.queries) {
      const cluster = clusterQuery(query.text)

      let targetPresent = false
      let targetFirstMention = false
      let targetPositions: number[] = []
      let winnerCounts: Record<string, number> = {}

      // Process each engine
      for (const engine of selectedEngines) {
        const mockResult = getMockResult(query.text, engine, project.targetCompany, project.competitors)

        // Create answer
        const answer = await prisma.answer.create({
          data: {
            runId: run.id,
            queryId: query.id,
            engine,
            winnerCompany: mockResult.winner,
            normalizedSummary: `${engine} response covering ${mockResult.companies.map(c => c.company).join(', ')}`,
          }
        })

        // Create citations
        for (const comp of mockResult.companies) {
          await prisma.citation.create({
            data: {
              answerId: answer.id,
              company: comp.company,
              domain: comp.domain,
              url: `https://${comp.domain}`,
              position: comp.position,
              isFirstMention: comp.position === 1,
            }
          })
        }

        // Track target stats
        const targetEntry = mockResult.companies.find(c => c.company === project.targetCompany)
        if (targetEntry) {
          targetPresent = true
          targetPositions.push(targetEntry.position)
          if (targetEntry.position === 1) targetFirstMention = true
        }

        winnerCounts[mockResult.winner] = (winnerCounts[mockResult.winner] || 0) + 1
      }

      // Determine query-level winner
      const queryWinner = Object.entries(winnerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
      const avgPos = targetPositions.length > 0 ? targetPositions.reduce((a, b) => a + b, 0) / targetPositions.length : 0

      const isTargetWinning = queryWinner === project.targetCompany
      const lossReasons = isTargetWinning ? [] : getLossReasons(query.text, cluster)
      const actions = isTargetWinning ? [] : getRecommendedActions(lossReasons)

      // Create query result
      await prisma.queryResult.create({
        data: {
          runId: run.id,
          queryId: query.id,
          targetPresent,
          targetFirstMention,
          targetAvgPosition: avgPos,
          winnerCompany: queryWinner,
          lossReasonsJson: JSON.stringify(lossReasons),
          recommendedActionsJson: JSON.stringify(actions),
          cluster,
        }
      })
    }

    // Generate top-level recommendations
    const recommendations = [
      {
        title: `${project.targetCompany} vs Auth0 vs Okta — Complete Comparison`,
        priority: 1,
        type: 'create',
        pageType: 'comparison',
        suggestedFormat: 'Comparison table + FAQ',
        rationale: 'Comparison queries drive the highest loss rate. A structured comparison page with feature table and FAQ would directly improve visibility on these queries.',
        outlineJson: JSON.stringify([
          'Introduction — who each platform is for',
          'Feature comparison table',
          'Passwordless authentication support',
          'Enterprise readiness',
          'Developer experience',
          'Pricing and packaging',
          'FAQ section',
        ]),
      },
      {
        title: `Best Authentication Platforms for Enterprises — ${new Date().getFullYear()} Guide`,
        priority: 2,
        type: 'create',
        pageType: 'best_of',
        suggestedFormat: 'Ranked list + criteria table',
        rationale: 'Best-of queries for enterprise auth show low target presence. A comprehensive best-of guide mentioning evaluation criteria would improve citation rate.',
        outlineJson: JSON.stringify([
          'What to look for in enterprise auth',
          'Top platforms overview',
          'Side-by-side criteria table',
          `Why choose ${project.targetCompany}`,
          'Implementation considerations',
          'FAQ',
        ]),
      },
      {
        title: 'What is Passwordless Authentication? Complete Guide',
        priority: 3,
        type: 'create',
        pageType: 'definition',
        suggestedFormat: 'Explainer + FAQ',
        rationale: `${project.targetCompany} wins passwordless queries but lacks strong definition content. A comprehensive definition page would reinforce authority.`,
        outlineJson: JSON.stringify([
          'What is passwordless authentication',
          'How it works (FIDO2, passkeys, magic links)',
          'Benefits over password-based auth',
          'Implementation approaches',
          `How ${project.targetCompany} enables passwordless`,
          'FAQ',
        ]),
      },
      {
        title: `Best Auth0 Alternatives in ${new Date().getFullYear()}`,
        priority: 4,
        type: 'create',
        pageType: 'alternatives',
        suggestedFormat: 'Comparison cards + table',
        rationale: 'Alternatives queries are high-intent and currently won by competitors. An alternatives page positions the target as the obvious choice.',
        outlineJson: JSON.stringify([
          'Why teams switch from Auth0',
          'Top alternatives overview',
          `${project.targetCompany} as Auth0 alternative`,
          'Feature comparison',
          'Migration guide overview',
          'FAQ',
        ]),
      },
      {
        title: `${project.targetCompany} for Developers — Integration Guide`,
        priority: 5,
        type: 'improve',
        pageType: 'use_case',
        suggestedFormat: 'Code examples + step-by-step',
        rationale: 'Developer-oriented queries show high target presence. Strengthening integration documentation would improve citation rate on use case queries.',
        outlineJson: JSON.stringify([
          'Quick start guide',
          'SDK installation',
          'Authentication flows with code examples',
          'Customization options',
          'Production checklist',
          'Developer FAQ',
        ]),
      },
    ]

    for (const rec of recommendations) {
      await prisma.recommendation.create({
        data: { runId: run.id, ...rec }
      })
    }

    // Mark run complete
    await prisma.analysisRun.update({
      where: { id: run.id },
      data: { status: 'completed', completedAt: new Date() }
    })

    return run.id
  } catch (err) {
    await prisma.analysisRun.update({
      where: { id: run.id },
      data: { status: 'failed' }
    })
    throw err
  }
}
