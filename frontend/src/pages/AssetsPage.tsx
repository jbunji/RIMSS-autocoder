import { useState, useEffect, useCallback, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, Transition } from '@headlessui/react'
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  CubeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// Reference data interfaces
interface Location {
  loc_id: number
  loc_cd: string
  loc_name: string
}

interface AssetStatus {
  status_cd: string
  status_name: string
  description: string
}

// Zod schema for asset creation
const createAssetSchema = z.object({
  partno: z.string()
    .min(1, 'Part number is required')
    .max(50, 'Part number must be at most 50 characters')
    .regex(/^[A-Za-z0-9\-_]+$/, 'Part number can only contain letters, numbers, hyphens, and underscores'),
  serno: z.string()
    .min(1, 'Serial number is required')
    .max(50, 'Serial number must be at most 50 characters'),
  name: z.string()
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  status_cd: z.string().min(1, 'Status is required'),
  admin_loc: z.string().min(1, 'Administrative location is required'),
  cust_loc: z.string().min(1, 'Custodial location is required'),
  notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
})

type CreateAssetFormData = z.infer<typeof createAssetSchema>

// Asset interface matching backend
interface Asset {
  asset_id: number
  serno: string
  partno: string
  part_name: string
  pgm_id: number
  status_cd: string
  status_name: string
  active: boolean
  location: string
  loc_type: 'depot' | 'field'
  in_transit: boolean
  bad_actor: boolean
  last_maint_date: string | null
  next_pmi_date: string | null
  eti_hours: number | null
  remarks: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
}

interface ProgramInfo {
  pgm_id: number
  pgm_cd: string
  pgm_name: string
}

interface AssetsResponse {
  assets: Asset[]
  pagination: Pagination
  program: ProgramInfo
}

// Status badge colors
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  FMC: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  PMC: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  NMCM: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  NMCS: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  CNDM: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
}

