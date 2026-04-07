import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { aggregateMetrics, generateInsights } from '@/lib/insights'
import type { CompanyMetrics } from '@/lib/insights'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        competitors: true,
        queries: true,
        runs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            queryResults: {
              include: { query: true },
            },
            answers: {
              include: { citations: true },
            },
            recommendations: {
              orderBy: { priority: 'asc' },
            },
          },
        },
      },
    })

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const latestRun = project.runs[0]
    if (!latestRun) return NextResponse.json({ hasRun: false, project })

    // Aggregate metrics per company
    const allCompanies = [
      { company: project.targetCompany, domain: project.targetDomain },
      ...project.competitors.map(c => ({ company: c.company, domain: c.domain })),
    ]

    const engines = JSON.parse(project.selectedEngines) as string[]
    const totalEvaluations = project.queries.length * engines.length

    const metricsMap = new Map<string, CompanyMetrics>()
    for (const co of allCompanies) {
      metricsMap.set(co.company, {
        company: co.company,
        domain: co.domain,
        presenceCount: 0,
        totalEvaluations,
        citationCount: 0,
        firstMentionCount: 0,
        positions: [],
        winCount: 0,
        engines: new Set(),
        coMentionSum: 0,
      })
    }

    // Process answers + citations
    for (const answer of latestRun.answers) {
      const companiesInAnswer = new Set<string>()
      for (const citation of answer.citations) {
        companiesInAnswer.add(citation.company)
        const m = metricsMap.get(citation.company)
        if (m) {
          m.presenceCount++
          m.citationCount++
          m.positions.push(citation.position)
          if (citation.isFirstMention) m.firstMentionCount++
          m.engines.add(answer.engine)
        }
      }
      // Co-mentions: for each company present, count others also present
      for (const company of companiesInAnswer) {
        const m = metricsMap.get(company)
        if (m) {
          m.coMentionSum += companiesInAnswer.size - 1
        }
      }
    }

    // Process query results for win counts
    for (const qr of latestRun.queryResults) {
      const m = metricsMap.get(qr.winnerCompany)
      if (m) m.winCount++
    }

    const aggregated = allCompanies.map(co => {
      const m = metricsMap.get(co.company)!
      return aggregateMetrics(m, totalEvaluations)
    })

    const targetMetrics = aggregated.find(a => a.company === project.targetCompany)

    // Generate insights
    const insights = generateInsights(
      project.targetCompany,
      latestRun.queryResults.map(qr => ({
        cluster: qr.cluster,
        winnerCompany: qr.winnerCompany,
        lossReasonsJson: qr.lossReasonsJson,
      }))
    )

    // Cluster breakdown
    const clusterStats: Record<string, { total: number; wins: number; queries: string[] }> = {}
    for (const qr of latestRun.queryResults) {
      if (!clusterStats[qr.cluster]) {
        clusterStats[qr.cluster] = { total: 0, wins: 0, queries: [] }
      }
      clusterStats[qr.cluster].total++
      clusterStats[qr.cluster].queries.push(qr.query.text)
      if (qr.winnerCompany === project.targetCompany) {
        clusterStats[qr.cluster].wins++
      }
    }

    return NextResponse.json({
      hasRun: true,
      project: {
        id: project.id,
        name: project.name,
        targetCompany: project.targetCompany,
        targetDomain: project.targetDomain,
        selectedEngines: JSON.parse(project.selectedEngines),
        competitors: project.competitors,
      },
      run: {
        id: latestRun.id,
        status: latestRun.status,
        startedAt: latestRun.startedAt,
        completedAt: latestRun.completedAt,
      },
      summary: {
        totalQuestions: project.queries.length,
        weightedScore: targetMetrics?.weightedScore || 0,
        winningQuestions: targetMetrics?.winCount || 0,
        engines: engines,
      },
      shareOfVoice: aggregated,
      queryResults: latestRun.queryResults.map(qr => ({
        id: qr.id,
        queryId: qr.queryId,
        queryText: qr.query.text,
        cluster: qr.cluster,
        targetPresent: qr.targetPresent,
        targetFirstMention: qr.targetFirstMention,
        targetAvgPosition: qr.targetAvgPosition,
        winnerCompany: qr.winnerCompany,
        lossReasons: JSON.parse(qr.lossReasonsJson),
        recommendedActions: JSON.parse(qr.recommendedActionsJson),
      })),
      recommendations: latestRun.recommendations.map(r => ({
        id: r.id,
        title: r.title,
        priority: r.priority,
        type: r.type,
        pageType: r.pageType,
        suggestedFormat: r.suggestedFormat,
        rationale: r.rationale,
        outline: JSON.parse(r.outlineJson),
      })),
      insights,
      clusterStats,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}
