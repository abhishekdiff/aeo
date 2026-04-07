export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatScore(value: number): string {
  return `${Math.round(value)}%`
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-green-700 bg-green-50 border-green-200'
    case 'running': return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    case 'failed': return 'text-red-700 bg-red-50 border-red-200'
    default: return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}

export function getEngineLabel(engine: string): string {
  switch (engine) {
    case 'openai': return 'OpenAI'
    case 'claude': return 'Claude'
    case 'gemini': return 'Gemini'
    default: return engine
  }
}

export function getEngineColor(engine: string): string {
  switch (engine) {
    case 'openai': return 'bg-green-100 text-green-800'
    case 'claude': return 'bg-orange-100 text-orange-800'
    case 'gemini': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
