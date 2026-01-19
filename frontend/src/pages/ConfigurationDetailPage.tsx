import { useState, useEffect, useCallback, Fragment } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tab, Dialog, Transition } from '@headlessui/react'
import {
  ChevronLeftIcon,
  Cog6ToothIcon,
  CubeIcon,
  CircleStackIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// Zod schema for adding BOM item
const addBomItemSchema = z.object({
  partno_c: z.string().min(1, 'Part number is required'),
  part_name_c: z.string().min(1, 'Part name is required'),
  qpa: z.number({ invalid_type_error: 'Quantity is required' })
    .min(1, 'Quantity must be at least 1'),
  sort_order: z.number({ invalid_type_error: 'Sort order is required' })
    .min(1, 'Sort order must be at least 1'),
})

type AddBomItemFormData = z.infer<typeof addBomItemSchema>

// Part interface for dropdown
interface Part {
  partno_id: number
  partno: string
  name: string
  pgm_id: number
}

// Configuration interface
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
  program_cd: string
  program_name: string
}

// BOM Item interface
interface BOMItem {
  list_id: number
  cfg_set_id: number
  partno_p: string
  partno_c: string
  part_name_c: string
  sort_order: number
  qpa: number
  active: boolean
}

// BOM Response interface
interface BOMResponse {
  bom: {
    parent_part: {
      partno: string
      name: string
    }
    items: BOMItem[]
    total_items: number
  }
}

