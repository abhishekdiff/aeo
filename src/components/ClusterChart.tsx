'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CLUSTER_LABELS } from '@/lib/clustering'

interface ClusterData {
  cluster: string
  total: number
  wins: number
}

interface ClusterChartProps {
  data: ClusterData[]
  targetCompany: string
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

export function ClusterChart({ data, targetCompany }: ClusterChartProps) {
  const chartData = data.map((d, i) => ({
    name: CLUSTER_LABELS[d.cluster as keyof typeof CLUSTER_LABELS] || d.cluster,
    wins: d.wins,
    losses: d.total - d.wins,
    total: d.total,
    winRate: d.total > 0 ? Math.round((d.wins / d.total) * 100) : 0,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
          formatter={(value, name) => [value, name === 'wins' ? `${targetCompany} wins` : 'Losses']}
        />
        <Bar dataKey="wins" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="wins" />
        <Bar dataKey="losses" stackId="a" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="losses" />
      </BarChart>
    </ResponsiveContainer>
  )
}
