import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { handleError, UserFriendlyError } from '../utils/errorHandler'
import { ErrorDisplay } from '../components/ErrorDisplay'

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

// Recent Activity interfaces
interface ActivityLogEntry {
  activity_id: number
  timestamp: string
  user_id: number
  username: string
  user_full_name: string
  action_type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'status_change' | 'order' | 'complete'
  entity_type: 'asset' | 'maintenance' | 'pmi' | 'parts_order' | 'user' | 'session' | 'tcto'
  entity_id: number | null
  entity_name: string | null
  description: string
  pgm_id: number | null
}

interface ActivityData {
  activities: ActivityLogEntry[]
  total: number
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

// Format activity timestamp to relative time
function formatActivityTimestamp(timestamp: string): string {
  const activityDate = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - activityDate.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return activityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Get action type icon and color
function getActivityActionStyle(actionType: ActivityLogEntry['action_type']): { icon: string; bgColor: string; textColor: string } {
  switch (actionType) {
    case 'create':
      return { icon: '+', bgColor: 'bg-green-100', textColor: 'text-green-700' }
    case 'update':
      return { icon: '~', bgColor: 'bg-blue-100', textColor: 'text-blue-700' }
    case 'delete':
      return { icon: '×', bgColor: 'bg-red-100', textColor: 'text-red-700' }
    case 'login':
    case 'logout':
      return { icon: '→', bgColor: 'bg-gray-100', textColor: 'text-gray-700' }
    case 'status_change':
      return { icon: '↔', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' }
    case 'order':
      return { icon: '📦', bgColor: 'bg-purple-100', textColor: 'text-purple-700' }
    case 'complete':
      return { icon: '✓', bgColor: 'bg-green-100', textColor: 'text-green-700' }
    default:
      return { icon: '•', bgColor: 'bg-gray-100', textColor: 'text-gray-700' }
  }
}

// Auto-refresh interval in milliseconds (60 seconds)
const AUTO_REFRESH_INTERVAL = 60000

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
  const [activityData, setActivityData] = useState<ActivityData | null>(null)
  const [activityLoading, setActivityLoading] = useState(true)
  const [error, setError] = useState<UserFriendlyError | null>(null)
  const [pmiError, setPmiError] = useState<UserFriendlyError | null>(null)
  const [maintenanceError, setMaintenanceError] = useState<UserFriendlyError | null>(null)
  const [partsError, setPartsError] = useState<UserFriendlyError | null>(null)
  const [activityError, setActivityError] = useState<UserFriendlyError | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0) // Used to trigger re-fetches

  // Manual refresh function - triggers all data to refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true)
    setRefreshCount(prev => prev + 1)
  }

