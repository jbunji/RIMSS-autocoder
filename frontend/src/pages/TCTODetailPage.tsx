import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tab, Dialog } from '@headlessui/react'
import {
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// TCTO Record interface
interface TCTORecord {
  tcto_id: number
  tcto_no: string
  title: string
  effective_date: string
  compliance_deadline: string
  pgm_id: number
  status: 'open' | 'closed'
  priority: 'Routine' | 'Urgent' | 'Critical'
  affected_assets: number[]
  compliant_assets: number[]
  description: string
  created_by_id: number
  created_by_name: string
  created_at: string
  days_until_deadline: number
  compliance_percentage: number
  assets_remaining: number
  is_overdue: boolean
  program_code: string
  program_name: string
  tcto_type?: string
  sys_type?: string
  remarks?: string
}

// Asset with compliance status
interface TCTOAsset {
  asset_id: number
  serno: string
  partno: string
  name: string
  status_cd: string
  admin_loc: string
  cust_loc: string
  is_compliant: boolean
  compliance_status: 'Compliant' | 'Non-Compliant'
  completion_date?: string | null
  linked_repair_id?: number | null
  linked_repair?: {
    repair_id: number
    event_id: number
    job_no: string
    narrative: string | null
  } | null
  completed_by?: string | null
  completed_at?: string | null
}

// Repair for linking
interface AssetRepair {
  repair_id: number
  event_id: number
  job_no: string
  repair_seq: number
  type_maint: string | null
  narrative: string | null
  start_date: string
  stop_date: string | null
  shop_status: string
}

// Summary of compliance
interface ComplianceSummary {
  total_affected: number
  compliant: number
  non_compliant: number
  compliance_percentage: number
}

// Priority badge colors
const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
  Critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  Urgent: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  Routine: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
}

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  closed: { bg: 'bg-green-100', text: 'text-green-800' },
}