// Type badge colors
const typeColors: Record<string, { bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  SYSTEM: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: CircleStackIcon },
  ASSEMBLY: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: CubeIcon },
  COMPONENT: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: Cog6ToothIcon },
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ConfigurationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()

  // Check if user can edit BOM (only ADMIN and DEPOT_MANAGER)
  const canEditBom = user && ['ADMIN', 'DEPOT_MANAGER'].includes(user.role)

  // State
  const [configuration, setConfiguration] = useState<Configuration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // BOM state
  const [bomData, setBomData] = useState<BOMResponse['bom'] | null>(null)
  const [bomLoading, setBomLoading] = useState(false)
  const [bomError, setBomError] = useState<string | null>(null)

  // Delete BOM item modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<BOMItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Add BOM item modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [availableParts, setAvailableParts] = useState<Part[]>([])
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)
  const [partSearchQuery, setPartSearchQuery] = useState('')
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)

  // Form setup for adding BOM item
  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    setValue: setAddValue,
    formState: { errors: addErrors, isSubmitting: isAddSubmitting },
  } = useForm<AddBomItemFormData>({
    resolver: zodResolver(addBomItemSchema),
    defaultValues: {
      partno_c: '',
      part_name_c: '',
      qpa: 1,
      sort_order: 1,
    },
  })

  // Fetch configuration detail
  const fetchConfiguration = useCallback(async () => {
    if (!token || !id) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch configuration')
      }

      const data = await response.json()
      setConfiguration(data.configuration)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching configuration:', err)
    } finally {
      setLoading(false)
    }
  }, [token, id])

  // Fetch BOM data
  const fetchBOM = useCallback(async () => {
    if (!token || !id) return

    setBomLoading(true)
    setBomError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/bom`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch BOM')
      }

      const data: BOMResponse = await response.json()
      setBomData(data.bom)
    } catch (err) {
      setBomError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching BOM:', err)
    } finally {
      setBomLoading(false)
    }
  }, [token, id])

  // Fetch on mount
  useEffect(() => {
    fetchConfiguration()
    fetchBOM()
  }, [fetchConfiguration, fetchBOM])

  // Open delete confirmation modal
  const openDeleteModal = (item: BOMItem) => {
    setItemToDelete(item)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
    setDeleteError(null)
    setIsDeleting(false)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !token || !id) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/bom/${itemToDelete.list_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove part from BOM')
      }

      // Refresh the BOM data
      await fetchBOM()
      // Refresh configuration to update bom_item_count
      await fetchConfiguration()

      // Show success message and close modal
      setSuccessMessage(`Part "${itemToDelete.partno_c}" removed from BOM successfully`)
      closeDeleteModal()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to remove part from BOM')
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

  // Format date with time
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Loading configuration...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/configurations')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Configurations
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!configuration) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/configurations')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Back to Configurations
          </button>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">Configuration not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center">
        <button
          onClick={() => navigate('/configurations')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Configurations
        </button>
      </div>

      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                typeColors[configuration.cfg_type]?.bg || 'bg-gray-100'
              }`}>
                {configuration.cfg_type === 'SYSTEM' && <CircleStackIcon className="h-6 w-6 text-purple-600" />}
                {configuration.cfg_type === 'ASSEMBLY' && <CubeIcon className="h-6 w-6 text-blue-600" />}
                {configuration.cfg_type === 'COMPONENT' && <Cog6ToothIcon className="h-6 w-6 text-green-600" />}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{configuration.cfg_name}</h1>
                <TypeBadge type={configuration.cfg_type} />
                {configuration.active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircleIcon className="h-3 w-3" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <XCircleIcon className="h-3 w-3" />
                    Inactive
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {configuration.program_cd} - {configuration.program_name}
              </p>
              {configuration.description && (
                <p className="mt-2 text-sm text-gray-700">{configuration.description}</p>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Part Number: <span className="font-medium text-gray-900">{configuration.partno || 'N/A'}</span></p>
            {configuration.part_name && (
              <p className="text-xs text-gray-400">{configuration.part_name}</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <ListBulletIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">BOM Items</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{configuration.bom_item_count}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CubeIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Linked Assets</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{configuration.asset_count}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Created</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">{formatDate(configuration.ins_date)}</p>
            <p className="text-xs text-gray-400">by {configuration.ins_by}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Last Modified</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">{configuration.chg_date ? formatDate(configuration.chg_date) : 'Never'}</p>
            {configuration.chg_by && <p className="text-xs text-gray-400">by {configuration.chg_by}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-primary-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
              )
            }
          >
            <div className="flex items-center justify-center gap-2">
              <DocumentTextIcon className="h-5 w-5" />
              Overview
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-primary-700 shadow'
                  : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
              )
            }
          >
            <div className="flex items-center justify-center gap-2">
              <ListBulletIcon className="h-5 w-5" />
              BOM ({bomData?.total_items || configuration.bom_item_count})
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          {/* Overview Tab */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Details</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Configuration ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{configuration.cfg_set_id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Configuration Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{configuration.cfg_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1"><TypeBadge type={configuration.cfg_type} /></dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Base Part Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{configuration.partno || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Part Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{configuration.part_name || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Program</dt>
                <dd className="mt-1 text-sm text-gray-900">{configuration.program_cd} - {configuration.program_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  {configuration.active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircleIcon className="h-3 w-3" />
                      Inactive
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">BOM Item Count</dt>
                <dd className="mt-1 text-sm text-gray-900">{configuration.bom_item_count}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{configuration.description || 'No description provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDateTime(configuration.ins_date)} by {configuration.ins_by}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {configuration.chg_date
                    ? `${formatDateTime(configuration.chg_date)} by ${configuration.chg_by}`
                    : 'Never modified'}
                </dd>
              </div>
            </dl>
          </Tab.Panel>

          {/* BOM Tab */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <div className="space-y-6">
              {/* Parent Part Header */}
              {bomData && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-primary-900 mb-2">Parent Part (Assembly)</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <CubeIcon className="h-10 w-10 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-primary-900">{bomData.parent_part.partno}</p>
                      <p className="text-sm text-primary-700">{bomData.parent_part.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* BOM Items List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Child Parts ({bomData?.total_items || 0})
                </h3>

                {bomLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">Loading BOM...</span>
                  </div>
                ) : bomError ? (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-800">{bomError}</p>
                  </div>
                ) : bomData && bomData.items.length > 0 ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">
                            #
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                            Part Number
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                            Part Name
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                            QPA
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                            Sort Order
                          </th>
                          {canEditBom && (
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {bomData.items.map((item, index) => (
                          <tr key={item.list_id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className="font-mono text-gray-900">{item.partno_c}</span>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-900">
                              {item.part_name_c}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.qpa}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500">
                              {item.sort_order}
                            </td>
                            {canEditBom && (
                              <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button
                                  onClick={() => openDeleteModal(item)}
                                  className="text-red-600 hover:text-red-900 inline-flex items-center"
                                  title="Remove part from BOM"
                                >
                                  <TrashIcon className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <ListBulletIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No BOM items found for this configuration</p>
                    <p className="text-xs text-gray-400">Add parts to build the Bill of Materials</p>
                  </div>
                )}
              </div>

              {/* BOM Summary */}
              {bomData && bomData.items.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total unique parts:</span>
                    <span className="font-medium text-gray-900">{bomData.total_items}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Total quantity (all parts):</span>
                    <span className="font-medium text-gray-900">
                      {bomData.items.reduce((sum, item) => sum + item.qpa, 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-md p-4 shadow-lg z-50">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <p className="ml-3 text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Delete BOM Item Confirmation Modal */}
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
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Remove Part from BOM
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-500">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  {itemToDelete && (
                    <div className="mt-4 bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Part Number:</span> {itemToDelete.partno_c}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Part Name:</span> {itemToDelete.part_name_c}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Quantity Per Assembly:</span> {itemToDelete.qpa}
                      </p>
                    </div>
                  )}

                  {/* Delete Error */}
                  {deleteError && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{deleteError}</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeDeleteModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      disabled={isDeleting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Removing...
                        </>
                      ) : (
                        <>
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Remove Part
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
