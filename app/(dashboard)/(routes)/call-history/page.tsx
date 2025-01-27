'use client'

import { useEffect, useState } from "react"
import { CallHistoryTable } from "@/app/(dashboard)/(routes)/call-history/table"
import { CallRecord } from "@/app/(dashboard)/(routes)/call-history/types"

export default function CallHistoryPage() {
  const [callHistory, setCallHistory] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCallHistory = async () => {
      try {
        const response = await fetch('/api/get_call_history')
        if (!response.ok) {
          throw new Error('Failed to fetch call history')
        }
        const data = await response.json()
        setCallHistory(data.data.records)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCallHistory()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-5 px-10">
        <h1 className="text-2xl font-bold mb-5">Call History</h1>
        <div>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-5 px-10">
        <h1 className="text-2xl font-bold mb-5">Call History</h1>
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-5 px-10">
      <h1 className="text-2xl font-bold mb-5">Call History</h1>
      <CallHistoryTable callHistory={callHistory} />
    </div>
  )
}

