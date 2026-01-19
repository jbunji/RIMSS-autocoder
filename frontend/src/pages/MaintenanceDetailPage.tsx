import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Dialog } from '@headlessui/react'
import {
  PencilSquareIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  WrenchScrewdriverIcon,
  PrinterIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// Repair interface
interface Repair {
  repair_id: number
  event_id: number
  repair_seq: number
  asset_id: number
  start_date: string
  stop_date: string | null
  type_maint: string
  how_mal: string | null
  when_disc: string | null
  shop_status: 'open' | 'closed'
  narrative: string
  tag_no: string | null
  doc_no: string | null
  created_by_name: string
  created_at: string
}

interface RepairsSummary {
  total: number
  open: number
  closed: number
}

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
  etic?: string | null
}

interface EditFormData {
  discrepancy: string
  etic: string
  priority: 'Routine' | 'Urgent' | 'Critical'
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
  const { token, user } = useAuthStore()
  const [event, setEvent] = useState<MaintenanceEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<EditFormData>({
    discrepancy: '',
    etic: '',
    priority: 'Routine',
    location: '',
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState<string | null>(null)

  // Repairs state
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [repairsSummary, setRepairsSummary] = useState<RepairsSummary>({ total: 0, open: 0, closed: 0 })
  const [repairsLoading, setRepairsLoading] = useState(false)

  // Close event modal state
  const [isCloseEventModalOpen, setIsCloseEventModalOpen] = useState(false)
  const [closeEventDate, setCloseEventDate] = useState(new Date().toISOString().split('T')[0])
  const [closeEventLoading, setCloseEventLoading] = useState(false)
  const [closeEventError, setCloseEventError] = useState<string | null>(null)
  const [closeEventSuccess, setCloseEventSuccess] = useState<string | null>(null)

  // Close repair state
  const [closingRepairId, setClosingRepairId] = useState<number | null>(null)

  // Check if user can edit (ADMIN, DEPOT_MANAGER, or FIELD_TECHNICIAN)
  const canEdit = user && ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'].includes(user.role)

  const fetchEvent = useCallback(async () => {
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
  }, [token, id])

  // Fetch repairs for the event
  const fetchRepairs = useCallback(async () => {
    if (!token || !id) return

    setRepairsLoading(true)

    try {
      const response = await fetch(`http://localhost:3001/api/events/${id}/repairs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch repairs')
        return
      }

      const data = await response.json()
      setRepairs(data.repairs || [])
      setRepairsSummary(data.summary || { total: 0, open: 0, closed: 0 })
    } catch (err) {
      console.error('Error fetching repairs:', err)
    } finally {
      setRepairsLoading(false)
    }
  }, [token, id])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  useEffect(() => {
    if (event) {
      fetchRepairs()
    }
  }, [event, fetchRepairs])

  // Close a repair
  const handleCloseRepair = async (repairId: number) => {
    if (!token) return

    setClosingRepairId(repairId)

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${repairId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shop_status: 'closed',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to close repair')
      }

      // Refresh repairs
      await fetchRepairs()
    } catch (err) {
      console.error('Error closing repair:', err)
    } finally {
      setClosingRepairId(null)
    }
  }

  // Open close event modal
  const openCloseEventModal = () => {
    setCloseEventDate(new Date().toISOString().split('T')[0])
    setCloseEventError(null)
    setCloseEventSuccess(null)
    setIsCloseEventModalOpen(true)
  }

  // Close the close event modal
  const closeCloseEventModal = () => {
    setIsCloseEventModalOpen(false)
    setCloseEventError(null)
    setCloseEventSuccess(null)
  }

  // Handle close event submission
  const handleCloseEvent = async () => {
    if (!token || !event) return

    setCloseEventLoading(true)
    setCloseEventError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/events/${event.event_id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stop_job: closeEventDate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to close maintenance event')
      }

      const data = await response.json()
      setCloseEventSuccess('Maintenance event closed successfully!')
      setEvent(data.event)

      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeCloseEventModal()
      }, 1500)
    } catch (err) {
      setCloseEventError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setCloseEventLoading(false)
    }
  }

  // Open edit modal
  const openEditModal = () => {
    if (!event) return
    setEditForm({
      discrepancy: event.discrepancy,
      etic: event.etic || '',
      priority: event.priority,
      location: event.location,
    })
    setEditError(null)
    setEditSuccess(null)
    setIsEditModalOpen(true)
  }

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditError(null)
    setEditSuccess(null)
  }

  // Handle form field changes
  const handleFormChange = (field: keyof EditFormData, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
    setEditError(null)
  }

  // Submit edit form
  const handleSubmitEdit = async () => {
    if (!token || !event) return

    // Validate form
    if (!editForm.discrepancy.trim()) {
      setEditError('Discrepancy description is required')
      return
    }

    setEditLoading(true)
    setEditError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/events/${event.event_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          discrepancy: editForm.discrepancy.trim(),
          etic: editForm.etic || null,
          priority: editForm.priority,
          location: editForm.location,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update maintenance event')
      }

      const data = await response.json()
      setEditSuccess('Maintenance event updated successfully!')
      setEvent(data.event)

      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeEditModal()
      }, 1500)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setEditLoading(false)
    }
  }

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
            onClick={() => navigate('/maintenance')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Maintenance
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
            onClick={() => navigate('/maintenance')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Maintenance
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
          onClick={() => navigate('/maintenance')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          Back to Maintenance
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Maintenance Event Details</h1>
              <p className="text-sm text-gray-500">Job #{event.job_no}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {canEdit && event.status === 'open' && (
              <button
                onClick={openEditModal}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                <PencilSquareIcon className="h-5 w-5 mr-2" />
                Edit Event
              </button>
            )}
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadgeClass(event.status)}`}>
              {event.status.toUpperCase()}
            </span>
          </div>
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
                <label className="text-sm text-gray-500 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  Location
                </label>
                <p className="text-gray-900">{event.location}</p>
              </div>
              {event.etic && (
                <div>
                  <label className="text-sm text-gray-500 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    ETIC (Est. Time In Commission)
                  </label>
                  <p className="text-gray-900">
                    {new Date(event.etic).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
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
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
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
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
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
                    <WrenchScrewdriverIcon className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">In Progress</p>
                    <p className="text-sm text-gray-500">Job is currently open</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Repairs Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Repairs
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({repairsSummary.total} total, {repairsSummary.open} open, {repairsSummary.closed} closed)
                </span>
              </h2>
            </div>

            {repairsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : repairs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No repairs recorded for this event</p>
              </div>
            ) : (
              <div className="space-y-4">
                {repairs.map((repair) => (
                  <div
                    key={repair.repair_id}
                    className={`border rounded-lg p-4 ${
                      repair.shop_status === 'open'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-green-200 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gray-900">
                            Repair #{repair.repair_seq}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              repair.shop_status === 'open'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {repair.shop_status.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {repair.type_maint}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{repair.narrative}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span>Started: {new Date(repair.start_date).toLocaleDateString()}</span>
                          {repair.stop_date && (
                            <span>Completed: {new Date(repair.stop_date).toLocaleDateString()}</span>
                          )}
                          {repair.tag_no && <span>Tag: {repair.tag_no}</span>}
                          {repair.doc_no && <span>Doc: {repair.doc_no}</span>}
                          <span>By: {repair.created_by_name}</span>
                        </div>
                      </div>
                      {canEdit && repair.shop_status === 'open' && event.status === 'open' && (
                        <button
                          onClick={() => handleCloseRepair(repair.repair_id)}
                          disabled={closingRepairId === repair.repair_id}
                          className="ml-4 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {closingRepairId === repair.repair_id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-700 border-t-transparent mr-1" />
                              Closing...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Close Repair
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {canEdit && event.status === 'open' && (
                <>
                  <button
                    onClick={openEditModal}
                    className="w-full px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <PencilSquareIcon className="h-4 w-4 mr-2" />
                    Edit Event
                  </button>
                  <button
                    onClick={openCloseEventModal}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <LockClosedIcon className="h-4 w-4 mr-2" />
                    Close Event
                  </button>
                </>
              )}
              <button
                onClick={() => navigate('/maintenance')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Return to Maintenance
              </button>
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onClose={closeEditModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Edit Maintenance Event
              </Dialog.Title>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Success Message */}
              {editSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{editSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {editError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{editError}</p>
                </div>
              )}

              {/* Job Number (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number
                </label>
                <p className="text-lg font-mono font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {event.job_no}
                </p>
              </div>

              {/* Discrepancy Description */}
              <div>
                <label htmlFor="edit_discrepancy" className="block text-sm font-medium text-gray-700 mb-1">
                  Discrepancy Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit_discrepancy"
                  value={editForm.discrepancy}
                  onChange={(e) => handleFormChange('discrepancy', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the maintenance issue or discrepancy..."
                />
              </div>

              {/* ETIC */}
              <div>
                <label htmlFor="edit_etic" className="block text-sm font-medium text-gray-700 mb-1">
                  ETIC (Estimated Time In Commission)
                </label>
                <input
                  type="date"
                  id="edit_etic"
                  value={editForm.etic}
                  onChange={(e) => handleFormChange('etic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Estimated date when the asset will be back in service
                </p>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="edit_priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="edit_priority"
                  value={editForm.priority}
                  onChange={(e) => handleFormChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="edit_location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="edit_location"
                  value={editForm.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter location..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={editLoading || !!editSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {editLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Close Event Modal */}
      <Dialog open={isCloseEventModalOpen} onClose={closeCloseEventModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Close Maintenance Event
              </Dialog.Title>
              <button
                onClick={closeCloseEventModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Success Message */}
              {closeEventSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{closeEventSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {closeEventError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{closeEventError}</p>
                  </div>
                </div>
              )}

              {/* Warning about open repairs */}
              {repairsSummary.open > 0 && !closeEventSuccess && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium">Open Repairs Detected</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        There {repairsSummary.open === 1 ? 'is' : 'are'} {repairsSummary.open} open repair{repairsSummary.open === 1 ? '' : 's'} for this event.
                        All repairs must be closed before the event can be closed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation text */}
              {repairsSummary.open === 0 && !closeEventSuccess && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">
                    You are about to close maintenance event <strong>{event?.job_no}</strong>.
                    This action will mark the job as completed.
                  </p>
                </div>
              )}

              {/* Job Number (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number
                </label>
                <p className="text-lg font-mono font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {event?.job_no}
                </p>
              </div>

              {/* Date Out / Stop Job */}
              <div>
                <label htmlFor="close_event_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Out (Completion Date) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="close_event_date"
                  value={closeEventDate}
                  onChange={(e) => setCloseEventDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={closeEventLoading || !!closeEventSuccess}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the date when maintenance work was completed
                </p>
              </div>

              {/* Repairs Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Repairs Summary</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">Total: {repairsSummary.total}</span>
                  <span className="text-green-600">Closed: {repairsSummary.closed}</span>
                  <span className={repairsSummary.open > 0 ? 'text-yellow-600 font-medium' : 'text-gray-600'}>
                    Open: {repairsSummary.open}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeCloseEventModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={closeEventLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCloseEvent}
                disabled={closeEventLoading || !!closeEventSuccess || repairsSummary.open > 0}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {closeEventLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Closing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="h-4 w-4 mr-2" />
                    Close Event
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
