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
  PaperClipIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  PhotoIcon,
  PlusIcon,
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

// Attachment interface
interface Attachment {
  attachment_id: number
  event_id: number
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  uploaded_by: number
  uploaded_by_name: string
  uploaded_at: string
  description: string | null
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
  sortie_id?: number | null
  pqdr?: boolean // Product Quality Deficiency Report flag
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

interface EditFormData {
  discrepancy: string
  etic: string
  priority: 'Routine' | 'Urgent' | 'Critical'
  location: string
  sortie_id: string
  pqdr: boolean
}

// Edit Repair form data interface
interface EditRepairFormData {
  narrative: string
  type_maint: string
  how_mal: string
  when_disc: string
  tag_no: string
  doc_no: string
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
    sortie_id: '',
    pqdr: false,
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [editSuccess, setEditSuccess] = useState<string | null>(null)

  // Sorties state for the edit modal
  const [sorties, setSorties] = useState<Sortie[]>([])
  const [sortiesLoading, setSortiesLoading] = useState(false)
  const [linkedSortie, setLinkedSortie] = useState<Sortie | null>(null)

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

  // Close repair modal state
  const [isCloseRepairModalOpen, setIsCloseRepairModalOpen] = useState(false)
  const [closingRepair, setClosingRepair] = useState<Repair | null>(null)
  const [closeRepairDate, setCloseRepairDate] = useState(new Date().toISOString().split('T')[0])
  const [closeRepairLoading, setCloseRepairLoading] = useState(false)
  const [closeRepairError, setCloseRepairError] = useState<string | null>(null)
  const [closeRepairSuccess, setCloseRepairSuccess] = useState<string | null>(null)
  const [closingRepairId, setClosingRepairId] = useState<number | null>(null)

  // Attachments state
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [attachmentsLoading, setAttachmentsLoading] = useState(false)
  const [downloadingAttachmentId, setDownloadingAttachmentId] = useState<number | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadDescription, setUploadDescription] = useState('')
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<number | null>(null)

  // Add Repair modal state
  const [isAddRepairModalOpen, setIsAddRepairModalOpen] = useState(false)
  const [addRepairForm, setAddRepairForm] = useState({
    start_date: new Date().toISOString().split('T')[0],
    type_maint: '',
    how_mal: '',
    when_disc: '',
    narrative: '',
  })
  const [addRepairLoading, setAddRepairLoading] = useState(false)
  const [addRepairError, setAddRepairError] = useState<string | null>(null)
  const [addRepairSuccess, setAddRepairSuccess] = useState<string | null>(null)

  // Maintenance code options
  const typeMaintOptions = [
    { value: 'Corrective', label: 'Corrective' },
    { value: 'Preventive', label: 'Preventive' },
    { value: 'Modification', label: 'Modification' },
    { value: 'Inspection', label: 'Inspection' },
  ]

  const howMalOptions = [
    { value: '', label: 'None / Not Applicable' },
    { value: 'PWR', label: 'PWR - Power Failure' },
    { value: 'FAIL', label: 'FAIL - Component Failure' },
    { value: 'OPTIC', label: 'OPTIC - Optical Issue' },
    { value: 'OVHT', label: 'OVHT - Overheat' },
    { value: 'COMP', label: 'COMP - Component Issue' },
    { value: 'ELEC', label: 'ELEC - Electrical' },
    { value: 'MECH', label: 'MECH - Mechanical' },
    { value: 'SOFT', label: 'SOFT - Software' },
    { value: 'OTHR', label: 'OTHR - Other' },
  ]

  const whenDiscOptions = [
    { value: '', label: 'None / Not Applicable' },
    { value: 'BIT', label: 'BIT - Built-In Test' },
    { value: 'OPS', label: 'OPS - Operations' },
    { value: 'PMI', label: 'PMI - Periodic Maintenance' },
    { value: 'TCTO', label: 'TCTO - Time Compliance' },
    { value: 'PRE', label: 'PRE - Pre-Flight' },
    { value: 'POST', label: 'POST - Post-Flight' },
    { value: 'INSP', label: 'INSP - Inspection' },
    { value: 'OTHR', label: 'OTHR - Other' },
  ]

