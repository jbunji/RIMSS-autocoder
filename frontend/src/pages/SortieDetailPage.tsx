import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import {
  ArrowLeftIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'

interface Sortie {
  sortie_id: number
  pgm_id: number
  asset_id: number
  mission_id: string
  serno: string
  ac_tailno: string | null
  sortie_date: string
  sortie_effect: string | null
  current_unit: string | null
  assigned_unit: string | null
  range: string | null
  reason: string | null
  remarks: string | null
}

interface MaintenanceEvent {
  event_id: number
  job_no: string
  discrepancy: string
  asset_sn: string
  asset_name: string
  event_type: string
  priority: string
  status: string
  start_job: string
}

function getSortieEffectBadge(effect: string | null): { bgClass: string; textClass: string } {
  switch (effect) {
    case 'FMC':
    case 'Full Mission Capable':
      return { bgClass: 'bg-green-100', textClass: 'text-green-800' }
    case 'PMC':
    case 'PMCM':
    case 'PMCS':
    case 'PMCB':
    case 'Partial Mission Capable':
      return { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' }
    case 'NMCM':
    case 'NMCS':
    case 'NMCB':
    case 'Non-Mission Capable':
      return { bgClass: 'bg-red-100', textClass: 'text-red-800' }
    default:
      return { bgClass: 'bg-gray-100', textClass: 'text-gray-800' }
  }
}

function getPriorityBadge(priority: string): { bgClass: string; textClass: string } {
  switch (priority) {
    case 'Critical':
      return { bgClass: 'bg-red-100', textClass: 'text-red-800' }
    case 'Urgent':
      return { bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' }
    case 'Routine':
      return { bgClass: 'bg-green-100', textClass: 'text-green-800' }
    default:
      return { bgClass: 'bg-gray-100', textClass: 'text-gray-800' }
  }
}

export default function SortieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [sortie, setSortie] = useState<Sortie | null>(null)
  const [linkedEvents, setLinkedEvents] = useState<MaintenanceEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSortie = async () => {
      if (!token || !id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/sorties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Sortie not found')
          }
          if (response.status === 403) {
            throw new Error('You do not have access to this sortie')
          }
          throw new Error('Failed to fetch sortie details')
        }

        const data = await response.json()
        setSortie(data.sortie)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSortie()
  }, [token, id])

  useEffect(() => {
    const fetchLinkedEvents = async () => {
      if (!token || !id) return

      setEventsLoading(true)

      try {
        // Fetch all maintenance events and filter by sortie_id
        const response = await fetch(`/api/events?sortie_id=${id}&limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setLinkedEvents(data.events || [])
        }
      } catch (err) {
        console.error('Failed to fetch linked maintenance events:', err)
      } finally {
        setEventsLoading(false)
      }
    }

    fetchLinkedEvents()
  }, [token, id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading sortie details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate('/sorties')}
          className="text-primary-600 hover:text-primary-700"
        >
          ← Back to Sorties
        </button>
      </div>
    )
  }

  if (!sortie) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <div className="text-gray-500 mb-4">Sortie not found</div>
        <button
          onClick={() => navigate('/sorties')}
          className="text-primary-600 hover:text-primary-700"
        >
          ← Back to Sorties
        </button>
      </div>
    )
  }

  const effectBadge = getSortieEffectBadge(sortie.sortie_effect)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/sorties')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Sorties</span>
        </button>
      </div>

      {/* Sortie Details Card */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{sortie.mission_id}</h1>
              <p className="text-sm text-gray-500 mt-1">Sortie ID: {sortie.sortie_id}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${effectBadge.bgClass} ${effectBadge.textClass}`}>
              {sortie.sortie_effect || 'Unknown'}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Serial Number</h3>
              <p className="text-base text-gray-900">{sortie.serno}</p>
            </div>

            {sortie.ac_tailno && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tail Number</h3>
                <p className="text-base text-gray-900">{sortie.ac_tailno}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Sortie Date</h3>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <p className="text-base text-gray-900">
                  {new Date(sortie.sortie_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {sortie.range && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Range</h3>
                <p className="text-base text-gray-900">{sortie.range}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {sortie.current_unit && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Current Unit</h3>
                <p className="text-base text-gray-900">{sortie.current_unit}</p>
              </div>
            )}

            {sortie.assigned_unit && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned Unit</h3>
                <p className="text-base text-gray-900">{sortie.assigned_unit}</p>
              </div>
            )}

            {sortie.reason && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Reason</h3>
                <p className="text-base text-gray-900">{sortie.reason}</p>
              </div>
            )}

            {sortie.remarks && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Remarks</h3>
                <p className="text-base text-gray-900">{sortie.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Linked Maintenance Events Card */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-2">
            <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              Linked Maintenance Events
              {!eventsLoading && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({linkedEvents.length})
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {eventsLoading ? (
            <div className="text-center text-gray-500 py-8">Loading linked events...</div>
          ) : linkedEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No maintenance events linked to this sortie.
            </div>
          ) : (
            <div className="space-y-3">
              {linkedEvents.map((event) => {
                const priorityBadge = getPriorityBadge(event.priority)
                return (
                  <div
                    key={event.event_id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => navigate(`/maintenance/${event.event_id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">{event.job_no}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityBadge.bgClass} ${priorityBadge.textClass}`}>
                            {event.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.status === 'open' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.discrepancy}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Asset: {event.asset_sn}</span>
                          <span>Type: {event.event_type}</span>
                          <span>Date In: {new Date(event.start_job).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
