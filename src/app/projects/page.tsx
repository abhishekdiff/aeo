import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { AppShell } from '@/components/AppShell'
import { formatDateTime } from '@/lib/formatters'
import { Plus, BarChart2, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
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

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your AEO audit projects</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart2 size={28} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h2>
          <p className="text-gray-500 text-sm mb-6">Create your first AEO audit project to get started.</p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            New Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => {
            const latestRun = project.runs[0]
            const hasResults = latestRun?.status === 'completed'
            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {project.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">{project.targetCompany} · {project.targetDomain}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    hasResults
                      ? 'bg-green-50 text-green-700'
                      : latestRun?.status === 'running'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {hasResults ? 'Analyzed' : latestRun?.status === 'running' ? 'Running' : 'Not run'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span>{project._count.queries} queries</span>
                  <span>{project.competitors.length} competitors</span>
                  {latestRun && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {formatDateTime(latestRun.createdAt)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/projects/${project.id}/setup`}
                    className="flex-1 text-center text-xs font-medium px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Setup
                  </Link>
                  {hasResults ? (
                    <Link
                      href={`/projects/${project.id}/results`}
                      className="flex-1 text-center text-xs font-medium px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Results
                    </Link>
                  ) : (
                    <Link
                      href={`/projects/${project.id}/setup`}
                      className="flex-1 text-center text-xs font-medium px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Run Analysis
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
