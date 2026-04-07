import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const queries = await prisma.query.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(queries)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch queries' }, { status: 500 })
  }
}

const AddQuerySchema = z.object({
  text: z.string().min(1),
  cluster: z.string().optional(),
  intent: z.string().optional(),
  weight: z.number().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const data = AddQuerySchema.parse(body)
    const { clusterQuery } = await import('@/lib/clustering')

    const query = await prisma.query.create({
      data: {
        projectId: id,
        text: data.text,
        cluster: data.cluster || clusterQuery(data.text),
        intent: data.intent || 'informational',
        weight: data.weight || 1.0,
      },
    })
    return NextResponse.json(query, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to add query' }, { status: 500 })
  }
}