// Compliance badge colors
const complianceColors: Record<string, { bg: string; text: string; icon: typeof CheckCircleIcon }> = {
  Compliant: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
  'Non-Compliant': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon },
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function TCTODetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const [tcto, setTcto] = useState<TCTORecord | null>(null)
  const [assets, setAssets] = useState<TCTOAsset[]>([])
  const [summary, setSummary] = useState<ComplianceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Compliance update state
  const [updatingAssetId, setUpdatingAssetId] = useState<number | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)

  // Completion modal state
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<TCTOAsset | null>(null)
  const [completionDate, setCompletionDate] = useState<string>('')
  const [linkedRepairId, setLinkedRepairId] = useState<number | null>(null)
  const [availableRepairs, setAvailableRepairs] = useState<AssetRepair[]>([])
  const [loadingRepairs, setLoadingRepairs] = useState(false)

  // Check if user can update compliance (field technician, depot manager or admin)
  const canUpdateCompliance = user?.role && ['FIELD_TECHNICIAN', 'DEPOT_MANAGER', 'ADMIN'].includes(user.role)

  useEffect(() => {
    const fetchTCTO = async () => {
      if (!token || !id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/tcto/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('TCTO not found')
          }
          if (response.status === 403) {
            throw new Error('You do not have access to this TCTO')
          }
          throw new Error('Failed to fetch TCTO details')
        }

        const data = await response.json()
        setTcto(data.tcto)
        setAssets(data.assets)
        setSummary(data.summary)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTCTO()
  }, [token, id])

  // Fetch repairs for an asset when opening completion modal
  const fetchAssetRepairs = async (assetId: number) => {
    if (!token || !id) return

    setLoadingRepairs(true)
    try {
      const response = await fetch(`/api/tcto/${id}/assets/${assetId}/repairs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAvailableRepairs(data.repairs)
      } else {
        setAvailableRepairs([])
      }
    } catch (err) {
      console.error('Failed to fetch repairs:', err)
      setAvailableRepairs([])
    } finally {
      setLoadingRepairs(false)
    }
  }

  // Open completion modal
  const openCompletionModal = (asset: TCTOAsset) => {
    setSelectedAsset(asset)
    setCompletionDate(new Date().toISOString().split('T')[0]) // Default to today
    setLinkedRepairId(null)
    setAvailableRepairs([])
    setIsCompletionModalOpen(true)
    fetchAssetRepairs(asset.asset_id)
  }

  // Close completion modal
  const closeCompletionModal = () => {
    setIsCompletionModalOpen(false)
    setSelectedAsset(null)
    setCompletionDate('')
    setLinkedRepairId(null)
    setAvailableRepairs([])
  }

  // Handle compliance update (with completion date and linked repair)
  const handleComplianceUpdate = async (assetId: number, isCompliant: boolean, completionDateValue?: string, linkedRepairIdValue?: number | null) => {
    if (!token || !id) return

    setUpdatingAssetId(assetId)
    setUpdateError(null)
    setUpdateSuccess(null)

    try {
      const body: Record<string, unknown> = {
        asset_id: assetId,
        is_compliant: isCompliant,
      }

      if (isCompliant && completionDateValue) {
        body.completion_date = completionDateValue
      }

      if (isCompliant && linkedRepairIdValue) {
        body.linked_repair_id = linkedRepairIdValue
      }

      const response = await fetch(`/api/tcto/${id}/compliance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update compliance')
      }

      const data = await response.json()

      // Update local state with completion data
      setAssets(prev =>
        prev.map(asset =>
          asset.asset_id === assetId
            ? {
                ...asset,
                is_compliant: isCompliant,
                compliance_status: isCompliant ? 'Compliant' : 'Non-Compliant',
                completion_date: data.asset.completion_date,
                linked_repair_id: data.asset.linked_repair_id,
                linked_repair: data.asset.linked_repair,
                completed_by: data.asset.completed_by,
                completed_at: data.asset.completed_at,
              }
            : asset
        )
      )

      // Update summary
      setSummary(data.tcto_summary)

      // Update TCTO compliance percentage
      if (tcto) {
        setTcto({
          ...tcto,
          compliant_assets: isCompliant
            ? [...tcto.compliant_assets, assetId]
            : tcto.compliant_assets.filter(aid => aid !== assetId),
          compliance_percentage: data.tcto_summary.compliance_percentage,
          assets_remaining: data.tcto_summary.non_compliant,
        })
      }

      setUpdateSuccess(`Asset ${data.asset.serno} marked as ${isCompliant ? 'compliant' : 'non-compliant'}`)

      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(null), 3000)

      // Close modal
      closeCompletionModal()
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update compliance')
    } finally {
      setUpdatingAssetId(null)
    }
  }

  // Handle submit from completion modal
  const handleCompletionSubmit = () => {
    if (selectedAsset) {
      handleComplianceUpdate(selectedAsset.asset_id, true, completionDate, linkedRepairId)
    }
  }

  // Navigate to asset detail
  const handleAssetClick = (assetId: number) => {
    navigate(`/assets/${assetId}`)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => navigate('/maintenance')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Return to Maintenance
          </button>
        </div>
      </div>
    )
  }

  if (!tcto) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">TCTO not found</p>
          <button
            onClick={() => navigate('/maintenance')}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            Return to Maintenance
          </button>
        </div>
      </div>
    )
  }

  const priorityStyle = priorityColors[tcto.priority] || priorityColors.Routine
  const statusStyle = statusColors[tcto.status] || statusColors.open

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/maintenance')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Back to Maintenance"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{tcto.tcto_no}</h1>
              <span
                className={classNames(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium',
                  priorityStyle.bg,
                  priorityStyle.text
                )}
              >
                {tcto.priority}
              </span>
              <span
                className={classNames(
                  'px-2.5 py-0.5 rounded-full text-xs font-medium uppercase',
                  statusStyle.bg,
                  statusStyle.text
                )}
              >
                {tcto.status}
              </span>
              {tcto.is_overdue && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  OVERDUE
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">{tcto.title}</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800">{updateSuccess}</p>
          </div>
        </div>
      )}

      {updateError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{updateError}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Compliance Progress Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{tcto.compliance_percentage}%</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={classNames(
                  'h-2 rounded-full',
                  tcto.compliance_percentage === 100
                    ? 'bg-green-500'
                    : tcto.compliance_percentage >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                )}
                style={{ width: `${tcto.compliance_percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Assets Remaining Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Assets Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                {tcto.assets_remaining} / {tcto.affected_assets.length}
              </p>
            </div>
            <div
              className={classNames(
                'p-3 rounded-full',
                tcto.assets_remaining === 0 ? 'bg-green-50' : 'bg-orange-50'
              )}
            >
              {tcto.assets_remaining === 0 ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
              )}
            </div>
          </div>
        </div>

        {/* Days Until Deadline Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {tcto.days_until_deadline < 0 ? 'Days Overdue' : 'Days Until Deadline'}
              </p>
              <p
                className={classNames(
                  'text-2xl font-bold',
                  tcto.days_until_deadline < 0
                    ? 'text-red-600'
                    : tcto.days_until_deadline <= 7
                    ? 'text-orange-600'
                    : 'text-gray-900'
                )}
              >
                {Math.abs(tcto.days_until_deadline)}
              </p>
            </div>
            <div
              className={classNames(
                'p-3 rounded-full',
                tcto.days_until_deadline < 0
                  ? 'bg-red-50'
                  : tcto.days_until_deadline <= 7
                  ? 'bg-orange-50'
                  : 'bg-gray-50'
              )}
            >
              <CalendarIcon
                className={classNames(
                  'h-6 w-6',
                  tcto.days_until_deadline < 0
                    ? 'text-red-600'
                    : tcto.days_until_deadline <= 7
                    ? 'text-orange-600'
                    : 'text-gray-600'
                )}
              />
            </div>
          </div>
        </div>

        {/* Deadline Date Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Compliance Deadline</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(tcto.compliance_deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-full">
              <ClockIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm font-medium leading-5 rounded-md',
                'focus:outline-none',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              )
            }
          >
            Details
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm font-medium leading-5 rounded-md',
                'focus:outline-none flex items-center justify-center',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              )
            }
          >
            Assets
            <span
              className={classNames(
                'ml-2 px-2 py-0.5 text-xs rounded-full',
                assets.length > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
              )}
            >
              {assets.length}
            </span>
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          {/* Details Tab */}
          <Tab.Panel>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 space-y-6">
                {/* Program Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Program</label>
                      <p className="mt-1 text-gray-900">
                        {tcto.program_code} - {tcto.program_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">TCTO Number</label>
                      <p className="mt-1 text-gray-900">{tcto.tcto_no}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Effective Date</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(tcto.effective_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Compliance Deadline
                      </label>
                      <p
                        className={classNames(
                          'mt-1 font-medium',
                          tcto.is_overdue ? 'text-red-600' : 'text-gray-900'
                        )}
                      >
                        {new Date(tcto.compliance_deadline).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Created</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(tcto.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Created By */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Created By</h3>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">{tcto.created_by_name}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {tcto.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                        <p className="text-gray-700 whitespace-pre-wrap">{tcto.description}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Remarks */}
                {tcto.remarks && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Remarks</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{tcto.remarks}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>

          {/* Assets Tab */}
          <Tab.Panel>
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Assets Summary Header */}
              {summary && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Total:</span>
                        <span className="font-semibold text-gray-900">{summary.total_affected}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                        <span className="text-sm text-gray-500 mr-2">Compliant:</span>
                        <span className="font-semibold text-green-600">{summary.compliant}</span>
                      </div>
                      <div className="flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                        <span className="text-sm text-gray-500 mr-2">Non-Compliant:</span>
                        <span className="font-semibold text-red-600">{summary.non_compliant}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {summary.compliance_percentage}% Complete
                    </div>
                  </div>
                </div>
              )}

              {/* Assets Table */}
              {assets.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No assets are affected by this TCTO</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serial Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Part Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compliance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completion Info
                        </th>
                        {canUpdateCompliance && (
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assets.map(asset => {
                        const complianceStyle = complianceColors[asset.compliance_status]
                        const ComplianceIcon = complianceStyle?.icon || XCircleIcon
                        const isUpdating = updatingAssetId === asset.asset_id

                        return (
                          <tr
                            key={asset.asset_id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleAssetClick(asset.asset_id)}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                title="View Asset Details"
                              >
                                {asset.serno}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {asset.partno}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {asset.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                                {asset.status_cd}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={classNames(
                                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                  complianceStyle?.bg || 'bg-gray-100',
                                  complianceStyle?.text || 'text-gray-800'
                                )}
                              >
                                <ComplianceIcon className="h-4 w-4 mr-1" />
                                {asset.compliance_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {asset.is_compliant && asset.completion_date ? (
                                <div className="space-y-1">
                                  <div className="flex items-center text-gray-600">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {new Date(asset.completion_date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </div>
                                  {asset.linked_repair && (
                                    <div className="flex items-center text-blue-600">
                                      <WrenchScrewdriverIcon className="h-4 w-4 mr-1" />
                                      <button
                                        onClick={() => navigate(`/maintenance/${asset.linked_repair?.event_id}`)}
                                        className="hover:underline font-medium"
                                        title={asset.linked_repair.narrative || 'No narrative'}
                                      >
                                        {asset.linked_repair.job_no}
                                      </button>
                                    </div>
                                  )}
                                  {asset.completed_by && (
                                    <div className="flex items-center text-gray-500 text-xs">
                                      <UserIcon className="h-3 w-3 mr-1" />
                                      {asset.completed_by}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            {canUpdateCompliance && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {isUpdating ? (
                                  <div className="flex items-center justify-end">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                  </div>
                                ) : asset.is_compliant ? (
                                  <button
                                    onClick={() => handleComplianceUpdate(asset.asset_id, false)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Mark Non-Compliant
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => openCompletionModal(asset)}
                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                                  >
                                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                                    Mark Complete
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Completion Modal */}
      <Dialog
        open={isCompletionModalOpen}
        onClose={closeCompletionModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl w-full">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
              Record TCTO Completion
            </Dialog.Title>

            {selectedAsset && (
              <div className="space-y-4">
                {/* Asset Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700">Asset:</p>
                  <p className="text-gray-900 font-semibold">{selectedAsset.serno}</p>
                  <p className="text-gray-600 text-sm">{selectedAsset.name}</p>
                </div>

                {/* TCTO Info */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-700">TCTO:</p>
                  <p className="text-blue-900 font-semibold">{tcto?.tcto_no}</p>
                  <p className="text-blue-700 text-sm">{tcto?.title}</p>
                </div>

                {/* Completion Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Date *
                  </label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={e => setCompletionDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Link to Repair */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link to Repair (Optional)
                  </label>
                  {loadingRepairs ? (
                    <div className="flex items-center text-gray-500 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                      Loading repairs...
                    </div>
                  ) : availableRepairs.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No repairs found for this asset</p>
                  ) : (
                    <select
                      value={linkedRepairId || ''}
                      onChange={e => setLinkedRepairId(e.target.value ? parseInt(e.target.value, 10) : null)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">-- Select a repair --</option>
                      {availableRepairs.map(repair => (
                        <option key={repair.repair_id} value={repair.repair_id}>
                          {repair.job_no} - Repair #{repair.repair_seq}
                          {repair.type_maint ? ` (${repair.type_maint})` : ''}
                          {repair.shop_status === 'closed' ? ' [Closed]' : ' [Open]'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeCompletionModal}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompletionSubmit}
                    disabled={!completionDate || updatingAssetId !== null}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {updatingAssetId === selectedAsset.asset_id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Complete TCTO
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
