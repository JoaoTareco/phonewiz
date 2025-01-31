import { CallRecord } from "@/app/(dashboard)/(routes)/call-history/types"

export const processCallData = (records: CallRecord[]) => {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const stats = {
    callsToday: 0,
    callsThisWeek: 0,
    callsThisMonth: 0,
    totalMinutes: 0,
    callDistribution: {
      morning: 0,   // 6AM - 12PM
      afternoon: 0, // 12PM - 5PM
      evening: 0,   // 5PM - 9PM
      night: 0      // 9PM - 6AM
    },
    callVolume: new Array(31).fill(0) // Changed to 31 days
  }

  records.forEach(record => {
    const callDate = new Date(record.fields['Date/Time Of Call'])
    const callHour = callDate.getHours()
    const duration = record.fields['Call Duration '] || 0

    // Add to total minutes
    stats.totalMinutes += duration

    // Count calls by period
    if (callDate >= startOfDay) {
      stats.callsToday++
    }
    if (callDate >= startOfWeek) {
      stats.callsThisWeek++
    }
    if (callDate >= startOfMonth) {
      stats.callsThisMonth++
    }

    // Distribution by time of day
    if (callHour >= 6 && callHour < 12) {
      stats.callDistribution.morning++
    } else if (callHour >= 12 && callHour < 17) {
      stats.callDistribution.afternoon++
    } else if (callHour >= 17 && callHour < 21) {
      stats.callDistribution.evening++
    } else {
      stats.callDistribution.night++
    }

    // Call volume for the month
    if (callDate.getMonth() === startOfMonth.getMonth() && 
        callDate.getFullYear() === startOfMonth.getFullYear()) {
      const dayOfMonth = callDate.getDate() - 1 // Convert to 0-based index
      stats.callVolume[dayOfMonth]++
    }
  })

  return stats
} 