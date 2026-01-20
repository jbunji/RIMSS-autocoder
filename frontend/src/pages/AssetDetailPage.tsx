import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Breadcrumbs from '../components/Breadcrumbs'
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning'
import { UnsavedChangesDialog } from '../components/UnsavedChangesDialog'

// Asset interface matching backend response
interface Asset {
  asset_id: number
  serno: string
  partno: string
  name: string
  part_name?: string
  pgm_id: number
  status_cd: string
  status_name?: string
  admin_loc: string
  admin_loc_name?: string
  cust_loc: string
  cust_loc_name?: string
  notes: string
  remarks?: string | null
  active: boolean
  created_date: string
  program_cd?: string
  program_name?: string
  // Additional fields for asset detail view
  uii?: string | null          // Unique Item Identifier
  mfg_date?: string | null     // Manufacturing date
  acceptance_date?: string | null  // Acceptance date
  eti_hours?: number | null    // ETI tracking hours (or hours for meter_type 'hours')
  meter_type?: 'hours' | 'cycles' | 'eti' | null  // Type of meter for this asset
  cycles_count?: number | null  // Cycles count (for assets that track cycles)
  last_maint_date?: string | null
  next_pmi_date?: string | null
  location?: string
  loc_type?: 'depot' | 'field'
  in_transit?: boolean
  bad_actor?: boolean
  // In-transit shipping information
  carrier?: string | null
  tracking_number?: string | null
  ship_date?: string | null
}

interface AssetStatus {
  status_cd: string
  status_name: string
  description: string
}

interface Location {
  loc_id: number
  loc_cd: string
  loc_name: string
}

// Hierarchy interfaces for NHA/SRA relationships
interface HierarchyAsset {
  asset_id: number
  serno: string
  partno: string
  part_name: string
  status_cd: string
  status_name: string
}

interface AssetHierarchy {
  asset: HierarchyAsset & { program_cd: string; program_name: string }
  nha: HierarchyAsset | null  // Next Higher Assembly (parent)
  sra: HierarchyAsset[]       // Shop Replaceable Assemblies (children)
  has_nha: boolean
  has_sra: boolean
}

// History interfaces
interface AssetHistoryChange {
  field: string
  field_label: string
  old_value: string | null
  new_value: string | null
}

interface AssetHistoryEntry {
  history_id: number
  asset_id: number
  timestamp: string
  user_id: number
  username: string
  user_full_name: string
  action_type: 'create' | 'update' | 'delete'
  changes: AssetHistoryChange[]
  description: string
}

// Meter History interfaces (supports hours, cycles, and ETI tracking)
interface MeterHistoryEntry {
  meter_history_id: number
  asset_id: number
  timestamp: string
  user_id: number
  username: string
  user_full_name: string
  meter_type: 'hours' | 'cycles' | 'eti'
  old_value: number | null
  new_value: number
  value_added: number
  source: 'maintenance' | 'manual' | 'sortie'
  source_id: number | null
  source_ref: string | null
  notes: string | null
}

// Legacy type alias for backward compatibility
type ETIHistoryEntry = MeterHistoryEntry

// Meter history entry interface (ETM - Engineering Time Meters)
interface MeterHistoryEntry {
  repair_id: number
  event_id: number
  job_no: string | null
  start_date: string
  stop_date: string | null
  type_maint: string
  shop_status: 'open' | 'closed'
  eti_in: number | null
  eti_out: number | null
  eti_delta: number | null
  narrative: string
  created_by: string
  created_at: string
}

// Maintenance event interface for asset events
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
}

interface MaintenanceEventsSummary {
  total: number
  open: number
  closed: number
  by_type: {
    standard: number
    pmi: number
    tcto: number
    bitpc: number
  }
}

// Status badge colors
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  FMC: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  PMC: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  NMCM: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  NMCS: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  CNDM: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
}

// Priority badge colors for maintenance events
const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  Urgent: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  Routine: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
}

// Event type badge colors
const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  Standard: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  PMI: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  TCTO: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  'BIT/PC': { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
}

// PMI History interfaces
interface PMIHistoryRecord {
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
  interval_days: number
}

interface PMIHistorySummary {
  total: number
  completed: number
  pending: number
  overdue: number
  due_soon: number
  upcoming: number
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

// Software association interface
interface SoftwareAssociation {
  assoc_id: number
  asset_id: number
  sw_version_id: number
  sw_version: string
  sw_name: string
  sw_number: string
  sw_type: string
  effective_date: string
  end_date: string | null
  created_by: string
  created_date: string
}

// Software version reference data
interface SoftwareVersion {
  sw_version_id: number
  sw_version: string
  sw_name: string
  description: string | null
  active: boolean
}

// Tab type
type TabType = 'details' | 'history' | 'eti' | 'meters' | 'maintenance' | 'pmi' | 'software'

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { token, user } = useAuthStore()

