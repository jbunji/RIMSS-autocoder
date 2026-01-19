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

  // Reference data for form
  const [adminLocations, setAdminLocations] = useState<Location[]>([])
  const [custodialLocations, setCustodialLocations] = useState<Location[]>([])
  const [assetStatuses, setAssetStatuses] = useState<AssetStatus[]>([])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

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
  }, [token, currentProgramId, statusFilter, debouncedSearch])

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchAssets(1)
  }, [fetchAssets])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchAssets(newPage)
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
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">
            {pagination.total} total asset{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Part Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ETI Hours
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next PMI
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
                        <button
                          onClick={() => navigate(`/assets/${asset.asset_id}`)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </button>
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
    </div>
  )
}
