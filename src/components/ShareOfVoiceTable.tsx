import { cn } from '@/lib/utils'
import { formatPercent } from '@/lib/formatters'

interface CompanyRow {
  company: string
  domain: string
  weightedScore: number
  presence: number
  citations: number
  firstMention: number
  engines: string[]
  avgPosition: number
  coMentions: number
  winCount: number
}

interface ShareOfVoiceTableProps {
  rows: CompanyRow[]
  targetCompany: string
}

export function ShareOfVoiceTable({ rows, targetCompany }: ShareOfVoiceTableProps) {
  const sorted = [...rows].sort((a, b) => b.weightedScore - a.weightedScore)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500 w-8">#</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Score</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Presence</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Citations</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">1st Mention</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Avg Pos</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">Wins</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const isTarget = row.company === targetCompany
            return (
              <tr
                key={row.company}
                className={cn(
                  'border-b border-gray-100 hover:bg-gray-50 transition-colors',
                  isTarget && 'bg-blue-50/50'
                )}
              >
                <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className={cn('font-medium', isTarget ? 'text-blue-700' : 'text-gray-900')}>
                        {row.company}
                        {isTarget && <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">You</span>}
                      </p>
                      <p className="text-xs text-gray-400">{row.domain}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div
                        className={cn('h-1.5 rounded-full', isTarget ? 'bg-blue-500' : 'bg-gray-400')}
                        style={{ width: `${row.weightedScore}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-900 w-12 text-right">{formatPercent(row.weightedScore)}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-gray-700">{formatPercent(row.presence)}</td>
                <td className="py-3 px-4 text-right text-gray-700">{row.citations}</td>
                <td className="py-3 px-4 text-right text-gray-700">{formatPercent(row.firstMention)}</td>
                <td className="py-3 px-4 text-right text-gray-700">{row.avgPosition > 0 ? `#${row.avgPosition}` : '—'}</td>
                <td className="py-3 px-4 text-right text-gray-700 font-medium">{row.winCount}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
