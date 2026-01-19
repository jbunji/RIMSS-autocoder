import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tab, Dialog } from '@headlessui/react'
import {
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// Maintenance event interface matching backend
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
  pqdr?: boolean // Product Quality Deficiency Report flag
}

interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

interface Summary {
  open: number
  closed: number
  critical: number
  urgent: number
  routine: number
  pqdr: number
  total: number
}

interface ProgramInfo {
  pgm_id: number
  pgm_cd: string
  pgm_name: string
}

interface EventsResponse {
  events: MaintenanceEvent[]
  pagination: Pagination
  summary: Summary
  program: ProgramInfo
}

// Asset interface for the dropdown
interface Asset {
  asset_id: number
  serno: string
  name: string
  pgm_id: number
  status_cd: string
  admin_loc: string
}

interface AssetsResponse {
  assets: Asset[]
  pagination: {
    total: number
  }
}

// Sortie interface
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

interface SortiesResponse {
  sorties: Sortie[]
  total: number
}

// Form data for new event
interface NewEventFormData {
  asset_id: string
  discrepancy: string
  event_type: 'Standard' | 'PMI' | 'TCTO' | 'BIT/PC'
  priority: 'Routine' | 'Urgent' | 'Critical'
  start_job: string
  etic: string
  location: string
  sortie_id: string
}

// Priority badge colors
const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  Urgent: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  Routine: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
}

// Event type badge colors
const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  Standard: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  PMI: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  TCTO: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  'BIT/PC': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
}

