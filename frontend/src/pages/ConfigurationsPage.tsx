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
  TrashIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

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

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [configToDelete, setConfigToDelete] = useState<Configuration | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

  // Get current ZULU (UTC) timestamp
  const getZuluTimestamp = (): string => {
    const now = new Date()
    return now.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, 'Z')
  }

  // Get ZULU date for filename
  const getZuluDateForFilename = (): string => {
    const now = new Date()
    const year = now.getUTCFullYear()
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')
    const day = String(now.getUTCDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }

  // Export configurations to PDF with CUI markings
  const exportToPdf = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const zuluTimestamp = getZuluTimestamp()

    // CUI Banner text
    const cuiHeaderText = 'CONTROLLED UNCLASSIFIED INFORMATION (CUI)'
    const cuiFooterText = 'CUI - CONTROLLED UNCLASSIFIED INFORMATION'

    // Add CUI header function
    const addCuiHeader = () => {
      // Yellow background for CUI banner
      doc.setFillColor(254, 243, 199) // #FEF3C7
      doc.rect(0, 0, pageWidth, 12, 'F')

      // CUI text
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(cuiHeaderText, pageWidth / 2, 7, { align: 'center' })
    }

    // Add CUI footer function
    const addCuiFooter = (pageNum: number, totalPages: number) => {
      // Yellow background for CUI footer banner
      doc.setFillColor(254, 243, 199) // #FEF3C7
      doc.rect(0, pageHeight - 12, pageWidth, 12, 'F')

      // CUI text
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(cuiFooterText, pageWidth / 2, pageHeight - 5, { align: 'center' })

      // Page number on footer
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 15, pageHeight - 5, { align: 'right' })

      // Timestamp on footer
      doc.text(`Generated: ${zuluTimestamp}`, 15, pageHeight - 5, { align: 'left' })
    }

    // Add title section after header
    const addTitle = () => {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 64, 175) // Primary blue
      doc.text('RIMSS Configuration Report', pageWidth / 2, 20, { align: 'center' })

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(55, 65, 81) // Gray
      const programText = program ? `Program: ${program.pgm_cd} - ${program.pgm_name}` : 'All Programs'
      doc.text(programText, pageWidth / 2, 27, { align: 'center' })

      doc.setFontSize(9)
      doc.text(`Report generated: ${zuluTimestamp}`, pageWidth / 2, 33, { align: 'center' })
      doc.text(`Total Configurations: ${pagination.total}`, pageWidth / 2, 38, { align: 'center' })

      // Add filter info if applied
      if (typeFilter || debouncedSearch) {
        const filters: string[] = []
        if (typeFilter) filters.push(`Type: ${typeFilter}`)
        if (debouncedSearch) filters.push(`Search: "${debouncedSearch}"`)
        doc.setFontSize(8)
        doc.setTextColor(107, 114, 128)
        doc.text(`Filters: ${filters.join(', ')}`, pageWidth / 2, 43, { align: 'center' })
      }
    }

    // Prepare table data
    const tableData = configurations.map(config => [
      config.cfg_name,
      config.cfg_type,
      config.partno || '-',
      config.part_name || '-',
      config.bom_item_count.toString(),
      config.asset_count.toString(),
      config.active ? 'Yes' : 'No',
      formatDate(config.ins_date)
    ])

    // Add header to first page
    addCuiHeader()
    addTitle()

    // Generate table with autoTable
    autoTable(doc, {
      startY: typeFilter || debouncedSearch ? 48 : 43,
      head: [['Configuration Name', 'Type', 'Part Number', 'Part Name', 'BOM Items', 'Assets', 'Active', 'Created']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 64, 175], // Primary blue
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [55, 65, 81]
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251] // Light gray
      },
      margin: { top: 15, bottom: 15, left: 10, right: 10 },
      didDrawPage: () => {
        // Add CUI header on each page
        addCuiHeader()
      },
      // Style specific columns
      columnStyles: {
        0: { cellWidth: 60 }, // Configuration Name
        1: { cellWidth: 25 }, // Type
        2: { cellWidth: 35 }, // Part Number
        3: { cellWidth: 45 }, // Part Name
        4: { cellWidth: 20 }, // BOM Items
        5: { cellWidth: 20 }, // Assets
        6: { cellWidth: 15 }, // Active
        7: { cellWidth: 30 }, // Created
      }
    })

    // Get total pages and add footers
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addCuiFooter(i, totalPages)
    }

    // Generate filename with CUI prefix and ZULU date
    const filename = `CUI_Configurations_${getZuluDateForFilename()}.pdf`

    // Save the PDF
    doc.save(filename)
  }

  // Export configurations to Excel with CUI markings
  const exportToExcel = () => {
    const zuluTimestamp = getZuluTimestamp()

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()

    // Prepare data rows with CUI header
    const cuiHeaderRow = ['CONTROLLED UNCLASSIFIED INFORMATION (CUI)']
    const blankRow: string[] = []
    const reportInfoRow1 = [`RIMSS Configuration Report - ${program ? `${program.pgm_cd} - ${program.pgm_name}` : 'All Programs'}`]
    const reportInfoRow2 = [`Generated: ${zuluTimestamp}`]
    const reportInfoRow3 = [`Total Configurations: ${pagination.total}`]
    const filterRow = typeFilter || debouncedSearch
      ? [`Filters: ${[typeFilter ? `Type: ${typeFilter}` : '', debouncedSearch ? `Search: "${debouncedSearch}"` : ''].filter(Boolean).join(', ')}`]
      : []

    // Table header row
    const headerRow = ['Configuration Name', 'Type', 'Part Number', 'Part Name', 'Description', 'BOM Items', 'Assets', 'Active', 'Created', 'Created By']

    // Data rows
    const dataRows = configurations.map(config => [
      config.cfg_name,
      config.cfg_type,
      config.partno || '',
      config.part_name || '',
      config.description || '',
      config.bom_item_count,
      config.asset_count,
      config.active ? 'Yes' : 'No',
      config.ins_date ? formatDate(config.ins_date) : '',
      config.ins_by
    ])

    // CUI footer row
    const cuiFooterRow = ['CUI - CONTROLLED UNCLASSIFIED INFORMATION']

    // Combine all rows
    const allRows = [
      cuiHeaderRow,
      blankRow,
      reportInfoRow1,
      reportInfoRow2,
      reportInfoRow3,
      ...(filterRow.length ? [filterRow] : []),
      blankRow,
      headerRow,
      ...dataRows,
      blankRow,
      cuiFooterRow
    ]

    // Create worksheet from array of arrays
    const ws = XLSX.utils.aoa_to_sheet(allRows)

    // Set column widths
    ws['!cols'] = [
      { wch: 35 },  // Configuration Name
      { wch: 12 },  // Type
      { wch: 18 },  // Part Number
      { wch: 25 },  // Part Name
      { wch: 40 },  // Description
      { wch: 12 },  // BOM Items
      { wch: 10 },  // Assets
      { wch: 8 },   // Active
      { wch: 14 },  // Created
      { wch: 15 },  // Created By
    ]

    // Merge CUI header cells across all columns
    const numCols = headerRow.length
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }, // CUI header
      { s: { r: 2, c: 0 }, e: { r: 2, c: numCols - 1 } }, // Report title
      { s: { r: 3, c: 0 }, e: { r: 3, c: numCols - 1 } }, // Generated timestamp
      { s: { r: 4, c: 0 }, e: { r: 4, c: numCols - 1 } }, // Total configurations
      { s: { r: allRows.length - 1, c: 0 }, e: { r: allRows.length - 1, c: numCols - 1 } }, // CUI footer
    ]

    // Add filter merge if applicable
    if (filterRow.length) {
      ws['!merges']!.push({ s: { r: 5, c: 0 }, e: { r: 5, c: numCols - 1 } })
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Configurations')

    // Generate filename with CUI prefix and ZULU date
    const filename = `CUI_Configurations_${getZuluDateForFilename()}.xlsx`

    // Write the file and trigger download
    XLSX.writeFile(wb, filename)
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

  // Open create modal
  const openCreateModal = () => {
    setCreateError(null)
    setCreateSuccess(false)
    createForm.reset({
      cfg_name: '',
      cfg_type: undefined,
      partno_id: '',
      description: '',
    })
    setIsCreateModalOpen(true)
  }

  // Close create modal
  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
    setCreateError(null)
    setCreateSuccess(false)
    createForm.reset()
  }

  // Handle create form submit
  const onCreateSubmit = async (data: CreateConfigFormData) => {
    if (!token) return

    setCreateError(null)

    try {
      // Find the selected part to get its details
      const selectedPart = availableParts.find(p => p.partno_id.toString() === data.partno_id)

      const response = await fetch('http://localhost:3001/api/configurations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cfg_name: data.cfg_name,
          cfg_type: data.cfg_type,
          partno_id: selectedPart?.partno_id || null,
          partno: selectedPart?.partno || null,
          part_name: selectedPart?.name || null,
          description: data.description || null,
          pgm_id: currentProgramId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create configuration')
      }

      setCreateSuccess(true)
      setTimeout(() => {
        closeCreateModal()
        fetchConfigurations(1)
      }, 1500)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'An error occurred')
    }
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

  // Open delete confirmation modal
  const openDeleteModal = (config: Configuration) => {
    setConfigToDelete(config)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setConfigToDelete(null)
    setDeleteError(null)
    setIsDeleting(false)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!configToDelete || !token) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/configurations/${configToDelete.cfg_set_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete configuration')
      }

      // Refresh the list
      await fetchConfigurations(pagination.page)

      // Show success message and close modal
      setSuccessMessage(`Configuration "${configToDelete.cfg_name}" deleted successfully`)
      closeDeleteModal()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete configuration')
    } finally {
      setIsDeleting(false)
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
          <button
            type="button"
            onClick={exportToPdf}
            disabled={configurations.length === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export to PDF with CUI markings"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2 text-red-600" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={exportToExcel}
            disabled={configurations.length === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export to Excel with CUI markings"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2 text-green-600" />
            Export Excel
          </button>
          {canEditConfig && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <PlusIcon className="mr-1.5 h-5 w-5" />
              Add Configuration
            </button>
          )}
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
                          <>
                            <button
                              onClick={() => openEditModal(config)}
                              className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                            >
                              <PencilSquareIcon className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(config)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                              title={config.asset_count > 0 ? 'Cannot delete - has linked assets' : 'Delete configuration'}
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </>
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

      {/* Edit Configuration Modal */}
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between">
                    <span className="flex items-center">
                      <PencilSquareIcon className="h-5 w-5 mr-2 text-primary-600" />
                      Edit Configuration
                    </span>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={closeEditModal}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>

                  {/* Modal Error */}
                  {modalError && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-700">{modalError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onEditSubmit)} className="mt-4 space-y-4">
                    {/* Configuration Name */}
                    <div>
                      <label htmlFor="cfg_name" className="block text-sm font-medium text-gray-700">
                        Configuration Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cfg_name"
                        {...register('cfg_name')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.cfg_name
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      />
                      {errors.cfg_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.cfg_name.message}</p>
                      )}
                    </div>

                    {/* Configuration Type */}
                    <div>
                      <label htmlFor="cfg_type" className="block text-sm font-medium text-gray-700">
                        Configuration Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="cfg_type"
                        {...register('cfg_type')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.cfg_type
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      >
                        <option value="ASSEMBLY">Assembly</option>
                        <option value="SYSTEM">System</option>
                        <option value="COMPONENT">Component</option>
                      </select>
                      {errors.cfg_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.cfg_type.message}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        {...register('description')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.description
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        {...register('active')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>

                    {/* Read-only info */}
                    {configToEdit && (
                      <div className="bg-gray-50 rounded-md p-3 text-sm">
                        <p className="text-gray-500">
                          <span className="font-medium">Part Number:</span> {configToEdit.partno || 'N/A'}
                        </p>
                        <p className="text-gray-500">
                          <span className="font-medium">BOM Items:</span> {configToEdit.bom_item_count}
                        </p>
                        <p className="text-gray-500">
                          <span className="font-medium">Linked Assets:</span> {configToEdit.asset_count}
                        </p>
                      </div>
                    )}

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Create Configuration Modal */}
      <Transition.Root show={isCreateModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeCreateModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  {createSuccess ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Configuration Created!</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        The configuration has been added successfully.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                          type="button"
                          className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                          onClick={closeCreateModal}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                          <Cog6ToothIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                            Add Configuration
                          </Dialog.Title>
                          <p className="mt-1 text-sm text-gray-500">
                            Create a new configuration set for {program?.pgm_name || 'your program'}
                          </p>
                        </div>
                      </div>

                      <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="mt-6 space-y-4">
                        {/* Configuration Name */}
                        <div>
                          <label htmlFor="create_cfg_name" className="block text-sm font-medium text-gray-700">
                            Configuration Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="create_cfg_name"
                            {...createForm.register('cfg_name')}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              createForm.formState.errors.cfg_name
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }`}
                            placeholder="e.g., Camera System Configuration"
                          />
                          {createForm.formState.errors.cfg_name && (
                            <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.cfg_name.message}</p>
                          )}
                        </div>

                        {/* Configuration Type */}
                        <div>
                          <label htmlFor="create_cfg_type" className="block text-sm font-medium text-gray-700">
                            Configuration Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="create_cfg_type"
                            {...createForm.register('cfg_type')}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              createForm.formState.errors.cfg_type
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }`}
                          >
                            <option value="">Select a type</option>
                            <option value="ASSEMBLY">Assembly - A complete assembly of components</option>
                            <option value="SYSTEM">System - A full system configuration</option>
                            <option value="COMPONENT">Component - An individual component</option>
                          </select>
                          {createForm.formState.errors.cfg_type && (
                            <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.cfg_type.message}</p>
                          )}
                        </div>

                        {/* Base Part Number */}
                        <div>
                          <label htmlFor="create_partno_id" className="block text-sm font-medium text-gray-700">
                            Base Part Number
                          </label>
                          <select
                            id="create_partno_id"
                            {...createForm.register('partno_id')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="">Select a part (optional)</option>
                            {availableParts.map(part => (
                              <option key={part.partno_id} value={part.partno_id}>
                                {part.partno} - {part.name}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-gray-500">
                            The base part this configuration is built around
                          </p>
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="create_description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="create_description"
                            rows={3}
                            {...createForm.register('description')}
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                              createForm.formState.errors.description
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                            }`}
                            placeholder="Enter a description for this configuration..."
                          />
                          {createForm.formState.errors.description && (
                            <p className="mt-1 text-sm text-red-600">{createForm.formState.errors.description.message}</p>
                          )}
                        </div>

                        {/* Error message */}
                        {createError && (
                          <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-700">{createError}</p>
                          </div>
                        )}

                        {/* Form Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                          <button
                            type="button"
                            onClick={closeCreateModal}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={createForm.formState.isSubmitting}
                            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {createForm.formState.isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                              </>
                            ) : (
                              'Create Configuration'
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
      </Transition.Root>

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
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Delete Configuration
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-gray-500">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  {configToDelete && (
                    <div className="mt-4 bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Configuration:</span> {configToDelete.cfg_name}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Type:</span> {configToDelete.cfg_type}
                      </p>
                      {configToDelete.partno && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Part Number:</span> {configToDelete.partno}
                        </p>
                      )}
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Linked Assets:</span> {configToDelete.asset_count}
                      </p>
                      {configToDelete.asset_count > 0 && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          ⚠️ This configuration has linked assets and cannot be deleted.
                        </p>
                      )}
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
                      disabled={isDeleting || (configToDelete?.asset_count ?? 0) > 0}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete Configuration
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
