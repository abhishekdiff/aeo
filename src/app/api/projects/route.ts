import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  targetCompany: z.string().min(1),
  targetDomain: z.string().min(1),
  selectedEngines: z.array(z.string()).default(['openai', 'claude', 'gemini']),
  competitors: z.array(z.object({
    company: z.string().min(1),
    domain: z.string().min(1),
  })).default([]),
  queries: z.array(z.object({
    text: z.string().min(1),
    cluster: z.string().optional(),
    intent: z.string().optional(),
    weight: z.number().optional(),
  })).default([]),
})

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        competitors: true,
        _count: { select: { queries: true } },
        runs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
    return NextResponse.json(projects)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = CreateProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        name: data.name,
        targetCompany: data.targetCompany,
        targetDomain: data.targetDomain,
        selectedEngines: JSON.stringify(data.selectedEngines),
        competitors: {
          create: data.competitors,
        },
        queries: {
          create: data.queries.map(q => ({
            text: q.text,
            cluster: q.cluster || 'best_tools',
            intent: q.intent || 'informational',
            weight: q.weight || 1.0,
          })),
        },
      },
      include: { competitors: true, queries: true },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
