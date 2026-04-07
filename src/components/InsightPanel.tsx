import { cn } from '@/lib/utils'
import { TrendingUp, AlertCircle, Lightbulb } from 'lucide-react'

interface InsightPanelProps {
  executiveSummary: string
  contentGapSummary: string
  biggestGapClusterLabel: string
  topLossReasons: { reason: string; label: string; count: number }[]
  topOpportunityThemes: string[]
  className?: string
}

export function InsightPanel({
  executiveSummary,
  contentGapSummary,
  biggestGapClusterLabel,
  topLossReasons,
  topOpportunityThemes,
  className,
}: InsightPanelProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-4', className)}>
      <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-blue-600" />
          <p className="text-sm font-semibold text-blue-900">Executive Summary</p>
        </div>
        <p className="text-sm text-blue-800 mb-3">{executiveSummary}</p>
        <p className="text-sm text-blue-700">{contentGapSummary}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={14} className="text-red-500" />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Top Loss Reasons</p>
          </div>
          <div className="space-y-2">
            {topLossReasons.map(lr => (
              <div key={lr.reason} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{lr.label}</span>
                <span className="text-xs font-semibold text-red-600">{lr.count}x</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} className="text-yellow-500" />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Top Opportunities</p>
          </div>
          <ul className="space-y-1.5">
            {topOpportunityThemes.map(theme => (
              <li key={theme} className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-1 h-1 rounded-full bg-yellow-400 flex-shrink-0" />
                {theme}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
