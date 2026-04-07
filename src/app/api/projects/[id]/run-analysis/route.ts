import { NextResponse } from 'next/server'
import { runMockAnalysis } from '@/lib/analysis-runner'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const runId = await runMockAnalysis(id)
    return NextResponse.json({ runId, status: 'completed' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