  // Auto-refresh interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshCount(prev => prev + 1)
    }, AUTO_REFRESH_INTERVAL)

    return () => clearInterval(intervalId)
  }, [])

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
        setError(handleError(err, 'loading asset status'))
      } finally {
        setLoading(false)
      }
    }

    fetchAssetStatus()
  }, [token, currentProgramId, refreshCount])

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
        setPmiError(handleError(err, 'loading PMI data'))
      } finally {
        setPmiLoading(false)
      }
    }

    fetchPMIData()
  }, [token, currentProgramId, refreshCount])

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
        setMaintenanceError(handleError(err, 'loading maintenance data'))
      } finally {
        setMaintenanceLoading(false)
      }
    }

    fetchMaintenanceData()
  }, [token, currentProgramId, refreshCount])

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
        setPartsError(handleError(err, 'loading parts data'))
      } finally {
        setPartsLoading(false)
      }
    }

    fetchPartsData()
  }, [token, currentProgramId, refreshCount])

  // Fetch recent activity data
  useEffect(() => {
    const fetchActivityData = async () => {
      if (!token) return

      setActivityLoading(true)
      setActivityError(null)

      try {
        const response = await fetch('http://localhost:3001/api/dashboard/recent-activity?limit=10', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch activity data')
        }

        const data = await response.json()
        setActivityData(data)
      } catch (err) {
        setActivityError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setActivityLoading(false)
      }
    }

    fetchActivityData()
  }, [token, refreshCount])

  // Track when all data has finished loading to update lastUpdated and clear refreshing state
  useEffect(() => {
    const allLoaded = !loading && !pmiLoading && !maintenanceLoading && !partsLoading && !activityLoading
    if (allLoaded) {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }
  }, [loading, pmiLoading, maintenanceLoading, partsLoading, activityLoading])

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

  // Format last updated time for display
  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return 'Never'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)

    if (diffSecs < 5) return 'Just now'
    if (diffSecs < 60) return `${diffSecs}s ago`
    if (diffMins < 60) return `${diffMins}m ago`
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Last updated timestamp */}
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {formatLastUpdated(lastUpdated)}
            </span>
          )}

          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Refresh dashboard data"
          >
            <svg
              className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

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

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        <button
          onClick={() => navigate('/assets')}
          className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-blue-200"
          aria-label="Navigate to Assets"
        >
          <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Assets</span>
        </button>

        <button
          onClick={() => navigate('/maintenance')}
          className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg hover:bg-orange-50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-orange-200"
          aria-label="Navigate to Maintenance"
        >
          <svg className="h-8 w-8 text-orange-600 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Maintenance</span>
        </button>

        <button
          onClick={() => navigate('/configurations')}
          className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg hover:bg-gray-50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-gray-200"
          aria-label="Navigate to Configurations"
        >
          <svg className="h-8 w-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Configurations</span>
        </button>

        <button
          onClick={() => navigate('/sorties')}
          className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg hover:bg-sky-50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-sky-200"
          aria-label="Navigate to Sorties"
        >
          <svg className="h-8 w-8 text-sky-600 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Sorties</span>
        </button>

        <button
          onClick={() => navigate('/spares')}
          className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg hover:bg-green-50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-green-200"
          aria-label="Navigate to Spares"
        >
          <svg className="h-8 w-8 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Spares</span>
        </button>

        <button
          onClick={() => navigate('/parts-ordered')}
          className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg hover:bg-purple-50 hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-purple-200"
          aria-label="Navigate to Parts Ordered"
        >
          <svg className="h-8 w-8 text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <span className="text-sm font-medium text-gray-900">Parts Ordered</span>
        </button>
      </div>

      {/* Dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Asset Status Summary Widget */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
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
              <div className="grid grid-cols-5 gap-1 md:gap-2">
                {assetStatus.status_summary.map((status) => {
                  const colors = statusColors[status.status_cd] || statusColors.CNDM
                  return (
                    <div
                      key={status.status_cd}
                      className={`${colors.bg} ${colors.text} rounded-lg p-2 md:p-3 text-center border-l-4 ${colors.border}`}
                      title={status.description}
                    >
                      <p className="text-xs font-medium opacity-75">{status.status_cd}</p>
                      <p className="text-lg md:text-2xl font-bold">{status.count}</p>
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
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
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
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
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
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
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

        {/* Recent Activity Feed Widget */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
            {activityData && (
              <span className="text-xs text-gray-400">
                {activityData.total} recent activities
              </span>
            )}
          </div>

          {activityLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activityError ? (
            <div className="text-red-600 py-4">{activityError}</div>
          ) : activityData && activityData.activities.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityData.activities.map((activity) => {
                const actionStyle = getActivityActionStyle(activity.action_type)
                return (
                  <div
                    key={activity.activity_id}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Action icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${actionStyle.bgColor} ${actionStyle.textColor} flex items-center justify-center text-sm font-bold`}>
                      {actionStyle.icon}
                    </div>

                    {/* Activity content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-tight">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500 font-medium">
                          {activity.user_full_name}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-400">
                          {formatActivityTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity</p>
              <p className="text-xs text-gray-300 mt-1">Activity will appear here as actions are performed</p>
            </div>
          )}

          {/* Legend */}
          {activityData && activityData.activities.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs mr-1">+</span>
                  Created
                </span>
                <span className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs mr-1">~</span>
                  Updated
                </span>
                <span className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs mr-1">↔</span>
                  Status
                </span>
                <span className="flex items-center">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs mr-1">✓</span>
                  Completed
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
