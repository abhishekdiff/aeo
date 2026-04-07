import Link from 'next/link'
import { BarChart3, Home } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
            <BarChart3 size={20} className="text-blue-600" />
            <span className="font-bold text-sm tracking-tight">AEO Copilot</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/projects" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5">
              <Home size={14} />
              Projects
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
