import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const latestRun = await prisma.analysisRun.findFirst({
      where: { projectId: id, status: 'completed' },
      orderBy: { createdAt: 'desc' },
      include: {
        recommendations: { orderBy: { priority: 'asc' } },
      },
    })

    if (!latestRun) return NextResponse.json([])

    return NextResponse.json(latestRun.recommendations.map(r => ({
      id: r.id,
      title: r.title,
      priority: r.priority,
      type: r.type,
      pageType: r.pageType,
      suggestedFormat: r.suggestedFormat,
      rationale: r.rationale,
      outline: JSON.parse(r.outlineJson),
    })))
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}
