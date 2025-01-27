'use client'

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/metric-card"
import { CallDistributionChart } from "@/components/call-distribution-chart"
import { CallVolumeChart } from "@/components/call-volume-chart"
import { processCallData } from "@/app/(dashboard)/utils"
import { CallRecord } from "@/app/(dashboard)/(routes)/call-history/types"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    callsToday: 0,
    callsThisWeek: 0,
    callsThisMonth: 0,
    totalMinutes: 0,
    callDistribution: { morning: 0, afternoon: 0, evening: 0, night: 0 },
    callVolume: [0, 0, 0, 0, 0, 0, 0]
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get_call_history')
        if (!response.ok) {
          throw new Error('Failed to fetch call data')
        }
        const data = await response.json()
        const processedStats = processCallData(data.data.records)
        setStats(processedStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 py-5 px-10">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-5 px-10 text-red-500">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-10">
      <header>
        <div className="container mx-auto mb-5">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>
 
      <main className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          <MetricCard title="Calls Accepted Today" value={stats.callsToday.toString()} />
          <MetricCard title="Calls Accepted This Week" value={stats.callsThisWeek.toString()} />
          <MetricCard title="Calls Accepted This Month" value={stats.callsThisMonth.toString()} />
          <MetricCard title="Avg Monthly Call Minutes" value={stats.totalMinutes.toFixed(2)} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          <CallDistributionChart data={stats.callDistribution} />
          <CallVolumeChart data={stats.callVolume} />
        </div>
      </main>
    </div>
  )
}

