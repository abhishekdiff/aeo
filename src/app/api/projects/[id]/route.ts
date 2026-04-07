import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

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
        queries: { orderBy: { createdAt: 'asc' } },
        runs: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    })
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

const UpdateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  targetCompany: z.string().min(1).optional(),
  targetDomain: z.string().min(1).optional(),
  selectedEngines: z.array(z.string()).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const data = UpdateProjectSchema.parse(body)

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        selectedEngines: data.selectedEngines ? JSON.stringify(data.selectedEngines) : undefined,
      },
    })
    return NextResponse.json(project)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
