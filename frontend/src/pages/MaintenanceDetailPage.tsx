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
  TrashIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  ShoppingCartIcon,
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
  action_taken: string | null // Action Taken code (T = cannibalization, R = repair, etc.)
  shop_status: 'open' | 'closed'
  narrative: string
  tag_no: string | null
  doc_no: string | null
  micap: boolean // Mission Capable impacting flag
  micap_login: string | null // User who flagged as MICAP
  chief_review: boolean // Flagged for chief review
  chief_review_by: string | null // User who flagged for chief review
  super_review: boolean // Flagged for supervisor review
  super_review_by: string | null // User who flagged for supervisor review
  repeat_recur: boolean // Flagged as repeat/recurring issue
  repeat_recur_by: string | null // User who flagged as repeat/recur
  // Cannibalization (Action T) fields
  donor_asset_id: number | null
  donor_asset_sn: string | null
  donor_asset_pn: string | null
  donor_asset_name: string | null
  // ETI (Elapsed Time Indicator) tracking
  eti_in: number | null // ETI meter value at repair start
  eti_out: number | null // ETI meter value at repair end
  eti_delta: number | null // Calculated difference (eti_out - eti_in)
  meter_changed: boolean // Flag indicating physical meter was replaced
  created_by_name: string
  created_at: string
  // Linked TCTO (from TCTO completion linking)
  linked_tcto: {
    tcto_id: number
    tcto_no: string
    title: string
    status: 'open' | 'closed'
    priority: 'Routine' | 'Urgent' | 'Critical'
    completion_date: string
  } | null
}

interface RepairsSummary {
  total: number
  open: number
  closed: number
}

// InstalledPart interface
interface InstalledPart {
  installed_part_id: number
  repair_id: number
  event_id: number
  asset_id: number
  asset_sn: string
  asset_pn: string
  asset_name: string
  installation_date: string
  installation_notes: string | null
  previous_location: string | null
  installed_by: number
  installed_by_name: string
  created_at: string
}

// RemovedPart interface
interface RemovedPart {
  removed_part_id: number
  repair_id: number
  event_id: number
  asset_id: number
  asset_sn: string
  asset_pn: string
  asset_name: string
  removal_date: string
  removal_reason: string | null
  removal_notes: string | null
  new_status: string | null
  removed_by: number
  removed_by_name: string
  created_at: string
}

// Available asset for installation
interface AvailableAsset {
  asset_id: number
  serno: string
  partno: string
  nomen: string | null
  status: string
  location: string | null
}

