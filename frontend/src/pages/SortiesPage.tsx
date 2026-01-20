import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { Dialog } from '@headlessui/react'
import { useAuthStore } from '../stores/authStore'

// Sortie interface matching backend
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

interface ProgramInfo {
  pgm_id: number
  pgm_cd: string
  pgm_name: string
}

interface SortiesResponse {
  sorties: Sortie[]
  total: number
}

interface Asset {
  asset_id: number
  serno: string
  partno: string
  name: string
  pgm_id: number
  status_cd: string
}

export default function SortiesPage() {
  const navigate = useNavigate()
  const { token, currentProgramId, user } = useAuthStore()

  // State
  const [sorties, setSorties] = useState<Sortie[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSorties, setFilteredSorties] = useState<Sortie[]>([])

  // Add Sortie Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [newSortieForm, setNewSortieForm] = useState({
    asset_id: '',
    mission_id: '',
    sortie_date: '',
    sortie_effect: '',
    range: '',
    remarks: '',
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Edit Sortie Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSortie, setEditingSortie] = useState<Sortie | null>(null)
  const [editSortieForm, setEditSortieForm] = useState({
    mission_id: '',
    sortie_date: '',
    sortie_effect: '',
    range: '',
    remarks: '',
  })

  // Delete Confirmation Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sortieToDelete, setSortieToDelete] = useState<Sortie | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Fetch sorties
  useEffect(() => {
    const fetchSorties = async () => {
      if (!token) return

      setLoading(true)
      setError(null)

      try {
        const url = new URL('http://localhost:3001/api/sorties')

        // Apply program filter
        if (currentProgramId) {
          url.searchParams.append('program_id', currentProgramId.toString())
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data: SortiesResponse = await response.json()
        setSorties(data.sorties)
        setTotal(data.total)
      } catch (err) {
        console.error('Error fetching sorties:', err)
        setError(err instanceof Error ? err.message : 'Failed to load sorties')
      } finally {
        setLoading(false)
      }
    }

    fetchSorties()
  }, [token, currentProgramId])

  // Apply search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSorties(sorties)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = sorties.filter(sortie =>
      sortie.mission_id.toLowerCase().includes(query) ||
      sortie.serno.toLowerCase().includes(query) ||
      (sortie.ac_tailno && sortie.ac_tailno.toLowerCase().includes(query)) ||
      (sortie.sortie_effect && sortie.sortie_effect.toLowerCase().includes(query))
    )
    setFilteredSorties(filtered)
  }, [searchQuery, sorties])

  // Fetch assets when modal opens
  const fetchAssets = async () => {
    if (!token || !currentProgramId) return

    setAssetsLoading(true)
    try {
      const url = new URL('http://localhost:3001/api/assets')
      url.searchParams.append('program_id', currentProgramId.toString())

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setAssets(data.assets || [])
    } catch (err) {
      console.error('Error fetching assets:', err)
      setAssets([])
    } finally {
      setAssetsLoading(false)
    }
  }

  // Open add modal
  const openAddModal = () => {
    setIsAddModalOpen(true)
    setSubmitError(null)
    setSubmitSuccess(null)
    setNewSortieForm({
      asset_id: '',
      mission_id: '',
      sortie_date: new Date().toISOString().split('T')[0], // Default to today
      sortie_effect: '',
      range: '',
      remarks: '',
    })
    fetchAssets()
  }

  // Close add modal
  const closeAddModal = () => {
    if (submitting) return // Prevent closing while submitting
    setIsAddModalOpen(false)
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  // Handle form changes
  const handleFormChange = (field: string, value: string) => {
    setNewSortieForm(prev => ({ ...prev, [field]: value }))
  }

  // Submit new sortie
  const handleSubmitNewSortie = async () => {
    if (!token) return

    // Validation
    if (!newSortieForm.asset_id || !newSortieForm.mission_id || !newSortieForm.sortie_date) {
      setSubmitError('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const response = await fetch('http://localhost:3001/api/sorties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSortieForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setSubmitSuccess('Sortie created successfully!')

      // Refresh the sorties list
      const refreshResponse = await fetch(
        `http://localhost:3001/api/sorties?program_id=${currentProgramId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setSorties(refreshData.sorties)
        setTotal(refreshData.total)
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        closeAddModal()
      }, 1500)
    } catch (err) {
      console.error('Error creating sortie:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to create sortie')
    } finally {
      setSubmitting(false)
    }
  }

  // Open edit modal
  const openEditModal = (sortie: Sortie, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click navigation
    setEditingSortie(sortie)
    setEditSortieForm({
      mission_id: sortie.mission_id,
      sortie_date: sortie.sortie_date.split('T')[0], // Format for date input
      sortie_effect: sortie.sortie_effect || '',
      range: sortie.range || '',
      remarks: sortie.remarks || '',
    })
    setIsEditModalOpen(true)
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  // Close edit modal
  const closeEditModal = () => {
    if (submitting) return // Prevent closing while submitting
    setIsEditModalOpen(false)
    setEditingSortie(null)
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  // Handle edit form changes
  const handleEditFormChange = (field: string, value: string) => {
    setEditSortieForm(prev => ({ ...prev, [field]: value }))
  }

  // Submit edit sortie
  const handleSubmitEditSortie = async () => {
    if (!token || !editingSortie) return

    // Validation
    if (!editSortieForm.mission_id || !editSortieForm.sortie_date) {
      setSubmitError('Mission ID and Sortie Date are required')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const response = await fetch(`http://localhost:3001/api/sorties/${editingSortie.sortie_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editSortieForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setSubmitSuccess('Sortie updated successfully!')

      // Refresh the sorties list
      const refreshResponse = await fetch(
        `http://localhost:3001/api/sorties?program_id=${currentProgramId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setSorties(refreshData.sorties)
        setTotal(refreshData.total)
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        closeEditModal()
      }, 1500)
    } catch (err) {
      console.error('Error updating sortie:', err)
      setSubmitError(err instanceof Error ? err.message : 'Failed to update sortie')
    } finally {
      setSubmitting(false)
    }
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (sortie: Sortie, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent row click navigation
    setSortieToDelete(sortie)
    setIsDeleteDialogOpen(true)
    setDeleteError(null)
  }

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    if (deleting) return // Prevent closing while deleting
    setIsDeleteDialogOpen(false)
    setSortieToDelete(null)
    setDeleteError(null)
  }

  // Handle delete sortie
  const handleDeleteSortie = async () => {
    if (!token || !sortieToDelete) return

    setDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/sorties/${sortieToDelete.sortie_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      // Refresh the sorties list
      const refreshResponse = await fetch(
        `http://localhost:3001/api/sorties?program_id=${currentProgramId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        setSorties(refreshData.sorties)
        setTotal(refreshData.total)
      }

      // Close dialog
      closeDeleteDialog()
    } catch (err) {
      console.error('Error deleting sortie:', err)
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete sortie')
    } finally {
      setDeleting(false)
    }
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sorties...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error loading sorties</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sorties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track sortie missions and aircraft operations
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Sortie
        </button>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by mission ID, serial number, tail number, or effect..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Sorties Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mission ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tail Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sortie Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sortie Effect
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Unit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSorties.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'No sorties match your search' : 'No sorties found'}
                  </td>
                </tr>
              ) : (
                filteredSorties.map((sortie) => (
                  <tr
                    key={sortie.sortie_id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/sorties/${sortie.sortie_id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sortie.mission_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sortie.serno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sortie.ac_tailno || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(sortie.sortie_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sortie.sortie_effect ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sortie.sortie_effect.includes('Full')
                            ? 'bg-green-100 text-green-800'
                            : sortie.sortie_effect.includes('Partial')
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sortie.sortie_effect}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sortie.range || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sortie.current_unit || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={(e) => openEditModal(sortie, e)}
                          className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                          title="Edit sortie"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        {(user?.role === 'ADMIN' || user?.role === 'DEPOT_MANAGER') && (
                          <button
                            onClick={(e) => openDeleteDialog(sortie, e)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                            title="Delete sortie"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with count */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredSorties.length}</span> of{' '}
              <span className="font-medium">{total}</span> sorties
              {searchQuery && (
                <span className="text-gray-500"> (filtered by "{searchQuery}")</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Sortie Modal */}
      <Dialog open={isAddModalOpen} onClose={closeAddModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Create New Sortie
              </Dialog.Title>
              <button onClick={closeAddModal} className="text-gray-400 hover:text-gray-500" disabled={submitting}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{submitSuccess}</p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="asset_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset / Aircraft <span className="text-red-500">*</span>
                </label>
                <select
                  id="asset_id"
                  value={newSortieForm.asset_id}
                  onChange={(e) => handleFormChange('asset_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={assetsLoading || submitting}
                  required
                >
                  <option value="">Select an asset...</option>
                  {assets.map((asset) => (
                    <option key={asset.asset_id} value={asset.asset_id}>
                      {asset.serno} - {asset.name} ({asset.status_cd})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mission_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Mission ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mission_id"
                  value={newSortieForm.mission_id}
                  onChange={(e) => handleFormChange('mission_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., CRIIS-SORTIE-005"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="sortie_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Sortie Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="sortie_date"
                  value={newSortieForm.sortie_date}
                  onChange={(e) => handleFormChange('sortie_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <label htmlFor="sortie_effect" className="block text-sm font-medium text-gray-700 mb-1">
                  Sortie Effectiveness Code
                </label>
                <select
                  id="sortie_effect"
                  value={newSortieForm.sortie_effect}
                  onChange={(e) => handleFormChange('sortie_effect', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={submitting}
                >
                  <option value="">Select effectiveness...</option>
                  <option value="Full Mission Capable">Full Mission Capable</option>
                  <option value="Partial Mission Capable">Partial Mission Capable</option>
                  <option value="Non-Mission Capable">Non-Mission Capable</option>
                </select>
              </div>

              <div>
                <label htmlFor="range" className="block text-sm font-medium text-gray-700 mb-1">
                  Range Code
                </label>
                <input
                  type="text"
                  id="range"
                  value={newSortieForm.range}
                  onChange={(e) => handleFormChange('range', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., R-2508"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  value={newSortieForm.remarks}
                  onChange={(e) => handleFormChange('remarks', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter any additional remarks..."
                  rows={3}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeAddModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewSortie}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || !newSortieForm.asset_id || !newSortieForm.mission_id || !newSortieForm.sortie_date}
              >
                {submitting ? 'Creating...' : 'Create Sortie'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Sortie Modal */}
      <Dialog open={isEditModalOpen} onClose={closeEditModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Edit Sortie
              </Dialog.Title>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-500"
                disabled={submitting}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Mission ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mission ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editSortieForm.mission_id}
                  onChange={(e) => handleEditFormChange('mission_id', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., CRIIS-SORTIE-001"
                  disabled={submitting}
                />
              </div>

              {/* Sortie Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sortie Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={editSortieForm.sortie_date}
                  onChange={(e) => handleEditFormChange('sortie_date', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  disabled={submitting}
                />
              </div>

              {/* Sortie Effect */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sortie Effect
                </label>
                <select
                  value={editSortieForm.sortie_effect}
                  onChange={(e) => handleEditFormChange('sortie_effect', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  disabled={submitting}
                >
                  <option value="">-- Select Effect --</option>
                  <option value="Full Mission Capable">Full Mission Capable</option>
                  <option value="Partial Mission Capable">Partial Mission Capable</option>
                  <option value="Non-Mission Capable">Non-Mission Capable</option>
                </select>
              </div>

              {/* Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Range
                </label>
                <input
                  type="text"
                  value={editSortieForm.range}
                  onChange={(e) => handleEditFormChange('range', e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Test Range Alpha"
                  disabled={submitting}
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={editSortieForm.remarks}
                  onChange={(e) => handleEditFormChange('remarks', e.target.value)}
                  rows={3}
                  className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Additional notes or comments..."
                  disabled={submitting}
                />
              </div>

              {/* Error/Success Messages */}
              {submitError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}
              {submitSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800">{submitSuccess}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEditSortie}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Delete Sortie
              </Dialog.Title>
            </div>

            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this sortie? This action cannot be undone.
              </p>

              {sortieToDelete && (
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Mission ID:</span>
                    <span className="text-sm text-gray-900">{sortieToDelete.mission_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Serial Number:</span>
                    <span className="text-sm text-gray-900">{sortieToDelete.serno}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Sortie Date:</span>
                    <span className="text-sm text-gray-900">{formatDate(sortieToDelete.sortie_date)}</span>
                  </div>
                  {sortieToDelete.sortie_effect && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Effect:</span>
                      <span className="text-sm text-gray-900">{sortieToDelete.sortie_effect}</span>
                    </div>
                  )}
                </div>
              )}

              {deleteError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-800">{deleteError}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSortie}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Sortie'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
