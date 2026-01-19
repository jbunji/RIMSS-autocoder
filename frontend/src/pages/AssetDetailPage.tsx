import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

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
  eti_hours?: number | null    // ETI tracking hours
  last_maint_date?: string | null
  next_pmi_date?: string | null
  location?: string
  loc_type?: 'depot' | 'field'
  in_transit?: boolean
  bad_actor?: boolean
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

// Status badge colors
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  FMC: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  PMC: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  NMCM: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  NMCS: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  CNDM: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
}

// Tab type
type TabType = 'details' | 'history'

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('details')

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
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History
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

              {/* ETI Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-500">ETI Hours</label>
                <p className="mt-1 text-gray-900">
                  {asset.eti_hours !== null && asset.eti_hours !== undefined ? (
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
      ) : (
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
      )}
    </div>
  )
}
