import { useState, useEffect, useCallback, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  ArrowUturnRightIcon,
  ChevronRightIcon,
  CalendarIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
  Squares2X2Icon,
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
  nha_partno_c: z.string().optional(),
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
  nha_partno_c: string | null  // NHA (Next Higher Assembly) - parent part in hierarchy
  is_sra: boolean  // Is this a Sub-Replaceable Assembly (has an NHA parent)?
}

// BOM Response interface (matches backend response)
interface BOMResponse {
  bom_items: BOMItem[]
  total: number
  configuration: {
    cfg_set_id: number
    cfg_name: string
    partno: string | null
  }
}

// Configuration Meter interface
interface ConfigurationMeter {
  cfg_meter_id: number
  cfg_set_id: number
  meter_type: string
  tracking_interval: number | null
  tracking_unit: string | null
  description: string | null
  active: boolean
  ins_by: string
  ins_date: string
  chg_by: string | null
  chg_date: string | null
}

// Meter Response interface
interface MeterResponse {
  meters: ConfigurationMeter[]
  total: number
  configuration: {
    cfg_set_id: number
    cfg_name: string
    partno: string | null
  }
}

// Software association interface
interface ConfigurationSoftware {
  cfg_sw_id: number
  sw_id: number
  sw_number: string
  sw_type: string
  revision: string
  revision_date: string
  sw_title: string
  sw_desc: string | null
  cpin_flag: boolean
  eff_date: string
  ins_by: string
  ins_date: string
}

// Software catalog interface (for search/selection)
interface Software {
  sw_id: number
  sw_number: string
  sw_type: string
  sys_id: string
  revision: string
  revision_date: string
  sw_title: string
  sw_desc: string | null
  eff_date: string
  cpin_flag: boolean
  active: boolean
  pgm_id: number
  program_cd: string
  program_name: string
}

// Software response interface
interface SoftwareResponse {
  configuration: {
    cfg_set_id: number
    cfg_name: string
  }
  software: ConfigurationSoftware[]
  total: number
}

// Tree node interface for hierarchy visualization
interface TreeNode {
  id: string
  partno: string
  name: string
  qpa: number
  list_id: number | null
  children: TreeNode[]
  isRoot?: boolean
}

