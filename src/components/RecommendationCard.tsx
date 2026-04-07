import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { FileText } from 'lucide-react'

interface RecommendationCardProps {
  title: string
  priority: number
  type: string
  pageType: string
  suggestedFormat: string
  rationale: string
  outline: string[]
  className?: string
}

const PAGE_TYPE_LABELS: Record<string, string> = {
  comparison: 'Comparison',
  best_of: 'Best-of List',
  alternatives: 'Alternatives',
  definition: 'Definition',
  use_case: 'Use Case',
  integration: 'Integration',
}

export function RecommendationCard({
  title,
  priority,
  type,
  pageType,
  suggestedFormat,
  rationale,
  outline,
  className,
}: RecommendationCardProps) {
  return (
    <div className={cn('bg-white border border-gray-200 rounded-xl p-5', className)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 w-6">#{priority}</span>
          <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge variant={type === 'create' ? 'info' : 'purple'}>
            {type === 'create' ? 'Create' : 'Improve'}
          </Badge>
          <Badge variant="default">{PAGE_TYPE_LABELS[pageType] || pageType}</Badge>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <FileText size={12} />
        <span>{suggestedFormat}</span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{rationale}</p>

      {outline.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Suggested outline</p>
          <ol className="space-y-1">
            {outline.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-gray-300 font-mono text-xs mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
