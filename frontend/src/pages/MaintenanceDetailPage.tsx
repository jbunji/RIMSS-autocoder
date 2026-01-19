import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface MaintenanceEvent {
  event_id: number
  asset_id: number
  asset_sn: string
  asset_name: string
  job_no: string
  discrepancy: string
  start_job: string
  stop_job: string | null
  event_type: 'Standard' | 'PMI' | 'TCTO' | 'BIT/PC'
  priority: 'Routine' | 'Urgent' | 'Critical'
  status: 'open' | 'closed'
  pgm_id: number
  location: string
}

// Priority colors
function getPriorityBadgeClass(priority: MaintenanceEvent['priority']): string {
  switch (priority) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'Urgent':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'Routine':
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200'
  }
}

// Status colors
function getStatusBadgeClass(status: MaintenanceEvent['status']): string {
  switch (status) {
    case 'open':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Event type colors
function getEventTypeBadgeClass(eventType: MaintenanceEvent['event_type']): string {
  switch (eventType) {
    case 'PMI':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'TCTO':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    case 'BIT/PC':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200'
    case 'Standard':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function MaintenanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [event, setEvent] = useState<MaintenanceEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!token || !id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Maintenance event not found')
          }
          if (response.status === 403) {
            throw new Error('Access denied to this maintenance event')
          }
          throw new Error('Failed to fetch maintenance event')
        }

        const data = await response.json()
        setEvent(data.event)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [token, id])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No maintenance event found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Event Details</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadgeClass(event.status)}`}>
            {event.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Event details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Job Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Job Number</label>
                <p className="text-lg font-mono font-semibold text-gray-900">{event.job_no}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Event Type</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-sm font-medium rounded border ${getEventTypeBadgeClass(event.event_type)}`}>
                    {event.event_type}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Priority</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-sm font-medium rounded border ${getPriorityBadgeClass(event.priority)}`}>
                    {event.priority}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Location</label>
                <p className="text-gray-900">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Discrepancy */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Discrepancy</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{event.discrepancy}</p>
          </div>

          {/* Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Job Started</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.start_job).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              {event.stop_job && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Job Completed</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.stop_job).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
              {!event.stop_job && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">In Progress</p>
                    <p className="text-sm text-gray-500">Job is currently open</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Asset information */}
        <div className="space-y-6">
          {/* Asset Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Asset Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Asset Name</label>
                <p className="text-gray-900 font-medium">{event.asset_name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Serial Number</label>
                <p className="text-gray-900 font-mono">{event.asset_sn}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Asset ID</label>
                <p className="text-gray-900">#{event.asset_id}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Print Details
              </button>
            </div>
          </div>

          {/* Event ID */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500">Event ID</p>
            <p className="text-lg font-mono font-bold text-gray-700">#{event.event_id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
