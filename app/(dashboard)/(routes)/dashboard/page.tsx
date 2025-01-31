'use client'

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartComponent, LineChartComponent } from "@/components/ui/chart"
import { processCallData } from "@/app/(dashboard)/utils"
import { CallRecord } from "@/app/(dashboard)/(routes)/call-history/types"
import { Heading } from "@/components/heading"
import { TrendingUp } from "lucide-react"
import { Separator } from "@radix-ui/react-select"
import { Loader } from "@/components/loader"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    callsToday: 0,
    callsThisWeek: 0,
    callsThisMonth: 0,
    totalMinutes: 0,
    callDistribution: { morning: 0, afternoon: 0, evening: 0, night: 0 },
    callVolume: Array(31).fill(0)
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

  const formatDistributionData = (distribution: { 
    morning: number, 
    afternoon: number, 
    evening: number, 
    night: number 
  }) => {
    return [
      { name: "Morning", value: distribution.morning },
      { name: "Afternoon", value: distribution.afternoon },
      { name: "Evening", value: distribution.evening },
      { name: "Night", value: distribution.night },
    ]
  }

  const formatVolumeData = (volume: number[]) => {
    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const formattedData = Array.from({ length: daysInMonth }, (_, i) => ({
      name: (i + 1).toString(),
      value: volume[i] || 0,
    }));
    
    console.log('Formatted volume data:', formattedData);
    return formattedData;
  }

  if (loading) {
    return <Loader/>
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 py-5 px-10 text-red-500">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-10">
      <Heading title={"Dashboard"} description={"Overview of your calls"} icon={TrendingUp}></Heading>

 
      <main className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          <MetricCard title="Calls Accepted Today" value={stats.callsToday.toString()} />
          <MetricCard title="Calls Accepted This Week" value={stats.callsThisWeek.toString()} />
          <MetricCard title="Calls Accepted This Month" value={stats.callsThisMonth.toString()} />
          <MetricCard title="Avg Monthly Call Minutes" value={Math.round(stats.totalMinutes).toString()} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Call Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent data={formatDistributionData(stats.callDistribution)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Daily Calls This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChartComponent data={formatVolumeData(stats.callVolume)} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