// Software type badge colors
const swTypeColors: Record<string, { bg: string; text: string }> = {
  FIRMWARE: { bg: 'bg-purple-100', text: 'text-purple-800' },
  APPLICATION: { bg: 'bg-blue-100', text: 'text-blue-800' },
  DSP: { bg: 'bg-green-100', text: 'text-green-800' },
  DRIVER: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  UTILITY: { bg: 'bg-gray-100', text: 'text-gray-800' },
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
  const [bomData, setBomData] = useState<BOMResponse | null>(null)
  const [bomLoading, setBomLoading] = useState(false)
  const [bomError, setBomError] = useState<string | null>(null)

  // Software state
  const [softwareData, setSoftwareData] = useState<SoftwareResponse | null>(null)
  const [softwareLoading, setSoftwareLoading] = useState(false)
  const [softwareError, setSoftwareError] = useState<string | null>(null)

  // Add Software modal state
  const [isAddSoftwareModalOpen, setIsAddSoftwareModalOpen] = useState(false)
  const [availableSoftware, setAvailableSoftware] = useState<Software[]>([])
  const [softwareSearchQuery, setSoftwareSearchQuery] = useState('')
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null)
  const [softwareEffDate, setSoftwareEffDate] = useState('')
  const [addSoftwareError, setAddSoftwareError] = useState<string | null>(null)
  const [addingSoftware, setAddingSoftware] = useState(false)

  // Delete Software modal state
  const [isDeleteSoftwareModalOpen, setIsDeleteSoftwareModalOpen] = useState(false)
  const [softwareToDelete, setSoftwareToDelete] = useState<ConfigurationSoftware | null>(null)
  const [deleteSoftwareError, setDeleteSoftwareError] = useState<string | null>(null)

  // Meter tracking state
  const [meterData, setMeterData] = useState<MeterResponse | null>(null)
  const [meterLoading, setMeterLoading] = useState(false)
  const [meterError, setMeterError] = useState<string | null>(null)

  // Add Meter modal state
  const [isAddMeterModalOpen, setIsAddMeterModalOpen] = useState(false)
  const [meterForm, setMeterForm] = useState({
    meter_type: 'eti',
    tracking_interval: '',
    tracking_unit: 'hours',
    description: '',
  })
  const [addMeterError, setAddMeterError] = useState<string | null>(null)
  const [addingMeter, setAddingMeter] = useState(false)
  const [deletingSoftware, setDeletingSoftware] = useState(false)

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

  // Hierarchy view state
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

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
      setBomData(data)
    } catch (err) {
      setBomError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching BOM:', err)
    } finally {
      setBomLoading(false)
    }
  }, [token, id])

  // Fetch Software data
  const fetchSoftware = useCallback(async () => {
    if (!token || !id) return

    setSoftwareLoading(true)
    setSoftwareError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/software`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch software')
      }

      const data: SoftwareResponse = await response.json()
      setSoftwareData(data)
    } catch (err) {
      setSoftwareError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching software:', err)
    } finally {
      setSoftwareLoading(false)
    }
  }, [token, id])

  // Fetch meters
  const fetchMeters = useCallback(async () => {
    if (!token || !id) return

    setMeterLoading(true)
    setMeterError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/meters`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch meters')
      }

      const data: MeterResponse = await response.json()
      setMeterData(data)
    } catch (err) {
      setMeterError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching meters:', err)
    } finally {
      setMeterLoading(false)
    }
  }, [token, id])

  // Fetch available software for selection
  const fetchAvailableSoftware = useCallback(async () => {
    if (!token || !configuration) return

    try {
      const response = await fetch(`http://localhost:3001/api/software?program_id=${configuration.pgm_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableSoftware(data.software || [])
      }
    } catch (err) {
      console.error('Failed to fetch available software:', err)
    }
  }, [token, configuration])

  // Fetch on mount
  useEffect(() => {
    fetchConfiguration()
    fetchBOM()
    fetchSoftware()
    fetchMeters()
  }, [fetchConfiguration, fetchBOM, fetchSoftware, fetchMeters])

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

  // Fetch available parts for selection
  const fetchParts = useCallback(async () => {
    if (!token || !configuration) return

    try {
      const response = await fetch(`http://localhost:3001/api/reference/parts?program_id=${configuration.pgm_id}`, {
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
  }, [token, configuration])

  // Open add modal
  const openAddModal = () => {
    setAddError(null)
    setAddSuccess(false)
    setSelectedPart(null)
    setPartSearchQuery('')
    const nextSortOrder = (bomData?.bom_items?.length || 0) + 1
    resetAddForm({
      partno_c: '',
      part_name_c: '',
      qpa: 1,
      sort_order: nextSortOrder,
    })
    fetchParts()
    setIsAddModalOpen(true)
  }

  // Close add modal
  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setAddError(null)
    setAddSuccess(false)
    setSelectedPart(null)
    setPartSearchQuery('')
    resetAddForm()
  }

  // Handle part selection from search results
  const selectPart = (part: Part) => {
    setSelectedPart(part)
    setAddValue('partno_c', part.partno)
    setAddValue('part_name_c', part.name)
    setPartSearchQuery('')
  }

  // Handle add BOM item form submit
  const onAddSubmit = async (data: AddBomItemFormData) => {
    if (!token || !id) return

    setAddError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/bom`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partno_c: data.partno_c,
          part_name_c: data.part_name_c,
          qpa: data.qpa,
          sort_order: data.sort_order,
          nha_partno_c: data.nha_partno_c || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add part to BOM')
      }

      setAddSuccess(true)

      // Refresh data
      await fetchBOM()
      await fetchConfiguration()

      setSuccessMessage(`Part "${data.partno_c}" added to BOM successfully`)

      setTimeout(() => {
        closeAddModal()
        setTimeout(() => setSuccessMessage(null), 3000)
      }, 1500)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Filter parts based on search query
  const filteredParts = availableParts.filter(part => {
    if (!partSearchQuery) return true
    const query = partSearchQuery.toLowerCase()
    return part.partno.toLowerCase().includes(query) || part.name.toLowerCase().includes(query)
  })

  // Filter software based on search query (excluding already associated)
  const filteredSoftware = availableSoftware.filter(sw => {
    // Exclude already associated software
    const alreadyAssociated = softwareData?.software?.some(assoc => assoc.sw_id === sw.sw_id)
    if (alreadyAssociated) return false

    if (!softwareSearchQuery) return true
    const query = softwareSearchQuery.toLowerCase()
    return (
      sw.sw_number.toLowerCase().includes(query) ||
      sw.sw_title.toLowerCase().includes(query) ||
      sw.revision.toLowerCase().includes(query)
    )
  })

  // Open add software modal
  const openAddSoftwareModal = () => {
    setAddSoftwareError(null)
    setSelectedSoftware(null)
    setSoftwareSearchQuery('')
    setSoftwareEffDate(new Date().toISOString().split('T')[0])
    fetchAvailableSoftware()
    setIsAddSoftwareModalOpen(true)
  }

  // Close add software modal
  const closeAddSoftwareModal = () => {
    setIsAddSoftwareModalOpen(false)
    setAddSoftwareError(null)
    setSelectedSoftware(null)
    setSoftwareSearchQuery('')
    setSoftwareEffDate('')
    setAddingSoftware(false)
  }

  // Select software from search results
  const selectSoftwareItem = (sw: Software) => {
    setSelectedSoftware(sw)
    setSoftwareSearchQuery('')
  }

  // Handle add software submit
  const handleAddSoftware = async () => {
    if (!token || !id || !selectedSoftware) return

    setAddingSoftware(true)
    setAddSoftwareError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/software`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sw_id: selectedSoftware.sw_id,
          eff_date: softwareEffDate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add software')
      }

      // Refresh software data
      await fetchSoftware()

      setSuccessMessage(`Software "${selectedSoftware.sw_number}" added successfully`)
      closeAddSoftwareModal()

      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setAddSoftwareError(err instanceof Error ? err.message : 'Failed to add software')
    } finally {
      setAddingSoftware(false)
    }
  }

  // Open delete software modal
  const openDeleteSoftwareModal = (sw: ConfigurationSoftware) => {
    setSoftwareToDelete(sw)
    setDeleteSoftwareError(null)
    setIsDeleteSoftwareModalOpen(true)
  }

  // Close delete software modal
  const closeDeleteSoftwareModal = () => {
    setIsDeleteSoftwareModalOpen(false)
    setSoftwareToDelete(null)
    setDeleteSoftwareError(null)
    setDeletingSoftware(false)
  }

  // Handle delete software confirm
  const handleDeleteSoftwareConfirm = async () => {
    if (!softwareToDelete || !token || !id) return

    setDeletingSoftware(true)
    setDeleteSoftwareError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/software/${softwareToDelete.cfg_sw_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove software')
      }

      // Refresh software data
      await fetchSoftware()

      setSuccessMessage(`Software "${softwareToDelete.sw_number}" removed successfully`)
      closeDeleteSoftwareModal()

      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setDeleteSoftwareError(err instanceof Error ? err.message : 'Failed to remove software')
    } finally {
      setDeletingSoftware(false)
    }
  }

  // Handle adding meter tracking requirement
  const handleAddMeter = async () => {
    if (!token || !id || !meterForm.meter_type) return

    setAddingMeter(true)
    setAddMeterError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/meters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meter_type: meterForm.meter_type,
          tracking_interval: meterForm.tracking_interval ? parseFloat(meterForm.tracking_interval) : null,
          tracking_unit: meterForm.tracking_unit || null,
          description: meterForm.description || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add meter tracking')
      }

      // Refresh meter data
      await fetchMeters()

      // Reset form and close modal
      setMeterForm({
        meter_type: 'eti',
        tracking_interval: '',
        tracking_unit: 'hours',
        description: '',
      })
      setIsAddMeterModalOpen(false)
      setSuccessMessage('Meter tracking requirement added successfully')

      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setAddMeterError(err instanceof Error ? err.message : 'Failed to add meter tracking')
    } finally {
      setAddingMeter(false)
    }
  }

  // Handle deleting meter tracking requirement
  const handleDeleteMeter = async (meterId: number) => {
    if (!token || !id) return

    if (!confirm('Are you sure you want to remove this meter tracking requirement?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${id}/meters/${meterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove meter tracking')
      }

      // Refresh meter data
      await fetchMeters()

      setSuccessMessage('Meter tracking requirement removed successfully')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setMeterError(err instanceof Error ? err.message : 'Failed to remove meter tracking')
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

  // Build hierarchical tree structure from BOM items
  const buildHierarchyTree = useCallback((): TreeNode | null => {
    if (!bomData || !configuration) return null

    // Create root node from configuration
    const rootNode: TreeNode = {
      id: 'root',
      partno: configuration.partno || configuration.cfg_name,
      name: configuration.cfg_name,
      qpa: 1,
      list_id: null,
      children: [],
      isRoot: true,
    }

    if (!bomData.bom_items || bomData.bom_items.length === 0) {
      return rootNode
    }

    // Create a map of part numbers to tree nodes
    const nodeMap = new Map<string, TreeNode>()

    // First pass: create all nodes
    bomData.bom_items.forEach((item) => {
      const node: TreeNode = {
        id: `bom-${item.list_id}`,
        partno: item.partno_c,
        name: item.part_name_c,
        qpa: item.qpa,
        list_id: item.list_id,
        children: [],
      }
      nodeMap.set(item.partno_c, node)
    })

    // Second pass: build hierarchy
    bomData.bom_items.forEach((item) => {
      const node = nodeMap.get(item.partno_c)
      if (!node) return

      if (item.nha_partno_c) {
        // This item has a parent within the BOM
        const parentNode = nodeMap.get(item.nha_partno_c)
        if (parentNode) {
          parentNode.children.push(node)
        } else {
          // Parent not found, attach to root
          rootNode.children.push(node)
        }
      } else {
        // No parent, attach directly to root
        rootNode.children.push(node)
      }
    })

    // Sort children by sort_order at each level
    const sortChildren = (node: TreeNode) => {
      node.children.sort((a, b) => {
        const itemA = bomData.bom_items.find(i => i.list_id === a.list_id)
        const itemB = bomData.bom_items.find(i => i.list_id === b.list_id)
        return (itemA?.sort_order || 0) - (itemB?.sort_order || 0)
      })
      node.children.forEach(sortChildren)
    }
    sortChildren(rootNode)

    return rootNode
  }, [bomData, configuration])

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  // Expand all nodes
  const expandAll = () => {
    if (!bomData) return
    const allIds = new Set<string>(['root'])
    bomData.bom_items.forEach(item => {
      allIds.add(`bom-${item.list_id}`)
    })
    setExpandedNodes(allIds)
  }

  // Collapse all nodes
  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  // Recursive tree node component
  const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
    const hasChildren = node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)
    const isRoot = node.isRoot

    return (
      <div className={level > 0 ? 'ml-6' : ''}>
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
            isRoot ? 'bg-primary-50 border border-primary-200' : 'bg-white border border-gray-200'
          }`}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {/* Expand/Collapse Button */}
          <button
            type="button"
            className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded ${
              hasChildren ? 'hover:bg-gray-200' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              if (hasChildren) toggleNode(node.id)
            }}
            disabled={!hasChildren}
          >
            {hasChildren && (
              <ChevronRightIcon
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            )}
          </button>

          {/* Icon */}
          <div className={`flex-shrink-0 p-1.5 rounded ${isRoot ? 'bg-primary-100' : 'bg-gray-100'}`}>
            {isRoot ? (
              <CircleStackIcon className="h-5 w-5 text-primary-600" />
            ) : hasChildren ? (
              <CubeIcon className="h-5 w-5 text-blue-600" />
            ) : (
              <Cog6ToothIcon className="h-5 w-5 text-green-600" />
            )}
          </div>

          {/* Part Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium text-gray-900 truncate">
                {node.partno}
              </span>
              {hasChildren && !isRoot && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                  NHA
                </span>
              )}
              {!isRoot && node.qpa > 1 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  x{node.qpa}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{node.name}</p>
          </div>

          {/* Part Detail Link (for BOM items only) */}
          {node.list_id && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                // Could navigate to part detail page if it exists
                // For now, we'll just show a tooltip
              }}
              className="flex-shrink-0 text-xs text-primary-600 hover:text-primary-800 hover:underline"
              title="View part details"
            >
              Details
            </button>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 border-l-2 border-gray-200 ml-3">
            {node.children.map((child) => (
              <TreeNodeComponent key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
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
              BOM ({bomData?.total || configuration.bom_item_count})
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
              <ComputerDesktopIcon className="h-5 w-5" />
              Software ({softwareData?.total || 0})
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
              <ClockIcon className="h-5 w-5" />
              Meters ({meterData?.total || 0})
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
              <Squares2X2Icon className="h-5 w-5" />
              Hierarchy
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
              {bomData && bomData.configuration && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-primary-900 mb-2">Parent Part (Assembly)</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <CubeIcon className="h-10 w-10 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-primary-900">{bomData.configuration.partno || 'N/A'}</p>
                      <p className="text-sm text-primary-700">{bomData.configuration.cfg_name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* BOM Items List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Child Parts ({bomData?.total || 0})
                  </h3>
                  {canEditBom && (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      <PlusIcon className="mr-1.5 h-5 w-5" />
                      Add Part
                    </button>
                  )}
                </div>

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
                ) : bomData && bomData.bom_items && bomData.bom_items.length > 0 ? (
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
                          <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                            NHA (Parent)
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                            QPA
                          </th>
                          {canEditBom && (
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {bomData.bom_items.map((item, index) => {
                          // Find NHA parent name if exists
                          const nhaParent = item.nha_partno_c
                            ? bomData.bom_items.find(b => b.partno_c === item.nha_partno_c)
                            : null;

                          return (
                            <tr key={item.list_id} className={`hover:bg-gray-50 ${item.is_sra ? 'bg-gray-50' : ''}`}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6">
                                {index + 1}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <div className="flex items-center">
                                  {item.is_sra && (
                                    <ArrowUturnRightIcon className="h-4 w-4 text-gray-400 mr-2" title="Sub-Replaceable Assembly (SRA)" />
                                  )}
                                  <span className="font-mono text-gray-900">{item.partno_c}</span>
                                  {!item.is_sra && !item.nha_partno_c && bomData.bom_items.some(b => b.nha_partno_c === item.partno_c) && (
                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200" title="Next Higher Assembly - has child parts">
                                      NHA
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-900">
                                {item.part_name_c}
                              </td>
                              <td className="px-3 py-4 text-sm">
                                {item.nha_partno_c ? (
                                  <div className="flex items-center text-gray-600">
                                    <ChevronRightIcon className="h-3 w-3 text-gray-400 mr-1" />
                                    <span className="font-mono text-xs">{item.nha_partno_c}</span>
                                    {nhaParent && (
                                      <span className="ml-1 text-xs text-gray-400 truncate max-w-[100px]" title={nhaParent.part_name_c}>
                                        ({nhaParent.part_name_c})
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-xs">—</span>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {item.qpa}
                                </span>
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
                          );
                        })}
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
              {bomData && bomData.bom_items && bomData.bom_items.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total unique parts:</span>
                    <span className="font-medium text-gray-900">{bomData.total}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">Total quantity (all parts):</span>
                    <span className="font-medium text-gray-900">
                      {bomData.bom_items.reduce((sum, item) => sum + item.qpa, 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Software Tab */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <div className="space-y-6">
              {/* Software Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Associated Software</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Software versions associated with this configuration
                  </p>
                </div>
                {canEditBom && (
                  <button
                    type="button"
                    onClick={openAddSoftwareModal}
                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    <PlusIcon className="mr-1.5 h-5 w-5" />
                    Add Software
                  </button>
                )}
              </div>

              {/* Software List */}
              {softwareLoading ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-500">Loading software...</span>
                </div>
              ) : softwareError ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{softwareError}</p>
                </div>
              ) : softwareData && softwareData.software && softwareData.software.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">
                          Software Number
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                          Title
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                          Revision
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                          Effective Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                          CPIN
                        </th>
                        {canEditBom && (
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {softwareData.software.map((sw) => (
                        <tr key={sw.cfg_sw_id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <span className="font-mono font-medium text-gray-900">{sw.sw_number}</span>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">
                            <div>
                              <p className="font-medium">{sw.sw_title}</p>
                              {sw.sw_desc && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{sw.sw_desc}</p>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${swTypeColors[sw.sw_type]?.bg || 'bg-gray-100'} ${swTypeColors[sw.sw_type]?.text || 'text-gray-800'}`}>
                              {sw.sw_type}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            <span className="font-mono">{sw.revision}</span>
                            <p className="text-xs text-gray-500">{formatDate(sw.revision_date)}</p>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(sw.eff_date)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                            {sw.cpin_flag ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-gray-300 mx-auto" />
                            )}
                          </td>
                          {canEditBom && (
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => openDeleteSoftwareModal(sw)}
                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                                title="Remove software"
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
                  <ComputerDesktopIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No software associated with this configuration</p>
                  <p className="text-xs text-gray-400">Click "Add Software" to associate software versions</p>
                </div>
              )}

              {/* Software Summary */}
              {softwareData && softwareData.software && softwareData.software.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total software versions:</span>
                    <span className="font-medium text-gray-900">{softwareData.total}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-500">CPIN-tracked:</span>
                    <span className="font-medium text-gray-900">
                      {softwareData.software.filter(sw => sw.cpin_flag).length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Meters Tab */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <div className="space-y-6">
              {/* Meters Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Meter Tracking Requirements</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Meters and tracking intervals required for this configuration
                  </p>
                </div>
                {canEditBom && (
                  <button
                    type="button"
                    onClick={() => setIsAddMeterModalOpen(true)}
                    className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    <PlusIcon className="mr-1.5 h-5 w-5" />
                    Add Meter Requirement
                  </button>
                )}
              </div>

              {/* Meters List */}
              {meterLoading ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-500">Loading meter requirements...</span>
                </div>
              ) : meterError ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{meterError}</p>
                </div>
              ) : meterData && meterData.meters && meterData.meters.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6">
                          Meter Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                          Tracking Interval
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                          Description
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                          Added By
                        </th>
                        {canEditBom && (
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {meterData.meters.map((meter) => (
                        <tr key={meter.cfg_meter_id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                              {meter.meter_type}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {meter.tracking_interval ? (
                              <>
                                <span className="font-medium">{meter.tracking_interval.toLocaleString()}</span>
                                {meter.tracking_unit && (
                                  <span className="text-gray-500 ml-1">{meter.tracking_unit}</span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900 max-w-md">
                            {meter.description || <span className="text-gray-400">No description</span>}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              <p className="font-medium text-gray-900">{meter.ins_by}</p>
                              <p className="text-xs text-gray-500">{formatDate(meter.ins_date)}</p>
                            </div>
                          </td>
                          {canEditBom && (
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleDeleteMeter(meter.cfg_meter_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">Delete meter requirement {meter.meter_type}</span>
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
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No meter tracking requirements defined</p>
                  <p className="text-xs text-gray-400">Click "Add Meter Requirement" to define tracking requirements</p>
                </div>
              )}

              {/* Meters Summary */}
              {meterData && meterData.meters && meterData.meters.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total meter requirements:</span>
                    <span className="font-medium text-gray-900">{meterData.total}</span>
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Hierarchy Tab */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <div className="space-y-6">
              {/* Hierarchy Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Component Hierarchy</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Visual tree view of configuration components and their relationships
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={expandAll}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <ChevronDownIcon className="h-4 w-4 mr-1" />
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAll}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <ChevronRightIcon className="h-4 w-4 mr-1" />
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-primary-100">
                    <CircleStackIcon className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-gray-600">Root Configuration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-gray-100">
                    <CubeIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-600">Assembly (NHA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-gray-100">
                    <Cog6ToothIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-600">Component</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                    NHA
                  </span>
                  <span className="text-gray-600">Next Higher Assembly</span>
                </div>
              </div>

              {/* Tree Visualization */}
              {bomLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-500">Loading hierarchy...</span>
                </div>
              ) : bomError ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{bomError}</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {(() => {
                    const tree = buildHierarchyTree()
                    if (!tree) {
                      return (
                        <div className="text-center py-8">
                          <Squares2X2Icon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">No hierarchy data available</p>
                        </div>
                      )
                    }
                    return (
                      <div className="space-y-2">
                        <TreeNodeComponent node={tree} />
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Hierarchy Summary */}
              {bomData && bomData.bom_items && bomData.bom_items.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Parts:</span>
                      <span className="ml-2 font-medium text-gray-900">{bomData.total}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">NHA Assemblies:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {bomData.bom_items.filter(item =>
                          bomData.bom_items.some(other => other.nha_partno_c === item.partno_c)
                        ).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">SRA Parts:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {bomData.bom_items.filter(item => item.is_sra).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Top-Level Parts:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {bomData.bom_items.filter(item => !item.nha_partno_c).length}
                      </span>
                    </div>
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

      {/* Add Part to BOM Modal */}
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
                  {addSuccess ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Part Added!</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        The part has been added to the BOM successfully.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                        <span className="flex items-center">
                          <PlusIcon className="h-5 w-5 mr-2 text-primary-600" />
                          Add Part to BOM
                        </span>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={closeAddModal}
                          aria-label="Close"
                        >
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </Dialog.Title>

                      {/* Error message */}
                      {addError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                          <p className="text-sm text-red-700">{addError}</p>
                        </div>
                      )}

                      <form onSubmit={handleAddSubmit(onAddSubmit)} className="mt-4 space-y-4">
                        {/* Part Search */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search for Part
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={partSearchQuery}
                              onChange={(e) => setPartSearchQuery(e.target.value)}
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              placeholder="Type to search parts..."
                            />
                          </div>
                          {/* Search Results */}
                          {partSearchQuery && filteredParts.length > 0 && (
                            <div className="mt-1 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-sm">
                              {filteredParts.slice(0, 10).map((part) => (
                                <button
                                  key={part.partno_id}
                                  type="button"
                                  onClick={() => selectPart(part)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                >
                                  <span className="font-medium">{part.partno}</span>
                                  <span className="text-gray-500 ml-2">- {part.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {partSearchQuery && filteredParts.length === 0 && (
                            <p className="mt-1 text-sm text-gray-500">No matching parts found. You can enter a custom part number below.</p>
                          )}
                        </div>

                        {/* Selected Part Info */}
                        {selectedPart && (
                          <div className="bg-primary-50 border border-primary-200 rounded-md p-3">
                            <p className="text-sm text-primary-800">
                              <span className="font-medium">Selected:</span> {selectedPart.partno} - {selectedPart.name}
                            </p>
                          </div>
                        )}

                        {/* Part Number */}
                        <div>
                          <label htmlFor="partno_c" className="block text-sm font-medium text-gray-700">
                            Part Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="partno_c"
                            {...registerAdd('partno_c')}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              addErrors.partno_c
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }`}
                            placeholder="e.g., PN-SENSOR-A"
                          />
                          {addErrors.partno_c && (
                            <p className="mt-1 text-sm text-red-600">{addErrors.partno_c.message}</p>
                          )}
                        </div>

                        {/* Part Name */}
                        <div>
                          <label htmlFor="part_name_c" className="block text-sm font-medium text-gray-700">
                            Part Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="part_name_c"
                            {...registerAdd('part_name_c')}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              addErrors.part_name_c
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }`}
                            placeholder="e.g., Sensor Unit Alpha"
                          />
                          {addErrors.part_name_c && (
                            <p className="mt-1 text-sm text-red-600">{addErrors.part_name_c.message}</p>
                          )}
                        </div>

                        {/* Quantity Per Assembly */}
                        <div>
                          <label htmlFor="qpa" className="block text-sm font-medium text-gray-700">
                            Quantity Per Assembly <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="qpa"
                            {...registerAdd('qpa', { valueAsNumber: true })}
                            min="1"
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              addErrors.qpa
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }`}
                          />
                          {addErrors.qpa && (
                            <p className="mt-1 text-sm text-red-600">{addErrors.qpa.message}</p>
                          )}
                        </div>

                        {/* Sort Order */}
                        <div>
                          <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
                            Sort Order <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            id="sort_order"
                            {...registerAdd('sort_order', { valueAsNumber: true })}
                            min="1"
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              addErrors.sort_order
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }`}
                          />
                          {addErrors.sort_order && (
                            <p className="mt-1 text-sm text-red-600">{addErrors.sort_order.message}</p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Determines the order in which parts appear in the BOM
                          </p>
                        </div>

                        {/* NHA Parent Selection */}
                        <div>
                          <label htmlFor="nha_partno_c" className="block text-sm font-medium text-gray-700">
                            NHA Parent (Optional)
                          </label>
                          <select
                            id="nha_partno_c"
                            {...registerAdd('nha_partno_c')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            disabled={configuration?.cfg_type === 'COMPONENT'}
                          >
                            <option value="">-- No Parent (Top-level part) --</option>
                            {bomData?.bom_items?.map((item) => (
                              <option key={item.list_id} value={item.partno_c}>
                                {item.partno_c} - {item.part_name_c}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-500">
                            Select an existing BOM part to make this a child (SRA) of that part
                          </p>
                          {configuration?.cfg_type === 'COMPONENT' && (
                            <p className="mt-1 text-xs text-amber-600">
                              ⚠️ NHA parent relationships are not available for COMPONENT configurations
                            </p>
                          )}
                        </div>

                        {/* Form Actions */}
                        <div className="mt-6 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={closeAddModal}
                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isAddSubmitting}
                            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isAddSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Adding...
                              </>
                            ) : (
                              'Add to BOM'
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Software Modal */}
      <Transition appear show={isAddSoftwareModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeAddSoftwareModal}>
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                    <span className="flex items-center">
                      <ComputerDesktopIcon className="h-5 w-5 mr-2 text-primary-600" />
                      Add Software to Configuration
                    </span>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={closeAddSoftwareModal}
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </Dialog.Title>

                  {/* Error message */}
                  {addSoftwareError && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{addSoftwareError}</p>
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    {/* Software Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search for Software Version
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={softwareSearchQuery}
                          onChange={(e) => setSoftwareSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          placeholder="Type to search by number, title, or revision..."
                        />
                      </div>
                      {/* Search Results */}
                      {softwareSearchQuery && filteredSoftware.length > 0 && (
                        <div className="mt-1 max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-sm">
                          {filteredSoftware.slice(0, 8).map((sw) => (
                            <button
                              key={sw.sw_id}
                              type="button"
                              onClick={() => selectSoftwareItem(sw)}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-mono font-medium">{sw.sw_number}</span>
                                  <span className="text-gray-500 ml-2">v{sw.revision}</span>
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${swTypeColors[sw.sw_type]?.bg || 'bg-gray-100'} ${swTypeColors[sw.sw_type]?.text || 'text-gray-800'}`}>
                                  {sw.sw_type}
                                </span>
                              </div>
                              <p className="text-gray-600 text-xs mt-0.5">{sw.sw_title}</p>
                            </button>
                          ))}
                        </div>
                      )}
                      {softwareSearchQuery && filteredSoftware.length === 0 && (
                        <p className="mt-1 text-sm text-gray-500">No matching software found in this program.</p>
                      )}
                    </div>

                    {/* Selected Software Info */}
                    {selectedSoftware && (
                      <div className="bg-primary-50 border border-primary-200 rounded-md p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-primary-900">
                              {selectedSoftware.sw_number}
                            </p>
                            <p className="text-sm text-primary-800 mt-0.5">{selectedSoftware.sw_title}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${swTypeColors[selectedSoftware.sw_type]?.bg || 'bg-gray-100'} ${swTypeColors[selectedSoftware.sw_type]?.text || 'text-gray-800'}`}>
                                {selectedSoftware.sw_type}
                              </span>
                              <span className="text-xs text-primary-700">
                                Revision: {selectedSoftware.revision}
                              </span>
                              {selectedSoftware.cpin_flag && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  CPIN
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedSoftware(null)}
                            className="text-primary-400 hover:text-primary-500"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Effective Date */}
                    <div>
                      <label htmlFor="sw_eff_date" className="block text-sm font-medium text-gray-700">
                        Effective Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="sw_eff_date"
                          value={softwareEffDate}
                          onChange={(e) => setSoftwareEffDate(e.target.value)}
                          className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Date when this software version becomes effective for this configuration
                      </p>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeAddSoftwareModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSoftware}
                      disabled={!selectedSoftware || !softwareEffDate || addingSoftware}
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingSoftware ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Adding...
                        </>
                      ) : (
                        'Add Software'
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Software Confirmation Modal */}
      <Transition appear show={isDeleteSoftwareModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDeleteSoftwareModal}>
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
                        Remove Software
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-500">
                        This will remove the software association from this configuration.
                      </p>
                    </div>
                  </div>

                  {softwareToDelete && (
                    <div className="mt-4 bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Software Number:</span> {softwareToDelete.sw_number}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Title:</span> {softwareToDelete.sw_title}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Revision:</span> {softwareToDelete.revision}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Effective Date:</span> {formatDate(softwareToDelete.eff_date)}
                      </p>
                    </div>
                  )}

                  {/* Delete Error */}
                  {deleteSoftwareError && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{deleteSoftwareError}</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeDeleteSoftwareModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteSoftwareConfirm}
                      disabled={deletingSoftware}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingSoftware ? (
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
                          Remove Software
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

      {/* Add Meter Modal */}
      <Transition appear show={isAddMeterModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsAddMeterModalOpen(false)}>
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                    <span className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-primary-600" />
                      Add Meter Tracking Requirement
                    </span>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setIsAddMeterModalOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>

                  {/* Error message */}
                  {addMeterError && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{addMeterError}</p>
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    {/* Meter Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meter Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={meterForm.meter_type}
                        onChange={(e) => setMeterForm({ ...meterForm, meter_type: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="eti">ETI (Elapsed Time Indicator)</option>
                        <option value="cycles">Cycles</option>
                        <option value="landings">Landings</option>
                        <option value="flight_hours">Flight Hours</option>
                        <option value="engine_starts">Engine Starts</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Tracking Interval */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tracking Interval (Optional)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={meterForm.tracking_interval}
                        onChange={(e) => setMeterForm({ ...meterForm, tracking_interval: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="e.g., 500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Recommended check interval (e.g., check every 500 hours)
                      </p>
                    </div>

                    {/* Tracking Unit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tracking Unit (Optional)
                      </label>
                      <select
                        value={meterForm.tracking_unit}
                        onChange={(e) => setMeterForm({ ...meterForm, tracking_unit: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="hours">Hours</option>
                        <option value="cycles">Cycles</option>
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                        <option value="operations">Operations</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        value={meterForm.description}
                        onChange={(e) => setMeterForm({ ...meterForm, description: e.target.value })}
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="e.g., Track operating hours for camera system - check every 500 hours"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                      onClick={() => setIsAddMeterModalOpen(false)}
                      disabled={addingMeter}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddMeter}
                      disabled={addingMeter || !meterForm.meter_type}
                    >
                      {addingMeter ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-5 w-5 mr-1" />
                          Add Meter
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
