'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Play, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { CLUSTER_LABELS } from '@/lib/clustering'

interface Project {
  id: string
  name: string
  targetCompany: string
  targetDomain: string
  selectedEngines: string
  competitors: { id: string; company: string; domain: string }[]
  queries: { id: string; text: string; cluster: string; weight: number }[]
  runs: { id: string; status: string; createdAt: string }[]
}

export default function SetupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(setProject)
      .catch(() => setError('Failed to load project'))
      .finally(() => setLoading(false))
  }, [id])

  async function runAnalysis() {
    setRunning(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${id}/run-analysis`, { method: 'POST' })
      if (!res.ok) throw new Error('Analysis failed')
      router.push(`/projects/${id}/results`)
    } catch {
      setError('Analysis failed. Please try again.')
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    )
  }

  if (!project) {
    return (
      <AppShell>
        <p className="text-red-600">Project not found.</p>
      </AppShell>
    )
  }

  const engines: string[] = JSON.parse(project.selectedEngines)
  const latestRun = project.runs[0]

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Project setup</p>
          </div>
        </div>
        <button
          onClick={runAnalysis}
          disabled={running}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {running ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running analysis...
            </>
          ) : latestRun?.status === 'completed' ? (
            <>
              <RotateCcw size={16} />
              Re-run Analysis
            </>
          ) : (
            <>
              <Play size={16} />
              Run Analysis
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {latestRun?.status === 'completed' && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
          <span>Analysis complete.</span>
          <Link href={`/projects/${id}/results`} className="font-medium underline">View results →</Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Target */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Target Company</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Company</span>
              <span className="font-medium text-gray-900">{project.targetCompany}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Domain</span>
              <span className="font-medium text-gray-900">{project.targetDomain}</span>
            </div>
          </div>
        </div>

        {/* Engines */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">AI Engines</h2>
          <div className="flex flex-wrap gap-2">
            {engines.map(engine => (
              <Badge key={engine} variant="info" className="capitalize">{engine}</Badge>
            ))}
          </div>
        </div>

        {/* Competitors */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Competitors ({project.competitors.length})</h2>
          <div className="space-y-2">
            {project.competitors.map(comp => (
              <div key={comp.id} className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{comp.company}</span>
                <span className="text-gray-400">{comp.domain}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Queries */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Questions ({project.queries.length})</h2>
          <ul className="space-y-2">
            {project.queries.map(query => (
              <li key={query.id} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5">
                  <Badge variant="default">{CLUSTER_LABELS[query.cluster as keyof typeof CLUSTER_LABELS] || query.cluster}</Badge>
                </span>
                <span className="text-gray-700">{query.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  )
}