  // Tab state - initialize from URL or default to 'details'
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const tabParam = searchParams.get('tab') as TabType | null
    return tabParam && ['details', 'history', 'eti', 'meters', 'maintenance', 'pmi', 'software'].includes(tabParam)
      ? tabParam
      : 'details'
  })

  // Data state
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // History state
  const [history, setHistory] = useState<AssetHistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState<string | null>(null)

  // Hierarchy state (NHA/SRA relationships)
  const [hierarchy, setHierarchy] = useState<AssetHierarchy | null>(null)
  const [hierarchyLoading, setHierarchyLoading] = useState(false)

  // ETI History state
  const [etiHistory, setEtiHistory] = useState<ETIHistoryEntry[]>([])
  const [etiHistoryLoading, setEtiHistoryLoading] = useState(false)
  const [etiHistoryError, setEtiHistoryError] = useState<string | null>(null)

  // Meter History state (ETM - Engineering Time Meters)
  const [meterHistory, setMeterHistory] = useState<MeterHistoryEntry[]>([])
  const [meterHistoryLoading, setMeterHistoryLoading] = useState(false)
  const [meterHistoryError, setMeterHistoryError] = useState<string | null>(null)

  // ETI Update form state
  const [showEtiUpdateModal, setShowEtiUpdateModal] = useState(false)
  const [etiUpdateForm, setEtiUpdateForm] = useState({
    meter_type: '' as 'hours' | 'cycles' | 'eti' | '',
    hours_to_add: '',
    source: 'manual' as 'maintenance' | 'manual' | 'sortie',
    source_ref: '',
    notes: '',
  })
  const [etiUpdating, setEtiUpdating] = useState(false)
  const [etiUpdateError, setEtiUpdateError] = useState<string | null>(null)
  const [etiUpdateSuccess, setEtiUpdateSuccess] = useState<string | null>(null)

  // Meter Replacement state
  const [showMeterReplacementModal, setShowMeterReplacementModal] = useState(false)
  const [meterReplacementForm, setMeterReplacementForm] = useState({
    replacement_reason: '',
    new_meter_start_value: '',
    notes: '',
  })
  const [meterReplacing, setMeterReplacing] = useState(false)
  const [meterReplacementError, setMeterReplacementError] = useState<string | null>(null)
  const [meterReplacementSuccess, setMeterReplacementSuccess] = useState<string | null>(null)

  // Maintenance Events state
  const [maintenanceEvents, setMaintenanceEvents] = useState<MaintenanceEvent[]>([])
  const [maintenanceEventsSummary, setMaintenanceEventsSummary] = useState<MaintenanceEventsSummary | null>(null)
  const [maintenanceEventsLoading, setMaintenanceEventsLoading] = useState(false)
  const [maintenanceEventsError, setMaintenanceEventsError] = useState<string | null>(null)

  // PMI History state
  const [pmiHistory, setPmiHistory] = useState<PMIHistoryRecord[]>([])
  const [pmiHistorySummary, setPmiHistorySummary] = useState<PMIHistorySummary | null>(null)
  const [pmiHistoryLoading, setPmiHistoryLoading] = useState(false)
  const [pmiHistoryError, setPmiHistoryError] = useState<string | null>(null)

  // Sorties state
  const [sorties, setSorties] = useState<Sortie[]>([])
  const [sortiesLoading, setSortiesLoading] = useState(false)
  const [sortiesError, setSortiesError] = useState<string | null>(null)

  // Software associations state
  const [softwareAssociations, setSoftwareAssociations] = useState<SoftwareAssociation[]>([])
  const [softwareLoading, setSoftwareLoading] = useState(false)
  const [softwareError, setSoftwareError] = useState<string | null>(null)
  const [showAddSoftwareModal, setShowAddSoftwareModal] = useState(false)
  const [softwareVersions, setSoftwareVersions] = useState<SoftwareVersion[]>([])
  const [addSoftwareForm, setAddSoftwareForm] = useState({
    sw_version_id: '',
    effective_date: new Date().toISOString().split('T')[0], // Today's date
  })
  const [addingSoftware, setAddingSoftware] = useState(false)
  const [addSoftwareError, setAddSoftwareError] = useState<string | null>(null)

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Asset>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // Reference data
  const [statuses, setStatuses] = useState<AssetStatus[]>([])
  const [adminLocations, setAdminLocations] = useState<Location[]>([])
  const [custodialLocations, setCustodialLocations] = useState<Location[]>([])

  // Check if user can edit
  const canEdit = user?.role === 'ADMIN' || user?.role === 'DEPOT_MANAGER'

  // Check if user can update ETI (ADMIN, DEPOT_MANAGER, or FIELD_TECHNICIAN)
  const canUpdateETI = user?.role === 'ADMIN' || user?.role === 'DEPOT_MANAGER' || user?.role === 'FIELD_TECHNICIAN'

  // Detect if form has unsaved changes
  const isFormDirty = useMemo(() => {
    if (!isEditing || !asset) return false

    // Compare relevant fields that can be edited
    const editableFields: (keyof Asset)[] = [
      'serno', 'partno', 'name', 'status_cd', 'active', 'bad_actor',
      'admin_loc', 'cust_loc', 'in_transit', 'carrier', 'tracking_number',
      'ship_date', 'notes'
    ]

    return editableFields.some(field => {
      const originalValue = asset[field]
      const editedValue = editForm[field]

      // Handle undefined/null/empty string equivalence
      const normalizedOriginal = originalValue === null || originalValue === undefined ? '' : String(originalValue)
      const normalizedEdited = editedValue === null || editedValue === undefined ? '' : String(editedValue)

      return normalizedOriginal !== normalizedEdited
    })
  }, [isEditing, asset, editForm])

  // Use unsaved changes warning hook
  const unsavedChangesWarning = useUnsavedChangesWarning(
    isFormDirty,
    'You have unsaved changes to this asset. Are you sure you want to leave? Your changes will be lost.'
  )

  // Check if user can replace meter (only ADMIN and DEPOT_MANAGER)
  const canReplaceMeter = user?.role === 'ADMIN' || user?.role === 'DEPOT_MANAGER'

  // Function to change tabs and update URL
  const changeTab = (tab: TabType) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  // Fetch asset data
  useEffect(() => {
    const fetchAsset = async () => {
      if (!token || !id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Asset not found')
          }
          if (response.status === 403) {
            throw new Error('You do not have access to this asset')
          }
          throw new Error('Failed to fetch asset details')
        }

        const data = await response.json()
        setAsset(data.asset)
        setEditForm(data.asset)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [token, id])

  // Fetch hierarchy data (NHA/SRA relationships)
  useEffect(() => {
    const fetchHierarchy = async () => {
      if (!token || !id) return

      setHierarchyLoading(true)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}/hierarchy`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setHierarchy(data)
        }
      } catch (err) {
        console.error('Failed to fetch hierarchy:', err)
      } finally {
        setHierarchyLoading(false)
      }
    }

    fetchHierarchy()
  }, [token, id])

  // Fetch sorties for this asset
  useEffect(() => {
    const fetchSorties = async () => {
      if (!token || !id) return

      setSortiesLoading(true)
      setSortiesError(null)

      try {
        const response = await fetch('http://localhost:3001/api/sorties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch sorties')
        }

        const data = await response.json()
        // Filter sorties for this specific asset
        const assetSorties = data.sorties.filter((s: Sortie) => s.asset_id === parseInt(id, 10))
        setSorties(assetSorties)
      } catch (err) {
        console.error('Failed to fetch sorties:', err)
        setSortiesError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setSortiesLoading(false)
      }
    }

    fetchSorties()
  }, [token, id])

  // Fetch history when History tab is selected
  useEffect(() => {
    const fetchHistory = async () => {
      if (!token || !id || activeTab !== 'history') return

      setHistoryLoading(true)
      setHistoryError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch asset history')
        }

        const data = await response.json()
        setHistory(data.history)
      } catch (err) {
        setHistoryError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setHistoryLoading(false)
      }
    }

    fetchHistory()
  }, [token, id, activeTab])

  // Fetch ETI history when ETI tab is selected
  useEffect(() => {
    const fetchETIHistory = async () => {
      if (!token || !id || activeTab !== 'eti') return

      setEtiHistoryLoading(true)
      setEtiHistoryError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}/eti-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch ETI history')
        }

        const data = await response.json()
        setEtiHistory(data.history)
      } catch (err) {
        setEtiHistoryError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setEtiHistoryLoading(false)
      }
    }

    fetchETIHistory()
  }, [token, id, activeTab])

  // Fetch meter history when Meters tab is selected
  useEffect(() => {
    const fetchMeterHistory = async () => {
      if (!token || !id || activeTab !== 'meters') return

      setMeterHistoryLoading(true)
      setMeterHistoryError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}/meter-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch meter history')
        }

        const data = await response.json()
        setMeterHistory(data.meter_history)
      } catch (err) {
        setMeterHistoryError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setMeterHistoryLoading(false)
      }
    }

    fetchMeterHistory()
  }, [token, id, activeTab])

  // Fetch maintenance events when Maintenance tab is selected
  useEffect(() => {
    const fetchMaintenanceEvents = async () => {
      if (!token || !id || activeTab !== 'maintenance') return

      setMaintenanceEventsLoading(true)
      setMaintenanceEventsError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch maintenance events')
        }

        const data = await response.json()
        setMaintenanceEvents(data.events)
        setMaintenanceEventsSummary(data.summary)
      } catch (err) {
        setMaintenanceEventsError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setMaintenanceEventsLoading(false)
      }
    }

    fetchMaintenanceEvents()
  }, [token, id, activeTab])

  // Fetch PMI history when PMI tab is selected
  useEffect(() => {
    const fetchPMIHistory = async () => {
      if (!token || !id || activeTab !== 'pmi') return

      setPmiHistoryLoading(true)
      setPmiHistoryError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}/pmi-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch PMI history')
        }

        const data = await response.json()
        setPmiHistory(data.pmi_history)
        setPmiHistorySummary(data.summary)
      } catch (err) {
        setPmiHistoryError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setPmiHistoryLoading(false)
      }
    }

    fetchPMIHistory()
  }, [token, id, activeTab])

  // Fetch software associations when Software tab is selected
  useEffect(() => {
    const fetchSoftwareAssociations = async () => {
      if (!token || !id || activeTab !== 'software') return

      setSoftwareLoading(true)
      setSoftwareError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/assets/${id}/software`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch software associations')
        }

        const data = await response.json()
        setSoftwareAssociations(data.associations)
      } catch (err) {
        setSoftwareError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setSoftwareLoading(false)
      }
    }

    fetchSoftwareAssociations()
  }, [token, id, activeTab])

  // Fetch available software versions for the program
  useEffect(() => {
    const fetchSoftwareVersions = async () => {
      if (!token || !asset) return

      try {
        const response = await fetch(`http://localhost:3001/api/reference/software-versions?program_id=${asset.pgm_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setSoftwareVersions(data.versions || [])
        }
      } catch (err) {
        console.error('Failed to fetch software versions:', err)
      }
    }

    fetchSoftwareVersions()
  }, [token, asset])

  // Handle ETI update form submission
  const handleETIUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !id || !asset) return

    setEtiUpdating(true)
    setEtiUpdateError(null)
    setEtiUpdateSuccess(null)

    try {
      const meterType = etiUpdateForm.meter_type || asset.meter_type || 'hours'

      const response = await fetch(`http://localhost:3001/api/assets/${id}/meter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meter_type: meterType,
          value_to_add: parseFloat(etiUpdateForm.hours_to_add),
          source: etiUpdateForm.source,
          source_ref: etiUpdateForm.source_ref || null,
          notes: etiUpdateForm.notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update meter reading')
      }

      // Update local asset state with new meter value
      if (meterType === 'cycles') {
        setAsset(prev => prev ? { ...prev, cycles_count: data.new_value, meter_type: meterType } : null)
      } else {
        setAsset(prev => prev ? { ...prev, eti_hours: data.new_value, meter_type: meterType } : null)
      }

      // Refresh meter history
      setEtiHistory(prev => [data.history_entry, ...prev])

      // Reset form and show success
      setEtiUpdateForm({
        meter_type: '',
        hours_to_add: '',
        source: 'manual',
        source_ref: '',
        notes: '',
      })
      setShowEtiUpdateModal(false)
      const unit = meterType === 'cycles' ? 'cycles' : 'hours'
      setEtiUpdateSuccess(`${meterType.toUpperCase()} updated: ${data.old_value || 0} → ${data.new_value} ${unit}`)

      // Clear history cache so it refreshes when viewing History tab
      setHistory([])
    } catch (err) {
      setEtiUpdateError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setEtiUpdating(false)
    }
  }

  // Handle Meter Replacement form submission
  const handleMeterReplacement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !id || !asset) return

    setMeterReplacing(true)
    setMeterReplacementError(null)
    setMeterReplacementSuccess(null)

    try {
      const response = await fetch(`http://localhost:3001/api/assets/${id}/replace-meter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replacement_reason: meterReplacementForm.replacement_reason,
          new_meter_start_value: parseFloat(meterReplacementForm.new_meter_start_value),
          notes: meterReplacementForm.notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to replace meter')
      }

      // Update local asset state with new meter value
      setAsset(prev => prev ? { ...prev, eti_hours: data.new_meter_start_value } : null)

      // Refresh ETI history to show replacement entry
      setEtiHistory([])

      // Reset form and show success
      setMeterReplacementForm({
        replacement_reason: '',
        new_meter_start_value: '',
        notes: '',
      })
      setShowMeterReplacementModal(false)
      setMeterReplacementSuccess(`Meter replaced successfully. Old meter: ${data.old_meter_value || 0} hrs, New meter start: ${data.new_meter_start_value} hrs`)

      // Clear history cache so it refreshes when viewing History tab
      setHistory([])

      // Auto-clear success message after 10 seconds
      setTimeout(() => setMeterReplacementSuccess(null), 10000)
    } catch (err) {
      setMeterReplacementError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setMeterReplacing(false)
    }
  }

  // Fetch reference data for editing
  useEffect(() => {
    const fetchReferenceData = async () => {
      if (!token) return

      try {
        // Fetch statuses
        const statusesRes = await fetch('http://localhost:3001/api/reference/asset-statuses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (statusesRes.ok) {
          const data = await statusesRes.json()
          setStatuses(data.statuses)
        }

        // Fetch locations
        const locationsRes = await fetch('http://localhost:3001/api/reference/locations', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (locationsRes.ok) {
          const data = await locationsRes.json()
          setAdminLocations(data.admin_locations)
          setCustodialLocations(data.custodial_locations)
        }
      } catch (err) {
        console.error('Failed to fetch reference data:', err)
      }
    }

    fetchReferenceData()
  }, [token])

  // Handle form input changes
  const handleInputChange = (field: keyof Asset, value: string | boolean) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
    setSaveError(null)
    setSaveSuccess(null)
  }

  // Start editing
  const startEditing = () => {
    setEditForm(asset || {})
    setIsEditing(true)
    setSaveError(null)
    setSaveSuccess(null)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditForm(asset || {})
    setIsEditing(false)
    setSaveError(null)
    setSaveSuccess(null)
  }

  // Save changes
  const saveChanges = async () => {
    if (!token || !id || !asset) return

    setSaving(true)
    setSaveError(null)
    setSaveSuccess(null)

    try {
      const response = await fetch(`http://localhost:3001/api/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serno: editForm.serno,
          partno: editForm.partno,
          name: editForm.name,
          status_cd: editForm.status_cd,
          admin_loc: editForm.admin_loc,
          cust_loc: editForm.cust_loc,
          notes: editForm.notes,
          active: editForm.active,
          bad_actor: editForm.bad_actor,
          in_transit: editForm.in_transit,
          carrier: editForm.carrier,
          tracking_number: editForm.tracking_number,
          ship_date: editForm.ship_date,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update asset')
      }

      // Update local state with new data
      setAsset(data.asset)
      setEditForm(data.asset)
      setIsEditing(false)
      setSaveSuccess(`Asset updated successfully! Changes: ${data.changes?.join(', ') || 'None'}`)

      // Clear history cache so it refreshes when viewing History tab
      setHistory([])
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  // Handle add software association
  const handleAddSoftware = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !id || !asset) return

    setAddingSoftware(true)
    setAddSoftwareError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/assets/${id}/software`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addSoftwareForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add software association')
      }

      // Refresh software associations list
      const listResponse = await fetch(`http://localhost:3001/api/assets/${id}/software`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (listResponse.ok) {
        const listData = await listResponse.json()
        setSoftwareAssociations(listData.associations)
      }

      // Close modal and reset form
      setShowAddSoftwareModal(false)
      setAddSoftwareForm({
        sw_version_id: '',
        effective_date: new Date().toISOString().split('T')[0],
      })
    } catch (err) {
      setAddSoftwareError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAddingSoftware(false)
    }
  }

  // Handle remove software association
  const handleRemoveSoftware = async (assocId: number) => {
    if (!token || !id) return

    if (!confirm('Are you sure you want to remove this software association?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/api/assets/${id}/software/${assocId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove software association')
      }

      // Refresh software associations list
      const listResponse = await fetch(`http://localhost:3001/api/assets/${id}/software`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (listResponse.ok) {
        const listData = await listResponse.json()
        setSoftwareAssociations(listData.associations)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove software association')
    }
  }

  // Status badge component
  const StatusBadge = ({ status, statusName }: { status: string; statusName?: string }) => {
    const colors = statusColors[status] || statusColors.CNDM
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
        {status}
        {statusName && <span className="ml-1 text-xs opacity-75">({statusName})</span>}
      </span>
    )
  }

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Format date/time for history
  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get action type badge
  const getActionBadge = (actionType: 'create' | 'update' | 'delete') => {
    const styles = {
      create: 'bg-green-100 text-green-800 border-green-200',
      update: 'bg-blue-100 text-blue-800 border-blue-200',
      delete: 'bg-red-100 text-red-800 border-red-200',
    }
    const labels = {
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[actionType]}`}>
        {labels[actionType]}
      </span>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate('/assets')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Return to Assets
          </button>
        </div>
      </div>
    )
  }

  // No asset found
  if (!asset) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-medium">Asset not found</p>
          <button
            onClick={() => navigate('/assets')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Return to Assets
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Assets', path: '/assets' },
          { label: asset.part_name || asset.name || asset.serno, path: `/assets/${asset.asset_id}` },
        ]}
      />

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/assets')}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Assets
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Asset' : 'Asset Details'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {asset.program_cd} - {asset.program_name}
            </p>
          </div>
          {canEdit && !isEditing && activeTab === 'details' && (
            <button
              onClick={startEditing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Asset
            </button>
          )}
        </div>
      </div>

      {/* Success message */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{saveSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {saveError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{saveError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => changeTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => changeTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History
          </button>
          <button
            onClick={() => changeTab('eti')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'eti'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ETI Tracking
          </button>
          <button
            onClick={() => changeTab('meters')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'meters'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meter History
          </button>
          <button
            onClick={() => changeTab('maintenance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'maintenance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Maintenance Events
          </button>
          <button
            onClick={() => changeTab('pmi')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pmi'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            PMI History
          </button>
          <button
            onClick={() => changeTab('software')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'software'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Software
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' ? (
        /* Details Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Asset Identification */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Asset Identification</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Serial Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.serno || ''}
                    onChange={(e) => handleInputChange('serno', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-lg font-semibold text-gray-900">{asset.serno}</p>
                )}
              </div>

              {/* Part Number */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Part Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.partno || ''}
                    onChange={(e) => handleInputChange('partno', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-lg text-gray-900">{asset.partno}</p>
                )}
              </div>

              {/* Name / Part Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name || editForm.part_name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="mt-1 text-lg text-gray-900">{asset.name || asset.part_name}</p>
                )}
              </div>

              {/* UII - Unique Item Identifier */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500">UII (Unique Item Identifier)</label>
                <p className="mt-1 text-gray-900 font-mono text-sm">
                  {asset.uii || <span className="text-gray-400 italic">Not assigned</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Manufacturing & Tracking */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Manufacturing & Tracking</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Manufacturing Date */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Manufacturing Date</label>
                <p className="mt-1 text-gray-900">
                  {asset.mfg_date ? formatDate(asset.mfg_date) : <span className="text-gray-400 italic">Not specified</span>}
                </p>
              </div>

              {/* Acceptance Date */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Acceptance Date</label>
                <p className="mt-1 text-gray-900">
                  {asset.acceptance_date ? formatDate(asset.acceptance_date) : <span className="text-gray-400 italic">Not specified</span>}
                </p>
              </div>

              {/* Meter Tracking */}
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  {asset.meter_type === 'cycles' ? 'Cycles Count' : asset.meter_type === 'eti' ? 'ETI Hours' : asset.meter_type === 'hours' ? 'Hours' : 'Meter Reading'}
                </label>
                <p className="mt-1 text-gray-900">
                  {asset.meter_type === 'cycles' && asset.cycles_count !== null && asset.cycles_count !== undefined ? (
                    <span className="text-lg font-semibold">{asset.cycles_count.toLocaleString()} cycles</span>
                  ) : (asset.meter_type === 'hours' || asset.meter_type === 'eti') && asset.eti_hours !== null && asset.eti_hours !== undefined ? (
                    <span className="text-lg font-semibold">{asset.eti_hours.toLocaleString()} hrs</span>
                  ) : (
                    <span className="text-gray-400 italic">Not tracked</span>
                  )}
                </p>
              </div>

              {/* Last Maintenance Date */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Last Maintenance</label>
                <p className="mt-1 text-gray-900">
                  {asset.last_maint_date ? formatDate(asset.last_maint_date) : <span className="text-gray-400 italic">None recorded</span>}
                </p>
              </div>

              {/* Next PMI Date */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Next PMI Due</label>
                <p className="mt-1 text-gray-900">
                  {asset.next_pmi_date ? formatDate(asset.next_pmi_date) : <span className="text-gray-400 italic">Not scheduled</span>}
                </p>
              </div>

            </div>
          </div>

          {/* Status & Location */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Status & Location</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                {isEditing ? (
                  <select
                    value={editForm.status_cd || ''}
                    onChange={(e) => handleInputChange('status_cd', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status.status_cd} value={status.status_cd}>
                        {status.status_cd} - {status.status_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1">
                    <StatusBadge status={asset.status_cd} statusName={asset.status_name} />
                  </div>
                )}
              </div>

              {/* Active */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Active Status</label>
                {isEditing ? (
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.active ?? true}
                        onChange={(e) => handleInputChange('active', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Asset is active</span>
                    </label>
                  </div>
                ) : (
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${asset.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {asset.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                )}
              </div>

              {/* Bad Actor Flag */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Bad Actor Flag</label>
                {isEditing ? (
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.bad_actor ?? false}
                        onChange={(e) => handleInputChange('bad_actor', e.target.checked)}
                        className="rounded border-red-300 text-red-600 shadow-sm focus:border-red-500 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Flag as Bad Actor (chronic failures)</span>
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Bad actors are assets with repeated failures that require special attention.
                    </p>
                  </div>
                ) : (
                  <p className="mt-1">
                    {asset.bad_actor ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        ⚠️ Bad Actor
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Not flagged</span>
                    )}
                  </p>
                )}
              </div>

              {/* Administrative Location */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Administrative Location</label>
                {isEditing ? (
                  <select
                    value={editForm.admin_loc || ''}
                    onChange={(e) => handleInputChange('admin_loc', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {adminLocations.map((loc) => (
                      <option key={loc.loc_cd} value={loc.loc_cd}>
                        {loc.loc_name} ({loc.loc_cd})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">
                    {asset.admin_loc_name || asset.admin_loc}
                  </p>
                )}
              </div>

              {/* Custodial Location */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Custodial Location</label>
                {isEditing ? (
                  <select
                    value={editForm.cust_loc || ''}
                    onChange={(e) => handleInputChange('cust_loc', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {custodialLocations.map((loc) => (
                      <option key={loc.loc_cd} value={loc.loc_cd}>
                        {loc.loc_name} ({loc.loc_cd})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">
                    {asset.cust_loc_name || asset.cust_loc}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* In-Transit / Shipping Information */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">In-Transit / Shipping Information</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* In Transit Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-500">In Transit Status</label>
                {isEditing ? (
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.in_transit ?? false}
                        onChange={(e) => handleInputChange('in_transit', e.target.checked)}
                        className="rounded border-blue-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Asset is in transit</span>
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Mark when asset is being shipped between locations.
                    </p>
                  </div>
                ) : (
                  <p className="mt-1">
                    {asset.in_transit ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        In Transit
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Not in transit</span>
                    )}
                  </p>
                )}
              </div>

              {/* Carrier */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Carrier</label>
                {isEditing ? (
                  <select
                    value={editForm.carrier || ''}
                    onChange={(e) => handleInputChange('carrier', e.target.value)}
                    disabled={!editForm.in_transit}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      !editForm.in_transit
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select carrier...</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="USPS">USPS</option>
                    <option value="DHL">DHL</option>
                    <option value="Military Transport">Military Transport</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">
                    {asset.carrier || <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                )}
              </div>

              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Tracking Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.tracking_number || ''}
                    onChange={(e) => handleInputChange('tracking_number', e.target.value)}
                    disabled={!editForm.in_transit}
                    placeholder="Enter tracking number..."
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      !editForm.in_transit
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                ) : (
                  <p className="mt-1 text-gray-900 font-mono text-sm">
                    {asset.tracking_number || <span className="text-gray-400 italic font-sans">Not specified</span>}
                  </p>
                )}
              </div>

              {/* Ship Date */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Ship Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.ship_date || ''}
                    onChange={(e) => handleInputChange('ship_date', e.target.value)}
                    disabled={!editForm.in_transit}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      !editForm.in_transit
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                ) : (
                  <p className="mt-1 text-gray-900">
                    {asset.ship_date ? formatDate(asset.ship_date) : <span className="text-gray-400 italic">Not specified</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Display shipping summary when in transit */}
            {asset.in_transit && (asset.carrier || asset.tracking_number || asset.ship_date) && !isEditing && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Shipment Information</p>
                    <p className="mt-1">
                      {asset.carrier && `Shipped via ${asset.carrier}`}
                      {asset.ship_date && ` on ${formatDate(asset.ship_date)}`}
                      {asset.tracking_number && (
                        <>
                          . Tracking: <span className="font-mono font-medium">{asset.tracking_number}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Remarks/Notes */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Remarks / Notes</h2>
          </div>
          <div className="px-6 py-4">
            {isEditing ? (
              <textarea
                value={editForm.notes || editForm.remarks || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter any notes or remarks about this asset..."
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">
                {asset.notes || asset.remarks || <span className="text-gray-400 italic">No remarks or notes</span>}
              </p>
            )}
          </div>

          {/* Assembly Hierarchy (NHA/SRA) */}
          {(hierarchy?.has_nha || hierarchy?.has_sra) && (
            <>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Assembly Hierarchy</h2>
              </div>
              <div className="px-6 py-4">
                {hierarchyLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* NHA - Parent Assembly */}
                    {hierarchy?.has_nha && hierarchy.nha && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          NHA (Next Higher Assembly) - Parent
                        </label>
                        <button
                          onClick={() => navigate(`/assets/${hierarchy.nha!.asset_id}`)}
                          className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-blue-900">
                                {hierarchy.nha.serno}
                              </p>
                              <p className="text-sm text-blue-700">
                                {hierarchy.nha.part_name}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                P/N: {hierarchy.nha.partno}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <StatusBadge status={hierarchy.nha.status_cd} />
                              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* SRA - Child Assemblies */}
                    {hierarchy?.has_sra && hierarchy.sra.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          SRA (Shop Replaceable Assemblies) - Children ({hierarchy.sra.length})
                        </label>
                        <div className="space-y-2">
                          {hierarchy.sra.map((child) => (
                            <button
                              key={child.asset_id}
                              onClick={() => navigate(`/assets/${child.asset_id}`)}
                              className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-green-900">
                                    {child.serno}
                                  </p>
                                  <p className="text-sm text-green-700">
                                    {child.part_name}
                                  </p>
                                  <p className="text-xs text-green-600 mt-1">
                                    P/N: {child.partno}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <StatusBadge status={child.status_cd} />
                                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Sorties Section */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Sorties</h2>
          </div>
          <div className="px-6 py-4">
            {sortiesLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : sortiesError ? (
              <div className="text-red-600 text-sm">{sortiesError}</div>
            ) : sorties.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No sorties recorded for this asset</p>
            ) : (
              <div className="space-y-3">
                {sorties.map((sortie) => (
                  <button
                    key={sortie.sortie_id}
                    onClick={() => navigate('/sorties')}
                    className="w-full text-left p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-indigo-900">
                          {sortie.mission_id}
                        </p>
                        <p className="text-sm text-indigo-700">
                          {new Date(sortie.sortie_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        {sortie.sortie_effect && (
                          <p className="text-xs text-indigo-600 mt-1">
                            Effect: {sortie.sortie_effect}
                          </p>
                        )}
                        {sortie.range && (
                          <p className="text-xs text-indigo-600">
                            Range: {sortie.range}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sortie.sortie_effect === 'Full Mission Capable'
                            ? 'bg-green-100 text-green-800'
                            : sortie.sortie_effect === 'Partial Mission Capable'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sortie.sortie_effect || 'N/A'}
                        </span>
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Record Information</h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Asset ID</label>
                <p className="mt-1 text-gray-900">{asset.asset_id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Created Date</label>
                <p className="mt-1 text-gray-900">{formatDate(asset.created_date)}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {isEditing && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      ) : activeTab === 'history' ? (
        /* History Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Change History</h2>
            <p className="mt-1 text-sm text-gray-500">Audit trail of all changes made to this asset</p>
          </div>

          {historyLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading history...</p>
            </div>
          ) : historyError ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-red-600">{historyError}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-gray-500">No history records found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {history.map((entry) => (
                <div key={entry.history_id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getActionBadge(entry.action_type)}
                        <span className="text-sm text-gray-500">{formatDateTime(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{entry.description}</p>
                      <p className="text-xs text-gray-500">
                        By {entry.user_full_name} ({entry.username})
                      </p>
                    </div>
                  </div>

                  {/* Changes table */}
                  {entry.changes && entry.changes.length > 0 && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="pb-2">Field</th>
                            <th className="pb-2">Old Value</th>
                            <th className="pb-2">New Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {entry.changes.map((change, idx) => (
                            <tr key={idx}>
                              <td className="py-2 font-medium text-gray-900">{change.field_label}</td>
                              <td className="py-2 text-gray-500">
                                {change.old_value === null ? (
                                  <span className="italic text-gray-400">-</span>
                                ) : (
                                  <span className="line-through text-red-600">{change.old_value}</span>
                                )}
                              </td>
                              <td className="py-2 text-green-600 font-medium">{change.new_value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'eti' ? (
        /* ETI Tracking Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">ETI Tracking</h2>
              <p className="mt-1 text-sm text-gray-500">Elapsed Time Indicator history and updates</p>
            </div>
            <div className="flex gap-3">
              {canUpdateETI && (
                <button
                  onClick={() => setShowEtiUpdateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Update ETI
                </button>
              )}
              {canReplaceMeter && asset?.eti_hours !== null && (
                <button
                  onClick={() => setShowMeterReplacementModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Replace Meter
                </button>
              )}
            </div>
          </div>

          {/* Current Meter Display */}
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Current {asset?.meter_type === 'cycles' ? 'Cycles Count' : asset?.meter_type === 'eti' ? 'ETI Hours' : asset?.meter_type === 'hours' ? 'Hours' : 'Meter Reading'}
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {asset?.meter_type === 'cycles' ? (
                    <>{asset?.cycles_count?.toLocaleString() || '0'} <span className="text-lg font-normal">cycles</span></>
                  ) : (
                    <>{asset?.eti_hours?.toLocaleString() || '0'} <span className="text-lg font-normal">hrs</span></>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Asset: {asset?.serno}</p>
                <p className="text-sm text-blue-600">Part: {asset?.partno}</p>
                {asset?.meter_type && (
                  <p className="text-sm text-blue-600">Meter Type: {asset.meter_type.toUpperCase()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Success messages */}
          {etiUpdateSuccess && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-100">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-700">{etiUpdateSuccess}</span>
              </div>
            </div>
          )}
          {meterReplacementSuccess && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-100">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-700">{meterReplacementSuccess}</span>
              </div>
            </div>
          )}

          {/* ETI History List */}
          {etiHistoryLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading ETI history...</p>
            </div>
          ) : etiHistoryError ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-red-600">{etiHistoryError}</p>
            </div>
          ) : etiHistory.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-gray-500">No ETI history records found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {etiHistory.map((entry) => (
                <div key={entry.eti_history_id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {/* Source badge */}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          entry.source === 'maintenance' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          entry.source === 'sortie' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {entry.source === 'maintenance' ? 'Maintenance' :
                           entry.source === 'sortie' ? 'Sortie' : 'Manual'}
                        </span>
                        <span className="text-sm text-gray-500">{formatDateTime(entry.timestamp)}</span>
                      </div>

                      {/* Meter value change */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold text-gray-900">
                          {entry.old_value?.toLocaleString() || '0'} → {entry.new_value.toLocaleString()} {entry.meter_type === 'cycles' ? 'cycles' : 'hrs'}
                        </span>
                        <span className={`text-sm font-medium ${entry.value_added >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({entry.value_added >= 0 ? '+' : ''}{entry.value_added} {entry.meter_type === 'cycles' ? 'cycles' : 'hrs'})
                        </span>
                      </div>

                      {/* Source reference */}
                      {entry.source_ref && (
                        <p className="text-sm text-gray-600">
                          Reference: <span className="font-mono">{entry.source_ref}</span>
                        </p>
                      )}

                      {/* Notes */}
                      {entry.notes && (
                        <p className="text-sm text-gray-500 mt-1">{entry.notes}</p>
                      )}

                      {/* User info */}
                      <p className="text-xs text-gray-400 mt-2">
                        By {entry.user_full_name} ({entry.username})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'meters' ? (
        /* Meter History Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Meter History</h2>
              <p className="mt-1 text-sm text-gray-500">Engineering Time Meters (ETM) readings from maintenance events</p>
            </div>
          </div>

          {/* Current ETM Display */}
          <div className="px-6 py-4 bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Current Meter Reading</p>
                <p className="text-3xl font-bold text-green-900">
                  {asset?.eti_hours?.toLocaleString() || '0'} <span className="text-lg font-normal">hrs</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Asset: {asset?.serno}</p>
                <p className="text-sm text-green-600">Part: {asset?.partno}</p>
              </div>
            </div>
          </div>

          {/* Meter History Table */}
          {meterHistoryLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading meter history...</p>
            </div>
          ) : meterHistoryError ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-red-600">{meterHistoryError}</p>
            </div>
          ) : meterHistory.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 text-sm text-gray-500">No meter readings found</p>
              <p className="mt-2 text-xs text-gray-400">Meter readings are recorded during maintenance events</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event / Job No
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meter In
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meter Out
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hours Added
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {meterHistory.map((entry) => (
                    <tr key={entry.repair_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-900">{entry.job_no || 'N/A'}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{entry.narrative}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="font-mono text-gray-900">
                          {entry.eti_in !== null ? entry.eti_in.toLocaleString() : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="font-mono text-gray-900">
                          {entry.eti_out !== null ? entry.eti_out.toLocaleString() : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        {entry.eti_delta !== null ? (
                          <span className={`font-semibold ${entry.eti_delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {entry.eti_delta >= 0 ? '+' : ''}{entry.eti_delta.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.type_maint}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.shop_status === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.shop_status === 'open' ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.created_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'maintenance' ? (
        /* Maintenance Events Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Maintenance Events</h2>
              <p className="mt-1 text-sm text-gray-500">Maintenance history for this asset</p>
            </div>
            <button
              onClick={() => navigate('/maintenance')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Event
            </button>
          </div>

          {/* Summary Statistics */}
          {maintenanceEventsSummary && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">{maintenanceEventsSummary.total}</p>
                  <p className="text-sm text-blue-700">Total Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{maintenanceEventsSummary.open}</p>
                  <p className="text-sm text-yellow-700">Open</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{maintenanceEventsSummary.closed}</p>
                  <p className="text-sm text-green-700">Closed</p>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Standard: {maintenanceEventsSummary.by_type.standard}</p>
                    <p>PMI: {maintenanceEventsSummary.by_type.pmi}</p>
                    <p>TCTO: {maintenanceEventsSummary.by_type.tcto}</p>
                    <p>BIT/PC: {maintenanceEventsSummary.by_type.bitpc}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Events List */}
          {maintenanceEventsLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading maintenance events...</p>
            </div>
          ) : maintenanceEventsError ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-red-600">{maintenanceEventsError}</p>
            </div>
          ) : maintenanceEvents.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              <p className="mt-4 text-sm text-gray-500">No maintenance events for this asset</p>
              <button
                onClick={() => navigate('/maintenance')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Create First Event
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {maintenanceEvents.map((event) => {
                const priorityStyle = priorityColors[event.priority] || priorityColors.Routine
                const eventTypeStyle = eventTypeColors[event.event_type] || eventTypeColors.Standard
                const isOpen = event.status === 'open'

                return (
                  <div
                    key={event.event_id}
                    onClick={() => navigate(`/maintenance/${event.event_id}`)}
                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {/* Job Number */}
                          <span className="text-sm font-mono font-semibold text-blue-600">
                            {event.job_no}
                          </span>
                          {/* Status Badge */}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                            isOpen
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              : 'bg-green-100 text-green-800 border-green-200'
                          }`}>
                            {event.status.toUpperCase()}
                          </span>
                          {/* Event Type Badge */}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${eventTypeStyle.bg} ${eventTypeStyle.text} ${eventTypeStyle.border}`}>
                            {event.event_type}
                          </span>
                          {/* Priority Badge */}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
                            {event.priority}
                          </span>
                        </div>

                        {/* Discrepancy */}
                        <p className="text-sm text-gray-900 mb-2">{event.discrepancy}</p>

                        {/* Dates and Location */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            Started: {new Date(event.start_job).toLocaleDateString()}
                          </span>
                          {event.stop_job && (
                            <span>
                              Closed: {new Date(event.stop_job).toLocaleDateString()}
                            </span>
                          )}
                          <span>Location: {event.location}</span>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <svg className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'pmi' ? (
        /* PMI History Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">PMI History</h2>
              <p className="mt-1 text-sm text-gray-500">Periodic maintenance inspection history for this asset</p>
            </div>
            <button
              onClick={() => navigate('/maintenance')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All PMI
            </button>
          </div>

          {/* PMI Summary Statistics */}
          {pmiHistorySummary && (
            <div className="px-6 py-4 bg-purple-50 border-b border-purple-100">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-900">{pmiHistorySummary.total}</p>
                  <p className="text-sm text-purple-700">Total PMIs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{pmiHistorySummary.completed}</p>
                  <p className="text-sm text-green-700">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">{pmiHistorySummary.pending}</p>
                  <p className="text-sm text-gray-700">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{pmiHistorySummary.overdue}</p>
                  <p className="text-sm text-red-700">Overdue</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{pmiHistorySummary.due_soon}</p>
                  <p className="text-sm text-orange-700">Due Soon</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{pmiHistorySummary.upcoming}</p>
                  <p className="text-sm text-yellow-700">Upcoming</p>
                </div>
              </div>
            </div>
          )}

          {/* PMI History List */}
          {pmiHistoryLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading PMI history...</p>
            </div>
          ) : pmiHistoryError ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-red-600">{pmiHistoryError}</p>
            </div>
          ) : pmiHistory.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-sm text-gray-500">No PMI records for this asset</p>
              <button
                onClick={() => navigate('/maintenance')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
              >
                Schedule First PMI
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PMI Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WUC
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interval
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Until Due
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pmiHistory.map((pmi) => {
                    // Determine status colors
                    let statusBg = 'bg-gray-100'
                    let statusText = 'text-gray-800'
                    let statusLabel = 'Scheduled'

                    if (pmi.completed_date) {
                      statusBg = 'bg-green-100'
                      statusText = 'text-green-800'
                      statusLabel = 'Completed'
                    } else if (pmi.days_until_due < 0) {
                      statusBg = 'bg-red-100'
                      statusText = 'text-red-800'
                      statusLabel = 'Overdue'
                    } else if (pmi.days_until_due <= 7) {
                      statusBg = 'bg-red-100'
                      statusText = 'text-red-800'
                      statusLabel = 'Due Soon'
                    } else if (pmi.days_until_due <= 30) {
                      statusBg = 'bg-yellow-100'
                      statusText = 'text-yellow-800'
                      statusLabel = 'Upcoming'
                    } else {
                      statusBg = 'bg-green-100'
                      statusText = 'text-green-800'
                      statusLabel = 'Scheduled'
                    }

                    return (
                      <tr
                        key={pmi.pmi_id}
                        onClick={() => navigate(`/pmi/${pmi.pmi_id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pmi.pmi_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBg} ${statusText}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-600">{pmi.wuc_cd || '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {pmi.interval_days}-Day
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pmi.completed_date ? (
                            <span className="text-sm text-green-600 font-medium">
                              {new Date(pmi.completed_date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Not completed</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {new Date(pmi.next_due_date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {pmi.completed_date ? (
                            <span className="text-sm text-gray-400">-</span>
                          ) : (
                            <span className={`text-sm font-medium ${
                              pmi.days_until_due < 0 ? 'text-red-600' :
                              pmi.days_until_due <= 7 ? 'text-red-600' :
                              pmi.days_until_due <= 30 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {pmi.days_until_due < 0 ? `${Math.abs(pmi.days_until_due)} days overdue` : `${pmi.days_until_due} days`}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'software' ? (
        /* Software Tab */
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Software Associations</h2>
            {canEdit && (
              <button
                onClick={() => setShowAddSoftwareModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Software
              </button>
            )}
          </div>

          {softwareLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading software associations...</p>
            </div>
          ) : softwareError ? (
            <div className="px-6 py-4">
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                <p className="text-sm">{softwareError}</p>
              </div>
            </div>
          ) : softwareAssociations.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>No software associations found for this asset.</p>
              {canEdit && (
                <p className="mt-2 text-sm">Click "Add Software" to associate software versions with this asset.</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Software Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Software Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Effective Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {canEdit && (
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {softwareAssociations.map((assoc) => (
                    <tr key={assoc.assoc_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{assoc.sw_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{assoc.sw_version}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{assoc.sw_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {assoc.sw_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(assoc.effective_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assoc.end_date ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      {canEdit && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveSoftware(assoc.assoc_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {/* Add Software Modal */}
      {showAddSoftwareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowAddSoftwareModal(false)}
            />

            {/* Modal panel */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Software Association</h3>
                <button
                  onClick={() => setShowAddSoftwareModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {addSoftwareError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
                  <p className="text-sm">{addSoftwareError}</p>
                </div>
              )}

              <form onSubmit={handleAddSoftware}>
                <div className="space-y-4">
                  {/* Software Version Dropdown */}
                  <div>
                    <label htmlFor="sw_version_id" className="block text-sm font-medium text-gray-700">
                      Software Version *
                    </label>
                    <select
                      id="sw_version_id"
                      value={addSoftwareForm.sw_version_id}
                      onChange={(e) => setAddSoftwareForm(prev => ({ ...prev, sw_version_id: e.target.value }))}
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select software version</option>
                      {softwareVersions.map((version) => (
                        <option key={version.sw_version_id} value={version.sw_version_id}>
                          {version.sw_name} (v{version.sw_version}) - {version.sw_number}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Effective Date */}
                  <div>
                    <label htmlFor="effective_date" className="block text-sm font-medium text-gray-700">
                      Effective Date *
                    </label>
                    <input
                      type="date"
                      id="effective_date"
                      value={addSoftwareForm.effective_date}
                      onChange={(e) => setAddSoftwareForm(prev => ({ ...prev, effective_date: e.target.value }))}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSoftwareModal(false)}
                    disabled={addingSoftware}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingSoftware}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {addingSoftware ? 'Adding...' : 'Add Software'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ETI Update Modal */}
      {showEtiUpdateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowEtiUpdateModal(false)}
            />

            {/* Modal panel */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Meter Reading</h3>
                <button
                  onClick={() => setShowEtiUpdateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Current Reading */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Current Reading</p>
                <p className="text-xl font-bold text-gray-900">
                  {asset?.meter_type === 'cycles' ? (
                    <>{asset?.cycles_count?.toLocaleString() || '0'} cycles</>
                  ) : (
                    <>{asset?.eti_hours?.toLocaleString() || '0'} hrs</>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Meter Type: {asset?.meter_type ? asset.meter_type.toUpperCase() : 'Not set'}
                </p>
              </div>

              {/* Error message */}
              {etiUpdateError && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">{etiUpdateError}</p>
                </div>
              )}

              <form onSubmit={handleETIUpdate}>
                {/* Meter Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meter Type
                  </label>
                  <select
                    value={etiUpdateForm.meter_type || asset?.meter_type || 'hours'}
                    onChange={(e) => setEtiUpdateForm(prev => ({ ...prev, meter_type: e.target.value as 'hours' | 'cycles' | 'eti' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hours">Hours</option>
                    <option value="cycles">Cycles</option>
                    <option value="eti">ETI (Elapsed Time Indicator)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Select the type of meter reading to add</p>
                </div>

                {/* Value to add */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {(etiUpdateForm.meter_type || asset?.meter_type) === 'cycles' ? 'Cycles to Add/Subtract' : 'Hours to Add/Subtract'}
                  </label>
                  <input
                    type="number"
                    step={(etiUpdateForm.meter_type || asset?.meter_type) === 'cycles' ? '1' : '0.1'}
                    value={etiUpdateForm.hours_to_add}
                    onChange={(e) => setEtiUpdateForm(prev => ({ ...prev, hours_to_add: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={(etiUpdateForm.meter_type || asset?.meter_type) === 'cycles' ? 'e.g., 100 or -10' : 'e.g., 50 or -10'}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Use negative numbers to subtract {(etiUpdateForm.meter_type || asset?.meter_type) === 'cycles' ? 'cycles' : 'hours'}</p>
                </div>

                {/* Source */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    value={etiUpdateForm.source}
                    onChange={(e) => setEtiUpdateForm(prev => ({ ...prev, source: e.target.value as 'maintenance' | 'manual' | 'sortie' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="manual">Manual Entry</option>
                    <option value="maintenance">Maintenance Event</option>
                    <option value="sortie">Sortie/Mission</option>
                  </select>
                </div>

                {/* Source reference */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={etiUpdateForm.source_ref}
                    onChange={(e) => setEtiUpdateForm(prev => ({ ...prev, source_ref: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., MX-2024-001 or SORTIE-2024-045"
                  />
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={etiUpdateForm.notes}
                    onChange={(e) => setEtiUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Reason for update..."
                  />
                </div>

                {/* Preview */}
                {etiUpdateForm.hours_to_add && !isNaN(parseFloat(etiUpdateForm.hours_to_add)) && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      New value will be: <span className="font-bold">
                        {(etiUpdateForm.meter_type || asset?.meter_type) === 'cycles' ? (
                          <>
                            {((asset?.cycles_count || 0) + parseFloat(etiUpdateForm.hours_to_add)).toLocaleString()} cycles
                          </>
                        ) : (
                          <>
                            {((asset?.eti_hours || 0) + parseFloat(etiUpdateForm.hours_to_add)).toLocaleString()} hrs
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEtiUpdateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={etiUpdating}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {etiUpdating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      'Update ETI'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Meter Replacement Modal */}
      {showMeterReplacementModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowMeterReplacementModal(false)}
            />

            {/* Modal panel */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Replace Meter</h3>
                <button
                  onClick={() => setShowMeterReplacementModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Current Meter Info */}
              <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-800">Current Meter Reading</p>
                <p className="text-2xl font-bold text-orange-900">{asset?.eti_hours?.toLocaleString() || '0'} hrs</p>
                <p className="text-xs text-orange-600 mt-1">This meter will be replaced</p>
              </div>

              {/* Warning */}
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Meter Replacement</p>
                    <p className="text-xs text-yellow-700 mt-1">Old meter history will be preserved. New meter starts fresh tracking.</p>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {meterReplacementError && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-600">{meterReplacementError}</p>
                </div>
              )}

              <form onSubmit={handleMeterReplacement}>
                {/* Replacement Reason */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Replacement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={meterReplacementForm.replacement_reason}
                    onChange={(e) => setMeterReplacementForm(prev => ({ ...prev, replacement_reason: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Meter malfunction, Calibration issue, Physical damage"
                    rows={3}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Explain why the meter is being replaced</p>
                </div>

                {/* New Meter Start Value */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Meter Starting Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={meterReplacementForm.new_meter_start_value}
                    onChange={(e) => setMeterReplacementForm(prev => ({ ...prev, new_meter_start_value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., 0"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter the starting value for the new meter (usually 0)</p>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={meterReplacementForm.notes}
                    onChange={(e) => setMeterReplacementForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Additional notes..."
                    rows={2}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMeterReplacementModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={meterReplacing}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 disabled:opacity-50"
                  >
                    {meterReplacing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Replacing...
                      </>
                    ) : (
                      'Replace Meter'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
