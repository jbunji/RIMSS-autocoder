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
  const { token } = useAuthStore()
  const [pmi, setPmi] = useState<PMIRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          </dl>
        </div>

        {/* Actions Section */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
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
    </div>
  )
}
