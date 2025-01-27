import { CallType } from "@/app/(dashboard)/(routes)/call-history/types"

export function generateMockCallHistory(count: number) {
  const callTypes: CallType[] = ['Incoming', 'Outgoing', 'Missed']
  const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams', 'Charlie Brown']

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toTimeString().split(' ')[0],
    callerName: names[Math.floor(Math.random() * names.length)],
    phoneNumber: `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}`,
    duration: Math.floor(Math.random() * 3600),
    callType: callTypes[Math.floor(Math.random() * callTypes.length)]
  }))
}

