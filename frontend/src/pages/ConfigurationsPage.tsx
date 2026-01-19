import { useState, useEffect, useCallback, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, Transition } from '@headlessui/react'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  Cog6ToothIcon,
  CubeIcon,
  CircleStackIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// Part interface for dropdown
interface Part {
  partno_id: number
  partno: string
  name: string
  pgm_id: number
}

// Zod schema for creating configuration
const createConfigSchema = z.object({
  cfg_name: z.string()
    .min(1, 'Configuration name is required')
    .max(100, 'Name must be at most 100 characters'),
  cfg_type: z.enum(['ASSEMBLY', 'SYSTEM', 'COMPONENT'], {
    errorMap: () => ({ message: 'Please select a valid configuration type' }),
  }),
  partno_id: z.string().optional(),
  description: z.string().max(500, 'Description must be at most 500 characters').optional().nullable(),
})

type CreateConfigFormData = z.infer<typeof createConfigSchema>

// Zod schema for editing configuration
const editConfigSchema = z.object({
  cfg_name: z.string()
    .min(1, 'Configuration name is required')
    .max(100, 'Name must be at most 100 characters'),
  cfg_type: z.enum(['ASSEMBLY', 'SYSTEM', 'COMPONENT'], {
    errorMap: () => ({ message: 'Please select a valid configuration type' }),
  }),
  description: z.string().max(500, 'Description must be at most 500 characters').optional().nullable(),
  active: z.boolean(),
})

type EditConfigFormData = z.infer<typeof editConfigSchema>

// Configuration interface matching backend
interface Configuration {
  cfg_set_id: number
  cfg_name: string
  cfg_type: string
  pgm_id: number
  partno_id: number | null
  partno: string | null
  part_name: string | null
  description: string | null
  active: boolean
  ins_by: string
  ins_date: string
  chg_by: string | null
  chg_date: string | null
  bom_item_count: number
  asset_count: number
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

interface ConfigurationsResponse {
  configurations: Configuration[]
  pagination: Pagination
  program: ProgramInfo
}

// Type badge colors
const typeColors: Record<string, { bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  SYSTEM: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: CircleStackIcon },
  ASSEMBLY: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: CubeIcon },
  COMPONENT: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: Cog6ToothIcon },
}