  // Edit Repair modal state
  const [isEditRepairModalOpen, setIsEditRepairModalOpen] = useState(false)
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null)
  const [editRepairForm, setEditRepairForm] = useState<EditRepairFormData>({
    narrative: '',
    type_maint: '',
    how_mal: '',
    when_disc: '',
    tag_no: '',
    doc_no: '',
  })
  const [editRepairLoading, setEditRepairLoading] = useState(false)
  const [editRepairError, setEditRepairError] = useState<string | null>(null)
  const [editRepairSuccess, setEditRepairSuccess] = useState<string | null>(null)

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

  // Fetch attachments for the event
  const fetchAttachments = useCallback(async () => {
    if (!token || !id) return

    setAttachmentsLoading(true)

    try {
      const response = await fetch(`http://localhost:3001/api/events/${id}/attachments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch attachments')
        return
      }

      const data = await response.json()
      setAttachments(data.attachments || [])
    } catch (err) {
      console.error('Error fetching attachments:', err)
    } finally {
      setAttachmentsLoading(false)
    }
  }, [token, id])

  // Handle attachment upload
  const handleUploadAttachment = async () => {
    if (!token || !id || !uploadFile) return

    setUploadLoading(true)
    setUploadError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      if (uploadDescription) {
        formData.append('description', uploadDescription)
      }

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch(`http://localhost:3001/api/events/${id}/attachments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload attachment')
      }

      const data = await response.json()
      setUploadSuccess(`File "${data.attachment.original_filename}" uploaded successfully!`)

      // Refresh attachments list
      await fetchAttachments()

      // Reset form and close modal after a short delay
      setTimeout(() => {
        closeUploadModal()
      }, 1500)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'An error occurred during upload')
      setUploadProgress(0)
    } finally {
      setUploadLoading(false)
    }
  }

  // Open upload modal
  const openUploadModal = () => {
    setUploadFile(null)
    setUploadDescription('')
    setUploadError(null)
    setUploadSuccess(null)
    setUploadProgress(0)
    setIsUploadModalOpen(true)
  }

  // Close upload modal
  const closeUploadModal = () => {
    setIsUploadModalOpen(false)
    setUploadFile(null)
    setUploadDescription('')
    setUploadError(null)
    setUploadSuccess(null)
    setUploadProgress(0)
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size exceeds 10MB limit')
        return
      }
      setUploadFile(file)
      setUploadError(null)
    }
  }

  // Download attachment
  const handleDownloadAttachment = async (attachment: Attachment) => {
    if (!token) return

    setDownloadingAttachmentId(attachment.attachment_id)

    try {
      const response = await fetch(`http://localhost:3001/api/attachments/${attachment.attachment_id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to download attachment')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.original_filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading attachment:', err)
    } finally {
      setDownloadingAttachmentId(null)
    }
  }

  // Delete attachment
  const handleDeleteAttachment = async (attachmentId: number) => {
    if (!token) return

    setDeletingAttachmentId(attachmentId)

    try {
      const response = await fetch(`http://localhost:3001/api/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete attachment')
      }

      // Refresh attachments list
      await fetchAttachments()
    } catch (err) {
      console.error('Error deleting attachment:', err)
    } finally {
      setDeletingAttachmentId(null)
    }
  }

  // Helper to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Check if file is an image
  const isImageFile = (mimeType: string): boolean => {
    return mimeType.startsWith('image/')
  }

  // Fetch sorties for dropdown
  const fetchSorties = useCallback(async () => {
    if (!token || !event) return

    setSortiesLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('program_id', event.pgm_id.toString())

      const response = await fetch(`http://localhost:3001/api/sorties?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sorties')
      }

      const data = await response.json()
      setSorties(data.sorties)
    } catch (err) {
      console.error('Error fetching sorties:', err)
    } finally {
      setSortiesLoading(false)
    }
  }, [token, event])

  // Fetch linked sortie details
  const fetchLinkedSortie = useCallback(async () => {
    if (!token || !event?.sortie_id) {
      setLinkedSortie(null)
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/sorties/${event.sortie_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch linked sortie')
      }

      const data = await response.json()
      setLinkedSortie(data.sortie)
    } catch (err) {
      console.error('Error fetching linked sortie:', err)
      setLinkedSortie(null)
    }
  }, [token, event?.sortie_id])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  useEffect(() => {
    if (event) {
      fetchRepairs()
      fetchLinkedSortie()
      fetchAttachments()
    }
  }, [event, fetchRepairs, fetchLinkedSortie, fetchAttachments])

  // Open close repair modal
  const openCloseRepairModal = (repair: Repair) => {
    setClosingRepair(repair)
    setCloseRepairDate(new Date().toISOString().split('T')[0])
    setCloseRepairError(null)
    setCloseRepairSuccess(null)
    setIsCloseRepairModalOpen(true)
  }

  // Close the close repair modal
  const closeCloseRepairModal = () => {
    setIsCloseRepairModalOpen(false)
    setClosingRepair(null)
    setCloseRepairError(null)
    setCloseRepairSuccess(null)
  }

  // Handle close repair submission with stop date
  const handleCloseRepair = async () => {
    if (!token || !closingRepair) return

    // Client-side validation: stop_date >= start_date
    // Compare date strings directly to avoid timezone issues
    // Both dates are in YYYY-MM-DD format, so string comparison works correctly
    const startDateStr = closingRepair.start_date.split('T')[0] // Extract YYYY-MM-DD part
    const stopDateStr = closeRepairDate // Already in YYYY-MM-DD format from input
    if (stopDateStr < startDateStr) {
      setCloseRepairError(`Stop date cannot be before the start date (${new Date(closingRepair.start_date).toLocaleDateString()})`)
      return
    }

    setCloseRepairLoading(true)
    setCloseRepairError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${closingRepair.repair_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stop_date: closeRepairDate,
          shop_status: 'closed',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to close repair')
      }

      setCloseRepairSuccess('Repair closed successfully!')

      // Refresh repairs
      await fetchRepairs()

      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeCloseRepairModal()
      }, 1500)
    } catch (err) {
      setCloseRepairError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setCloseRepairLoading(false)
    }
  }

  // Open add repair modal
  const openAddRepairModal = () => {
    setAddRepairForm({
      start_date: new Date().toISOString().split('T')[0],
      type_maint: '',
      how_mal: '',
      when_disc: '',
      narrative: '',
    })
    setAddRepairError(null)
    setAddRepairSuccess(null)
    setIsAddRepairModalOpen(true)
  }

  // Close add repair modal
  const closeAddRepairModal = () => {
    setIsAddRepairModalOpen(false)
    setAddRepairError(null)
    setAddRepairSuccess(null)
  }

  // Handle add repair form changes
  const handleAddRepairFormChange = (field: string, value: string) => {
    setAddRepairForm(prev => ({ ...prev, [field]: value }))
    setAddRepairError(null)
  }

  // Submit new repair
  const handleAddRepair = async () => {
    if (!token || !event) return

    // Validate required fields
    if (!addRepairForm.type_maint) {
      setAddRepairError('Type of Maintenance is required')
      return
    }
    if (!addRepairForm.narrative.trim()) {
      setAddRepairError('Narrative description is required')
      return
    }

    setAddRepairLoading(true)
    setAddRepairError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/events/${event.event_id}/repairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_date: addRepairForm.start_date,
          type_maint: addRepairForm.type_maint,
          how_mal: addRepairForm.how_mal || null,
          when_disc: addRepairForm.when_disc || null,
          narrative: addRepairForm.narrative.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create repair')
      }

      const data = await response.json()
      setAddRepairSuccess(`Repair #${data.repair.repair_seq} created successfully!`)

      // Refresh repairs list
      await fetchRepairs()

      // Close modal after a short delay
      setTimeout(() => {
        closeAddRepairModal()
      }, 1500)
    } catch (err) {
      setAddRepairError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAddRepairLoading(false)
    }
  }

  // Open edit repair modal
  const openEditRepairModal = (repair: Repair) => {
    setEditingRepair(repair)
    setEditRepairForm({
      narrative: repair.narrative,
      type_maint: repair.type_maint,
      how_mal: repair.how_mal || '',
      when_disc: repair.when_disc || '',
      tag_no: repair.tag_no || '',
      doc_no: repair.doc_no || '',
    })
    setEditRepairError(null)
    setEditRepairSuccess(null)
    setIsEditRepairModalOpen(true)
  }

  // Close edit repair modal
  const closeEditRepairModal = () => {
    setIsEditRepairModalOpen(false)
    setEditingRepair(null)
    setEditRepairError(null)
    setEditRepairSuccess(null)
  }

  // Handle edit repair form field changes
  const handleEditRepairFormChange = (field: keyof EditRepairFormData, value: string) => {
    setEditRepairForm(prev => ({ ...prev, [field]: value }))
    setEditRepairError(null)
  }

  // Submit edit repair form
  const handleSubmitEditRepair = async () => {
    if (!token || !editingRepair) return

    // Validate form
    if (!editRepairForm.narrative.trim()) {
      setEditRepairError('Narrative is required')
      return
    }
    if (!editRepairForm.type_maint) {
      setEditRepairError('Maintenance type is required')
      return
    }

    setEditRepairLoading(true)
    setEditRepairError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${editingRepair.repair_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          narrative: editRepairForm.narrative.trim(),
          type_maint: editRepairForm.type_maint,
          how_mal: editRepairForm.how_mal || null,
          when_disc: editRepairForm.when_disc || null,
          tag_no: editRepairForm.tag_no || null,
          doc_no: editRepairForm.doc_no || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update repair')
      }

      setEditRepairSuccess('Repair updated successfully!')

      // Refresh repairs
      await fetchRepairs()

      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeEditRepairModal()
      }, 1500)
    } catch (err) {
      setEditRepairError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setEditRepairLoading(false)
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
      sortie_id: event.sortie_id?.toString() || '',
      pqdr: event.pqdr || false,
    })
    setEditError(null)
    setEditSuccess(null)
    fetchSorties()
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
          sortie_id: editForm.sortie_id || null,
          pqdr: editForm.pqdr,
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
              {/* PQDR Flag Display */}
              <div>
                <label className="text-sm text-gray-500">PQDR Status</label>
                <p className="mt-1">
                  {event.pqdr ? (
                    <span className="inline-flex items-center px-2.5 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      PQDR Flagged
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Not flagged</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* PQDR Alert Banner */}
          {event.pqdr && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Product Quality Deficiency Report (PQDR)</h3>
                  <p className="text-sm text-red-700 mt-1">
                    This maintenance event has been flagged for quality deficiency reporting. Review and document any manufacturing or design defects.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Discrepancy */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Discrepancy</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{event.discrepancy}</p>
          </div>

          {/* Linked Sortie */}
          {linkedSortie && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Linked Sortie</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-blue-900">
                        {linkedSortie.mission_id}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        linkedSortie.sortie_effect === 'Full Mission Capable'
                          ? 'bg-green-100 text-green-800'
                          : linkedSortie.sortie_effect === 'Partial Mission Capable'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {linkedSortie.sortie_effect || 'Unknown'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Asset:</span>{' '}
                        <span className="text-gray-900">{linkedSortie.serno}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>{' '}
                        <span className="text-gray-900">
                          {new Date(linkedSortie.sortie_date).toLocaleDateString()}
                        </span>
                      </div>
                      {linkedSortie.ac_tailno && (
                        <div>
                          <span className="text-gray-500">Tail No:</span>{' '}
                          <span className="text-gray-900">{linkedSortie.ac_tailno}</span>
                        </div>
                      )}
                      {linkedSortie.current_unit && (
                        <div>
                          <span className="text-gray-500">Unit:</span>{' '}
                          <span className="text-gray-900">{linkedSortie.current_unit}</span>
                        </div>
                      )}
                      {linkedSortie.range && (
                        <div>
                          <span className="text-gray-500">Range:</span>{' '}
                          <span className="text-gray-900">{linkedSortie.range}</span>
                        </div>
                      )}
                      {linkedSortie.reason && (
                        <div className="col-span-2">
                          <span className="text-gray-500">Reason:</span>{' '}
                          <span className="text-gray-900">{linkedSortie.reason}</span>
                        </div>
                      )}
                    </div>
                    {linkedSortie.remarks && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <span className="text-sm text-gray-500">Remarks:</span>
                        <p className="text-sm text-gray-700 mt-1">{linkedSortie.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
              {canEdit && event.status === 'open' && (
                <button
                  onClick={openAddRepairModal}
                  className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Repair
                </button>
              )}
            </div>

            {repairsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : repairs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No repairs recorded for this event</p>
                {canEdit && event.status === 'open' && (
                  <button
                    onClick={openAddRepairModal}
                    className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Add your first repair
                  </button>
                )}
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
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={() => openEditRepairModal(repair)}
                            className="px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors flex items-center"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => openCloseRepairModal(repair)}
                            className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors flex items-center"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Close Repair
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <PaperClipIcon className="h-5 w-5 mr-2 text-gray-500" />
                Attachments
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({attachments.length} file{attachments.length !== 1 ? 's' : ''})
                </span>
              </h2>
              {canEdit && (
                <button
                  onClick={openUploadModal}
                  className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1 rotate-180" />
                  Upload
                </button>
              )}
            </div>

            {attachmentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : attachments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <PaperClipIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No attachments uploaded</p>
                {canEdit && (
                  <button
                    onClick={openUploadModal}
                    className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Upload your first attachment
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.attachment_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      {isImageFile(attachment.mime_type) ? (
                        <PhotoIcon className="h-8 w-8 text-green-500 flex-shrink-0" />
                      ) : (
                        <DocumentIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                      )}
                      <div className="ml-3 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={attachment.original_filename}>
                          {attachment.original_filename}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatFileSize(attachment.file_size)}</span>
                          <span>•</span>
                          <span>{attachment.uploaded_by_name}</span>
                          <span>•</span>
                          <span>{new Date(attachment.uploaded_at).toLocaleDateString()}</span>
                        </div>
                        {attachment.description && (
                          <p className="text-xs text-gray-600 mt-1 truncate" title={attachment.description}>
                            {attachment.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleDownloadAttachment(attachment)}
                        disabled={downloadingAttachmentId === attachment.attachment_id}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Download"
                      >
                        {downloadingAttachmentId === attachment.attachment_id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                        ) : (
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        )}
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleDeleteAttachment(attachment.attachment_id)}
                          disabled={deletingAttachmentId === attachment.attachment_id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingAttachmentId === attachment.attachment_id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <XMarkIcon className="h-5 w-5" />
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

              {/* Linked Sortie */}
              <div>
                <label htmlFor="edit_sortie_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Linked Sortie
                </label>
                <select
                  id="edit_sortie_id"
                  value={editForm.sortie_id}
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
                  Link this event to a sortie that caused the discrepancy
                </p>
              </div>

              {/* PQDR Flag */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="edit_pqdr"
                    checked={editForm.pqdr}
                    onChange={(e) => setEditForm(prev => ({ ...prev, pqdr: e.target.checked }))}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-3">
                    <span className="text-sm font-medium text-red-800">Flag for PQDR</span>
                    <span className="block text-xs text-red-600 mt-0.5">
                      Product Quality Deficiency Report - Mark this event for quality deficiency reporting
                    </span>
                  </span>
                </label>
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

      {/* Upload Attachment Modal */}
      <Dialog open={isUploadModalOpen} onClose={closeUploadModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <PaperClipIcon className="h-5 w-5 mr-2 text-gray-500" />
                Upload Attachment
              </Dialog.Title>
              <button
                onClick={closeUploadModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Success Message */}
              {uploadSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{uploadSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{uploadError}</p>
                </div>
              )}

              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select File <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {uploadFile ? (
                      <>
                        {isImageFile(uploadFile.type) ? (
                          <PhotoIcon className="mx-auto h-12 w-12 text-green-500" />
                        ) : (
                          <DocumentIcon className="mx-auto h-12 w-12 text-blue-500" />
                        )}
                        <p className="text-sm text-gray-900 font-medium">{uploadFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(uploadFile.size)}</p>
                        <button
                          type="button"
                          onClick={() => setUploadFile(null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileSelect}
                              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx,.txt"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, images, Word, Excel, or text up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="upload_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="upload_description"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add a description for this attachment..."
                />
              </div>

              {/* Upload Progress */}
              {uploadLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeUploadModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={uploadLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadAttachment}
                disabled={uploadLoading || !uploadFile || !!uploadSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploadLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2 rotate-180" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Repair Modal */}
      <Dialog open={isEditRepairModalOpen} onClose={closeEditRepairModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-primary-500" />
                Edit Repair #{editingRepair?.repair_seq}
              </Dialog.Title>
              <button
                onClick={closeEditRepairModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Success Message */}
              {editRepairSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{editRepairSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {editRepairError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{editRepairError}</p>
                </div>
              )}

              {/* Type of Maintenance */}
              <div>
                <label htmlFor="edit_repair_type_maint" className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Maintenance <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit_repair_type_maint"
                  value={editRepairForm.type_maint}
                  onChange={(e) => handleEditRepairFormChange('type_maint', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select type...</option>
                  {typeMaintOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* How Malfunctioned */}
              <div>
                <label htmlFor="edit_repair_how_mal" className="block text-sm font-medium text-gray-700 mb-1">
                  How Malfunctioned Code
                </label>
                <select
                  id="edit_repair_how_mal"
                  value={editRepairForm.how_mal}
                  onChange={(e) => handleEditRepairFormChange('how_mal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {howMalOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* When Discovered */}
              <div>
                <label htmlFor="edit_repair_when_disc" className="block text-sm font-medium text-gray-700 mb-1">
                  When Discovered Code
                </label>
                <select
                  id="edit_repair_when_disc"
                  value={editRepairForm.when_disc}
                  onChange={(e) => handleEditRepairFormChange('when_disc', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {whenDiscOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Tag Number */}
              <div>
                <label htmlFor="edit_repair_tag_no" className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Number
                </label>
                <input
                  type="text"
                  id="edit_repair_tag_no"
                  value={editRepairForm.tag_no}
                  onChange={(e) => handleEditRepairFormChange('tag_no', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter tag number (optional)"
                />
              </div>

              {/* Document Number */}
              <div>
                <label htmlFor="edit_repair_doc_no" className="block text-sm font-medium text-gray-700 mb-1">
                  Document Number
                </label>
                <input
                  type="text"
                  id="edit_repair_doc_no"
                  value={editRepairForm.doc_no}
                  onChange={(e) => handleEditRepairFormChange('doc_no', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter document number (optional)"
                />
              </div>

              {/* Narrative */}
              <div>
                <label htmlFor="edit_repair_narrative" className="block text-sm font-medium text-gray-700 mb-1">
                  Narrative <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit_repair_narrative"
                  value={editRepairForm.narrative}
                  onChange={(e) => handleEditRepairFormChange('narrative', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the repair work performed..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeEditRepairModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={editRepairLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEditRepair}
                disabled={editRepairLoading || !!editRepairSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {editRepairLoading ? (
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

      {/* Add Repair Modal */}
      <Dialog open={isAddRepairModalOpen} onClose={closeAddRepairModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-primary-600" />
                Add Repair
              </Dialog.Title>
              <button
                onClick={closeAddRepairModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Success Message */}
              {addRepairSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{addRepairSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {addRepairError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{addRepairError}</p>
                </div>
              )}

              {/* Start Date */}
              <div>
                <label htmlFor="repair_start_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="repair_start_date"
                  value={addRepairForm.start_date}
                  onChange={(e) => handleAddRepairFormChange('start_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Type of Maintenance */}
              <div>
                <label htmlFor="repair_type_maint" className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Maintenance <span className="text-red-500">*</span>
                </label>
                <select
                  id="repair_type_maint"
                  value={addRepairForm.type_maint}
                  onChange={(e) => handleAddRepairFormChange('type_maint', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select type of maintenance...</option>
                  {typeMaintOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* How Malfunction Code */}
              <div>
                <label htmlFor="repair_how_mal" className="block text-sm font-medium text-gray-700 mb-1">
                  How Malfunction Code
                </label>
                <select
                  id="repair_how_mal"
                  value={addRepairForm.how_mal}
                  onChange={(e) => handleAddRepairFormChange('how_mal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {howMalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Code indicating how the malfunction manifested
                </p>
              </div>

              {/* When Discovered Code */}
              <div>
                <label htmlFor="repair_when_disc" className="block text-sm font-medium text-gray-700 mb-1">
                  When Discovered Code
                </label>
                <select
                  id="repair_when_disc"
                  value={addRepairForm.when_disc}
                  onChange={(e) => handleAddRepairFormChange('when_disc', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {whenDiscOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Code indicating when the issue was discovered
                </p>
              </div>

              {/* Narrative Description */}
              <div>
                <label htmlFor="repair_narrative" className="block text-sm font-medium text-gray-700 mb-1">
                  Narrative Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="repair_narrative"
                  value={addRepairForm.narrative}
                  onChange={(e) => handleAddRepairFormChange('narrative', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe the repair work being performed..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeAddRepairModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={addRepairLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddRepair}
                disabled={addRepairLoading || !!addRepairSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addRepairLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Repair
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Close Repair Modal */}
      <Dialog open={isCloseRepairModalOpen} onClose={closeCloseRepairModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                Close Repair #{closingRepair?.repair_seq}
              </Dialog.Title>
              <button
                onClick={closeCloseRepairModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Success Message */}
              {closeRepairSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{closeRepairSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {closeRepairError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{closeRepairError}</p>
                  </div>
                </div>
              )}

              {/* Confirmation text */}
              {!closeRepairSuccess && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">
                    You are about to close <strong>Repair #{closingRepair?.repair_seq}</strong> for this maintenance event.
                    Please enter the completion date.
                  </p>
                </div>
              )}

              {/* Repair Info (read-only) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Repair Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Repair #:</span>{' '}
                    <span className="text-gray-900 font-medium">{closingRepair?.repair_seq}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>{' '}
                    <span className="text-gray-900">{closingRepair?.type_maint}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Start Date:</span>{' '}
                    <span className="text-gray-900">
                      {closingRepair?.start_date ? new Date(closingRepair.start_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>{' '}
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      {closingRepair?.shop_status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                {closingRepair?.narrative && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">Narrative:</span>
                    <p className="text-gray-900 text-sm mt-1">{closingRepair.narrative}</p>
                  </div>
                )}
              </div>

              {/* Stop Date Input */}
              <div>
                <label htmlFor="close_repair_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Date (Completion Date) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="close_repair_date"
                  value={closeRepairDate}
                  onChange={(e) => setCloseRepairDate(e.target.value)}
                  min={closingRepair?.start_date}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={closeRepairLoading || !!closeRepairSuccess}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be on or after the start date ({closingRepair?.start_date ? new Date(closingRepair.start_date).toLocaleDateString() : 'N/A'})
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeCloseRepairModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={closeRepairLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCloseRepair}
                disabled={closeRepairLoading || !!closeRepairSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {closeRepairLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Closing...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Close Repair
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
