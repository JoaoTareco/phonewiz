'use client'

import { useEffect, useState } from "react"
import { CallHistoryTable } from "@/app/(dashboard)/(routes)/call-history/table"
import { CallRecord } from "@/app/(dashboard)/(routes)/call-history/types"
import { Heading } from "@/components/heading"
import { Phone } from "lucide-react"
import { Loader } from "@/components/loader"

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
    
        
      <Loader/>
      
       
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-5 px-10">
        <Heading title={"Call History"} description={"View full list of completed calls"} icon={Phone}></Heading>
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-10">
      <Heading title={"Call History"} description={"View full list of completed calls"} icon={Phone}></Heading>
      <div className="px-10"><CallHistoryTable callHistory={callHistory} /></div>
      
    </div>
  )
}

