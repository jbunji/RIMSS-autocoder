import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface StatusItem {
  status_cd: string
  status_name: string
  description: string
  count: number
}

interface AssetStatusData {
  program_id: number
  program_cd: string
  total_assets: number
  mission_capability_rate: number
  status_summary: StatusItem[]
}

interface PMIRecord {
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
}

interface PMISummary {
  overdue: number
  red: number
  yellow: number
  green: number
  total: number
}

interface PMIData {
  pmi: PMIRecord[]
  summary: PMISummary
}

// Maintenance Event interfaces
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

interface MaintenanceSummary {
  critical: number
  urgent: number
  routine: number
  total: number
}

interface MaintenanceData {
  events: MaintenanceEvent[]
  summary: MaintenanceSummary
}

// Parts Order interfaces
interface PartsOrder {
  order_id: number
  part_no: string
  part_name: string
  nsn: string
  qty_ordered: number
  qty_received: number
  unit_price: number
  order_date: string
  status: 'pending' | 'acknowledged' | 'shipped' | 'received' | 'cancelled'
  requestor_id: number
  requestor_name: string
  asset_sn: string | null
  asset_name: string | null
  job_no: string | null
  priority: 'routine' | 'urgent' | 'critical'
  pgm_id: number
  notes: string
  shipping_tracking: string | null
  estimated_delivery: string | null
}

interface PartsSummary {
  pending: number
  acknowledged: number
  critical: number
  urgent: number
  routine: number
  total: number
}

interface PartsData {
  orders: PartsOrder[]
  summary: PartsSummary
}

// Status code colors and styling
const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  FMC: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  PMC: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  NMCM: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  NMCS: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
  CNDM: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' },
}

// Get PMI color class based on days until due
function getPMIColorClass(daysUntilDue: number): { bg: string; text: string; border: string; dot: string } {
  if (daysUntilDue < 0) {
    // Overdue - red
    return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400', dot: 'bg-red-600' }
  }
  if (daysUntilDue <= 7) {
    // Red - within 7 days
    return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400', dot: 'bg-red-600' }
  }
  if (daysUntilDue <= 30) {
    // Yellow - 8-30 days
    return { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-400', dot: 'bg-yellow-500' }
  }
  // Green - after 30 days
  return { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-400', dot: 'bg-green-600' }
}

// Format due date display
function formatDueDate(daysUntilDue: number): string {
  if (daysUntilDue < 0) {
    return `${Math.abs(daysUntilDue)} days overdue`
  }
  if (daysUntilDue === 0) {
    return 'Due today'
  }
  if (daysUntilDue === 1) {
    return 'Due tomorrow'
  }
  return `Due in ${daysUntilDue} days`
}

// Priority colors for maintenance events
function getPriorityColorClass(priority: MaintenanceEvent['priority']): { bg: string; text: string; border: string; dot: string } {
  switch (priority) {
    case 'Critical':
      return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400', dot: 'bg-red-600' }
    case 'Urgent':
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-400', dot: 'bg-orange-500' }
    case 'Routine':
    default:
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-400', dot: 'bg-blue-500' }
  }
}

// Calculate days since job start
function formatDaysSinceStart(startDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  start.setHours(0, 0, 0, 0)
  const diffTime = today.getTime() - start.getTime()
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Started today'
  if (days === 1) return '1 day open'
  return `${days} days open`
}

// Priority colors for parts orders
function getPartsPriorityColorClass(priority: PartsOrder['priority']): { bg: string; text: string; border: string; dot: string } {
  switch (priority) {
    case 'critical':
      return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-400', dot: 'bg-red-600' }
    case 'urgent':
      return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-400', dot: 'bg-orange-500' }
    case 'routine':
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-400', dot: 'bg-gray-500' }
  }
}

// Get status label for parts order
function getPartsStatusLabel(status: PartsOrder['status']): { label: string; color: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'text-yellow-600' }
    case 'acknowledged':
      return { label: 'Acknowledged', color: 'text-blue-600' }
    default:
      return { label: status, color: 'text-gray-600' }
  }
}

