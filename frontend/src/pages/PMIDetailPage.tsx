import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface PMIRecord {
  pmi_id: number
  asset_id: number
  asset_sn: string
  asset_name: string
  pmi_type: string
  wuc_cd: string
  next_due_date: string
  days_until_due: number
  completed_date: string | null
  pgm_id: number
  status: 'overdue' | 'due_soon' | 'upcoming' | 'completed'
  interval_days?: number
  linked_event_id?: number | null
}

interface MaintenanceEvent {
  event_id: number
  job_no: string
  discrepancy: string
  asset_sn: string
  asset_name: string
}

// Get color class based on days until due
function getDueDateColorClass(daysUntilDue: number): string {
  if (daysUntilDue < 0) return 'text-red-600' // Overdue
  if (daysUntilDue <= 7) return 'text-red-600' // Red - within 7 days
  if (daysUntilDue <= 30) return 'text-yellow-600' // Yellow - 8-30 days
  return 'text-green-600' // Green - after 30 days
}

function getStatusBadge(daysUntilDue: number): { text: string; bgClass: string; textClass: string } {
  if (daysUntilDue < 0) return { text: 'OVERDUE', bgClass: 'bg-red-100', textClass: 'text-red-800' }
  if (daysUntilDue <= 7) return { text: 'DUE SOON', bgClass: 'bg-red-100', textClass: 'text-red-800' }
  if (daysUntilDue <= 30) return { text: 'UPCOMING', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' }
  return { text: 'SCHEDULED', bgClass: 'bg-green-100', textClass: 'text-green-800' }
}

export default function PMIDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const [pmi, setPmi] = useState<PMIRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Complete PMI Modal State
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0])
  const [linkedEventId, setLinkedEventId] = useState<number | null>(null)
  const [availableEvents, setAvailableEvents] = useState<MaintenanceEvent[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [completeError, setCompleteError] = useState<string | null>(null)

  // Check if user can complete PMI (field technician, depot manager, or admin)
  const canCompletePMI = user?.role && ['FIELD_TECHNICIAN', 'DEPOT_MANAGER', 'ADMIN'].includes(user.role)

  useEffect(() => {
    const fetchPMI = async () => {
      if (!token || !id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/pmi/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('PMI record not found')
          }
          if (response.status === 403) {
            throw new Error('You do not have access to this PMI record')
          }
          throw new Error('Failed to fetch PMI details')
        }

        const data = await response.json()
        setPmi(data.pmi)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPMI()
  }, [token, id])

  // Fetch available maintenance events when modal opens
  const fetchMaintenanceEvents = async () => {
    if (!token) return

    setLoadingEvents(true)
    try {
      const response = await fetch('http://localhost:3001/api/events?status=open&limit=50', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableEvents(data.events || [])
      }
    } catch (err) {
      console.error('Failed to fetch maintenance events:', err)
    } finally {
      setLoadingEvents(false)
    }
  }

  const openCompleteModal = () => {
    setCompletionDate(new Date().toISOString().split('T')[0])
    setLinkedEventId(null)
    setCompleteError(null)
    setShowCompleteModal(true)
    fetchMaintenanceEvents()
  }

  const handleCompletePMI = async () => {
    if (!token || !id) return

    setCompleting(true)
    setCompleteError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/pmi/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completion_date: completionDate,
          linked_event_id: linkedEventId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to complete PMI')
      }

      const data = await response.json()
      setPmi(data.pmi)
      setShowCompleteModal(false)

      // Show success message (could be a toast, but we'll update the UI)
      alert(`PMI completed successfully! Next due date: ${new Date(data.next_due_date).toLocaleDateString()}`)
    } catch (err) {
      setCompleteError(err instanceof Error ? err.message : 'Failed to complete PMI')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!pmi) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">PMI record not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(pmi.days_until_due)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">PMI Details</h1>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bgClass} ${statusBadge.textClass}`}>
          {statusBadge.text}
        </span>
      </div>

      {/* PMI Information Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Title Section */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{pmi.asset_name}</h2>
          <p className="text-sm text-gray-500">{pmi.pmi_type}</p>
        </div>

        {/* Details Grid */}
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">PMI ID</dt>
              <dd className="mt-1 text-lg text-gray-900">#{pmi.pmi_id}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Asset Serial Number</dt>
              <dd className="mt-1 text-lg text-gray-900">{pmi.asset_sn}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">WUC Code</dt>
              <dd className="mt-1 text-lg text-gray-900 font-mono">{pmi.wuc_cd}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Asset ID</dt>
              <dd className="mt-1 text-lg text-gray-900">#{pmi.asset_id}</dd>
            </div>

            {pmi.interval_days && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Interval</dt>
                <dd className="mt-1 text-lg text-gray-900">{pmi.interval_days} days</dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500">Next Due Date</dt>
              <dd className={`mt-1 text-lg font-semibold ${getDueDateColorClass(pmi.days_until_due)}`}>
                {new Date(pmi.next_due_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Days Until Due</dt>
              <dd className={`mt-1 text-lg font-semibold ${getDueDateColorClass(pmi.days_until_due)}`}>
                {pmi.days_until_due < 0
                  ? `${Math.abs(pmi.days_until_due)} days overdue`
                  : pmi.days_until_due === 0
                  ? 'Due today'
                  : `${pmi.days_until_due} days`}
              </dd>
            </div>

            {pmi.completed_date && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Last Completed</dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {new Date(pmi.completed_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            )}

            {pmi.linked_event_id && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Linked Maintenance Event</dt>
                <dd className="mt-1">
                  <button
                    onClick={() => navigate(`/maintenance/${pmi.linked_event_id}`)}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Event #{pmi.linked_event_id}
                  </button>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Actions Section */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/maintenance')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Maintenance
            </button>
          </div>

          {/* Complete PMI Button */}
          {canCompletePMI && (
            <button
              onClick={openCompleteModal}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Complete PMI
            </button>
          )}
        </div>
      </div>

      {/* Color Legend */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Due Date Color Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span className="text-sm text-gray-600">Overdue or Due within 7 days</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm text-gray-600">Due in 8-30 days</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-green-600"></span>
            <span className="text-sm text-gray-600">Due after 30 days</span>
          </div>
        </div>
      </div>

      {/* Complete PMI Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowCompleteModal(false)}
            ></div>

            {/* Modal */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Complete PMI</h3>
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* PMI Info Summary */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-gray-900">{pmi.asset_name}</p>
                <p className="text-sm text-gray-500">{pmi.pmi_type}</p>
                {pmi.interval_days && (
                  <p className="text-xs text-gray-500 mt-1">
                    Interval: {pmi.interval_days} days (next PMI will be scheduled {pmi.interval_days} days from completion date)
                  </p>
                )}
              </div>

              {completeError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{completeError}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Completion Date */}
                <div>
                  <label htmlFor="completion_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="completion_date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Link to Maintenance Event (Optional) */}
                <div>
                  <label htmlFor="linked_event" className="block text-sm font-medium text-gray-700 mb-1">
                    Link to Maintenance Event (Optional)
                  </label>
                  {loadingEvents ? (
                    <div className="flex items-center justify-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">Loading events...</span>
                    </div>
                  ) : (
                    <select
                      id="linked_event"
                      value={linkedEventId || ''}
                      onChange={(e) => setLinkedEventId(e.target.value ? parseInt(e.target.value, 10) : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- No linked event --</option>
                      {availableEvents.map((event) => (
                        <option key={event.event_id} value={event.event_id}>
                          {event.job_no} - {event.asset_sn} - {event.discrepancy?.substring(0, 40)}
                          {(event.discrepancy?.length || 0) > 40 ? '...' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Optionally link this PMI completion to an existing maintenance event.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={completing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompletePMI}
                  disabled={completing || !completionDate}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Completing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete PMI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