// Available asset for removal
interface RemovableAsset {
  asset_id: number
  serno: string
  partno: string
  name: string
  status_cd: string
  admin_loc: string
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

// Labor record interface
interface Labor {
  labor_id: number
  repair_id: number
  labor_seq: number
  asset_id: number
  action_taken: string | null
  how_mal: string | null
  when_disc: string | null
  type_maint: string | null
  cat_labor: string | null
  start_date: string
  stop_date: string | null
  hours: number | null
  crew_chief: string | null
  crew_size: number | null
  corrective: string | null
  discrepancy: string | null
  remarks: string | null
  corrected_by: string | null
  inspected_by: string | null
  bit_log: string | null
  sent_imds: boolean
  valid: boolean
  created_by: number
  created_by_name: string
  created_at: string
}

// Labor part tracking interface
interface LaborPart {
  labor_part_id: number
  labor_id: number
  asset_id: number | null
  partno_id: number | null
  partno: string | null
  part_name: string | null
  serial_number: string | null
  part_action: 'WORKED' | 'REMOVED' | 'INSTALLED'
  qty: number
  created_by: number
  created_by_name: string
  created_at: string
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
  action_taken: string
  tag_no: string
  doc_no: string
  micap: boolean
  chief_review: boolean
  super_review: boolean
  repeat_recur: boolean
  donor_asset_id: number | null
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
  const [repairFilter, setRepairFilter] = useState<'all' | 'repeat_recur'>('all')

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
  const [closeRepairEtiOut, setCloseRepairEtiOut] = useState<string>('') // ETI Out value for closing repair
  const [closeRepairLoading, setCloseRepairLoading] = useState(false)
  const [closeRepairError, setCloseRepairError] = useState<string | null>(null)
  const [closeRepairSuccess, setCloseRepairSuccess] = useState<string | null>(null)

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
    action_taken: '',
    narrative: '',
    micap: false,
    chief_review: false,
    super_review: false,
    repeat_recur: false,
    donor_asset_id: null as number | null,
    eti_in: '', // ETI meter value at repair start
  })
  const [addRepairLoading, setAddRepairLoading] = useState(false)
  const [addRepairError, setAddRepairError] = useState<string | null>(null)
  const [addRepairSuccess, setAddRepairSuccess] = useState<string | null>(null)
  const [donorAssets, setDonorAssets] = useState<AvailableAsset[]>([])
  const [donorAssetsLoading, setDonorAssetsLoading] = useState(false)

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
    // No-Defect codes with special handling - parts not required
    { value: '799', label: '799 - No Defect, Cannot Duplicate' },
    { value: '800', label: '800 - No Defect Evident' },
    { value: '804', label: '804 - No Defect, Component Bench Checked' },
    { value: '806', label: '806 - Bench Check Satisfactory' },
  ]

  // No-defect codes that have special handling (parts not required)
  const noDefectCodes = ['799', '800', '804', '806']
  const isNoDefectCode = (code: string | null) => code && noDefectCodes.includes(code)

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

  // Action Taken code options
  const actionTakenOptions = [
    { value: '', label: 'None / Not Applicable' },
    { value: 'A', label: 'A - Adjusted' },
    { value: 'B', label: 'B - Bench Checked' },
    { value: 'C', label: 'C - Calibrated' },
    { value: 'D', label: 'D - Disassembled' },
    { value: 'F', label: 'F - Fabricated/Manufactured' },
    { value: 'G', label: 'G - Altered/Modified' },
    { value: 'I', label: 'I - Inspected' },
    { value: 'K', label: 'K - Kit Installed' },
    { value: 'L', label: 'L - Lubricated' },
    { value: 'M', label: 'M - Maintained' },
    { value: 'N', label: 'N - No Defect Found' },
    { value: 'P', label: 'P - Repaired/Serviced' },
    { value: 'R', label: 'R - Removed/Replaced' },
    { value: 'S', label: 'S - Cleaned' },
    { value: 'T', label: 'T - Cannibalization' },
    { value: 'U', label: 'U - Functional Check' },
    { value: 'V', label: 'V - Verified/Validated' },
    { value: 'X', label: 'X - Condemned' },
    { value: 'Z', label: 'Z - Other' },
  ]

  // Check if action taken is cannibalization
  const isCannibalization = (code: string | null) => code === 'T'

  // Filter repairs based on selected filter
  const filteredRepairs = repairFilter === 'all'
    ? repairs
    : repairs.filter(r => r.repeat_recur)

  // Count of repeat/recur repairs for filter badge
  const repeatRecurCount = repairs.filter(r => r.repeat_recur).length

  // Edit Repair modal state
  const [isEditRepairModalOpen, setIsEditRepairModalOpen] = useState(false)
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null)
  const [editRepairForm, setEditRepairForm] = useState<EditRepairFormData>({
    narrative: '',
    type_maint: '',
    how_mal: '',
    when_disc: '',
    action_taken: '',
    tag_no: '',
    doc_no: '',
    micap: false,
    chief_review: false,
    super_review: false,
    repeat_recur: false,
    donor_asset_id: null,
  })
  const [editRepairLoading, setEditRepairLoading] = useState(false)
  const [editRepairError, setEditRepairError] = useState<string | null>(null)
  const [editRepairSuccess, setEditRepairSuccess] = useState<string | null>(null)
  const [editDonorAssets, setEditDonorAssets] = useState<AvailableAsset[]>([])
  const [editDonorAssetsLoading, setEditDonorAssetsLoading] = useState(false)

  // Delete Repair modal state
  const [isDeleteRepairModalOpen, setIsDeleteRepairModalOpen] = useState(false)
  const [deletingRepair, setDeletingRepair] = useState<Repair | null>(null)
  const [deleteRepairLoading, setDeleteRepairLoading] = useState(false)
  const [deleteRepairError, setDeleteRepairError] = useState<string | null>(null)
  const [deleteRepairSuccess, setDeleteRepairSuccess] = useState<string | null>(null)

  // Installed Parts state
  const [installedPartsMap, setInstalledPartsMap] = useState<Map<number, InstalledPart[]>>(new Map())
  const [loadingInstalledParts, setLoadingInstalledParts] = useState<Set<number>>(new Set())

  // Add Installed Part modal state
  const [isAddInstalledPartModalOpen, setIsAddInstalledPartModalOpen] = useState(false)
  const [addInstalledPartRepair, setAddInstalledPartRepair] = useState<Repair | null>(null)
  const [availableAssets, setAvailableAssets] = useState<AvailableAsset[]>([])
  const [assetSearchQuery, setAssetSearchQuery] = useState('')
  const [assetSearchLoading, setAssetSearchLoading] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<AvailableAsset | null>(null)
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().split('T')[0])
  const [installationNotes, setInstallationNotes] = useState('')
  const [addInstalledPartLoading, setAddInstalledPartLoading] = useState(false)
  const [addInstalledPartError, setAddInstalledPartError] = useState<string | null>(null)
  const [addInstalledPartSuccess, setAddInstalledPartSuccess] = useState<string | null>(null)

  // Delete Installed Part state
  const [deletingInstalledPartId, setDeletingInstalledPartId] = useState<number | null>(null)

  // Removed Parts state
  const [removedPartsMap, setRemovedPartsMap] = useState<Map<number, RemovedPart[]>>(new Map())
  const [loadingRemovedParts, setLoadingRemovedParts] = useState<Set<number>>(new Set())

  // Add Removed Part modal state
  const [isAddRemovedPartModalOpen, setIsAddRemovedPartModalOpen] = useState(false)
  const [addRemovedPartRepair, setAddRemovedPartRepair] = useState<Repair | null>(null)
  const [removableAssets, setRemovableAssets] = useState<RemovableAsset[]>([])
  const [removableAssetSearchQuery, setRemovableAssetSearchQuery] = useState('')
  const [removableAssetSearchLoading, setRemovableAssetSearchLoading] = useState(false)
  const [selectedRemovableAsset, setSelectedRemovableAsset] = useState<RemovableAsset | null>(null)
  const [removalDate, setRemovalDate] = useState(new Date().toISOString().split('T')[0])
  const [removalReason, setRemovalReason] = useState('')
  const [removalNotes, setRemovalNotes] = useState('')
  const [newAssetStatus, setNewAssetStatus] = useState('')
  const [addRemovedPartLoading, setAddRemovedPartLoading] = useState(false)
  const [addRemovedPartError, setAddRemovedPartError] = useState<string | null>(null)
  const [addRemovedPartSuccess, setAddRemovedPartSuccess] = useState<string | null>(null)

  // Delete Removed Part state
  const [deletingRemovedPartId, setDeletingRemovedPartId] = useState<number | null>(null)

  // Request Parts modal state
  const [isRequestPartsModalOpen, setIsRequestPartsModalOpen] = useState(false)
  const [requestPartsRemovedPart, setRequestPartsRemovedPart] = useState<RemovedPart | null>(null)
  const [requestPartsForm, setRequestPartsForm] = useState({
    part_no: '',
    part_name: '',
    nsn: '',
    qty_ordered: '1',
    priority: 'routine' as 'routine' | 'urgent' | 'critical',
    notes: '',
  })
  const [requestPartsLoading, setRequestPartsLoading] = useState(false)
  const [requestPartsError, setRequestPartsError] = useState<string | null>(null)
  const [requestPartsSuccess, setRequestPartsSuccess] = useState<string | null>(null)

  // Labor Records state
  const [laborMap, setLaborMap] = useState<Map<number, Labor[]>>(new Map())
  const [loadingLabor, setLoadingLabor] = useState<Set<number>>(new Set())

  // Add Labor modal state
  const [isAddLaborModalOpen, setIsAddLaborModalOpen] = useState(false)
  const [addLaborRepair, setAddLaborRepair] = useState<Repair | null>(null)
  const [addLaborForm, setAddLaborForm] = useState({
    action_taken: '',
    cat_labor: '',
    crew_chief: '',
    crew_size: '',
    hours: '',
    start_date: new Date().toISOString().split('T')[0],
    stop_date: '',
    corrective: '',
    bit_log: '',
    inspected_by: '',
    corrected_by: '',
  })
  const [addLaborLoading, setAddLaborLoading] = useState(false)
  const [addLaborError, setAddLaborError] = useState<string | null>(null)
  const [addLaborSuccess, setAddLaborSuccess] = useState<string | null>(null)

  // Delete Labor modal state
  const [isDeleteLaborModalOpen, setIsDeleteLaborModalOpen] = useState(false)
  const [deletingLabor, setDeletingLabor] = useState<Labor | null>(null)
  const [deletingLaborRepair, setDeletingLaborRepair] = useState<Repair | null>(null)
  const [deleteLaborLoading, setDeleteLaborLoading] = useState(false)
  const [deleteLaborError, setDeleteLaborError] = useState<string | null>(null)
  const [deleteLaborSuccess, setDeleteLaborSuccess] = useState<string | null>(null)

  // Edit Labor modal state
  const [isEditLaborModalOpen, setIsEditLaborModalOpen] = useState(false)
  const [editLaborRecord, setEditLaborRecord] = useState<Labor | null>(null)
  const [editLaborRepair, setEditLaborRepair] = useState<Repair | null>(null)
  const [editLaborForm, setEditLaborForm] = useState({
    action_taken: '',
    cat_labor: '',
    crew_chief: '',
    crew_size: '',
    hours: '',
    start_date: '',
    stop_date: '',
    corrective: '',
    bit_log: '',
    inspected_by: '',
    corrected_by: '',
  })
  const [editLaborLoading, setEditLaborLoading] = useState(false)
  const [editLaborError, setEditLaborError] = useState<string | null>(null)
  const [editLaborSuccess, setEditLaborSuccess] = useState<string | null>(null)

  // Labor Parts state
  const [laborPartsMap, setLaborPartsMap] = useState<Map<number, LaborPart[]>>(new Map())
  const [loadingLaborParts, setLoadingLaborParts] = useState<Set<number>>(new Set())
  const [expandedLaborParts, setExpandedLaborParts] = useState<Set<number>>(new Set())

  // Add Labor Part modal state
  const [isAddLaborPartModalOpen, setIsAddLaborPartModalOpen] = useState(false)
  const [addLaborPartLabor, setAddLaborPartLabor] = useState<Labor | null>(null)
  const [addLaborPartForm, setAddLaborPartForm] = useState({
    part_action: 'WORKED' as 'WORKED' | 'REMOVED' | 'INSTALLED',
    partno: '',
    part_name: '',
    serial_number: '',
    qty: '1',
  })
  const [addLaborPartLoading, setAddLaborPartLoading] = useState(false)
  const [addLaborPartError, setAddLaborPartError] = useState<string | null>(null)
  const [addLaborPartSuccess, setAddLaborPartSuccess] = useState<string | null>(null)

  // Delete Labor Part state
  const [deletingLaborPart, setDeletingLaborPart] = useState<LaborPart | null>(null)
  const [deleteLaborPartLoading, setDeleteLaborPartLoading] = useState(false)

  // Removal reason options
  const removalReasonOptions = [
    { value: '', label: 'Select a reason...' },
    { value: 'FAILED', label: 'Failed - Component Failure' },
    { value: 'DAMAGED', label: 'Damaged - Physical Damage' },
    { value: 'WORN', label: 'Worn - End of Service Life' },
    { value: 'UPGRADE', label: 'Upgrade - Replaced with Better Part' },
    { value: 'CALIBRATION', label: 'Calibration - Needs Recalibration' },
    { value: 'INSPECTION', label: 'Inspection - Scheduled Inspection' },
    { value: 'OTHER', label: 'Other' },
  ]

  // Asset status options for removed parts
  const assetStatusOptions = [
    { value: '', label: 'Keep current status' },
    { value: 'NMCM', label: 'NMCM - Non-Mission Capable Maintenance' },
    { value: 'NMCS', label: 'NMCS - Non-Mission Capable Supply' },
    { value: 'CNDM', label: 'CNDM - Condition Not Determined' },
    { value: 'FMC', label: 'FMC - Full Mission Capable' },
    { value: 'PMC', label: 'PMC - Partial Mission Capable' },
  ]

  // Action taken code options for labor records
  const laborActionTakenOptions = [
    { value: '', label: 'Select action...' },
    { value: 'R', label: 'R - Repair' },
    { value: 'I', label: 'I - Inspect' },
    { value: 'T', label: 'T - Cannibalization' },
    { value: 'A', label: 'A - Adjust/Align' },
    { value: 'C', label: 'C - Clean' },
    { value: 'E', label: 'E - Remove/Replace' },
    { value: 'L', label: 'L - Lubricate' },
    { value: 'S', label: 'S - Service' },
    { value: 'Z', label: 'Z - Other' },
  ]

  // Category of labor code options
  const catLaborOptions = [
    { value: '', label: 'Select category...' },
    { value: 'R', label: 'R - Repair' },
    { value: 'I', label: 'I - Inspection' },
    { value: 'S', label: 'S - Servicing' },
    { value: 'M', label: 'M - Modification' },
    { value: 'O', label: 'O - Overhaul' },
    { value: 'T', label: 'T - Time Change' },
    { value: 'C', label: 'C - Calibration' },
    { value: 'P', label: 'P - PMI' },
    { value: 'Z', label: 'Z - Other' },
  ]

  // Check if user can edit (ADMIN, DEPOT_MANAGER, or FIELD_TECHNICIAN)
  const canEdit = user && ['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN'].includes(user.role)

  // Check if user can delete repairs (ADMIN or DEPOT_MANAGER only)
  const canDeleteRepairs = user && ['ADMIN', 'DEPOT_MANAGER'].includes(user.role)

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

  // Fetch installed parts for a repair
  const fetchInstalledParts = useCallback(async (repairId: number) => {
    if (!token) return

    setLoadingInstalledParts(prev => new Set(prev).add(repairId))

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${repairId}/installed-parts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch installed parts')
        return
      }

      const data = await response.json()
      setInstalledPartsMap(prev => {
        const newMap = new Map(prev)
        newMap.set(repairId, data.installed_parts || [])
        return newMap
      })
    } catch (err) {
      console.error('Error fetching installed parts:', err)
    } finally {
      setLoadingInstalledParts(prev => {
        const newSet = new Set(prev)
        newSet.delete(repairId)
        return newSet
      })
    }
  }, [token])

  // Fetch installed parts for all repairs when repairs are loaded
  useEffect(() => {
    if (repairs.length > 0 && token) {
      repairs.forEach(repair => {
        fetchInstalledParts(repair.repair_id)
      })
    }
  }, [repairs, token, fetchInstalledParts])

  // Search available assets for installation
  const searchAvailableAssets = useCallback(async (query: string) => {
    if (!token || !id) return

    setAssetSearchLoading(true)

    try {
      const response = await fetch(
        `http://localhost:3001/api/events/${id}/available-assets?search=${encodeURIComponent(query)}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        console.error('Failed to search assets')
        return
      }

      const data = await response.json()
      setAvailableAssets(data.assets || [])
    } catch (err) {
      console.error('Error searching assets:', err)
    } finally {
      setAssetSearchLoading(false)
    }
  }, [token, id])

  // Debounced asset search
  useEffect(() => {
    if (!isAddInstalledPartModalOpen) return

    const timeoutId = setTimeout(() => {
      searchAvailableAssets(assetSearchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [assetSearchQuery, isAddInstalledPartModalOpen, searchAvailableAssets])

  // Open Add Installed Part modal
  const openAddInstalledPartModal = (repair: Repair) => {
    setAddInstalledPartRepair(repair)
    setAvailableAssets([])
    setAssetSearchQuery('')
    setSelectedAsset(null)
    setInstallationDate(new Date().toISOString().split('T')[0])
    setInstallationNotes('')
    setAddInstalledPartError(null)
    setAddInstalledPartSuccess(null)
    setIsAddInstalledPartModalOpen(true)
    // Initial search with empty query to show available assets
    searchAvailableAssets('')
  }

  // Close Add Installed Part modal
  const closeAddInstalledPartModal = () => {
    setIsAddInstalledPartModalOpen(false)
    setAddInstalledPartRepair(null)
    setSelectedAsset(null)
    setAvailableAssets([])
  }

  // Handle adding installed part
  const handleAddInstalledPart = async () => {
    if (!token || !addInstalledPartRepair || !selectedAsset) return

    setAddInstalledPartLoading(true)
    setAddInstalledPartError(null)

    try {
      const response = await fetch(
        `http://localhost:3001/api/repairs/${addInstalledPartRepair.repair_id}/installed-parts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            asset_id: selectedAsset.asset_id,
            installation_date: installationDate,
            installation_notes: installationNotes || null,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add installed part')
      }

      setAddInstalledPartSuccess(`Part "${selectedAsset.serno}" added successfully!`)

      // Refresh installed parts for this repair
      await fetchInstalledParts(addInstalledPartRepair.repair_id)

      // Close modal after a short delay
      setTimeout(() => {
        closeAddInstalledPartModal()
      }, 1500)
    } catch (err) {
      setAddInstalledPartError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAddInstalledPartLoading(false)
    }
  }

  // Handle removing installed part
  const handleRemoveInstalledPart = async (installedPart: InstalledPart) => {
    if (!token) return

    setDeletingInstalledPartId(installedPart.installed_part_id)

    try {
      const response = await fetch(
        `http://localhost:3001/api/installed-parts/${installedPart.installed_part_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove installed part')
      }

      // Refresh installed parts for this repair
      await fetchInstalledParts(installedPart.repair_id)
    } catch (err) {
      console.error('Error removing installed part:', err)
      alert(err instanceof Error ? err.message : 'Failed to remove installed part')
    } finally {
      setDeletingInstalledPartId(null)
    }
  }

  // Fetch removed parts for a repair
  const fetchRemovedParts = useCallback(async (repairId: number) => {
    if (!token) return

    setLoadingRemovedParts(prev => new Set(prev).add(repairId))

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${repairId}/removed-parts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch removed parts')
        return
      }

      const data = await response.json()
      setRemovedPartsMap(prev => {
        const newMap = new Map(prev)
        newMap.set(repairId, data.removed_parts || [])
        return newMap
      })
    } catch (err) {
      console.error('Error fetching removed parts:', err)
    } finally {
      setLoadingRemovedParts(prev => {
        const newSet = new Set(prev)
        newSet.delete(repairId)
        return newSet
      })
    }
  }, [token])

  // Fetch removed parts for all repairs when repairs are loaded
  useEffect(() => {
    if (repairs.length > 0 && token) {
      repairs.forEach(repair => {
        fetchRemovedParts(repair.repair_id)
      })
    }
  }, [repairs, token, fetchRemovedParts])

  // Fetch labor records for a repair
  const fetchLabor = useCallback(async (repairId: number) => {
    if (!token) return

    setLoadingLabor(prev => new Set(prev).add(repairId))

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${repairId}/labor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch labor records')
        return
      }

      const data = await response.json()
      setLaborMap(prev => {
        const newMap = new Map(prev)
        newMap.set(repairId, data.labor || [])
        return newMap
      })
    } catch (err) {
      console.error('Error fetching labor records:', err)
    } finally {
      setLoadingLabor(prev => {
        const newSet = new Set(prev)
        newSet.delete(repairId)
        return newSet
      })
    }
  }, [token])

  // Fetch labor records for all repairs when repairs are loaded
  useEffect(() => {
    if (repairs.length > 0 && token) {
      repairs.forEach(repair => {
        fetchLabor(repair.repair_id)
      })
    }
  }, [repairs, token, fetchLabor])

  // Search removable assets
  const searchRemovableAssets = useCallback(async (query: string) => {
    if (!token || !id) return

    setRemovableAssetSearchLoading(true)

    try {
      const response = await fetch(
        `http://localhost:3001/api/events/${id}/removable-assets?search=${encodeURIComponent(query)}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        console.error('Failed to search removable assets')
        return
      }

      const data = await response.json()
      setRemovableAssets(data.assets || [])
    } catch (err) {
      console.error('Error searching removable assets:', err)
    } finally {
      setRemovableAssetSearchLoading(false)
    }
  }, [token, id])

  // Debounced removable asset search
  useEffect(() => {
    if (!isAddRemovedPartModalOpen) return

    const timeoutId = setTimeout(() => {
      searchRemovableAssets(removableAssetSearchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [removableAssetSearchQuery, isAddRemovedPartModalOpen, searchRemovableAssets])

  // Open Add Removed Part modal
  const openAddRemovedPartModal = (repair: Repair) => {
    setAddRemovedPartRepair(repair)
    setRemovableAssets([])
    setRemovableAssetSearchQuery('')
    setSelectedRemovableAsset(null)
    setRemovalDate(new Date().toISOString().split('T')[0])
    setRemovalReason('')
    setRemovalNotes('')
    setNewAssetStatus('')
    setAddRemovedPartError(null)
    setAddRemovedPartSuccess(null)
    setIsAddRemovedPartModalOpen(true)
    // Initial search with empty query to show available assets
    searchRemovableAssets('')
  }

  // Close Add Removed Part modal
  const closeAddRemovedPartModal = () => {
    setIsAddRemovedPartModalOpen(false)
    setAddRemovedPartRepair(null)
    setSelectedRemovableAsset(null)
    setRemovableAssets([])
  }

  // Handle adding removed part
  const handleAddRemovedPart = async () => {
    if (!token || !addRemovedPartRepair || !selectedRemovableAsset) return

    setAddRemovedPartLoading(true)
    setAddRemovedPartError(null)

    try {
      const response = await fetch(
        `http://localhost:3001/api/repairs/${addRemovedPartRepair.repair_id}/removed-parts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            asset_id: selectedRemovableAsset.asset_id,
            removal_date: removalDate,
            removal_reason: removalReason || null,
            removal_notes: removalNotes || null,
            new_status: newAssetStatus || null,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add removed part')
      }

      setAddRemovedPartSuccess(`Part "${selectedRemovableAsset.serno}" recorded as removed!`)

      // Refresh removed parts for this repair
      await fetchRemovedParts(addRemovedPartRepair.repair_id)

      // Close modal after a short delay
      setTimeout(() => {
        closeAddRemovedPartModal()
      }, 1500)
    } catch (err) {
      setAddRemovedPartError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAddRemovedPartLoading(false)
    }
  }

  // Handle deleting removed part record
  const handleDeleteRemovedPart = async (removedPart: RemovedPart) => {
    if (!token) return

    setDeletingRemovedPartId(removedPart.removed_part_id)

    try {
      const response = await fetch(
        `http://localhost:3001/api/removed-parts/${removedPart.removed_part_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete removed part record')
      }

      // Refresh removed parts for this repair
      await fetchRemovedParts(removedPart.repair_id)
    } catch (err) {
      console.error('Error deleting removed part:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete removed part record')
    } finally {
      setDeletingRemovedPartId(null)
    }
  }

  // Open Request Parts modal
  const openRequestPartsModal = (removedPart: RemovedPart) => {
    setRequestPartsRemovedPart(removedPart)
    setRequestPartsForm({
      part_no: removedPart.asset_pn || '',
      part_name: removedPart.asset_name || '',
      nsn: '',
      qty_ordered: '1',
      priority: 'routine',
      notes: `Replacement for removed part from ${event?.job_no || 'maintenance event'}`,
    })
    setRequestPartsError(null)
    setRequestPartsSuccess(null)
    setIsRequestPartsModalOpen(true)
  }

  // Close Request Parts modal
  const closeRequestPartsModal = () => {
    setIsRequestPartsModalOpen(false)
    setRequestPartsRemovedPart(null)
  }

  // Handle submitting parts request
  const handleRequestParts = async () => {
    if (!token || !requestPartsRemovedPart || !event) return

    // Validation
    if (!requestPartsForm.part_no.trim() && !requestPartsForm.part_name.trim()) {
      setRequestPartsError('Either Part Number or Part Name is required')
      return
    }

    const qtyOrdered = parseInt(requestPartsForm.qty_ordered, 10)
    if (isNaN(qtyOrdered) || qtyOrdered < 1) {
      setRequestPartsError('Quantity must be at least 1')
      return
    }

    setRequestPartsLoading(true)
    setRequestPartsError(null)

    try {
      const response = await fetch('http://localhost:3001/api/parts-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          part_no: requestPartsForm.part_no.trim() || null,
          part_name: requestPartsForm.part_name.trim() || null,
          nsn: requestPartsForm.nsn.trim() || null,
          qty_ordered: qtyOrdered,
          asset_sn: event.asset_sn,
          asset_name: event.asset_name,
          job_no: event.job_no,
          priority: requestPartsForm.priority,
          pgm_id: event.pgm_id,
          notes: requestPartsForm.notes.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create parts request')
      }

      const data = await response.json()
      setRequestPartsSuccess(`Parts request #${data.order.order_id} created successfully!`)

      // Close modal after a short delay
      setTimeout(() => {
        closeRequestPartsModal()
      }, 1500)
    } catch (err) {
      setRequestPartsError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setRequestPartsLoading(false)
    }
  }

  // Open Add Labor modal
  const openAddLaborModal = (repair: Repair) => {
    setAddLaborRepair(repair)
    setAddLaborForm({
      action_taken: '',
      cat_labor: '',
      crew_chief: '',
      crew_size: '',
      hours: '',
      start_date: new Date().toISOString().split('T')[0],
      stop_date: '',
      corrective: '',
      bit_log: '',
      inspected_by: '',
      corrected_by: '',
    })
    setAddLaborError(null)
    setAddLaborSuccess(null)
    setIsAddLaborModalOpen(true)
  }

  // Close Add Labor modal
  const closeAddLaborModal = () => {
    setIsAddLaborModalOpen(false)
    setAddLaborRepair(null)
  }

  // Handle adding labor record
  const handleAddLabor = async () => {
    if (!token || !addLaborRepair) return

    if (!addLaborForm.crew_chief.trim()) {
      setAddLaborError('Crew chief name is required')
      return
    }

    if (!addLaborForm.corrective.trim()) {
      setAddLaborError('Corrective action narrative is required')
      return
    }

    setAddLaborLoading(true)
    setAddLaborError(null)

    try {
      const response = await fetch(
        `http://localhost:3001/api/repairs/${addLaborRepair.repair_id}/labor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action_taken: addLaborForm.action_taken || null,
            cat_labor: addLaborForm.cat_labor || null,
            crew_chief: addLaborForm.crew_chief,
            crew_size: addLaborForm.crew_size ? parseInt(addLaborForm.crew_size, 10) : null,
            hours: addLaborForm.hours ? parseFloat(addLaborForm.hours) : null,
            start_date: addLaborForm.start_date,
            stop_date: addLaborForm.stop_date || null,
            corrective: addLaborForm.corrective || null,
            bit_log: addLaborForm.bit_log || null,
            inspected_by: addLaborForm.inspected_by || null,
            corrected_by: addLaborForm.corrected_by || null,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create labor record')
      }

      const data = await response.json()
      setAddLaborSuccess(`Labor #${data.labor.labor_seq} created successfully!`)

      // Refresh labor records for this repair
      await fetchLabor(addLaborRepair.repair_id)

      // Close modal after a short delay
      setTimeout(() => {
        closeAddLaborModal()
      }, 1500)
    } catch (err) {
      setAddLaborError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAddLaborLoading(false)
    }
  }

  // Open delete labor modal
  const openDeleteLaborModal = (labor: Labor, repair: Repair) => {
    setDeletingLabor(labor)
    setDeletingLaborRepair(repair)
    setDeleteLaborError(null)
    setDeleteLaborSuccess(null)
    setIsDeleteLaborModalOpen(true)
  }

  // Close delete labor modal
  const closeDeleteLaborModal = () => {
    setIsDeleteLaborModalOpen(false)
    setDeletingLabor(null)
    setDeletingLaborRepair(null)
    setDeleteLaborError(null)
    setDeleteLaborSuccess(null)
  }

  // Handle deleting labor record (called from modal confirmation)
  const handleDeleteLabor = async () => {
    if (!token || !deletingLabor) return

    setDeleteLaborLoading(true)
    setDeleteLaborError(null)

    try {
      const response = await fetch(
        `http://localhost:3001/api/labor/${deletingLabor.labor_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete labor record')
      }

      setDeleteLaborSuccess(`Labor #${deletingLabor.labor_seq} deleted successfully!`)

      // Refresh labor records for this repair
      await fetchLabor(deletingLabor.repair_id)

      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeDeleteLaborModal()
      }, 1500)
    } catch (err) {
      console.error('Error deleting labor:', err)
      setDeleteLaborError(err instanceof Error ? err.message : 'Failed to delete labor record')
    } finally {
      setDeleteLaborLoading(false)
    }
  }

  // Open Edit Labor modal
  const openEditLaborModal = (labor: Labor, repair: Repair) => {
    setEditLaborRecord(labor)
    setEditLaborRepair(repair)
    setEditLaborForm({
      action_taken: labor.action_taken || '',
      cat_labor: labor.cat_labor || '',
      crew_chief: labor.crew_chief || '',
      crew_size: labor.crew_size?.toString() || '',
      hours: labor.hours?.toString() || '',
      start_date: labor.start_date || '',
      stop_date: labor.stop_date || '',
      corrective: labor.corrective || '',
      bit_log: labor.bit_log || '',
      inspected_by: labor.inspected_by || '',
      corrected_by: labor.corrected_by || '',
    })
    setEditLaborError(null)
    setEditLaborSuccess(null)
    setIsEditLaborModalOpen(true)
  }

  // Close Edit Labor modal
  const closeEditLaborModal = () => {
    setIsEditLaborModalOpen(false)
    setEditLaborRecord(null)
    setEditLaborRepair(null)
    setEditLaborForm({
      action_taken: '',
      cat_labor: '',
      crew_chief: '',
      crew_size: '',
      hours: '',
      start_date: '',
      stop_date: '',
      corrective: '',
      bit_log: '',
      inspected_by: '',
      corrected_by: '',
    })
    setEditLaborError(null)
    setEditLaborSuccess(null)
  }

  // Handle editing labor record
  const handleEditLabor = async () => {
    if (!token || !editLaborRecord) return

    if (!editLaborForm.corrective.trim()) {
      setEditLaborError('Corrective action narrative is required')
      return
    }

    setEditLaborLoading(true)
    setEditLaborError(null)

    try {
      const response = await fetch(
        `http://localhost:3001/api/labor/${editLaborRecord.labor_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action_taken: editLaborForm.action_taken || null,
            cat_labor: editLaborForm.cat_labor || null,
            crew_chief: editLaborForm.crew_chief || null,
            crew_size: editLaborForm.crew_size ? parseInt(editLaborForm.crew_size, 10) : null,
            hours: editLaborForm.hours ? parseFloat(editLaborForm.hours) : null,
            start_date: editLaborForm.start_date || null,
            stop_date: editLaborForm.stop_date || null,
            corrective: editLaborForm.corrective || null,
            bit_log: editLaborForm.bit_log || null,
            inspected_by: editLaborForm.inspected_by || null,
            corrected_by: editLaborForm.corrected_by || null,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update labor record')
      }

      const data = await response.json()
      setEditLaborSuccess(`Labor #${data.labor.labor_seq} updated successfully!`)

      // Refresh labor records for this repair
      await fetchLabor(editLaborRecord.repair_id)

      // Auto-close modal after success
      setTimeout(() => {
        closeEditLaborModal()
      }, 1500)
    } catch (err) {
      console.error('Error updating labor:', err)
      setEditLaborError(err instanceof Error ? err.message : 'Failed to update labor record')
    } finally {
      setEditLaborLoading(false)
    }
  }

  // Fetch labor parts for a specific labor record
  const fetchLaborParts = async (laborId: number) => {
    if (!token) return

    setLoadingLaborParts(prev => new Set(prev).add(laborId))

    try {
      const response = await fetch(
        `http://localhost:3001/api/labor/${laborId}/parts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch labor parts')
      }

      const data = await response.json()
      setLaborPartsMap(prev => {
        const newMap = new Map(prev)
        newMap.set(laborId, data.parts)
        return newMap
      })
    } catch (err) {
      console.error('Error fetching labor parts:', err)
    } finally {
      setLoadingLaborParts(prev => {
        const newSet = new Set(prev)
        newSet.delete(laborId)
        return newSet
      })
    }
  }

  // Toggle expanded state for labor parts and fetch if needed
  const toggleLaborParts = async (laborId: number) => {
    if (expandedLaborParts.has(laborId)) {
      setExpandedLaborParts(prev => {
        const newSet = new Set(prev)
        newSet.delete(laborId)
        return newSet
      })
    } else {
      setExpandedLaborParts(prev => new Set(prev).add(laborId))
      // Fetch parts if not already loaded
      if (!laborPartsMap.has(laborId)) {
        await fetchLaborParts(laborId)
      }
    }
  }

  // Open Add Labor Part modal
  const openAddLaborPartModal = (labor: Labor) => {
    setAddLaborPartLabor(labor)
    setAddLaborPartForm({
      part_action: 'WORKED',
      partno: '',
      part_name: '',
      serial_number: '',
      qty: '1',
    })
    setAddLaborPartError(null)
    setAddLaborPartSuccess(null)
    setIsAddLaborPartModalOpen(true)
  }

  // Close Add Labor Part modal
  const closeAddLaborPartModal = () => {
    setIsAddLaborPartModalOpen(false)
    setAddLaborPartLabor(null)
    setAddLaborPartError(null)
    setAddLaborPartSuccess(null)
  }

  // Handle adding a labor part
  const handleAddLaborPart = async () => {
    if (!token || !addLaborPartLabor) return

    // Validation
    if (!addLaborPartForm.partno && !addLaborPartForm.part_name) {
      setAddLaborPartError('Please enter either a part number or part name')
      return
    }

    setAddLaborPartLoading(true)
    setAddLaborPartError(null)

    try {
      const response = await fetch(
        `http://localhost:3001/api/labor/${addLaborPartLabor.labor_id}/parts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            part_action: addLaborPartForm.part_action,
            partno: addLaborPartForm.partno || null,
            part_name: addLaborPartForm.part_name || null,
            serial_number: addLaborPartForm.serial_number || null,
            qty: addLaborPartForm.qty ? parseInt(addLaborPartForm.qty, 10) : 1,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add labor part')
      }

      const data = await response.json()
      setAddLaborPartSuccess(`Part "${data.part.partno || data.part.part_name}" added successfully!`)

      // Refresh labor parts
      await fetchLaborParts(addLaborPartLabor.labor_id)

      // Auto-close modal after success
      setTimeout(() => {
        closeAddLaborPartModal()
      }, 1500)
    } catch (err) {
      console.error('Error adding labor part:', err)
      setAddLaborPartError(err instanceof Error ? err.message : 'Failed to add labor part')
    } finally {
      setAddLaborPartLoading(false)
    }
  }

  // Handle deleting a labor part
  const handleDeleteLaborPart = async (part: LaborPart) => {
    if (!token) return

    setDeletingLaborPart(part)
    setDeleteLaborPartLoading(true)

    try {
      const response = await fetch(
        `http://localhost:3001/api/labor-parts/${part.labor_part_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete labor part')
      }

      // Refresh labor parts
      await fetchLaborParts(part.labor_id)
    } catch (err) {
      console.error('Error deleting labor part:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete labor part')
    } finally {
      setDeleteLaborPartLoading(false)
      setDeletingLaborPart(null)
    }
  }

  // Get part action color and icon
  const getPartActionStyle = (action: string) => {
    switch (action) {
      case 'WORKED':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' }
      case 'REMOVED':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' }
      case 'INSTALLED':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
    }
  }

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
    setCloseRepairEtiOut('') // Reset ETI Out
    setCloseRepairError(null)
    setCloseRepairSuccess(null)
    setIsCloseRepairModalOpen(true)
  }

  // Close the close repair modal
  const closeCloseRepairModal = () => {
    setIsCloseRepairModalOpen(false)
    setClosingRepair(null)
    setCloseRepairEtiOut('')
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

    // Validate ETI Out >= ETI In if both are provided
    if (closeRepairEtiOut && closingRepair.eti_in !== null) {
      const etiOutValue = parseFloat(closeRepairEtiOut)
      if (etiOutValue < closingRepair.eti_in) {
        setCloseRepairError(`ETI Out (${etiOutValue}) cannot be less than ETI In (${closingRepair.eti_in})`)
        return
      }
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
          eti_out: closeRepairEtiOut || null, // Include ETI Out value
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

  // Fetch donor assets for cannibalization
  const fetchDonorAssets = async () => {
    if (!token) return
    setDonorAssetsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/assets/available-for-install', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Filter to only show assets that could be donors (FMC, PMC status)
        const eligibleDonors = data.assets.filter((a: AvailableAsset) =>
          a.status === 'FMC' || a.status === 'PMC'
        )
        setDonorAssets(eligibleDonors)
      }
    } catch (error) {
      console.error('Error fetching donor assets:', error)
    } finally {
      setDonorAssetsLoading(false)
    }
  }

  // Open add repair modal
  const openAddRepairModal = () => {
    setAddRepairForm({
      start_date: new Date().toISOString().split('T')[0],
      type_maint: '',
      how_mal: '',
      when_disc: '',
      action_taken: '',
      narrative: '',
      micap: false,
      chief_review: false,
      super_review: false,
      repeat_recur: false,
      donor_asset_id: null,
      eti_in: '',
    })
    setAddRepairError(null)
    setAddRepairSuccess(null)
    setDonorAssets([])
    setIsAddRepairModalOpen(true)
  }

  // Close add repair modal
  const closeAddRepairModal = () => {
    setIsAddRepairModalOpen(false)
    setAddRepairError(null)
    setAddRepairSuccess(null)
    setDonorAssets([])
  }

  // Handle add repair form changes
  const handleAddRepairFormChange = (field: string, value: string | number | null) => {
    setAddRepairForm(prev => ({ ...prev, [field]: value }))
    setAddRepairError(null)

    // If action_taken changed to 'T' (cannibalization), fetch donor assets
    if (field === 'action_taken' && value === 'T') {
      fetchDonorAssets()
    }
    // Clear donor asset if action_taken changed away from 'T'
    if (field === 'action_taken' && value !== 'T') {
      setAddRepairForm(prev => ({ ...prev, donor_asset_id: null }))
      setDonorAssets([])
    }
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
    // Validate cannibalization requires donor asset
    if (addRepairForm.action_taken === 'T' && !addRepairForm.donor_asset_id) {
      setAddRepairError('Donor asset is required for cannibalization (Action T)')
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
          action_taken: addRepairForm.action_taken || null,
          narrative: addRepairForm.narrative.trim(),
          micap: addRepairForm.micap,
          chief_review: addRepairForm.chief_review,
          super_review: addRepairForm.super_review,
          repeat_recur: addRepairForm.repeat_recur,
          donor_asset_id: addRepairForm.action_taken === 'T' ? addRepairForm.donor_asset_id : null,
          eti_in: addRepairForm.eti_in || null, // ETI meter value at repair start
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

  // Fetch donor assets for edit repair modal (cannibalization)
  const fetchEditDonorAssets = async () => {
    if (!token) return
    setEditDonorAssetsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/assets/available-for-install', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Filter to only show assets that could be donors (FMC, PMC status)
        const eligibleDonors = data.assets.filter((a: AvailableAsset) =>
          a.status === 'FMC' || a.status === 'PMC'
        )
        setEditDonorAssets(eligibleDonors)
      }
    } catch (error) {
      console.error('Error fetching donor assets:', error)
    } finally {
      setEditDonorAssetsLoading(false)
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
      action_taken: repair.action_taken || '',
      tag_no: repair.tag_no || '',
      doc_no: repair.doc_no || '',
      micap: repair.micap || false,
      chief_review: repair.chief_review || false,
      super_review: repair.super_review || false,
      repeat_recur: repair.repeat_recur || false,
      donor_asset_id: repair.donor_asset_id || null,
    })
    setEditRepairError(null)
    setEditRepairSuccess(null)
    setEditDonorAssets([])
    // If it's already a cannibalization, fetch donor assets
    if (repair.action_taken === 'T') {
      fetchEditDonorAssets()
    }
    setIsEditRepairModalOpen(true)
  }

  // Close edit repair modal
  const closeEditRepairModal = () => {
    setIsEditRepairModalOpen(false)
    setEditingRepair(null)
    setEditRepairError(null)
    setEditRepairSuccess(null)
    setEditDonorAssets([])
  }

  // Handle edit repair form field changes
  const handleEditRepairFormChange = (field: keyof EditRepairFormData, value: string | number | null) => {
    setEditRepairForm(prev => ({ ...prev, [field]: value }))
    setEditRepairError(null)

    // If action_taken changed to 'T' (cannibalization), fetch donor assets
    if (field === 'action_taken' && value === 'T') {
      fetchEditDonorAssets()
    }
    // Clear donor asset if action_taken changed away from 'T'
    if (field === 'action_taken' && value !== 'T') {
      setEditRepairForm(prev => ({ ...prev, donor_asset_id: null }))
      setEditDonorAssets([])
    }
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
    // Validate cannibalization requires donor asset
    if (editRepairForm.action_taken === 'T' && !editRepairForm.donor_asset_id) {
      setEditRepairError('Donor asset is required for cannibalization (Action T)')
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
          action_taken: editRepairForm.action_taken || null,
          tag_no: editRepairForm.tag_no || null,
          doc_no: editRepairForm.doc_no || null,
          micap: editRepairForm.micap,
          chief_review: editRepairForm.chief_review,
          super_review: editRepairForm.super_review,
          repeat_recur: editRepairForm.repeat_recur,
          donor_asset_id: editRepairForm.action_taken === 'T' ? editRepairForm.donor_asset_id : null,
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

  // Open delete repair modal
  const openDeleteRepairModal = (repair: Repair) => {
    setDeletingRepair(repair)
    setDeleteRepairError(null)
    setDeleteRepairSuccess(null)
    setIsDeleteRepairModalOpen(true)
  }

  // Close delete repair modal
  const closeDeleteRepairModal = () => {
    setIsDeleteRepairModalOpen(false)
    setDeletingRepair(null)
    setDeleteRepairError(null)
    setDeleteRepairSuccess(null)
  }

  // Handle delete repair
  const handleDeleteRepair = async () => {
    if (!token || !deletingRepair) return

    setDeleteRepairLoading(true)
    setDeleteRepairError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${deletingRepair.repair_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete repair')
      }

      setDeleteRepairSuccess(`Repair #${deletingRepair.repair_seq} deleted successfully!`)

      // Refresh repairs
      await fetchRepairs()

      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeDeleteRepairModal()
      }, 1500)
    } catch (err) {
      setDeleteRepairError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDeleteRepairLoading(false)
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
              <div className="flex items-center gap-2">
                {/* Repeat/Recur Filter */}
                {repeatRecurCount > 0 && (
                  <button
                    onClick={() => setRepairFilter(repairFilter === 'all' ? 'repeat_recur' : 'all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center ${
                      repairFilter === 'repeat_recur'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                    }`}
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Repeat/Recur Only
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                      repairFilter === 'repeat_recur' ? 'bg-cyan-500' : 'bg-cyan-200'
                    }`}>
                      {repeatRecurCount}
                    </span>
                  </button>
                )}
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
            ) : filteredRepairs.length === 0 && repairFilter === 'repeat_recur' ? (
              <div className="text-center py-8 text-gray-500">
                <ArrowPathIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No repeat/recur repairs found</p>
                <button
                  onClick={() => setRepairFilter('all')}
                  className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Show all repairs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRepairs.map((repair) => (
                  <div
                    key={repair.repair_id}
                    className={`border rounded-lg p-4 ${
                      repair.micap && repair.shop_status === 'open'
                        ? 'border-red-300 bg-red-50'
                        : repair.super_review && repair.shop_status === 'open'
                        ? 'border-purple-300 bg-purple-50'
                        : repair.chief_review && repair.shop_status === 'open'
                        ? 'border-amber-300 bg-amber-50'
                        : repair.repeat_recur && repair.shop_status === 'open'
                        ? 'border-cyan-300 bg-cyan-50'
                        : repair.shop_status === 'open'
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
                          {repair.micap && (
                            <span
                              className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white flex items-center"
                              title={`MICAP flagged by ${repair.micap_login || 'unknown'}`}
                            >
                              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                              MICAP
                            </span>
                          )}
                          {repair.chief_review && (
                            <span
                              className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-600 text-white flex items-center"
                              title={`Chief review flagged by ${repair.chief_review_by || 'unknown'}`}
                            >
                              <InformationCircleIcon className="h-3 w-3 mr-1" />
                              CHIEF REVIEW
                            </span>
                          )}
                          {repair.super_review && (
                            <span
                              className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-600 text-white flex items-center"
                              title={`Supervisor review flagged by ${repair.super_review_by || 'unknown'}`}
                            >
                              <MagnifyingGlassIcon className="h-3 w-3 mr-1" />
                              SUPER REVIEW
                            </span>
                          )}
                          {repair.repeat_recur && (
                            <span
                              className="px-2 py-0.5 text-xs font-bold rounded-full bg-cyan-600 text-white flex items-center"
                              title={`Repeat/Recur issue flagged by ${repair.repeat_recur_by || 'unknown'}`}
                            >
                              <ArrowPathIcon className="h-3 w-3 mr-1" />
                              REPEAT/RECUR
                            </span>
                          )}
                          {isNoDefectCode(repair.how_mal) && (
                            <span
                              className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 flex items-center"
                              title="No-Defect Code: Parts not required for this repair"
                            >
                              <InformationCircleIcon className="h-3 w-3 mr-1" />
                              NO DEFECT ({repair.how_mal})
                            </span>
                          )}
                          {isCannibalization(repair.action_taken) && (
                            <span
                              className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 flex items-center"
                              title={`Cannibalization from: ${repair.donor_asset_sn || 'N/A'}`}
                            >
                              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                              CANN
                            </span>
                          )}
                          {repair.action_taken && repair.action_taken !== 'T' && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                              Action: {repair.action_taken}
                            </span>
                          )}
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
                        {/* ETI Tracking Display */}
                        {(repair.eti_in !== null || repair.eti_out !== null) && (
                          <div className="mt-2 flex flex-wrap gap-4 text-xs">
                            {repair.eti_in !== null && (
                              <span className="text-blue-600">
                                <span className="font-medium">ETI In:</span> {repair.eti_in} hrs
                              </span>
                            )}
                            {repair.eti_out !== null && (
                              <span className="text-blue-600">
                                <span className="font-medium">ETI Out:</span> {repair.eti_out} hrs
                              </span>
                            )}
                            {repair.eti_delta !== null && (
                              <span className="text-blue-800 font-medium">
                                ETI Delta: {repair.eti_delta} hrs
                              </span>
                            )}
                          </div>
                        )}

                        {/* Linked TCTO Reference */}
                        {repair.linked_tcto && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                              <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-indigo-800">TCTO Completion</p>
                                <p className="text-xs text-indigo-700 mt-1">
                                  This repair was performed to complete a Time Compliance Technical Order (TCTO).
                                </p>
                                <div className="mt-2 p-2 bg-white border border-indigo-200 rounded">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-semibold text-indigo-900">
                                        {repair.linked_tcto.tcto_no}
                                      </p>
                                      <p className="text-xs text-indigo-700 mt-0.5">
                                        {repair.linked_tcto.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span
                                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                            repair.linked_tcto.priority === 'Critical'
                                              ? 'bg-red-100 text-red-800'
                                              : repair.linked_tcto.priority === 'Urgent'
                                              ? 'bg-orange-100 text-orange-800'
                                              : 'bg-blue-100 text-blue-800'
                                          }`}
                                        >
                                          {repair.linked_tcto.priority}
                                        </span>
                                        <span
                                          className={`px-2 py-0.5 text-xs font-medium rounded-full uppercase ${
                                            repair.linked_tcto.status === 'closed'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-yellow-100 text-yellow-800'
                                          }`}
                                        >
                                          {repair.linked_tcto.status}
                                        </span>
                                        <span className="text-xs text-indigo-600">
                                          Completed: {new Date(repair.linked_tcto.completion_date).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => navigate(`/tcto/${repair.linked_tcto?.tcto_id}`)}
                                      className="ml-3 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors whitespace-nowrap"
                                    >
                                      View TCTO
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* No-Defect Code Notice */}
                        {isNoDefectCode(repair.how_mal) && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <InformationCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-blue-800">No-Defect Code ({repair.how_mal})</p>
                                <p className="text-xs text-blue-700 mt-1">
                                  This repair uses a no-defect how-malfunctioned code, indicating no actual defect was found in the component.
                                  Parts tracking is not required for this type of repair.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Cannibalization Notice */}
                        {isCannibalization(repair.action_taken) && repair.donor_asset_sn && (
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                              <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-amber-800">Cannibalization (Action T)</p>
                                <p className="text-xs text-amber-700 mt-1">
                                  This repair involves cannibalization. A part was taken from a donor asset to complete the repair.
                                </p>
                                <div className="mt-2 p-2 bg-white border border-amber-200 rounded">
                                  <p className="text-xs text-amber-800">
                                    <strong>Donor Asset:</strong> {repair.donor_asset_sn}
                                  </p>
                                  <p className="text-xs text-amber-700">
                                    Part Number: {repair.donor_asset_pn || 'N/A'} | Name: {repair.donor_asset_name || 'N/A'}
                                  </p>
                                  <p className="text-xs text-amber-600 mt-1 italic">
                                    The donor asset status has been changed to NMCS (Not Mission Capable - Supply).
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Installed Parts Sub-section */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                              <CubeIcon className="h-4 w-4 mr-1" />
                              Installed Parts
                              <span className="ml-1 text-gray-400">
                                ({installedPartsMap.get(repair.repair_id)?.length || 0})
                              </span>
                            </h4>
                            {canEdit && repair.shop_status === 'open' && event.status === 'open' && !isNoDefectCode(repair.how_mal) && (
                              <button
                                onClick={() => openAddInstalledPartModal(repair)}
                                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                              >
                                <PlusIcon className="h-3 w-3 mr-0.5" />
                                Add Part
                              </button>
                            )}
                          </div>

                          {loadingInstalledParts.has(repair.repair_id) ? (
                            <div className="flex items-center justify-center py-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                            </div>
                          ) : isNoDefectCode(repair.how_mal) && (installedPartsMap.get(repair.repair_id)?.length || 0) === 0 ? (
                            <p className="text-xs text-blue-500 italic">Parts not required for no-defect repairs</p>
                          ) : (installedPartsMap.get(repair.repair_id)?.length || 0) === 0 ? (
                            <p className="text-xs text-gray-400 italic">No parts installed</p>
                          ) : (
                            <div className="space-y-2">
                              {installedPartsMap.get(repair.repair_id)?.map((installedPart) => (
                                <div
                                  key={installedPart.installed_part_id}
                                  className="flex items-center justify-between bg-white border border-gray-200 rounded p-2"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <CubeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                      <span className="text-sm font-medium text-gray-900 truncate">
                                        {installedPart.asset_sn}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        ({installedPart.asset_pn})
                                      </span>
                                    </div>
                                    <div className="ml-6 text-xs text-gray-500">
                                      <span>{installedPart.asset_name}</span>
                                      <span className="mx-1">•</span>
                                      <span>Installed: {new Date(installedPart.installation_date).toLocaleDateString()}</span>
                                      <span className="mx-1">•</span>
                                      <span>By: {installedPart.installed_by_name}</span>
                                    </div>
                                    {installedPart.installation_notes && (
                                      <p className="ml-6 text-xs text-gray-600 mt-1 italic">
                                        {installedPart.installation_notes}
                                      </p>
                                    )}
                                  </div>
                                  {canDeleteRepairs && event.status === 'open' && (
                                    <button
                                      onClick={() => handleRemoveInstalledPart(installedPart)}
                                      disabled={deletingInstalledPartId === installedPart.installed_part_id}
                                      className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
                                      title="Remove installed part"
                                    >
                                      {deletingInstalledPartId === installedPart.installed_part_id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                      ) : (
                                        <TrashIcon className="h-4 w-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Removed Parts Sub-section */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                              <CubeIcon className="h-4 w-4 mr-1 text-red-500" />
                              Removed Parts
                              <span className="ml-1 text-gray-400">
                                ({removedPartsMap.get(repair.repair_id)?.length || 0})
                              </span>
                            </h4>
                            {canEdit && repair.shop_status === 'open' && event.status === 'open' && !isNoDefectCode(repair.how_mal) && (
                              <button
                                onClick={() => openAddRemovedPartModal(repair)}
                                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center"
                              >
                                <PlusIcon className="h-3 w-3 mr-0.5" />
                                Add Removed Part
                              </button>
                            )}
                          </div>

                          {loadingRemovedParts.has(repair.repair_id) ? (
                            <div className="flex items-center justify-center py-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            </div>
                          ) : isNoDefectCode(repair.how_mal) && (removedPartsMap.get(repair.repair_id)?.length || 0) === 0 ? (
                            <p className="text-xs text-blue-500 italic">Parts not required for no-defect repairs</p>
                          ) : (removedPartsMap.get(repair.repair_id)?.length || 0) === 0 ? (
                            <p className="text-xs text-gray-400 italic">No parts removed</p>
                          ) : (
                            <div className="space-y-2">
                              {removedPartsMap.get(repair.repair_id)?.map((removedPart) => (
                                <div
                                  key={removedPart.removed_part_id}
                                  className="flex items-center justify-between bg-red-50 border border-red-200 rounded p-2"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <CubeIcon className="h-4 w-4 text-red-500 flex-shrink-0" />
                                      <span className="text-sm font-medium text-gray-900 truncate">
                                        {removedPart.asset_sn}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        ({removedPart.asset_pn})
                                      </span>
                                      {removedPart.removal_reason && (
                                        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700">
                                          {removedPart.removal_reason}
                                        </span>
                                      )}
                                      {removedPart.new_status && (
                                        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                                          → {removedPart.new_status}
                                        </span>
                                      )}
                                    </div>
                                    <div className="ml-6 text-xs text-gray-500">
                                      <span>{removedPart.asset_name}</span>
                                      <span className="mx-1">•</span>
                                      <span>Removed: {new Date(removedPart.removal_date).toLocaleDateString()}</span>
                                      <span className="mx-1">•</span>
                                      <span>By: {removedPart.removed_by_name}</span>
                                    </div>
                                    {removedPart.removal_notes && (
                                      <p className="ml-6 text-xs text-gray-600 mt-1 italic">
                                        {removedPart.removal_notes}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {canEdit && repair.shop_status === 'open' && event.status === 'open' && (
                                      <button
                                        onClick={() => openRequestPartsModal(removedPart)}
                                        className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded border border-blue-300"
                                        title="Request replacement part"
                                      >
                                        Request Replacement
                                      </button>
                                    )}
                                    {canEdit && repair.shop_status === 'open' && event.status === 'open' && (
                                      <button
                                        onClick={() => handleDeleteRemovedPart(removedPart)}
                                        disabled={deletingRemovedPartId === removedPart.removed_part_id}
                                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded disabled:opacity-50"
                                        title="Delete removed part record"
                                      >
                                        {deletingRemovedPartId === removedPart.removed_part_id ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                        ) : (
                                          <TrashIcon className="h-4 w-4" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Labor Records */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-medium text-purple-700 flex items-center">
                              <WrenchScrewdriverIcon className="h-3 w-3 mr-1" />
                              Labor Records
                              <span className="ml-1 text-gray-500">
                                ({laborMap.get(repair.repair_id)?.length || 0})
                              </span>
                            </h4>
                            {canEdit && repair.shop_status === 'open' && event.status === 'open' && (
                              <button
                                onClick={() => openAddLaborModal(repair)}
                                className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center"
                              >
                                <PlusIcon className="h-3 w-3 mr-0.5" />
                                Add Labor
                              </button>
                            )}
                          </div>

                          {loadingLabor.has(repair.repair_id) ? (
                            <div className="flex items-center justify-center py-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            </div>
                          ) : (laborMap.get(repair.repair_id)?.length || 0) === 0 ? (
                            <p className="text-xs text-gray-400 italic">No labor records</p>
                          ) : (
                            <div className="space-y-2">
                              {laborMap.get(repair.repair_id)?.map((labor) => (
                                <div
                                  key={labor.labor_id}
                                  className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded p-2"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <WrenchScrewdriverIcon className="h-4 w-4 text-purple-500 flex-shrink-0" />
                                      <span className="text-sm font-medium text-gray-900">
                                        Labor #{labor.labor_seq}
                                      </span>
                                      {labor.action_taken && (
                                        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700">
                                          {labor.action_taken}
                                        </span>
                                      )}
                                      {labor.cat_labor && (
                                        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-700">
                                          Cat: {labor.cat_labor}
                                        </span>
                                      )}
                                      {labor.hours !== null && (
                                        <span className="text-xs text-gray-600">
                                          {labor.hours} hrs
                                        </span>
                                      )}
                                    </div>
                                    <div className="ml-6 text-xs text-gray-500">
                                      <span>Chief: {labor.crew_chief || 'N/A'}</span>
                                      {labor.crew_size !== null && (
                                        <>
                                          <span className="mx-1">•</span>
                                          <span>Crew: {labor.crew_size}</span>
                                        </>
                                      )}
                                      <span className="mx-1">•</span>
                                      <span>Start: {new Date(labor.start_date).toLocaleDateString()}</span>
                                      {labor.stop_date && (
                                        <>
                                          <span className="mx-1">•</span>
                                          <span>Stop: {new Date(labor.stop_date).toLocaleDateString()}</span>
                                        </>
                                      )}
                                    </div>
                                    {labor.corrective && (
                                      <p className="ml-6 text-xs text-gray-600 mt-1 italic line-clamp-2">
                                        {labor.corrective}
                                      </p>
                                    )}
                                    {labor.bit_log && (
                                      <div className="ml-6 mt-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs">
                                        <span className="font-medium text-blue-700 flex items-center gap-1">
                                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                          </svg>
                                          BIT Log:
                                        </span>
                                        <span className="text-blue-600 ml-1">{labor.bit_log}</span>
                                      </div>
                                    )}

                                    {/* Parts Tracking Section */}
                                    <div className="ml-6 mt-2">
                                      <button
                                        onClick={() => toggleLaborParts(labor.labor_id)}
                                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                      >
                                        <svg
                                          className={`h-3 w-3 transform transition-transform ${expandedLaborParts.has(labor.labor_id) ? 'rotate-90' : ''}`}
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth="2"
                                          stroke="currentColor"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                        <CubeIcon className="h-3 w-3" />
                                        Parts Tracking
                                        {laborPartsMap.has(labor.labor_id) && (
                                          <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                                            {laborPartsMap.get(labor.labor_id)?.length || 0}
                                          </span>
                                        )}
                                      </button>

                                      {expandedLaborParts.has(labor.labor_id) && (
                                        <div className="mt-2 pl-4 border-l-2 border-indigo-200">
                                          {loadingLaborParts.has(labor.labor_id) ? (
                                            <div className="flex items-center justify-center py-2">
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                            </div>
                                          ) : (laborPartsMap.get(labor.labor_id)?.length || 0) === 0 ? (
                                            <div className="text-xs text-gray-500 italic py-1">
                                              No parts tracked for this labor record
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              {laborPartsMap.get(labor.labor_id)?.map((part) => {
                                                const style = getPartActionStyle(part.part_action)
                                                return (
                                                  <div
                                                    key={part.labor_part_id}
                                                    className={`flex items-center justify-between px-2 py-1 rounded text-xs ${style.bg} ${style.border} border`}
                                                  >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                      <span className={`px-1.5 py-0.5 rounded font-medium ${style.text} ${style.bg}`}>
                                                        {part.part_action}
                                                      </span>
                                                      <span className="font-medium text-gray-900 truncate">
                                                        {part.partno || part.part_name}
                                                      </span>
                                                      {part.serial_number && (
                                                        <span className="text-gray-500">
                                                          S/N: {part.serial_number}
                                                        </span>
                                                      )}
                                                      {part.qty > 1 && (
                                                        <span className="text-gray-600">
                                                          x{part.qty}
                                                        </span>
                                                      )}
                                                    </div>
                                                    {canDeleteRepairs && repair.shop_status === 'open' && event.status === 'open' && (
                                                      <button
                                                        onClick={() => handleDeleteLaborPart(part)}
                                                        disabled={deleteLaborPartLoading && deletingLaborPart?.labor_part_id === part.labor_part_id}
                                                        className="p-0.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded disabled:opacity-50"
                                                        title="Remove part"
                                                      >
                                                        {deleteLaborPartLoading && deletingLaborPart?.labor_part_id === part.labor_part_id ? (
                                                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                                                        ) : (
                                                          <XMarkIcon className="h-3 w-3" />
                                                        )}
                                                      </button>
                                                    )}
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          )}

                                          {/* Add Part Button */}
                                          {canEdit && repair.shop_status === 'open' && event.status === 'open' && (
                                            <button
                                              onClick={() => openAddLaborPartModal(labor)}
                                              className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded"
                                            >
                                              <PlusIcon className="h-3 w-3" />
                                              Add Part
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    {canEdit && repair.shop_status === 'open' && event.status === 'open' && (
                                      <button
                                        onClick={() => openEditLaborModal(labor, repair)}
                                        className="p-1 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded"
                                        title="Edit labor record"
                                      >
                                        <PencilSquareIcon className="h-4 w-4" />
                                      </button>
                                    )}
                                    {canDeleteRepairs && repair.shop_status === 'open' && event.status === 'open' && (
                                      <button
                                        onClick={() => openDeleteLaborModal(labor, repair)}
                                        className="ml-1 p-1 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded"
                                        title="Delete labor record"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {event.status === 'open' && (
                        <div className="flex flex-col gap-2 ml-4">
                          {canEdit && repair.shop_status === 'open' && (
                            <>
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
                            </>
                          )}
                          {canDeleteRepairs && (
                            <button
                              onClick={() => openDeleteRepairModal(repair)}
                              className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          )}
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
                {isNoDefectCode(editRepairForm.how_mal) && (
                  <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <InformationCircleIcon className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      <strong>No-Defect Code:</strong> This code indicates no actual defect was found.
                      Parts tracking is not required for this repair.
                    </p>
                  </div>
                )}
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

              {/* Action Taken Code */}
              <div>
                <label htmlFor="edit_repair_action_taken" className="block text-sm font-medium text-gray-700 mb-1">
                  Action Taken Code
                </label>
                <select
                  id="edit_repair_action_taken"
                  value={editRepairForm.action_taken}
                  onChange={(e) => handleEditRepairFormChange('action_taken', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {actionTakenOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {isCannibalization(editRepairForm.action_taken) && (
                  <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <strong>Cannibalization:</strong> A part will be removed from a donor asset to repair this asset.
                      The donor asset will be marked as NMCS.
                    </p>
                  </div>
                )}
              </div>

              {/* Donor Asset Selection (only for Cannibalization) */}
              {isCannibalization(editRepairForm.action_taken) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <label htmlFor="edit_repair_donor_asset" className="block text-sm font-medium text-amber-800 mb-2">
                    Donor Asset <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-amber-700 mb-3">
                    Select the asset that will provide the part for cannibalization.
                  </p>
                  {/* Show current donor asset if already set */}
                  {editingRepair?.donor_asset_sn && editRepairForm.donor_asset_id === editingRepair.donor_asset_id && (
                    <div className="mb-3 p-2 bg-white border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>Current Donor:</strong> {editingRepair.donor_asset_sn} - {editingRepair.donor_asset_pn} ({editingRepair.donor_asset_name || 'N/A'})
                      </p>
                    </div>
                  )}
                  {editDonorAssetsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                      <span className="ml-2 text-sm text-amber-700">Loading available assets...</span>
                    </div>
                  ) : editDonorAssets.length === 0 && !editingRepair?.donor_asset_id ? (
                    <div className="text-center py-4 text-amber-700">
                      <p className="text-sm">No eligible donor assets available.</p>
                    </div>
                  ) : (
                    <select
                      id="edit_repair_donor_asset"
                      value={editRepairForm.donor_asset_id || ''}
                      onChange={(e) => handleEditRepairFormChange('donor_asset_id', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    >
                      <option value="">Select donor asset...</option>
                      {/* Show current donor if set */}
                      {editingRepair?.donor_asset_id && editingRepair?.donor_asset_sn && (
                        <option value={editingRepair.donor_asset_id}>
                          {editingRepair.donor_asset_sn} - {editingRepair.donor_asset_pn} ({editingRepair.donor_asset_name || 'N/A'}) [Current]
                        </option>
                      )}
                      {editDonorAssets.map((asset) => (
                        <option key={asset.asset_id} value={asset.asset_id}>
                          {asset.serno} - {asset.partno} ({asset.nomen || 'N/A'}) [{asset.status}]
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

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

              {/* MICAP Flag */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <label htmlFor="edit_repair_micap" className="block text-sm font-medium text-red-800">
                        MICAP - Mission Capable Impacting
                      </label>
                      <p className="text-xs text-red-600 mt-0.5">
                        Flag this repair if it impacts mission capability
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="edit_repair_micap"
                    role="switch"
                    aria-checked={editRepairForm.micap}
                    onClick={() => setEditRepairForm(prev => ({ ...prev, micap: !prev.micap }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      editRepairForm.micap ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editRepairForm.micap ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {editRepairForm.micap && editingRepair?.micap_login && (
                  <p className="text-xs text-red-600 mt-2">
                    Originally flagged by: {editingRepair.micap_login}
                  </p>
                )}
              </div>

              {/* Chief Review Flag */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <InformationCircleIcon className="h-5 w-5 text-amber-600 mr-2" />
                    <div>
                      <label htmlFor="edit_repair_chief_review" className="block text-sm font-medium text-amber-800">
                        Chief Review Required
                      </label>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Flag this repair for chief review
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="edit_repair_chief_review"
                    role="switch"
                    aria-checked={editRepairForm.chief_review}
                    onClick={() => setEditRepairForm(prev => ({ ...prev, chief_review: !prev.chief_review }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      editRepairForm.chief_review ? 'bg-amber-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editRepairForm.chief_review ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {editRepairForm.chief_review && editingRepair?.chief_review_by && (
                  <p className="text-xs text-amber-600 mt-2">
                    Originally flagged by: {editingRepair.chief_review_by}
                  </p>
                )}
              </div>

              {/* Supervisor Review Flag */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <label htmlFor="edit_repair_super_review" className="block text-sm font-medium text-purple-800">
                        Supervisor Review Required
                      </label>
                      <p className="text-xs text-purple-600 mt-0.5">
                        Flag this repair for supervisor review and approval
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="edit_repair_super_review"
                    role="switch"
                    aria-checked={editRepairForm.super_review}
                    onClick={() => setEditRepairForm(prev => ({ ...prev, super_review: !prev.super_review }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      editRepairForm.super_review ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editRepairForm.super_review ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {editRepairForm.super_review && editingRepair?.super_review_by && (
                  <p className="text-xs text-purple-600 mt-2">
                    Originally flagged by: {editingRepair.super_review_by}
                  </p>
                )}
              </div>

              {/* Repeat/Recur Flag */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowPathIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <div>
                      <label htmlFor="edit_repair_repeat_recur" className="block text-sm font-medium text-cyan-800">
                        Repeat/Recur Issue
                      </label>
                      <p className="text-xs text-cyan-600 mt-0.5">
                        Flag this repair as a repeat or recurring issue
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="edit_repair_repeat_recur"
                    role="switch"
                    aria-checked={editRepairForm.repeat_recur}
                    onClick={() => setEditRepairForm(prev => ({ ...prev, repeat_recur: !prev.repeat_recur }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                      editRepairForm.repeat_recur ? 'bg-cyan-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editRepairForm.repeat_recur ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {editRepairForm.repeat_recur && editingRepair?.repeat_recur_by && (
                  <p className="text-xs text-cyan-600 mt-2">
                    Originally flagged by: {editingRepair.repeat_recur_by}
                  </p>
                )}
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
                {isNoDefectCode(addRepairForm.how_mal) && (
                  <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <InformationCircleIcon className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      <strong>No-Defect Code:</strong> This code indicates no actual defect was found.
                      Parts tracking is not required for this repair.
                    </p>
                  </div>
                )}
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

              {/* Action Taken Code */}
              <div>
                <label htmlFor="repair_action_taken" className="block text-sm font-medium text-gray-700 mb-1">
                  Action Taken Code
                </label>
                <select
                  id="repair_action_taken"
                  value={addRepairForm.action_taken}
                  onChange={(e) => handleAddRepairFormChange('action_taken', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {actionTakenOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Code indicating what action was taken during the repair
                </p>
                {isCannibalization(addRepairForm.action_taken) && (
                  <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      <strong>Cannibalization:</strong> A part will be removed from a donor asset to repair this asset.
                      The donor asset will be marked as NMCS (Not Mission Capable - Supply).
                    </p>
                  </div>
                )}
              </div>

              {/* Donor Asset Selection (only for Cannibalization) */}
              {isCannibalization(addRepairForm.action_taken) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <label htmlFor="repair_donor_asset" className="block text-sm font-medium text-amber-800 mb-2">
                    Donor Asset <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-amber-700 mb-3">
                    Select the asset that will provide the part for cannibalization. This asset's status will change to NMCS.
                  </p>
                  {donorAssetsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                      <span className="ml-2 text-sm text-amber-700">Loading available assets...</span>
                    </div>
                  ) : donorAssets.length === 0 ? (
                    <div className="text-center py-4 text-amber-700">
                      <p className="text-sm">No eligible donor assets available (must be FMC or PMC status).</p>
                    </div>
                  ) : (
                    <select
                      id="repair_donor_asset"
                      value={addRepairForm.donor_asset_id || ''}
                      onChange={(e) => handleAddRepairFormChange('donor_asset_id', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                    >
                      <option value="">Select donor asset...</option>
                      {donorAssets.map((asset) => (
                        <option key={asset.asset_id} value={asset.asset_id}>
                          {asset.serno} - {asset.partno} ({asset.nomen || 'N/A'}) [{asset.status}]
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

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

              {/* ETI In (Elapsed Time Indicator at repair start) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label htmlFor="repair_eti_in" className="block text-sm font-medium text-blue-800 mb-1">
                  ETI In (Elapsed Time Indicator)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="repair_eti_in"
                    value={addRepairForm.eti_in}
                    onChange={(e) => setAddRepairForm(prev => ({ ...prev, eti_in: e.target.value }))}
                    step="0.01"
                    min="0"
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter ETI meter reading at repair start"
                  />
                  <span className="text-sm text-blue-600 font-medium">hours</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Record the ETI meter value when the repair begins (optional)
                </p>
              </div>

              {/* MICAP Flag */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <label htmlFor="add_repair_micap" className="block text-sm font-medium text-red-800">
                        MICAP - Mission Capable Impacting
                      </label>
                      <p className="text-xs text-red-600 mt-0.5">
                        Flag this repair if it impacts mission capability
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="add_repair_micap"
                    role="switch"
                    aria-checked={addRepairForm.micap}
                    onClick={() => setAddRepairForm(prev => ({ ...prev, micap: !prev.micap }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      addRepairForm.micap ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        addRepairForm.micap ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Chief Review Flag */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <InformationCircleIcon className="h-5 w-5 text-amber-600 mr-2" />
                    <div>
                      <label htmlFor="add_repair_chief_review" className="block text-sm font-medium text-amber-800">
                        Chief Review Required
                      </label>
                      <p className="text-xs text-amber-600 mt-0.5">
                        Flag this repair for chief review
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="add_repair_chief_review"
                    role="switch"
                    aria-checked={addRepairForm.chief_review}
                    onClick={() => setAddRepairForm(prev => ({ ...prev, chief_review: !prev.chief_review }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      addRepairForm.chief_review ? 'bg-amber-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        addRepairForm.chief_review ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Supervisor Review Flag */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <div>
                      <label htmlFor="add_repair_super_review" className="block text-sm font-medium text-purple-800">
                        Supervisor Review Required
                      </label>
                      <p className="text-xs text-purple-600 mt-0.5">
                        Flag this repair for supervisor review and approval
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="add_repair_super_review"
                    role="switch"
                    aria-checked={addRepairForm.super_review}
                    onClick={() => setAddRepairForm(prev => ({ ...prev, super_review: !prev.super_review }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      addRepairForm.super_review ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        addRepairForm.super_review ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Repeat/Recur Flag */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowPathIcon className="h-5 w-5 text-cyan-600 mr-2" />
                    <div>
                      <label htmlFor="add_repair_repeat_recur" className="block text-sm font-medium text-cyan-800">
                        Repeat/Recur Issue
                      </label>
                      <p className="text-xs text-cyan-600 mt-0.5">
                        Flag this repair as a repeat or recurring issue
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    id="add_repair_repeat_recur"
                    role="switch"
                    aria-checked={addRepairForm.repeat_recur}
                    onClick={() => setAddRepairForm(prev => ({ ...prev, repeat_recur: !prev.repeat_recur }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                      addRepairForm.repeat_recur ? 'bg-cyan-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        addRepairForm.repeat_recur ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
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

              {/* ETI Out Input */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label htmlFor="close_repair_eti_out" className="block text-sm font-medium text-blue-800 mb-1">
                  ETI Out (Elapsed Time Indicator)
                </label>
                {closingRepair && closingRepair.eti_in !== null && (
                  <p className="text-xs text-blue-600 mb-2">
                    ETI In recorded: <strong>{closingRepair.eti_in} hours</strong>
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="close_repair_eti_out"
                    value={closeRepairEtiOut}
                    onChange={(e) => setCloseRepairEtiOut(e.target.value)}
                    step="0.01"
                    min={closingRepair?.eti_in ?? 0}
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter ETI meter reading at repair end"
                    disabled={closeRepairLoading || !!closeRepairSuccess}
                  />
                  <span className="text-sm text-blue-600 font-medium">hours</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Record the ETI meter value when the repair ends (optional)
                </p>
                {closeRepairEtiOut && closingRepair && closingRepair.eti_in !== null && (
                  <p className="text-sm text-blue-800 font-medium mt-2">
                    ETI Delta: {(parseFloat(closeRepairEtiOut) - closingRepair.eti_in).toFixed(2)} hours
                  </p>
                )}
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

      {/* Delete Repair Modal */}
      <Dialog open={isDeleteRepairModalOpen} onClose={closeDeleteRepairModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <TrashIcon className="h-5 w-5 mr-2 text-red-500" />
                Delete Repair #{deletingRepair?.repair_seq}
              </Dialog.Title>
              <button
                onClick={closeDeleteRepairModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Success Message */}
              {deleteRepairSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{deleteRepairSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {deleteRepairError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{deleteRepairError}</p>
                  </div>
                </div>
              )}

              {/* Warning message */}
              {!deleteRepairSuccess && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 text-sm font-medium">
                        Are you sure you want to delete this repair?
                      </p>
                      <p className="text-red-600 text-sm mt-1">
                        This action cannot be undone. All associated labor records will also be removed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Repair Info (read-only) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Repair Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Repair #:</span>{' '}
                    <span className="text-gray-900 font-medium">{deletingRepair?.repair_seq}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>{' '}
                    <span className="text-gray-900">{deletingRepair?.type_maint}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Start Date:</span>{' '}
                    <span className="text-gray-900">
                      {deletingRepair?.start_date ? new Date(deletingRepair.start_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>{' '}
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      deletingRepair?.shop_status === 'open'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {deletingRepair?.shop_status?.toUpperCase()}
                    </span>
                  </div>
                </div>
                {deletingRepair?.narrative && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">Narrative:</span>
                    <p className="text-gray-900 text-sm mt-1">{deletingRepair.narrative}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeDeleteRepairModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={deleteRepairLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRepair}
                disabled={deleteRepairLoading || !!deleteRepairSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {deleteRepairLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Repair
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Labor Modal */}
      <Dialog open={isDeleteLaborModalOpen} onClose={closeDeleteLaborModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-xl shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <TrashIcon className="h-5 w-5 mr-2 text-red-500" />
                Delete Labor #{deletingLabor?.labor_seq}
              </Dialog.Title>
              <button
                onClick={closeDeleteLaborModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Success Message */}
              {deleteLaborSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700">{deleteLaborSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {deleteLaborError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{deleteLaborError}</p>
                  </div>
                </div>
              )}

              {/* Warning message */}
              {!deleteLaborSuccess && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-700 text-sm font-medium">
                        Are you sure you want to delete this labor record?
                      </p>
                      <p className="text-red-600 text-sm mt-1">
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Labor Info (read-only) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Labor Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Labor #:</span>{' '}
                    <span className="text-gray-900 font-medium">{deletingLabor?.labor_seq}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Repair #:</span>{' '}
                    <span className="text-gray-900">{deletingLaborRepair?.repair_seq}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Start Date:</span>{' '}
                    <span className="text-gray-900">
                      {deletingLabor?.start_date ? new Date(deletingLabor.start_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {deletingLabor?.stop_date && (
                    <div>
                      <span className="text-gray-500">Stop Date:</span>{' '}
                      <span className="text-gray-900">
                        {new Date(deletingLabor.stop_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {deletingLabor?.hours !== null && (
                    <div>
                      <span className="text-gray-500">Hours:</span>{' '}
                      <span className="text-gray-900">{deletingLabor?.hours}</span>
                    </div>
                  )}
                  {deletingLabor?.crew_chief && (
                    <div>
                      <span className="text-gray-500">Chief:</span>{' '}
                      <span className="text-gray-900">{deletingLabor?.crew_chief}</span>
                    </div>
                  )}
                </div>
                {deletingLabor?.action_taken && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">Action Taken:</span>
                    <span className="text-gray-900 text-sm ml-1">{deletingLabor.action_taken}</span>
                  </div>
                )}
                {deletingLabor?.corrective && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">Corrective:</span>
                    <p className="text-gray-900 text-sm mt-1">{deletingLabor.corrective}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={closeDeleteLaborModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={deleteLaborLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteLabor}
                disabled={deleteLaborLoading || !!deleteLaborSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {deleteLaborLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete Labor
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Add Installed Part Modal */}
      <Dialog
        open={isAddInstalledPartModalOpen}
        onClose={closeAddInstalledPartModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg w-full rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <CubeIcon className="h-5 w-5 mr-2 text-primary-600" />
                Add Installed Part
                {addInstalledPartRepair && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Repair #{addInstalledPartRepair.repair_seq})
                  </span>
                )}
              </Dialog.Title>
              <button
                onClick={closeAddInstalledPartModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {addInstalledPartSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {addInstalledPartSuccess}
                </div>
              )}

              {addInstalledPartError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {addInstalledPartError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Replacement Asset <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={assetSearchQuery}
                    onChange={(e) => setAssetSearchQuery(e.target.value)}
                    placeholder="Search by S/N, P/N, or name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {assetSearchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    </div>
                  )}
                </div>

                <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {availableAssets.length === 0 && !assetSearchLoading ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {assetSearchQuery ? 'No assets found' : 'Start typing to search assets'}
                    </div>
                  ) : (
                    availableAssets.map((asset) => (
                      <div
                        key={asset.asset_id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                          selectedAsset?.asset_id === asset.asset_id ? 'bg-primary-50 border-primary-200' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{asset.serno}</span>
                            <span className="text-gray-500 ml-2 text-sm">({asset.partno})</span>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            asset.status === 'FMC' ? 'bg-green-100 text-green-700' :
                            asset.status === 'PMC' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {asset.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {asset.nomen || 'No description'}
                          {asset.location && <span className="ml-2">• Location: {asset.location}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedAsset && (
                  <div className="mt-2 p-2 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-primary-600 mr-2" />
                        <span className="text-sm font-medium text-primary-700">
                          Selected: {selectedAsset.serno}
                        </span>
                      </div>
                      <button onClick={() => setSelectedAsset(null)} className="text-primary-600 hover:text-primary-700 text-xs">
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Installation Date</label>
                <input
                  type="date"
                  value={installationDate}
                  onChange={(e) => setInstallationDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Installation Notes</label>
                <textarea
                  value={installationNotes}
                  onChange={(e) => setInstallationNotes(e.target.value)}
                  rows={3}
                  placeholder="Enter any notes about the installation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <button
                type="button"
                onClick={closeAddInstalledPartModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddInstalledPart}
                disabled={addInstalledPartLoading || !selectedAsset}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addInstalledPartLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Installed Part
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Add Removed Part Modal */}
      <Dialog open={isAddRemovedPartModalOpen} onClose={closeAddRemovedPartModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <CubeIcon className="h-5 w-5 mr-2 text-red-500" />
                Add Removed Part
              </Dialog.Title>
              <button
                onClick={closeAddRemovedPartModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Success Message */}
              {addRemovedPartSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {addRemovedPartSuccess}
                </div>
              )}

              {/* Error Message */}
              {addRemovedPartError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {addRemovedPartError}
                </div>
              )}

              {/* Asset Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Asset to Remove *
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={removableAssetSearchQuery}
                    onChange={(e) => setRemovableAssetSearchQuery(e.target.value)}
                    placeholder="Search by serial number, part number, or name..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                {/* Asset Search Results */}
                <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {removableAssetSearchLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                    </div>
                  ) : removableAssets.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {removableAssetSearchQuery ? 'No assets found' : 'Start typing to search assets'}
                    </div>
                  ) : (
                    removableAssets.map((asset) => (
                      <div
                        key={asset.asset_id}
                        onClick={() => setSelectedRemovableAsset(asset)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                          selectedRemovableAsset?.asset_id === asset.asset_id ? 'bg-red-50 border-red-200' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{asset.serno}</span>
                            <span className="text-gray-500 ml-2 text-sm">({asset.partno})</span>
                          </div>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            asset.status_cd === 'FMC' ? 'bg-green-100 text-green-700' :
                            asset.status_cd === 'PMC' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {asset.status_cd}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {asset.name}
                          {asset.admin_loc && <span className="ml-2">• Location: {asset.admin_loc}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selectedRemovableAsset && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm font-medium text-red-700">
                          Selected: {selectedRemovableAsset.serno}
                        </span>
                      </div>
                      <button onClick={() => setSelectedRemovableAsset(null)} className="text-red-600 hover:text-red-700 text-xs">
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Removal Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Removal Date
                </label>
                <input
                  type="date"
                  value={removalDate}
                  onChange={(e) => setRemovalDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Removal Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Removal
                </label>
                <select
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {removalReasonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* New Asset Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Asset Status To
                </label>
                <select
                  value={newAssetStatus}
                  onChange={(e) => setNewAssetStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {assetStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Removal Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={removalNotes}
                  onChange={(e) => setRemovalNotes(e.target.value)}
                  placeholder="Enter any additional details about the removal..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl sticky bottom-0">
              <button
                onClick={closeAddRemovedPartModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={addRemovedPartLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddRemovedPart}
                disabled={addRemovedPartLoading || !selectedRemovableAsset || !!addRemovedPartSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addRemovedPartLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <CubeIcon className="h-4 w-4 mr-2" />
                    Add Removed Part
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Add Labor Modal */}
      <Dialog open={isAddLaborModalOpen} onClose={closeAddLaborModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-purple-500" />
                Add Labor
                {addLaborRepair && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Repair #{addLaborRepair.repair_seq})
                  </span>
                )}
              </Dialog.Title>
              <button
                onClick={closeAddLaborModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {addLaborSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-green-700 text-sm">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {addLaborSuccess}
                </div>
              )}

              {addLaborError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700 text-sm">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {addLaborError}
                </div>
              )}

              {/* Action Taken Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Taken Code
                </label>
                <select
                  value={addLaborForm.action_taken}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, action_taken: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {actionTakenOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Category of Labor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category of Labor
                </label>
                <select
                  value={addLaborForm.cat_labor}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, cat_labor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {catLaborOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Crew Chief Name (Required) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crew Chief Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addLaborForm.crew_chief}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, crew_chief: e.target.value }))}
                  placeholder="Enter crew chief name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Crew Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crew Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={addLaborForm.crew_size}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, crew_size: e.target.value }))}
                  placeholder="Number of workers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Hours Worked */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Worked
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={addLaborForm.hours}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, hours: e.target.value }))}
                  placeholder="Enter hours worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={addLaborForm.start_date}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Stop Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Date
                </label>
                <input
                  type="date"
                  value={addLaborForm.stop_date}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, stop_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Corrective Action Narrative */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corrective Action Narrative <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={addLaborForm.corrective}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, corrective: e.target.value }))}
                  placeholder="Describe the corrective action taken..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none ${
                    !addLaborForm.corrective.trim() ? 'border-gray-300' : 'border-gray-300'
                  }`}
                  required
                />
                {!addLaborForm.corrective.trim() && (
                  <p className="mt-1 text-xs text-gray-500">Required - please describe the corrective action taken</p>
                )}
              </div>

              {/* BIT Log Section */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <label className="block text-sm font-medium text-blue-700 mb-1 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  BIT Log (Built-In Test Results)
                </label>
                <textarea
                  value={addLaborForm.bit_log}
                  onChange={(e) => setAddLaborForm(prev => ({ ...prev, bit_log: e.target.value }))}
                  placeholder="Enter BIT test results, codes, pass/fail status..."
                  rows={3}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
                />
                <p className="mt-1 text-xs text-blue-600">
                  Record Built-In Test diagnostics, error codes, or test pass/fail results
                </p>
              </div>

              {/* Inspected By / Corrected By Section */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspected By
                  </label>
                  <input
                    type="text"
                    value={addLaborForm.inspected_by}
                    onChange={(e) => setAddLaborForm(prev => ({ ...prev, inspected_by: e.target.value }))}
                    placeholder="Inspector name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corrected By
                  </label>
                  <input
                    type="text"
                    value={addLaborForm.corrected_by}
                    onChange={(e) => setAddLaborForm(prev => ({ ...prev, corrected_by: e.target.value }))}
                    placeholder="Technician name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeAddLaborModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLabor}
                disabled={addLaborLoading || !addLaborForm.crew_chief.trim() || !addLaborForm.corrective.trim() || !!addLaborSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addLaborLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                    Add Labor
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Request Parts Modal */}
      <Dialog open={isRequestPartsModalOpen} onClose={closeRequestPartsModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingCartIcon className="h-5 w-5 mr-2 text-blue-500" />
                Request Replacement Part
                {requestPartsRemovedPart && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({requestPartsRemovedPart.asset_sn})
                  </span>
                )}
              </Dialog.Title>
              <button
                onClick={closeRequestPartsModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {requestPartsSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-green-700 text-sm">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {requestPartsSuccess}
                </div>
              )}

              {requestPartsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700 text-sm">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {requestPartsError}
                </div>
              )}

              {/* Part Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Number
                </label>
                <input
                  type="text"
                  value={requestPartsForm.part_no}
                  onChange={(e) => setRequestPartsForm(prev => ({ ...prev, part_no: e.target.value }))}
                  placeholder="e.g., PN-SENSOR-A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Part Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={requestPartsForm.part_name}
                  onChange={(e) => setRequestPartsForm(prev => ({ ...prev, part_name: e.target.value }))}
                  placeholder="e.g., Sensor Unit Alpha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Either Part Number or Part Name is required
                </p>
              </div>

              {/* NSN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NSN (National Stock Number)
                </label>
                <input
                  type="text"
                  value={requestPartsForm.nsn}
                  onChange={(e) => setRequestPartsForm(prev => ({ ...prev, nsn: e.target.value }))}
                  placeholder="e.g., 5999-01-234-5678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={requestPartsForm.qty_ordered}
                  onChange={(e) => setRequestPartsForm(prev => ({ ...prev, qty_ordered: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={requestPartsForm.priority}
                  onChange={(e) => setRequestPartsForm(prev => ({ ...prev, priority: e.target.value as 'routine' | 'urgent' | 'critical' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={requestPartsForm.notes}
                  onChange={(e) => setRequestPartsForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional information about this request..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeRequestPartsModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={requestPartsLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleRequestParts}
                disabled={requestPartsLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {requestPartsLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Add Labor Part Modal */}
      <Dialog open={isAddLaborPartModalOpen} onClose={closeAddLaborPartModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <CubeIcon className="h-5 w-5 mr-2 text-indigo-500" />
                Add Part to Labor
                {addLaborPartLabor && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Labor #{addLaborPartLabor.labor_seq})
                  </span>
                )}
              </Dialog.Title>
              <button
                onClick={closeAddLaborPartModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {addLaborPartSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-green-700 text-sm">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {addLaborPartSuccess}
                </div>
              )}

              {addLaborPartError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700 text-sm">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {addLaborPartError}
                </div>
              )}

              {/* Part Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Action <span className="text-red-500">*</span>
                </label>
                <select
                  value={addLaborPartForm.part_action}
                  onChange={(e) => setAddLaborPartForm(prev => ({ ...prev, part_action: e.target.value as 'WORKED' | 'REMOVED' | 'INSTALLED' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="WORKED">WORKED - Part was worked on</option>
                  <option value="REMOVED">REMOVED - Part was removed</option>
                  <option value="INSTALLED">INSTALLED - Part was installed</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {addLaborPartForm.part_action === 'WORKED' && 'Maintenance performed on the part without removal/replacement'}
                  {addLaborPartForm.part_action === 'REMOVED' && 'Part was removed from the asset (may need replacement)'}
                  {addLaborPartForm.part_action === 'INSTALLED' && 'New or replacement part was installed'}
                </p>
              </div>

              {/* Part Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Number
                </label>
                <input
                  type="text"
                  value={addLaborPartForm.partno}
                  onChange={(e) => setAddLaborPartForm(prev => ({ ...prev, partno: e.target.value }))}
                  placeholder="e.g., PN-SENSOR-A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Part Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Name/Description
                </label>
                <input
                  type="text"
                  value={addLaborPartForm.part_name}
                  onChange={(e) => setAddLaborPartForm(prev => ({ ...prev, part_name: e.target.value }))}
                  placeholder="e.g., Sensor Unit Alpha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter either Part Number or Part Name (or both)
                </p>
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={addLaborPartForm.serial_number}
                  onChange={(e) => setAddLaborPartForm(prev => ({ ...prev, serial_number: e.target.value }))}
                  placeholder="e.g., SN-12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={addLaborPartForm.qty}
                  onChange={(e) => setAddLaborPartForm(prev => ({ ...prev, qty: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeAddLaborPartModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLaborPart}
                disabled={addLaborPartLoading || (!addLaborPartForm.partno.trim() && !addLaborPartForm.part_name.trim()) || !!addLaborPartSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {addLaborPartLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <CubeIcon className="h-4 w-4 mr-2" />
                    Add Part
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Labor Modal */}
      <Dialog open={isEditLaborModalOpen} onClose={closeEditLaborModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center">
                <PencilSquareIcon className="h-5 w-5 mr-2 text-purple-500" />
                Edit Labor
                {editLaborRecord && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Labor #{editLaborRecord.labor_seq})
                  </span>
                )}
              </Dialog.Title>
              <button
                onClick={closeEditLaborModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {editLaborSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center text-green-700 text-sm">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {editLaborSuccess}
                </div>
              )}

              {editLaborError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700 text-sm">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {editLaborError}
                </div>
              )}

              {/* Action Taken Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Taken Code
                </label>
                <select
                  value={editLaborForm.action_taken}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, action_taken: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {actionTakenOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Category of Labor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category of Labor
                </label>
                <select
                  value={editLaborForm.cat_labor}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, cat_labor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {catLaborOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Crew Chief Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crew Chief Name
                </label>
                <input
                  type="text"
                  value={editLaborForm.crew_chief}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, crew_chief: e.target.value }))}
                  placeholder="Enter crew chief name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Crew Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crew Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={editLaborForm.crew_size}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, crew_size: e.target.value }))}
                  placeholder="Number of workers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Hours Worked */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Worked
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={editLaborForm.hours}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, hours: e.target.value }))}
                  placeholder="Enter hours worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={editLaborForm.start_date}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Stop Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stop Date
                </label>
                <input
                  type="date"
                  value={editLaborForm.stop_date}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, stop_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Corrective Action Narrative */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corrective Action Narrative <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editLaborForm.corrective}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, corrective: e.target.value }))}
                  placeholder="Describe the corrective action taken..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none ${
                    !editLaborForm.corrective.trim() ? 'border-gray-300' : 'border-gray-300'
                  }`}
                  required
                />
                {!editLaborForm.corrective.trim() && (
                  <p className="mt-1 text-xs text-gray-500">Required - please describe the corrective action taken</p>
                )}
              </div>

              {/* BIT Log Section */}
              <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                <label className="block text-sm font-medium text-blue-700 mb-1 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  BIT Log (Built-In Test Results)
                </label>
                <textarea
                  value={editLaborForm.bit_log}
                  onChange={(e) => setEditLaborForm(prev => ({ ...prev, bit_log: e.target.value }))}
                  placeholder="Enter BIT test results, codes, pass/fail status..."
                  rows={3}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
                />
                <p className="mt-1 text-xs text-blue-600">
                  Record Built-In Test diagnostics, error codes, or test pass/fail results
                </p>
              </div>

              {/* Inspected By / Corrected By Section */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inspected By
                  </label>
                  <input
                    type="text"
                    value={editLaborForm.inspected_by}
                    onChange={(e) => setEditLaborForm(prev => ({ ...prev, inspected_by: e.target.value }))}
                    placeholder="Inspector name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corrected By
                  </label>
                  <input
                    type="text"
                    value={editLaborForm.corrected_by}
                    onChange={(e) => setEditLaborForm(prev => ({ ...prev, corrected_by: e.target.value }))}
                    placeholder="Technician name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 sticky bottom-0">
              <button
                onClick={closeEditLaborModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditLabor}
                disabled={editLaborLoading || !editLaborForm.corrective.trim() || !!editLaborSuccess}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {editLaborLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
    </div>
  )
}