// Format order date for display
function formatOrderDate(dateString: string): string {
  const orderDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  orderDate.setHours(0, 0, 0, 0)
  const diffTime = today.getTime() - orderDate.getTime()
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, currentProgramId, token } = useAuthStore()
  const [assetStatus, setAssetStatus] = useState<AssetStatusData | null>(null)
  const [pmiData, setPmiData] = useState<PMIData | null>(null)
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pmiLoading, setPmiLoading] = useState(true)
  const [maintenanceLoading, setMaintenanceLoading] = useState(true)
  const [partsData, setPartsData] = useState<PartsData | null>(null)
  const [partsLoading, setPartsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pmiError, setPmiError] = useState<string | null>(null)
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null)
  const [partsError, setPartsError] = useState<string | null>(null)

  // Fetch asset status
  useEffect(() => {
    const fetchAssetStatus = async () => {
      if (!token) return

      setLoading(true)
      setError(null)

      try {
        const url = currentProgramId
          ? `http://localhost:3001/api/dashboard/asset-status?program_id=${currentProgramId}`
          : 'http://localhost:3001/api/dashboard/asset-status'

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch asset status')
        }

        const data = await response.json()
        setAssetStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAssetStatus()
  }, [token, currentProgramId])

  // Fetch PMI data
  useEffect(() => {
    const fetchPMIData = async () => {
      if (!token) return

      setPmiLoading(true)
      setPmiError(null)

      try {
        const url = currentProgramId
          ? `http://localhost:3001/api/pmi/due-soon?program_id=${currentProgramId}`
          : 'http://localhost:3001/api/pmi/due-soon'

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch PMI data')
        }

        const data = await response.json()
        setPmiData(data)
      } catch (err) {
        setPmiError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setPmiLoading(false)
      }
    }

    fetchPMIData()
  }, [token, currentProgramId])

  // Fetch maintenance jobs data
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      if (!token) return

      setMaintenanceLoading(true)
      setMaintenanceError(null)

      try {
        const url = currentProgramId
          ? `http://localhost:3001/api/dashboard/open-maintenance-jobs?program_id=${currentProgramId}`
          : 'http://localhost:3001/api/dashboard/open-maintenance-jobs'

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch maintenance data')
        }

        const data = await response.json()
        setMaintenanceData(data)
      } catch (err) {
        setMaintenanceError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setMaintenanceLoading(false)
      }
    }

    fetchMaintenanceData()
  }, [token, currentProgramId])

  // Fetch parts awaiting action data
  useEffect(() => {
    const fetchPartsData = async () => {
      if (!token) return

      setPartsLoading(true)
      setPartsError(null)

      try {
        const url = currentProgramId
          ? `http://localhost:3001/api/dashboard/parts-awaiting-action?program_id=${currentProgramId}`
          : 'http://localhost:3001/api/dashboard/parts-awaiting-action'

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch parts data')
        }

        const data = await response.json()
        setPartsData(data)
      } catch (err) {
        setPartsError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setPartsLoading(false)
      }
    }

    fetchPartsData()
  }, [token, currentProgramId])

  // Handle PMI item click
  const handlePMIClick = (pmiId: number) => {
    navigate(`/pmi/${pmiId}`)
  }

  // Handle maintenance event click
  const handleMaintenanceClick = (eventId: number) => {
    navigate(`/maintenance/${eventId}`)
  }

  // Handle parts order click
  const handlePartsOrderClick = (orderId: number) => {
    navigate(`/parts-orders/${orderId}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Welcome, {user?.first_name} {user?.last_name}
        </h2>
        <p className="text-gray-600">
          You are logged in as <span className="font-medium">{user?.role?.replace('_', ' ')}</span>
        </p>
        {currentProgramId && (
          <p className="text-gray-600 mt-2">
            Current Program: <span className="font-medium">{user?.programs?.find(p => p.pgm_id === currentProgramId)?.pgm_name || 'Unknown'}</span>
          </p>
        )}
      </div>

      {/* Dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* Asset Status Summary Widget */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Asset Status Summary</h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 py-4">{error}</div>
          ) : assetStatus ? (
            <div>
              {/* Mission Capability Rate */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Total Assets</p>
                  <p className="text-2xl font-bold text-gray-900">{assetStatus.total_assets}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Mission Capability Rate</p>
                  <p className={`text-2xl font-bold ${assetStatus.mission_capability_rate >= 80 ? 'text-green-600' : assetStatus.mission_capability_rate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {assetStatus.mission_capability_rate}%
                  </p>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-5 gap-2">
                {assetStatus.status_summary.map((status) => {
                  const colors = statusColors[status.status_cd] || statusColors.CNDM
                  return (
                    <div
                      key={status.status_cd}
                      className={`${colors.bg} ${colors.text} rounded-lg p-3 text-center border-l-4 ${colors.border}`}
                      title={status.description}
                    >
                      <p className="text-xs font-medium opacity-75">{status.status_cd}</p>
                      <p className="text-2xl font-bold">{status.count}</p>
                      <p className="text-xs truncate" title={status.status_name}>
                        {status.status_name.split(' ').slice(0, 2).join(' ')}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Program indicator */}
              <p className="text-xs text-gray-400 mt-4 text-right">
                Data for program: {assetStatus.program_cd}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 py-4">No data available</p>
          )}
        </div>

        {/* PMI Due Soon Widget */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">PMI Due Soon</h3>
            {pmiData && (
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                  <span className="text-gray-600">{pmiData.summary.overdue + pmiData.summary.red}</span>
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                  <span className="text-gray-600">{pmiData.summary.yellow}</span>
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span>
                  <span className="text-gray-600">{pmiData.summary.green}</span>
                </span>
              </div>
            )}
          </div>

          {pmiLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : pmiError ? (
            <div className="text-red-600 py-4">{pmiError}</div>
          ) : pmiData && pmiData.pmi.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {pmiData.pmi.map((pmi) => {
                const colors = getPMIColorClass(pmi.days_until_due)
                return (
                  <button
                    key={pmi.pmi_id}
                    onClick={() => handlePMIClick(pmi.pmi_id)}
                    className={`w-full text-left ${colors.bg} ${colors.text} rounded-lg p-3 border-l-4 ${colors.border} hover:opacity-80 transition-opacity cursor-pointer`}
                    aria-label={`View PMI details for ${pmi.asset_name}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`}></span>
                          <p className="text-sm font-medium truncate">{pmi.asset_name}</p>
                        </div>
                        <p className="text-xs mt-1 opacity-75 truncate">{pmi.pmi_type}</p>
                        <p className="text-xs mt-1 font-mono opacity-60">{pmi.asset_sn}</p>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-xs font-semibold">{formatDueDate(pmi.days_until_due)}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {new Date(pmi.next_due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No PMI items due soon</p>
              <p className="text-xs text-gray-300 mt-1">All inspections are on schedule</p>
            </div>
          )}

          {/* Color Legend */}
          {pmiData && pmiData.pmi.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                  Due in 7 days or less
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                  Due in 8-30 days
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-600 mr-1"></span>
                  Due after 30 days
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Open Maintenance Jobs Widget */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Open Maintenance Jobs</h3>
            {maintenanceData && (
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                  <span className="text-gray-600">{maintenanceData.summary.critical}</span>
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                  <span className="text-gray-600">{maintenanceData.summary.urgent}</span>
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                  <span className="text-gray-600">{maintenanceData.summary.routine}</span>
                </span>
              </div>
            )}
          </div>

          {maintenanceLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : maintenanceError ? (
            <div className="text-red-600 py-4">{maintenanceError}</div>
          ) : maintenanceData && maintenanceData.events.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {maintenanceData.events.map((event) => {
                const colors = getPriorityColorClass(event.priority)
                return (
                  <button
                    key={event.event_id}
                    onClick={() => handleMaintenanceClick(event.event_id)}
                    className={`w-full text-left ${colors.bg} ${colors.text} rounded-lg p-3 border-l-4 ${colors.border} hover:opacity-80 transition-opacity cursor-pointer`}
                    aria-label={`View maintenance job ${event.job_no}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`}></span>
                          <p className="text-sm font-medium truncate">{event.asset_name}</p>
                        </div>
                        <p className="text-xs mt-1 opacity-75 truncate">{event.discrepancy}</p>
                        <p className="text-xs mt-1 font-mono opacity-60">{event.job_no}</p>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className="text-xs font-semibold">{event.priority}</p>
                        <p className="text-xs opacity-60 mt-1">{formatDaysSinceStart(event.start_job)}</p>
                        <p className="text-xs opacity-50 mt-1">{event.event_type}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No open maintenance jobs</p>
              <p className="text-xs text-gray-300 mt-1">All jobs are closed</p>
            </div>
          )}

          {/* Total count and legend */}
          {maintenanceData && maintenanceData.events.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                    Critical
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                    Urgent
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                    Routine
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Total: {maintenanceData.summary.total}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Parts Awaiting Action Widget */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Parts Awaiting Action</h3>
            {partsData && (
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                  <span className="text-gray-600">{partsData.summary.pending} pending</span>
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                  <span className="text-gray-600">{partsData.summary.acknowledged} ack</span>
                </span>
              </div>
            )}
          </div>

          {partsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : partsError ? (
            <div className="text-red-600 py-4">{partsError}</div>
          ) : partsData && partsData.orders.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {partsData.orders.map((order) => {
                const colors = getPartsPriorityColorClass(order.priority)
                const statusInfo = getPartsStatusLabel(order.status)
                return (
                  <button
                    key={order.order_id}
                    onClick={() => handlePartsOrderClick(order.order_id)}
                    className={`w-full text-left ${colors.bg} ${colors.text} rounded-lg p-3 border-l-4 ${colors.border} hover:opacity-80 transition-opacity cursor-pointer`}
                    aria-label={`View parts order for ${order.part_name}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`}></span>
                          <p className="text-sm font-medium truncate">{order.part_name}</p>
                        </div>
                        <p className="text-xs mt-1 opacity-75 truncate">
                          {order.asset_name ? `For: ${order.asset_name}` : 'Stock replenishment'}
                        </p>
                        <p className="text-xs mt-1 font-mono opacity-60">{order.part_no}</p>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <p className={`text-xs font-semibold ${statusInfo.color}`}>{statusInfo.label}</p>
                        <p className="text-xs opacity-60 mt-1">Qty: {order.qty_ordered}</p>
                        <p className="text-xs opacity-50 mt-1">{formatOrderDate(order.order_date)}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No parts awaiting action</p>
              <p className="text-xs text-gray-300 mt-1">All orders have been processed</p>
            </div>
          )}

          {/* Summary and legend */}
          {partsData && partsData.orders.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-600 mr-1"></span>
                    Critical ({partsData.summary.critical})
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                    Urgent ({partsData.summary.urgent})
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
                    Routine ({partsData.summary.routine})
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Total: {partsData.summary.total}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
