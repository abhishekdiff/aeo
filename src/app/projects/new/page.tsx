'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { X, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_ENGINES = ['openai', 'claude', 'gemini']
const ENGINE_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  claude: 'Claude',
  gemini: 'Gemini',
}

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [targetCompany, setTargetCompany] = useState('')
  const [targetDomain, setTargetDomain] = useState('')
  const [selectedEngines, setSelectedEngines] = useState<string[]>(['openai', 'claude', 'gemini'])
  const [competitors, setCompetitors] = useState<{ company: string; domain: string }[]>([
    { company: '', domain: '' },
  ])
  const [queryInput, setQueryInput] = useState('')
  const [queries, setQueries] = useState<string[]>([])

  function toggleEngine(engine: string) {
    setSelectedEngines(prev =>
      prev.includes(engine) ? prev.filter(e => e !== engine) : [...prev, engine]
    )
  }

  function addCompetitor() {
    setCompetitors(prev => [...prev, { company: '', domain: '' }])
  }

  function removeCompetitor(index: number) {
    setCompetitors(prev => prev.filter((_, i) => i !== index))
  }

  function updateCompetitor(index: number, field: 'company' | 'domain', value: string) {
    setCompetitors(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c))
  }

  function addQuery() {
    const text = queryInput.trim()
    if (text && !queries.includes(text)) {
      setQueries(prev => [...prev, text])
      setQueryInput('')
    }
  }

  function removeQuery(index: number) {
    setQueries(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const validCompetitors = competitors.filter(c => c.company && c.domain)
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          targetCompany,
          targetDomain,
          selectedEngines,
          competitors: validCompetitors,
          queries: queries.map(text => ({ text })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create project')
      }

      const project = await res.json()
      router.push(`/projects/${project.id}/setup`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
            <p className="text-sm text-gray-500 mt-1">Set up a new AEO audit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic info */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project name</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Descope AEO Audit"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target company</label>
                  <input
                    required
                    value={targetCompany}
                    onChange={e => setTargetCompany(e.target.value)}
                    placeholder="e.g. Descope"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target domain</label>
                  <input
                    required
                    value={targetDomain}
                    onChange={e => setTargetDomain(e.target.value)}
                    placeholder="e.g. descope.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Engines */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">AI Engines</h2>
            <div className="flex gap-3">
              {DEFAULT_ENGINES.map(engine => (
                <button
                  key={engine}
                  type="button"
                  onClick={() => toggleEngine(engine)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectedEngines.includes(engine)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {ENGINE_LABELS[engine]}
                </button>
              ))}
            </div>
          </section>

          {/* Competitors */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Competitors</h2>
            <div className="space-y-3">
              {competitors.map((comp, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={comp.company}
                    onChange={e => updateCompetitor(i, 'company', e.target.value)}
                    placeholder="Company name"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    value={comp.domain}
                    onChange={e => updateCompetitor(i, 'domain', e.target.value)}
                    placeholder="domain.com"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeCompetitor(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCompetitor}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus size={14} />
                Add competitor
              </button>
            </div>
          </section>

          {/* Queries */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Questions</h2>
            <div className="flex gap-2 mb-4">
              <input
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addQuery() } }}
                placeholder="Enter a question and press Enter"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addQuery}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            {queries.length > 0 && (
              <ul className="space-y-2">
                {queries.map((q, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-700">{q}</span>
                    <button
                      type="button"
                      onClick={() => removeQuery(i)}
                      className="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {queries.length === 0 && (
              <p className="text-xs text-gray-400">No questions added yet. Add at least one.</p>
            )}
          </section>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || queries.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