export default function AssetsPage() {
  const navigate = useNavigate()
  const { token, currentProgramId, user } = useAuthStore()

  // Check if user can create assets
  const canCreateAsset = user && ['ADMIN', 'DEPOT_MANAGER'].includes(user.role)
  // Check if user can delete assets (only admins)
  const canDeleteAsset = user && user.role === 'ADMIN'

  // State
  const [assets, setAssets] = useState<Asset[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 25, total: 0, total_pages: 1 })
  const [program, setProgram] = useState<ProgramInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)

  // Delete confirmation modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Reference data for form
  const [adminLocations, setAdminLocations] = useState<Location[]>([])
  const [custodialLocations, setCustodialLocations] = useState<Location[]>([])
  const [assetStatuses, setAssetStatuses] = useState<AssetStatus[]>([])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Sorting
  type SortColumn = 'serno' | 'partno' | 'part_name' | 'status_cd' | 'location' | 'eti_hours' | 'next_pmi_date'
  type SortOrder = 'asc' | 'desc'
  const [sortBy, setSortBy] = useState<SortColumn>('serno')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAssetFormData>({
    resolver: zodResolver(createAssetSchema),
    defaultValues: {
      partno: '',
      serno: '',
      name: '',
      status_cd: '',
      admin_loc: '',
      cust_loc: '',
      notes: '',
    },
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch assets
  const fetchAssets = useCallback(async (page: number = 1) => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (currentProgramId) params.append('program_id', currentProgramId.toString())
      params.append('page', page.toString())
      params.append('limit', '25')
      if (statusFilter) params.append('status', statusFilter)
      if (debouncedSearch) params.append('search', debouncedSearch)
      params.append('sort_by', sortBy)
      params.append('sort_order', sortOrder)

      const response = await fetch(`http://localhost:3001/api/assets?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch assets')
      }

      const data: AssetsResponse = await response.json()
      setAssets(data.assets)
      setPagination(data.pagination)
      setProgram(data.program)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching assets:', err)
    } finally {
      setLoading(false)
    }
  }, [token, currentProgramId, statusFilter, debouncedSearch, sortBy, sortOrder])

  // Fetch reference data for form
  const fetchReferenceData = useCallback(async () => {
    if (!token) return

    try {
      const [locResponse, statusResponse] = await Promise.all([
        fetch('http://localhost:3001/api/reference/locations', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('http://localhost:3001/api/reference/asset-statuses', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ])

      if (locResponse.ok) {
        const locData = await locResponse.json()
        setAdminLocations(locData.admin_locations || [])
        setCustodialLocations(locData.custodial_locations || [])
      }

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        setAssetStatuses(statusData.statuses || [])
      }
    } catch (err) {
      console.error('Error fetching reference data:', err)
    }
  }, [token])

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchAssets(1)
    fetchReferenceData()
  }, [fetchAssets, fetchReferenceData])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchAssets(newPage)
    }
  }

  // Handle form submission
  const onSubmit = async (data: CreateAssetFormData) => {
    try {
      setModalError(null)
      const response = await fetch('http://localhost:3001/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          pgm_id: currentProgramId || 1,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage(`Asset "${result.asset.serno}" created successfully!`)
        setIsModalOpen(false)
        reset()
        fetchAssets(1) // Refresh the asset list

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setModalError(errorData.error || 'Failed to create asset')
      }
    } catch (err) {
      setModalError('Failed to create asset. Please try again.')
      console.error('Error creating asset:', err)
    }
  }

  // Modal handlers
  const openModal = () => {
    reset()
    setModalError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    reset()
    setModalError(null)
  }

  // Delete modal handlers
  const openDeleteModal = (asset: Asset) => {
    setAssetToDelete(asset)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setAssetToDelete(null)
    setDeleteError(null)
  }

  const handleDeleteAsset = async () => {
    if (!assetToDelete || !token) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/assets/${assetToDelete.asset_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage(result.message || `Asset "${assetToDelete.serno}" deleted successfully!`)
        closeDeleteModal()
        fetchAssets(pagination.page) // Refresh the list

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setDeleteError(errorData.error || 'Failed to delete asset')
      }
    } catch (err) {
      setDeleteError('Failed to delete asset. Please try again.')
      console.error('Error deleting asset:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Handle column sorting
  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      // Toggle order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // New column, start with ascending
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  // Sortable column header component
  const SortableHeader = ({
    column,
    label
  }: {
    column: SortColumn
    label: string
  }) => {
    const isActive = sortBy === column
    return (
      <button
        type="button"
        onClick={() => handleSort(column)}
        className="group inline-flex items-center gap-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
      >
        {label}
        <span className="flex-none">
          {isActive ? (
            sortOrder === 'asc' ? (
              <ChevronUpIcon className="h-4 w-4 text-primary-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-primary-500" />
            )
          ) : (
            <ChevronUpDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
          )}
        </span>
      </button>
    )
  }

  // Get status badge
  const StatusBadge = ({ status, statusName }: { status: string; statusName: string }) => {
    const colors = statusColors[status] || statusColors.CNDM
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
        {status}
        <span className="sr-only"> - {statusName}</span>
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            {program ? `Viewing assets for ${program.pgm_cd} - ${program.pgm_name}` : 'Loading...'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {pagination.total} total asset{pagination.total !== 1 ? 's' : ''}
          </span>
          {canCreateAsset && (
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Asset
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by S/N, P/N, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="FMC">FMC - Full Mission Capable</option>
              <option value="PMC">PMC - Partial Mission Capable</option>
              <option value="NMCM">NMCM - Not Mission Capable (Maintenance)</option>
              <option value="NMCS">NMCS - Not Mission Capable (Supply)</option>
              <option value="CNDM">CNDM - Cannot Determine Mission</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => fetchAssets(pagination.page)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Loading assets...</p>
            </div>
          </div>
        ) : assets.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No assets found</p>
              <p className="text-xs text-gray-400">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="serno" label="Serial Number" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="partno" label="Part Number" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="part_name" label="Name" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="status_cd" label="Status" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="location" label="Location" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="eti_hours" label="ETI Hours" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="next_pmi_date" label="Next PMI" />
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((asset) => (
                    <tr
                      key={asset.asset_id}
                      className={`hover:bg-gray-50 ${asset.bad_actor ? 'bg-red-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {asset.serno}
                          </div>
                          {asset.bad_actor && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800" title="Bad Actor">
                              BA
                            </span>
                          )}
                          {asset.in_transit && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800" title="In Transit">
                              Transit
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.partno}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{asset.part_name}</div>
                        {asset.remarks && (
                          <div className="text-xs text-gray-500 truncate max-w-xs" title={asset.remarks}>
                            {asset.remarks}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={asset.status_cd} statusName={asset.status_name} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{asset.location}</div>
                        <div className="text-xs text-gray-500 capitalize">{asset.loc_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.eti_hours !== null ? asset.eti_hours.toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(asset.next_pmi_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => navigate(`/assets/${asset.asset_id}`)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </button>
                          {canDeleteAsset && (
                            <button
                              onClick={() => openDeleteModal(asset)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete asset"
                            >
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Delete {asset.serno}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
                      of <span className="font-medium">{pagination.total}</span> results
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
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {/* Page numbers */}
                      {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.page
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
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
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <StatusBadge status="FMC" statusName="Full Mission Capable" />
            <span className="ml-2 text-xs text-gray-500">Full Mission Capable</span>
          </div>
          <div className="flex items-center">
            <StatusBadge status="PMC" statusName="Partial Mission Capable" />
            <span className="ml-2 text-xs text-gray-500">Partial Mission Capable</span>
          </div>
          <div className="flex items-center">
            <StatusBadge status="NMCM" statusName="Not Mission Capable Maintenance" />
            <span className="ml-2 text-xs text-gray-500">Not Mission Capable (Maint)</span>
          </div>
          <div className="flex items-center">
            <StatusBadge status="NMCS" statusName="Not Mission Capable Supply" />
            <span className="ml-2 text-xs text-gray-500">Not Mission Capable (Supply)</span>
          </div>
          <div className="flex items-center">
            <StatusBadge status="CNDM" statusName="Cannot Determine Mission" />
            <span className="ml-2 text-xs text-gray-500">Cannot Determine Mission</span>
          </div>
        </div>
        <div className="mt-3 flex gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">BA</span>
            <span className="ml-1">= Bad Actor (chronic failures)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Transit</span>
            <span className="ml-1">= In Transit</span>
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <CubeIcon className="h-6 w-6 mr-2 text-primary-600" />
                    Add New Asset
                  </Dialog.Title>

                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    {/* Error display inside modal */}
                    {modalError && (
                      <div className="rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-800">{modalError}</p>
                      </div>
                    )}

                    {/* Part Number */}
                    <div>
                      <label htmlFor="partno" className="block text-sm font-medium text-gray-700">
                        Part Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="partno"
                        {...register('partno')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.partno
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="PN-SENSOR-A"
                      />
                      {errors.partno && (
                        <p className="mt-1 text-sm text-red-600">{errors.partno.message}</p>
                      )}
                    </div>

                    {/* Serial Number */}
                    <div>
                      <label htmlFor="serno" className="block text-sm font-medium text-gray-700">
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="serno"
                        {...register('serno')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.serno
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="CRIIS-011"
                      />
                      {errors.serno && (
                        <p className="mt-1 text-sm text-red-600">{errors.serno.message}</p>
                      )}
                    </div>

                    {/* Asset Name (optional) */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Asset Name <span className="text-gray-400">(optional)</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="Sensor Unit A-3"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        If not provided, a name will be generated from the part and serial number.
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <label htmlFor="status_cd" className="block text-sm font-medium text-gray-700">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="status_cd"
                        {...register('status_cd')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.status_cd
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      >
                        <option value="">Select a status...</option>
                        {assetStatuses.map((status) => (
                          <option key={status.status_cd} value={status.status_cd}>
                            {status.status_cd} - {status.status_name}
                          </option>
                        ))}
                      </select>
                      {errors.status_cd && (
                        <p className="mt-1 text-sm text-red-600">{errors.status_cd.message}</p>
                      )}
                    </div>

                    {/* Administrative Location */}
                    <div>
                      <label htmlFor="admin_loc" className="block text-sm font-medium text-gray-700">
                        Administrative Location <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="admin_loc"
                        {...register('admin_loc')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.admin_loc
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      >
                        <option value="">Select administrative location...</option>
                        {adminLocations.map((loc) => (
                          <option key={loc.loc_cd} value={loc.loc_cd}>
                            {loc.loc_name}
                          </option>
                        ))}
                      </select>
                      {errors.admin_loc && (
                        <p className="mt-1 text-sm text-red-600">{errors.admin_loc.message}</p>
                      )}
                    </div>

                    {/* Custodial Location */}
                    <div>
                      <label htmlFor="cust_loc" className="block text-sm font-medium text-gray-700">
                        Custodial Location <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="cust_loc"
                        {...register('cust_loc')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.cust_loc
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      >
                        <option value="">Select custodial location...</option>
                        {custodialLocations.map((loc) => (
                          <option key={loc.loc_cd} value={loc.loc_cd}>
                            {loc.loc_name}
                          </option>
                        ))}
                      </select>
                      {errors.cust_loc && (
                        <p className="mt-1 text-sm text-red-600">{errors.cust_loc.message}</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes <span className="text-gray-400">(optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={3}
                        {...register('notes')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.notes
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="Any additional notes about this asset..."
                      />
                      {errors.notes && (
                        <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Creating...' : 'Create Asset'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDeleteModal}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Delete Asset
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this asset? This action cannot be undone.
                        </p>
                        {assetToDelete && (
                          <div className="mt-3 bg-gray-50 rounded-md p-3">
                            <dl className="text-sm">
                              <div className="flex justify-between py-1">
                                <dt className="font-medium text-gray-500">Serial Number:</dt>
                                <dd className="text-gray-900">{assetToDelete.serno}</dd>
                              </div>
                              <div className="flex justify-between py-1">
                                <dt className="font-medium text-gray-500">Part Number:</dt>
                                <dd className="text-gray-900">{assetToDelete.partno}</dd>
                              </div>
                              <div className="flex justify-between py-1">
                                <dt className="font-medium text-gray-500">Name:</dt>
                                <dd className="text-gray-900">{assetToDelete.part_name}</dd>
                              </div>
                              <div className="flex justify-between py-1">
                                <dt className="font-medium text-gray-500">Status:</dt>
                                <dd className="text-gray-900">{assetToDelete.status_cd}</dd>
                              </div>
                            </dl>
                          </div>
                        )}
                      </div>

                      {/* Error display */}
                      {deleteError && (
                        <div className="mt-3 rounded-md bg-red-50 p-3">
                          <p className="text-sm text-red-800">{deleteError}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeDeleteModal}
                      disabled={isDeleting}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAsset}
                      disabled={isDeleting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Asset'}
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
