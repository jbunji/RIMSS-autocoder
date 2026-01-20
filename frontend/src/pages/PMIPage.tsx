import { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Dialog, Transition } from '@headlessui/react'
import {
  CalendarDaysIcon,
  PlusIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

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

interface Asset {
  asset_id: number
  serno: string
  partno: string
  part_name: string
  status_cd: string
  pgm_id: number
}

// Get color class based on days until due
function getDueDateColorClass(daysUntilDue: number): { bg: string; text: string; border: string; dot: string } {
  if (daysUntilDue < 0) {
    return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400', dot: 'bg-red-600' }
  }
  if (daysUntilDue <= 7) {
    return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400', dot: 'bg-red-600' }
  }
  if (daysUntilDue <= 30) {
    return { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-400', dot: 'bg-yellow-500' }
  }
  return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-400', dot: 'bg-green-600' }
}

function getStatusBadge(daysUntilDue: number, completed: boolean): { text: string; bgClass: string; textClass: string } {
  if (completed) return { text: 'COMPLETED', bgClass: 'bg-blue-100', textClass: 'text-blue-800' }
  if (daysUntilDue < 0) return { text: 'OVERDUE', bgClass: 'bg-red-100', textClass: 'text-red-800' }
  if (daysUntilDue <= 7) return { text: 'DUE SOON', bgClass: 'bg-red-100', textClass: 'text-red-800' }
  if (daysUntilDue <= 30) return { text: 'UPCOMING', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' }
  return { text: 'SCHEDULED', bgClass: 'bg-green-100', textClass: 'text-green-800' }
}

// Format due date display
function formatDueDate(daysUntilDue: number): string {
  if (daysUntilDue < 0) {
    return `${Math.abs(daysUntilDue)} days overdue`
  }
  if (daysUntilDue === 0) {
    return 'Due today'
  }
  if (daysUntilDue === 1) {
    return 'Due tomorrow'
  }
  return `Due in ${daysUntilDue} days`
}

// PMI types available
const PMI_TYPES = [
  '30-Day Inspection',
  '60-Day Check',
  '90-Day Calibration',
  '180-Day Service',
  '365-Day Overhaul',
  'Phase Inspection',
  'Functional Check Flight',
  'Special Inspection',
]

export default function PMIPage() {
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const [pmiRecords, setPmiRecords] = useState<PMIRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showOverdueOnly, setShowOverdueOnly] = useState<boolean>(false)

  // Add PMI modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addingPMI, setAddingPMI] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState<string | null>(null)

  // Edit PMI modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingPMI, setEditingPMI] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState<string | null>(null)
  const [selectedPMI, setSelectedPMI] = useState<PMIRecord | null>(null)

  // Edit form fields
  const [editPmiType, setEditPmiType] = useState<string>('')
  const [editDueDate, setEditDueDate] = useState<string>('')
  const [editWucCode, setEditWucCode] = useState<string>('')

  // Form fields (for Add modal)
  const [selectedAssetId, setSelectedAssetId] = useState<string>('')
  const [pmiType, setPmiType] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [wucCode, setWucCode] = useState<string>('')

  // Assets for dropdown
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)

  // Check if user can create PMI (depot manager or admin)
  const canCreatePMI = user?.role === 'DEPOT_MANAGER' || user?.role === 'ADMIN'

  // Filter PMI records based on search and filters
  const filteredPMIRecords = pmiRecords.filter((pmi) => {
    // Search filter: check if asset serial number matches
    if (searchQuery && !pmi.asset_sn.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Overdue filter: show only overdue PMIs if enabled
    if (showOverdueOnly && pmi.days_until_due >= 0) {
      return false
    }

    return true
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setShowOverdueOnly(false)
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery !== '' || showOverdueOnly

  // Fetch PMI records
  const fetchPMI = async () => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/pmi', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch PMI records')
      }

      const data = await response.json()
      setPmiRecords(data.pmi || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Fetch assets for dropdown
  const fetchAssets = async () => {
    if (!token) return

    setLoadingAssets(true)

    try {
      const response = await fetch('http://localhost:3001/api/assets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch assets')
      }

      const data = await response.json()
      setAssets(data.assets || [])
    } catch (err) {
      console.error('Failed to fetch assets:', err)
    } finally {
      setLoadingAssets(false)
    }
  }

  useEffect(() => {
    fetchPMI()
  }, [token])

  // Open add modal
  const openAddModal = () => {
    setIsAddModalOpen(true)
    setAddError(null)
    setAddSuccess(null)
    setSelectedAssetId('')
    setPmiType('')
    setDueDate('')
    setWucCode('')
    fetchAssets()
  }

  // Close add modal
  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setAddError(null)
    setAddSuccess(null)
  }

  // Handle add PMI
  const handleAddPMI = async () => {
    if (!token) return

    setAddingPMI(true)
    setAddError(null)
    setAddSuccess(null)

    try {
      const response = await fetch('http://localhost:3001/api/pmi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_id: selectedAssetId,
          pmi_type: pmiType,
          next_due_date: dueDate,
          wuc_cd: wucCode,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create PMI record')
      }

      const data = await response.json()
      setAddSuccess(`PMI record created successfully for ${data.pmi.asset_sn}`)

      // Refresh the list
      await fetchPMI()

      // Close modal after a short delay
      setTimeout(() => {
        closeAddModal()
      }, 1500)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to create PMI record')
    } finally {
      setAddingPMI(false)
    }
  }

  // Navigate to PMI detail
  const handlePMIClick = (pmiId: number) => {
    navigate(`/pmi/${pmiId}`)
  }

  // Get default due date (30 days from today)
  const getDefaultDueDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toISOString().split('T')[0]
  }

  // Open edit modal
  const openEditModal = (pmi: PMIRecord, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click navigation
    setSelectedPMI(pmi)
    setEditPmiType(pmi.pmi_type)
    setEditDueDate(pmi.next_due_date.split('T')[0]) // Format date for input
    setEditWucCode(pmi.wuc_cd || '')
    setEditError(null)
    setEditSuccess(null)
    setIsEditModalOpen(true)
  }

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditError(null)
    setEditSuccess(null)
    setSelectedPMI(null)
  }

  // Handle edit PMI
  const handleEditPMI = async () => {
    if (!token || !selectedPMI) return

    setEditingPMI(true)
    setEditError(null)
    setEditSuccess(null)

    try {
      const response = await fetch(`http://localhost:3001/api/pmi/${selectedPMI.pmi_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pmi_type: editPmiType,
          next_due_date: editDueDate,
          wuc_cd: editWucCode,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update PMI record')
      }

      const data = await response.json()
      setEditSuccess(`PMI record for ${data.pmi.asset_sn} updated successfully`)

      // Refresh the list
      await fetchPMI()

      // Close modal after a short delay
      setTimeout(() => {
        closeEditModal()
      }, 1500)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update PMI record')
    } finally {
      setEditingPMI(false)
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PMI Schedule</h1>
            <p className="text-sm text-gray-500">Periodic Maintenance Inspection tracking</p>
          </div>
        </div>
        {canCreatePMI && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add PMI
          </button>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* PMI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {pmiRecords.filter(p => p.days_until_due < 0).length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Due Soon (7 days)</span>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {pmiRecords.filter(p => p.days_until_due >= 0 && p.days_until_due <= 7).length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Upcoming (30 days)</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {pmiRecords.filter(p => p.days_until_due > 7 && p.days_until_due <= 30).length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Scheduled (30+ days)</span>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {pmiRecords.filter(p => p.days_until_due > 30).length}
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by Asset Serial Number
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., CRIIS-001, Sensor Unit A..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter controls */}
          <div className="flex items-end gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOverdueOnly}
                  onChange={(e) => setShowOverdueOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  <FunnelIcon className="h-4 w-4 inline mr-1" />
                  Overdue Only
                </span>
              </label>
            </div>

            {/* Clear filters button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                Search: "{searchQuery}"
              </span>
            )}
            {showOverdueOnly && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                Overdue Only
              </span>
            )}
          </div>
        )}
      </div>

      {/* PMI List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All PMI Records ({filteredPMIRecords.length}{hasActiveFilters && ` of ${pmiRecords.length}`})
          </h2>
        </div>
        {filteredPMIRecords.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {pmiRecords.length === 0 ? (
              <>
                <p className="text-gray-500">No PMI records found</p>
                {canCreatePMI && (
                  <button
                    onClick={openAddModal}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Create your first PMI record
                  </button>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-500">No PMI records match your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear filters to see all records
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredPMIRecords.map((pmi) => {
              const colors = getDueDateColorClass(pmi.days_until_due)
              const badge = getStatusBadge(pmi.days_until_due, !!pmi.completed_date)
              return (
                <div
                  key={pmi.pmi_id}
                  className={`w-full px-4 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between`}
                >
                  <button
                    onClick={() => handlePMIClick(pmi.pmi_id)}
                    className="flex-1 text-left flex items-center gap-4"
                  >
                    <div className={`w-2 h-12 rounded-full ${colors.dot}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{pmi.asset_sn}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badge.bgClass} ${badge.textClass}`}>
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{pmi.asset_name}</p>
                      <p className="text-sm text-gray-500">{pmi.pmi_type}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-medium ${colors.text}`}>
                        {formatDueDate(pmi.days_until_due)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(pmi.next_due_date).toLocaleDateString()}
                      </p>
                      {pmi.wuc_cd && (
                        <p className="text-xs text-gray-400">WUC: {pmi.wuc_cd}</p>
                      )}
                    </div>
                    {canCreatePMI && (
                      <button
                        onClick={(e) => openEditModal(pmi, e)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit PMI"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add PMI Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeAddModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                        Add PMI Record
                      </Dialog.Title>
                      <button
                        onClick={closeAddModal}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                      >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-4">
                    {/* Error/Success messages */}
                    {addError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{addError}</p>
                      </div>
                    )}
                    {addSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-600">{addSuccess}</p>
                      </div>
                    )}

                    {/* Asset Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset *
                      </label>
                      <select
                        value={selectedAssetId}
                        onChange={(e) => setSelectedAssetId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loadingAssets}
                      >
                        <option value="">Select an asset...</option>
                        {assets.map((asset) => (
                          <option key={asset.asset_id} value={asset.asset_id}>
                            {asset.serno} - {asset.part_name || asset.partno}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* PMI Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PMI Type *
                      </label>
                      <select
                        value={pmiType}
                        onChange={(e) => setPmiType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select PMI type...</option>
                        {PMI_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* WUC Code (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WUC Code
                      </label>
                      <input
                        type="text"
                        value={wucCode}
                        onChange={(e) => setWucCode(e.target.value)}
                        placeholder="e.g., 14AAA"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Work Unit Code (optional)</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                      onClick={closeAddModal}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddPMI}
                      disabled={addingPMI || !selectedAssetId || !pmiType || !dueDate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {addingPMI ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4" />
                          Create PMI
                        </>
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit PMI Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <PencilIcon className="h-5 w-5 text-blue-600" />
                        Edit PMI Record
                      </Dialog.Title>
                      <button
                        onClick={closeEditModal}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                      >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-4">
                    {/* Error/Success messages */}
                    {editError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{editError}</p>
                      </div>
                    )}
                    {editSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-600">{editSuccess}</p>
                      </div>
                    )}

                    {/* Asset info (read-only) */}
                    {selectedPMI && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">Asset</p>
                        <p className="text-gray-900">{selectedPMI.asset_sn} - {selectedPMI.asset_name}</p>
                      </div>
                    )}

                    {/* PMI Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PMI Type *
                      </label>
                      <select
                        value={editPmiType}
                        onChange={(e) => setEditPmiType(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select PMI type...</option>
                        {PMI_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* WUC Code (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WUC Code
                      </label>
                      <input
                        type="text"
                        value={editWucCode}
                        onChange={(e) => setEditWucCode(e.target.value)}
                        placeholder="e.g., 14AAA"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Work Unit Code (optional)</p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                      onClick={closeEditModal}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditPMI}
                      disabled={editingPMI || !editPmiType || !editDueDate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {editingPMI ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <PencilIcon className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
