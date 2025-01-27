export type CallType = 'inboundPhoneCall' | 'outboundPhoneCall' | 'missedCall'

export interface CallRecord {
  recordId: string
  fields: {
    'Call ID': string
    'Date/Time Of Call': number
    'Call Type': CallType
    'Name': string
    'Call Duration ': number
    'Recording Link'?: {
      text: string
    }
    'Transcript'?: string
    'Summary'?: string
  }
}

export interface CallHistoryResponse {
  code: number
  success: boolean
  message: string
  data: {
    total: number
    pageNum: number
    pageSize: number
    records: CallRecord[]
  }
}

