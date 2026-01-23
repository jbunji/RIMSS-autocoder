import { ClockIcon } from '@heroicons/react/24/outline'

// Status change interface
interface StatusChange {
  history_id: number
  timestamp: string
  old_status: string | null
  new_status: string
  old_status_name: string | null
  new_status_name: string
  username: string
  user_full_name: string
  notes?: string
}

interface StatusTimelineProps {
  statusChanges: StatusChange[]
  currentStatus: string
  currentStatusName: string
}

/**
 * StatusTimeline - Visual timeline showing status change history
 *
 * Displays chronological status changes as nodes on a vertical timeline,
 * with dates, previous status, new status, and optional notes.
 * Uses status-appropriate colors for each node.
 */
export default function StatusTimeline({ statusChanges, currentStatus, currentStatusName }: StatusTimelineProps) {
  // Get color class based on status code
  const getStatusColor = (statusCd: string) => {
    if (statusCd === 'FMC') return 'green'
    if (statusCd === 'PMC') return 'blue'
    if (['NMCM', 'NMCS', 'NMCB'].includes(statusCd)) return 'red'
    return 'gray'
  }

  // Get timeline node border and background colors
  const getStatusStyles = (statusCd: string) => {
    const color = getStatusColor(statusCd)
    const styles = {
      green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        dot: 'bg-green-500',
        line: 'bg-green-200'
      },
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
        line: 'bg-blue-200'
      },
      red: {
        border: 'border-red-500',
        bg: 'bg-red-50',
        text: 'text-red-700',
        dot: 'bg-red-500',
        line: 'bg-red-200'
      },
      gray: {
        border: 'border-gray-500',
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        dot: 'bg-gray-500',
        line: 'bg-gray-200'
      }
    }
    return styles[color as keyof typeof styles]
  }

  // No status changes yet
  if (statusChanges.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-500">No status change history available</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline nodes */}
        <div className="space-y-6">
          {statusChanges.map((change, index) => {
            const styles = getStatusStyles(change.new_status)
            const isLatest = index === 0

            return (
              <div key={change.history_id} className="relative pl-10">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full ${styles.dot} border-4 border-white shadow-sm flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full bg-white`}></div>
                </div>

                {/* Timeline card */}
                <div className={`rounded-lg border-l-4 ${styles.border} ${styles.bg} p-4 shadow-sm`}>
                  {/* Header with date and status badge */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${styles.text}`}>
                          {change.new_status}
                        </span>
                        {isLatest && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {change.new_status_name}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(change.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Status change indicator */}
                  {change.old_status && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusStyles(change.old_status).bg} ${getStatusStyles(change.old_status).text}`}>
                        {change.old_status}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles.bg} ${styles.text}`}>
                        {change.new_status}
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {change.notes && (
                    <div className="mt-2 p-2 bg-white bg-opacity-60 rounded text-sm text-gray-700 border border-gray-200">
                      <span className="font-medium text-gray-600">Note: </span>
                      {change.notes}
                    </div>
                  )}

                  {/* User info */}
                  <div className="mt-2 text-xs text-gray-500">
                    By {change.user_full_name} ({change.username})
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current status summary at bottom */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Current Status</p>
            <p className="text-lg font-bold text-blue-900 mt-1">
              {currentStatus} - {currentStatusName}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusStyles(currentStatus).dot}`}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Helper function to extract status changes from asset history
 */
export function extractStatusChanges(history: any[]): StatusChange[] {
  const statusChanges: StatusChange[] = []

  for (const entry of history) {
    // Look for status_cd field in changes
    const statusChange = entry.changes?.find((c: any) => c.field === 'status_cd')

    if (statusChange) {
      statusChanges.push({
        history_id: entry.history_id,
        timestamp: entry.timestamp,
        old_status: statusChange.old_value,
        new_status: statusChange.new_value,
        old_status_name: entry.changes?.find((c: any) => c.field === 'status_name')?.old_value || null,
        new_status_name: entry.changes?.find((c: any) => c.field === 'status_name')?.new_value || statusChange.new_value,
        username: entry.username,
        user_full_name: entry.user_full_name,
        notes: entry.description
      })
    }
  }

  // Sort by timestamp descending (newest first)
  return statusChanges.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}
