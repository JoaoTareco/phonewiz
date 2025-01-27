import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CallRecord } from "@/app/(dashboard)/(routes)/call-history/types"
import { formatDuration } from "@/app/(dashboard)/(routes)/call-history/utils"

interface CallHistoryTableProps {
  callHistory: CallRecord[]
}

export function CallHistoryTable({ callHistory }: CallHistoryTableProps) {
  const extractReason = (summary: string | undefined) => {
    if (!summary) return 'N/A';
    const reasonMatch = summary.match(/Reason: (.*?)(?:\n|$)/);
    return reasonMatch ? reasonMatch[1].trim() : 'N/A';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Caller Name</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Recording</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {callHistory.map((call) => {
          const date = new Date(call.fields['Date/Time Of Call']);
          return (
            <TableRow key={call.recordId}>
              <TableCell>{date.toLocaleDateString()}</TableCell>
              <TableCell>{date.toLocaleTimeString()}</TableCell>
              <TableCell>{call.fields.Name || 'Unknown'}</TableCell>
              <TableCell>{formatDuration(call.fields['Call Duration '] * 60)}</TableCell>
              <TableCell>{extractReason(call.fields.Summary)}</TableCell>
              <TableCell>
                {call.fields['Recording Link'] && (
                  <a 
                    href={call.fields['Recording Link'].text} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Listen
                  </a>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