// Status badge colors
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  open: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  closed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function MaintenancePage() {
  const navigate = useNavigate()
  const { token, currentProgramId } = useAuthStore()

  // State
  const [events, setEvents] = useState<MaintenanceEvent[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, total_pages: 1 })
  const [summary, setSummary] = useState<Summary>({ open: 0, closed: 0, critical: 0, urgent: 0, routine: 0, pqdr: 0, total: 0 })
  const [program, setProgram] = useState<ProgramInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('') // '' = all, or specific type
  const [pqdrFilter, setPqdrFilter] = useState(false) // false = show all, true = only PQDR flagged
  const [activeTab, setActiveTab] = useState(0) // 0 = Backlog (open), 1 = History (closed)

  // New Event Modal State
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [sorties, setSorties] = useState<Sortie[]>([])
  const [sortiesLoading, setSortiesLoading] = useState(false)
  const [newEventLoading, setNewEventLoading] = useState(false)
  const [newEventError, setNewEventError] = useState<string | null>(null)
  const [newEventSuccess, setNewEventSuccess] = useState<string | null>(null)
  const [newEventForm, setNewEventForm] = useState<NewEventFormData>({
    asset_id: '',
    discrepancy: '',
    event_type: 'Standard',
    priority: 'Routine',
    start_job: new Date().toISOString().split('T')[0],
    etic: '',
    location: '',
    sortie_id: '',
  })

  // Delete Event Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<MaintenanceEvent | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)

  // Get user info from token to check role
  const { user } = useAuthStore()
  const canCreateEvent = user && ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'].includes(user.role)
  const canDeleteEvent = user && user.role === 'ADMIN'

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch events
  const fetchEvents = useCallback(async (page: number = 1, status?: 'open' | 'closed') => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })

      if (currentProgramId) {
        params.append('program_id', currentProgramId.toString())
      }

      if (status) {
        params.append('status', status)
      }

      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }

      if (eventTypeFilter) {
        params.append('event_type', eventTypeFilter)
      }

      if (pqdrFilter) {
        params.append('pqdr', 'true')
      }

      const response = await fetch(`http://localhost:3001/api/events?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch maintenance events')
      }

      const data: EventsResponse = await response.json()
      setEvents(data.events)
      setPagination(data.pagination)
      setSummary(data.summary)
      setProgram(data.program)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [token, currentProgramId, debouncedSearch, eventTypeFilter, pqdrFilter])

  // Fetch events when tab changes, search changes, or event type filter changes
  useEffect(() => {
    const status = activeTab === 0 ? 'open' : 'closed'
    fetchEvents(1, status)
  }, [fetchEvents, activeTab, debouncedSearch, eventTypeFilter, pqdrFilter])

  // Refetch when program changes
  useEffect(() => {
    const status = activeTab === 0 ? 'open' : 'closed'
    fetchEvents(1, status)
  }, [currentProgramId])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const status = activeTab === 0 ? 'open' : 'closed'
    fetchEvents(newPage, status)
  }

  // Handle event click
  const handleEventClick = (eventId: number) => {
    navigate(`/maintenance/${eventId}`)
  }

  // Fetch assets for the dropdown
  const fetchAssets = useCallback(async () => {
    if (!token) return

    setAssetsLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '100', // Get all assets for the dropdown
      })

      if (currentProgramId) {
        params.append('program_id', currentProgramId.toString())
      }

      const response = await fetch(`http://localhost:3001/api/assets?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch assets')
      }

      const data: AssetsResponse = await response.json()
      setAssets(data.assets)
    } catch (err) {
      console.error('Error fetching assets:', err)
    } finally {
      setAssetsLoading(false)
    }
  }, [token, currentProgramId])

  // Fetch sorties for the dropdown
  const fetchSorties = useCallback(async () => {
    if (!token) return

    setSortiesLoading(true)
    try {
      const params = new URLSearchParams()

      if (currentProgramId) {
        params.append('program_id', currentProgramId.toString())
      }

      const response = await fetch(`http://localhost:3001/api/sorties?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sorties')
      }

      const data: SortiesResponse = await response.json()
      setSorties(data.sorties)
    } catch (err) {
      console.error('Error fetching sorties:', err)
    } finally {
      setSortiesLoading(false)
    }
  }, [token, currentProgramId])

  // Open new event modal
  const openNewEventModal = () => {
    setNewEventForm({
      asset_id: '',
      discrepancy: '',
      event_type: 'Standard',
      priority: 'Routine',
      start_job: new Date().toISOString().split('T')[0],
      etic: '',
      location: '',
      sortie_id: '',
    })
    setNewEventError(null)
    setNewEventSuccess(null)
    fetchAssets()
    fetchSorties()
    setIsNewEventModalOpen(true)
  }

  // Close new event modal
  const closeNewEventModal = () => {
    setIsNewEventModalOpen(false)
    setNewEventError(null)
    setNewEventSuccess(null)
  }

  // Handle form input changes
  const handleFormChange = (field: keyof NewEventFormData, value: string) => {
    setNewEventForm(prev => ({ ...prev, [field]: value }))
    setNewEventError(null)
  }

  // Update location when asset changes
  useEffect(() => {
    if (newEventForm.asset_id) {
      const selectedAsset = assets.find(a => a.asset_id.toString() === newEventForm.asset_id)
      if (selectedAsset) {
        setNewEventForm(prev => ({ ...prev, location: selectedAsset.admin_loc || '' }))
      }
    }
  }, [newEventForm.asset_id, assets])

  // Submit new event
  const handleSubmitNewEvent = async () => {
    if (!token) return

    // Validate form
    if (!newEventForm.asset_id) {
      setNewEventError('Please select an asset')
      return
    }
    if (!newEventForm.discrepancy.trim()) {
      setNewEventError('Please enter a discrepancy description')
      return
    }
    if (!newEventForm.start_job) {
      setNewEventError('Please select a date in')
      return
    }

    setNewEventLoading(true)
    setNewEventError(null)

    try {
      const response = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_id: parseInt(newEventForm.asset_id, 10),
          discrepancy: newEventForm.discrepancy.trim(),
          event_type: newEventForm.event_type,
          priority: newEventForm.priority,
          start_job: newEventForm.start_job,
          etic: newEventForm.etic || null,
          location: newEventForm.location || null,
          sortie_id: newEventForm.sortie_id || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create maintenance event')
      }

      const data = await response.json()
      setNewEventSuccess(`Maintenance event ${data.event.job_no} created successfully!`)

      // Refresh the events list after a short delay to show success message
      setTimeout(() => {
        closeNewEventModal()
        const status = activeTab === 0 ? 'open' : 'closed'
        fetchEvents(1, status)
      }, 1500)
    } catch (err) {
      setNewEventError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setNewEventLoading(false)
    }
  }

  // Open delete confirmation modal
  const openDeleteModal = (event: MaintenanceEvent, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click navigation
    setEventToDelete(event)
    setDeleteError(null)
    setDeleteSuccess(null)
    setIsDeleteModalOpen(true)
  }

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setEventToDelete(null)
    setDeleteError(null)
    setDeleteSuccess(null)
  }

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!token || !eventToDelete) return

    setDeleteLoading(true)
    setDeleteError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventToDelete.event_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete maintenance event')
      }

      const data = await response.json()
      const repairsMsg = data.repairs_deleted > 0 ? ` (${data.repairs_deleted} repair(s) also removed)` : ''
      setDeleteSuccess(`Maintenance event "${data.event.job_no}" deleted successfully!${repairsMsg}`)

      // Refresh the events list after a short delay to show success message
      setTimeout(() => {
        closeDeleteModal()
        const status = activeTab === 0 ? 'open' : 'closed'
        fetchEvents(1, status)
      }, 1500)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Calculate days open
  const calculateDaysOpen = (startJob: string, stopJob: string | null) => {
    const start = new Date(startJob)
    const end = stopJob ? new Date(stopJob) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
              {program && (
                <p className="text-sm text-gray-500">
                  Viewing maintenance events for {program.pgm_cd} - {program.pgm_name}
                </p>
              )}
            </div>
          </div>
          {canCreateEvent && (
            <button
              onClick={openNewEventModal}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Event
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold text-red-600">{summary.critical}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Urgent</p>
              <p className="text-2xl font-bold text-orange-600">{summary.urgent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Routine</p>
              <p className="text-2xl font-bold text-blue-600">{summary.routine}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Open Jobs</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.open}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Closed Jobs</p>
              <p className="text-2xl font-bold text-green-600">{summary.closed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by job number, asset, discrepancy, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Event Type Filter */}
        <div className="relative sm:w-56">
          <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
          >
            <option value="">All Event Types</option>
            <option value="Standard">Standard</option>
            <option value="PMI">PMI (Periodic Maintenance)</option>
            <option value="TCTO">TCTO (Time Compliance)</option>
            <option value="BIT/PC">BIT/PC (Built-In Test)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* PQDR Filter */}
        <label className={classNames(
          'flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-colors',
          pqdrFilter
            ? 'bg-red-50 border-red-300 text-red-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        )}>
          <input
            type="checkbox"
            checked={pqdrFilter}
            onChange={(e) => setPqdrFilter(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <ExclamationTriangleIcon className="h-5 w-5 ml-2 mr-1 text-red-500" />
          <span className="text-sm font-medium whitespace-nowrap">
            PQDR Only {summary.pqdr > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{summary.pqdr}</span>}
          </span>
        </label>
      </div>

      {/* Tabs */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow text-primary-700'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-700'
              )
            }
          >
            Backlog ({summary.open})
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-primary-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow text-primary-700'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-700'
              )
            }
          >
            History ({summary.closed})
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Backlog Tab */}
          <Tab.Panel>
            {renderEventsTable()}
          </Tab.Panel>

          {/* History Tab */}
          <Tab.Panel>
            {renderEventsTable()}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* New Event Modal */}
      <Dialog open={isNewEventModalOpen} onClose={closeNewEventModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Create New Maintenance Event
              </Dialog.Title>
              <button
                onClick={closeNewEventModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Success Message */}
              {newEventSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{newEventSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {newEventError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{newEventError}</p>
                </div>
              )}

              {/* Asset Selection */}
              <div>
                <label htmlFor="asset_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset <span className="text-red-500">*</span>
                </label>
                <select
                  id="asset_id"
                  value={newEventForm.asset_id}
                  onChange={(e) => handleFormChange('asset_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={assetsLoading}
                >
                  <option value="">Select an asset...</option>
                  {assets.map((asset) => (
                    <option key={asset.asset_id} value={asset.asset_id}>
                      {asset.serno} - {asset.name} ({asset.status_cd})
                    </option>
                  ))}
                </select>
                {assetsLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading assets...</p>
                )}
              </div>

              {/* Discrepancy Description */}
              <div>
                <label htmlFor="discrepancy" className="block text-sm font-medium text-gray-700 mb-1">
                  Discrepancy Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="discrepancy"
                  value={newEventForm.discrepancy}
                  onChange={(e) => handleFormChange('discrepancy', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the maintenance issue or discrepancy..."
                />
              </div>

              {/* Event Type */}
              <div>
                <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="event_type"
                  value={newEventForm.event_type}
                  onChange={(e) => handleFormChange('event_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="PMI">PMI (Periodic Maintenance Inspection)</option>
                  <option value="TCTO">TCTO (Time Compliance Technical Order)</option>
                  <option value="BIT/PC">BIT/PC (Built-In Test / Pre-flight Check)</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newEventForm.priority}
                  onChange={(e) => handleFormChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Date In */}
              <div>
                <label htmlFor="start_job" className="block text-sm font-medium text-gray-700 mb-1">
                  Date In <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="start_job"
                  value={newEventForm.start_job}
                  onChange={(e) => handleFormChange('start_job', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* ETIC */}
              <div>
                <label htmlFor="etic" className="block text-sm font-medium text-gray-700 mb-1">
                  ETIC (Estimated Time In Commission)
                </label>
                <input
                  type="date"
                  id="etic"
                  value={newEventForm.etic}
                  onChange={(e) => handleFormChange('etic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Optional"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Estimated date when the asset will be back in service
                </p>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={newEventForm.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Auto-filled from asset, or enter custom location"
                />
              </div>

              {/* Sortie Selection */}
              <div>
                <label htmlFor="sortie_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Linked Sortie
                </label>
                <select
                  id="sortie_id"
                  value={newEventForm.sortie_id}
                  onChange={(e) => handleFormChange('sortie_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={sortiesLoading}
                >
                  <option value="">No sortie linked (optional)</option>
                  {sorties.map((sortie) => (
                    <option key={sortie.sortie_id} value={sortie.sortie_id}>
                      {sortie.mission_id} - {sortie.serno} ({new Date(sortie.sortie_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {sortiesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading sorties...</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Optionally link this event to a sortie that caused the discrepancy
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeNewEventModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={newEventLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewEvent}
                disabled={newEventLoading || !!newEventSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {newEventLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Event Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Delete Maintenance Event
              </Dialog.Title>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Success Message */}
              {deleteSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{deleteSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {deleteError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-700 text-sm">{deleteError}</p>
                </div>
              )}

              {!deleteSuccess && (
                <>
                  {/* Warning */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <p className="text-red-700 text-sm">
                        Are you sure you want to delete this maintenance event? This action cannot be undone.
                        All related repairs will also be deleted.
                      </p>
                    </div>
                  </div>

                  {/* Event Details */}
                  {eventToDelete && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Job Number:</span>
                        <span className="text-sm font-mono font-semibold text-primary-600">{eventToDelete.job_no}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Asset:</span>
                        <span className="text-sm font-medium text-gray-900">{eventToDelete.asset_sn} - {eventToDelete.asset_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={classNames(
                          'text-xs font-medium px-2 py-0.5 rounded-full',
                          eventToDelete.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        )}>
                          {eventToDelete.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Priority:</span>
                        <span className="text-sm text-gray-900">{eventToDelete.priority}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!deleteSuccess && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  disabled={deleteLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Event
                    </>
                  )}
                </button>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )

  function renderEventsTable() {
    if (loading) {
      return (
        <div className="bg-white shadow rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchEvents(1, activeTab === 0 ? 'open' : 'closed')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )
    }

    if (events.length === 0) {
      return (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <WrenchScrewdriverIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {activeTab === 0 ? 'No open maintenance events found.' : 'No closed maintenance events found.'}
          </p>
        </div>
      )
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discrepancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days {activeTab === 0 ? 'Open' : 'Duration'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {canDeleteEvent && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => {
                const priorityStyle = priorityColors[event.priority] || priorityColors.Routine
                const eventTypeStyle = eventTypeColors[event.event_type] || eventTypeColors.Standard
                const statusStyle = statusColors[event.status] || statusColors.open
                const daysOpen = calculateDaysOpen(event.start_job, event.stop_job)

                return (
                  <tr
                    key={event.event_id}
                    className={classNames(
                      'cursor-pointer transition-colors',
                      event.pqdr ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                    )}
                    onClick={() => handleEventClick(event.event_id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-primary-600">
                          {event.job_no}
                        </span>
                        {event.pqdr && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-red-500 text-white" title="Product Quality Deficiency Report">
                            PQDR
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.asset_name}</div>
                        <div className="text-sm text-gray-500 font-mono">{event.asset_sn}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={event.discrepancy}>
                        {event.discrepancy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        'px-2 py-1 text-xs font-medium rounded-full border',
                        eventTypeStyle.bg,
                        eventTypeStyle.text,
                        eventTypeStyle.border
                      )}>
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        'px-2 py-1 text-xs font-medium rounded-full border',
                        priorityStyle.bg,
                        priorityStyle.text,
                        priorityStyle.border
                      )}>
                        {event.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{event.location}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(event.start_job)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        'text-sm font-medium',
                        daysOpen > 7 ? 'text-red-600' : daysOpen > 3 ? 'text-orange-600' : 'text-gray-600'
                      )}>
                        {daysOpen} {daysOpen === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        'px-2 py-1 text-xs font-medium rounded-full border',
                        statusStyle.bg,
                        statusStyle.text,
                        statusStyle.border
                      )}>
                        {event.status.toUpperCase()}
                      </span>
                    </td>
                    {canDeleteEvent && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => openDeleteModal(event, e)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title={`Delete ${event.job_no}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.total_pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> events
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {/* Page numbers */}
                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={classNames(
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        pageNum === pagination.page
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      )}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.total_pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Total count */}
        {pagination.total_pages <= 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">{pagination.total} total events</p>
          </div>
        )}
      </div>
    )
  }
}
