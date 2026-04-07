'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { CLUSTER_LABELS } from '@/lib/clustering'
import { LOSS_REASON_LABELS, ACTION_LABELS } from '@/lib/scoring'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface QueryRow {
  id: string
  queryId: string
  queryText: string
  cluster: string
  targetPresent: boolean
  targetFirstMention: boolean
  targetAvgPosition: number
  winnerCompany: string
  lossReasons: string[]
  recommendedActions: string[]
}

interface QueryTableProps {
  rows: QueryRow[]
  targetCompany: string
}

export function QueryTable({ rows, targetCompany }: QueryTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [filterCluster, setFilterCluster] = useState<string>('all')
  const [filterWinner, setFilterWinner] = useState<string>('all')
  const [filterPresent, setFilterPresent] = useState<string>('all')

  const clusters = ['all', ...new Set(rows.map(r => r.cluster))]
  const winners = ['all', ...new Set(rows.map(r => r.winnerCompany))]

  const filtered = rows.filter(r => {
    if (filterCluster !== 'all' && r.cluster !== filterCluster) return false
    if (filterWinner !== 'all' && r.winnerCompany !== filterWinner) return false
    if (filterPresent === 'yes' && !r.targetPresent) return false
    if (filterPresent === 'no' && r.targetPresent) return false
    return true
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterCluster}
          onChange={e => setFilterCluster(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
        >
          {clusters.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All clusters' : CLUSTER_LABELS[c as keyof typeof CLUSTER_LABELS] || c}</option>
          ))}
        </select>
        <select
          value={filterWinner}
          onChange={e => setFilterWinner(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
        >
          {winners.map(w => (
            <option key={w} value={w}>{w === 'all' ? 'All winners' : w}</option>
          ))}
        </select>
        <select
          value={filterPresent}
          onChange={e => setFilterPresent(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700"
        >
          <option value="all">Target: all</option>
          <option value="yes">Target: present</option>
          <option value="no">Target: absent</option>
        </select>
        <span className="text-sm text-gray-400 self-center">{filtered.length} queries</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-500 w-8"></th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Query</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Cluster</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Winner</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">Present</th>
              <th className="text-center py-3 px-4 font-medium text-gray-500">1st Mention</th>
              <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Pos</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const isTarget = row.winnerCompany === targetCompany
              const isExpanded = expandedRow === row.id
              return (
                <React.Fragment key={row.id}>
                  <tr
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setExpandedRow(isExpanded ? null : row.id)}
                  >
                    <td className="py-3 px-4 text-gray-400">
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium max-w-xs">{row.queryText}</td>
                    <td className="py-3 px-4">
                      <Badge variant="default">{CLUSTER_LABELS[row.cluster as keyof typeof CLUSTER_LABELS] || row.cluster}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn('font-medium', isTarget ? 'text-blue-700' : 'text-gray-700')}>
                        {row.winnerCompany}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.targetPresent
                        ? <span className="text-green-600">✓</span>
                        : <span className="text-red-400">✗</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.targetFirstMention
                        ? <span className="text-green-600">✓</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {row.targetAvgPosition > 0 ? `#${row.targetAvgPosition}` : '—'}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${row.id}-expanded`} className="bg-gray-50 border-b border-gray-100">
                      <td colSpan={7} className="px-8 py-4">
                        <div className="grid grid-cols-2 gap-6">
                          {row.lossReasons.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Loss Reasons</p>
                              <ul className="space-y-1">
                                {row.lossReasons.map(r => (
                                  <li key={r} className="flex items-center gap-2 text-sm text-red-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                    {LOSS_REASON_LABELS[r] || r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {row.recommendedActions.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recommended Actions</p>
                              <ul className="space-y-1">
                                {row.recommendedActions.map(a => (
                                  <li key={a} className="flex items-center gap-2 text-sm text-blue-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                    {ACTION_LABELS[a] || a}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {row.lossReasons.length === 0 && (
                            <div className="col-span-2">
                              <p className="text-sm text-green-700 font-medium">✓ Target wins this query</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