export default function ConfigurationsPage() {
  const navigate = useNavigate()
  const { token, currentProgramId, user } = useAuthStore()

  // Check if user can edit configurations
  const canEditConfig = user && ['ADMIN', 'DEPOT_MANAGER'].includes(user.role)

  // State
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, total_pages: 1 })
  const [program, setProgram] = useState<ProgramInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [availableParts, setAvailableParts] = useState<Part[]>([])
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSuccess, setCreateSuccess] = useState(false)

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [configToEdit, setConfigToEdit] = useState<Configuration | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Sorting
  type SortColumn = 'cfg_name' | 'cfg_type' | 'partno' | 'bom_item_count' | 'asset_count' | 'ins_date'
  type SortOrder = 'asc' | 'desc'
  const [sortBy, setSortBy] = useState<SortColumn>('cfg_name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // Form setup for creating
  const createForm = useForm<CreateConfigFormData>({
    resolver: zodResolver(createConfigSchema),
    defaultValues: {
      cfg_name: '',
      cfg_type: undefined,
      partno_id: '',
      description: '',
    },
  })

  // Form setup for editing
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditConfigFormData>({
    resolver: zodResolver(editConfigSchema),
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch configurations
  const fetchConfigurations = useCallback(async (page: number = 1) => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (currentProgramId) params.append('program_id', currentProgramId.toString())
      params.append('page', page.toString())
      params.append('limit', '10')
      if (typeFilter) params.append('type', typeFilter)
      if (debouncedSearch) params.append('search', debouncedSearch)
      params.append('sort_by', sortBy)
      params.append('sort_order', sortOrder)

      const response = await fetch(`http://localhost:3001/api/configurations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch configurations')
      }

      const data: ConfigurationsResponse = await response.json()
      setConfigurations(data.configurations)
      setPagination(data.pagination)
      setProgram(data.program)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching configurations:', err)
    } finally {
      setLoading(false)
    }
  }, [token, currentProgramId, typeFilter, debouncedSearch, sortBy, sortOrder])

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchConfigurations(1)
  }, [fetchConfigurations])

  // Fetch available parts for the create form dropdown
  const fetchParts = useCallback(async () => {
    if (!token) return

    try {
      const params = new URLSearchParams()
      if (currentProgramId) {
        params.append('program_id', currentProgramId.toString())
      }

      const response = await fetch(`http://localhost:3001/api/reference/parts?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableParts(data.parts || [])
      }
    } catch (err) {
      console.error('Failed to fetch parts:', err)
    }
  }, [token, currentProgramId])

  // Fetch parts when program changes or modal opens
  useEffect(() => {
    if (isCreateModalOpen) {
      fetchParts()
    }
  }, [isCreateModalOpen, fetchParts])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchConfigurations(newPage)
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

  // Get type badge
  const TypeBadge = ({ type }: { type: string }) => {
    const colors = typeColors[type] || typeColors.COMPONENT
    const IconComponent = colors.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
        <IconComponent className="h-3.5 w-3.5" />
        {type}
      </span>
    )
  }

  // Open edit modal
  const openEditModal = (config: Configuration) => {
    setConfigToEdit(config)
    setModalError(null)
    reset({
      cfg_name: config.cfg_name,
      cfg_type: config.cfg_type as 'ASSEMBLY' | 'SYSTEM' | 'COMPONENT',
      description: config.description || '',
      active: config.active,
    })
    setIsEditModalOpen(true)
  }

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setConfigToEdit(null)
    setModalError(null)
    reset()
  }

  // Handle edit form submit
  const onEditSubmit = async (data: EditConfigFormData) => {
    if (!configToEdit || !token) return

    setModalError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${configToEdit.cfg_set_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cfg_name: data.cfg_name,
          cfg_type: data.cfg_type,
          description: data.description || null,
          active: data.active,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update configuration')
      }

      // Refresh the list
      await fetchConfigurations(pagination.page)

      // Show success message and close modal
      setSuccessMessage(`Configuration "${data.cfg_name}" updated successfully`)
      closeEditModal()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Failed to update configuration')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurations</h1>
          <p className="mt-1 text-sm text-gray-500">
            {program ? `Viewing configurations for ${program.pgm_cd} - ${program.pgm_name}` : 'Loading...'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {pagination.total} configuration{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckIcon className="h-5 w-5 text-green-400" />
            <p className="ml-3 text-sm text-green-700">{successMessage}</p>
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
                placeholder="Search by name, P/N, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Configuration Type
            </label>
            <select
              id="type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="SYSTEM">System</option>
              <option value="ASSEMBLY">Assembly</option>
              <option value="COMPONENT">Component</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => fetchConfigurations(pagination.page)}
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

      {/* Configurations Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Loading configurations...</p>
            </div>
          </div>
        ) : configurations.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">No configurations found</p>
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
                      <SortableHeader column="cfg_name" label="Configuration Name" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="cfg_type" label="Type" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="partno" label="Part Number" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="bom_item_count" label="BOM Items" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="asset_count" label="Assets" />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      <SortableHeader column="ins_date" label="Created" />
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {configurations.map((config) => (
                    <tr
                      key={config.cfg_set_id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {config.cfg_name}
                        </div>
                        {config.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs" title={config.description}>
                            {config.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TypeBadge type={config.cfg_type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{config.partno || '-'}</div>
                        {config.part_name && (
                          <div className="text-xs text-gray-500">{config.part_name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {config.bom_item_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {config.asset_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(config.ins_date)}
                        </div>
                        <div className="text-xs text-gray-400">
                          by {config.ins_by}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        {canEditConfig && (
                          <button
                            onClick={() => openEditModal(config)}
                            className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/configurations/${config.cfg_set_id}`)}
                          className="text-gray-600 hover:text-gray-900"
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
    </div>
  )
}
