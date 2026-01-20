import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { CheckCircleIcon, TruckIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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
  program_cd: string
  program_name: string
  notes: string
  shipping_tracking: string | null
  estimated_delivery: string | null
  acknowledged_date: string | null
  acknowledged_by: number | null
  acknowledged_by_name: string | null
  filled_date: string | null
  filled_by: number | null
  filled_by_name: string | null
  replacement_asset_id: number | null
  replacement_serno: string | null
  shipper: string | null
  ship_date: string | null
  received_date: string | null
  received_by: number | null
  received_by_name: string | null
  pqdr: boolean
}

interface Spare {
  asset_id: number
  serno: string
  partno: string
  part_name: string
  pgm_id: number
  status_cd: string
  status_name: string
  location: string
  loc_type: 'depot' | 'field'
  admin_loc: string
  cust_loc: string
  uii: string | null
}

interface HistoryEntry {
  history_id: number
  order_id: number
  timestamp: string
  user_id: number
  username: string
  user_full_name: string
  action_type: 'create' | 'request' | 'acknowledge' | 'fill' | 'deliver' | 'cancel' | 'pqdr_flag'
  status: string
  description: string
  metadata?: Record<string, any>
}

// Status badge styling
function getStatusBadge(status: PartsOrder['status']): { bg: string; text: string; label: string } {
  switch (status) {
    case 'pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' }
    case 'acknowledged':
      return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Acknowledged' }
    case 'shipped':
      return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shipped' }
    case 'received':
      return { bg: 'bg-green-100', text: 'text-green-800', label: 'Received' }
    case 'cancelled':
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' }
  }
}

// Priority badge styling
function getPriorityBadge(priority: PartsOrder['priority']): { bg: string; text: string; label: string } {
  switch (priority) {
    case 'critical':
      return { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' }
    case 'urgent':
      return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Urgent' }
    case 'routine':
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Routine' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' }
  }
}

// Get tracking URL for carrier websites
function getTrackingUrl(trackingNumber: string): { url: string; carrier: string } | null {
  if (!trackingNumber) return null

  const upperTracking = trackingNumber.toUpperCase()

  // FedEx patterns: FDX-, 1234-5678-9012, starts with 96/61/02
  if (upperTracking.includes('FDX') || upperTracking.includes('FEDEX')) {
    // Extract just the tracking number (remove prefix like "FDX-2024-")
    const trackingNum = trackingNumber.replace(/^(FDX|FEDEX)[-_]/i, '')
    return {
      url: `https://www.fedex.com/fedextrack/?trknbr=${trackingNum}`,
      carrier: 'FedEx'
    }
  }

  // UPS patterns: UPS-, 1Z, starts with tracking number
  if (upperTracking.includes('UPS') || upperTracking.startsWith('1Z')) {
    // Extract just the tracking number (remove prefix like "UPS-2024-")
    const trackingNum = trackingNumber.replace(/^UPS[-_]/i, '')
    return {
      url: `https://www.ups.com/track?tracknum=${trackingNum}`,
      carrier: 'UPS'
    }
  }

  // DHL patterns: DHL-, starts with 10-digit number
  if (upperTracking.includes('DHL') || /^\d{10,}$/.test(trackingNumber)) {
    // Extract just the tracking number (remove prefix like "DHL-")
    const trackingNum = trackingNumber.replace(/^DHL[-_]/i, '')
    return {
      url: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNum}&brand=DHL`,
      carrier: 'DHL'
    }
  }

  // Default: try FedEx if no pattern matches
  return {
    url: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    carrier: 'Unknown'
  }
}

export default function PartsOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const [order, setOrder] = useState<PartsOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false)
  const [acknowledging, setAcknowledging] = useState(false)
  const [showFillDialog, setShowFillDialog] = useState(false)
  const [filling, setFilling] = useState(false)
  const [searchingSpares, setSearchingSpares] = useState(false)
  const [spares, setSpares] = useState<Spare[]>([])
  const [selectedSpare, setSelectedSpare] = useState<Spare | null>(null)
  const [spareSearchQuery, setSpareSearchQuery] = useState('')
  const [shipper, setShipper] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [shipDate, setShipDate] = useState('')
  const [showReceiveDialog, setShowReceiveDialog] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token || !id) return

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:3001/api/parts-orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Parts order not found')
          }
          if (response.status === 403) {
            throw new Error('Access denied to this parts order')
          }
          throw new Error('Failed to fetch parts order details')
        }

        const data = await response.json()
        setOrder(data.order)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [token, id])

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token || !id || activeTab !== 'history') return

      setLoadingHistory(true)

      try {
        const response = await fetch(`http://localhost:3001/api/parts-orders/${id}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch order history')
        }

        const data = await response.json()
        setHistory(data.history || [])
      } catch (err) {
        console.error('History fetch error:', err)
        setHistory([])
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [token, id, activeTab])

  const handleAcknowledge = async () => {
    if (!token || !id) return

    setAcknowledging(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/parts-orders/${id}/acknowledge`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to acknowledge order')
      }

      const data = await response.json()
      setOrder(data.order)
      setShowAcknowledgeDialog(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setAcknowledging(false)
    }
  }

  const searchSpares = async (query: string) => {
    if (!token) return

    setSearchingSpares(true)

    try {
      const params = new URLSearchParams({ search: query })
      const response = await fetch(`http://localhost:3001/api/spares?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to search spares')
      }

      const data = await response.json()
      setSpares(data.spares || [])
    } catch (err) {
      console.error('Spare search error:', err)
      setSpares([])
    } finally {
      setSearchingSpares(false)
    }
  }

  const handleFill = async () => {
    if (!token || !id || !selectedSpare || !shipper || !trackingNumber || !shipDate) {
      setError('Please complete all required fields')
      return
    }

    setFilling(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/parts-orders/${id}/fill`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          replacement_asset_id: selectedSpare.asset_id,
          replacement_serno: selectedSpare.serno,
          shipper,
          tracking_number: trackingNumber,
          ship_date: shipDate,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fill order')
      }

      const data = await response.json()
      setOrder(data.order)
      setShowFillDialog(false)
      // Reset form
      setSelectedSpare(null)
      setShipper('')
      setTrackingNumber('')
      setShipDate('')
      setSpareSearchQuery('')
      setSpares([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setFilling(false)
    }
  }

  const handleReceive = async () => {
    if (!token || !id) return

    setReceiving(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/parts-orders/${id}/deliver`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to receive order')
      }

      const data = await response.json()
      setOrder(data.order)
      setShowReceiveDialog(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setReceiving(false)
    }
  }

  const handleTogglePqdr = async () => {
    if (!token || !id || !order) return

    setError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/parts-orders/${id}/pqdr`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pqdr: !order.pqdr,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update PQDR flag')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const canAcknowledge = user && (user.role === 'DEPOT_MANAGER' || user.role === 'ADMIN') && order?.status === 'pending'
  const canFill = user && (user.role === 'DEPOT_MANAGER' || user.role === 'ADMIN') && order?.status === 'acknowledged'
  const canReceive = user && (user.role === 'FIELD_TECHNICIAN' || user.role === 'DEPOT_MANAGER' || user.role === 'ADMIN') && order?.status === 'shipped'
  const canTogglePqdr = user && (user.role === 'FIELD_TECHNICIAN' || user.role === 'DEPOT_MANAGER' || user.role === 'ADMIN')

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No order data available</p>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(order.status)
  const priorityBadge = getPriorityBadge(order.priority)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parts Order #{order.order_id}</h1>
            <p className="text-gray-600 mt-1">{order.part_name}</p>
          </div>
          <div className="flex items-center space-x-3">
            {canAcknowledge && (
              <button
                onClick={() => setShowAcknowledgeDialog(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Acknowledge
              </button>
            )}
            {canFill && (
              <button
                onClick={() => setShowFillDialog(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <TruckIcon className="h-5 w-5 mr-2" />
                Fill Order
              </button>
            )}
            {canReceive && (
              <button
                onClick={() => setShowReceiveDialog(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Receive
              </button>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityBadge.bg} ${priorityBadge.text}`}>
              {priorityBadge.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.label}
            </span>
            {order.pqdr && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                PQDR
              </span>
            )}
          </div>
        </div>
      </div>

      {/* PQDR Toggle */}
      {canTogglePqdr && (
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={order.pqdr}
              onChange={handleTogglePqdr}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <ExclamationTriangleIcon className="h-5 w-5 ml-2 mr-1 text-red-500" />
            <span className="text-sm font-medium text-gray-700">
              Flag for PQDR (Product Quality Deficiency Report)
            </span>
          </label>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History
          </button>
        </nav>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Part Information */}
          <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Part Information</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Part Number</dt>
              <dd className="text-sm font-medium text-gray-900 font-mono">{order.part_no}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Part Name</dt>
              <dd className="text-sm font-medium text-gray-900">{order.part_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">NSN</dt>
              <dd className="text-sm font-medium text-gray-900 font-mono">{order.nsn}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Unit Price</dt>
              <dd className="text-sm font-medium text-gray-900">${order.unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</dd>
            </div>
          </dl>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Order Date</dt>
              <dd className="text-sm font-medium text-gray-900">
                {new Date(order.order_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Quantity Ordered</dt>
              <dd className="text-sm font-medium text-gray-900">{order.qty_ordered}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Quantity Received</dt>
              <dd className="text-sm font-medium text-gray-900">{order.qty_received}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Total Value</dt>
              <dd className="text-sm font-bold text-gray-900">
                ${(order.unit_price * order.qty_ordered).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Program</dt>
              <dd className="text-sm font-medium text-gray-900">{order.program_cd}</dd>
            </div>
          </dl>
        </div>

        {/* Requestor & Assignment */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requestor & Assignment</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Requestor</dt>
              <dd className="text-sm font-medium text-gray-900">{order.requestor_name}</dd>
            </div>
            {order.asset_sn && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Asset S/N</dt>
                <dd className="text-sm font-medium text-gray-900 font-mono">{order.asset_sn}</dd>
              </div>
            )}
            {order.asset_name && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Asset Name</dt>
                <dd className="text-sm font-medium text-gray-900">{order.asset_name}</dd>
              </div>
            )}
            {order.job_no && (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Job Number</dt>
                <dd className="text-sm font-medium text-blue-600 font-mono">{order.job_no}</dd>
              </div>
            )}
            {!order.asset_sn && !order.job_no && (
              <div className="text-sm text-gray-400 italic">Not assigned to specific asset or job</div>
            )}
          </dl>
        </div>

        {/* Shipping Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Status</dt>
              <dd>
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                  {statusBadge.label}
                </span>
              </dd>
            </div>
            {order.acknowledged_date && (
              <>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Acknowledged Date</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(order.acknowledged_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                {order.acknowledged_by_name && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Acknowledged By</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.acknowledged_by_name}</dd>
                  </div>
                )}
              </>
            )}
            {order.filled_date && (
              <>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Filled Date</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(order.filled_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                {order.filled_by_name && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Filled By</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.filled_by_name}</dd>
                  </div>
                )}
                {order.replacement_serno && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Replacement S/N</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.replacement_serno}</dd>
                  </div>
                )}
                {order.shipper && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Shipper</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.shipper}</dd>
                  </div>
                )}
                {order.ship_date && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Ship Date</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Date(order.ship_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                )}
              </>
            )}
            {order.shipping_tracking ? (
              <div className="flex justify-between items-center">
                <dt className="text-sm text-gray-500">Tracking Number</dt>
                <dd className="text-sm font-medium font-mono">
                  {(() => {
                    const trackingInfo = getTrackingUrl(order.shipping_tracking)
                    if (trackingInfo) {
                      return (
                        <a
                          href={trackingInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                          title={`Track with ${trackingInfo.carrier}`}
                        >
                          {order.shipping_tracking}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )
                    }
                    return <span className="text-gray-900">{order.shipping_tracking}</span>
                  })()}
                </dd>
              </div>
            ) : (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Tracking Number</dt>
                <dd className="text-sm text-gray-400 italic">Not yet shipped</dd>
              </div>
            )}
            {order.received_date && (
              <>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Received Date</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Date(order.received_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                {order.received_by_name && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Received By</dt>
                    <dd className="text-sm font-medium text-gray-900">{order.received_by_name}</dd>
                  </div>
                )}
              </>
            )}
            {order.estimated_delivery ? (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Estimated Delivery</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(order.estimated_delivery).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
            ) : (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Estimated Delivery</dt>
                <dd className="text-sm text-gray-400 italic">Not available</dd>
              </div>
            )}
          </dl>
        </div>

          {/* Notes */}
          <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-700">{order.notes || 'No notes available.'}</p>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order History</h2>

          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No history entries available</p>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {history.map((entry, idx) => (
                  <li key={entry.history_id}>
                    <div className="relative pb-8">
                      {idx !== history.length - 1 && (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <div className="relative px-1">
                            <div className="h-8 w-8 bg-blue-500 rounded-full ring-8 ring-white flex items-center justify-center">
                              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">{entry.user_full_name}</span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {new Date(entry.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{entry.description}</p>
                            {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                              <div className="mt-2 bg-gray-50 rounded p-2 text-xs">
                                {Object.entries(entry.metadata).map(([key, value]) => (
                                  <div key={key} className="flex justify-between py-1">
                                    <span className="font-medium text-gray-600">{key.replace(/_/g, ' ')}:</span>
                                    <span className="text-gray-900">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Acknowledge Confirmation Dialog */}
      {showAcknowledgeDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Acknowledge Parts Order</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to acknowledge this parts order? This will change the status to "Acknowledged" and indicates that you have received the request and will begin processing it.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAcknowledgeDialog(false)}
                  disabled={acknowledging}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcknowledge}
                  disabled={acknowledging}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {acknowledging ? 'Acknowledging...' : 'Confirm Acknowledgment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fill Order Dialog */}
      {showFillDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <TruckIcon className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Fill Parts Order</h3>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Spare Parts Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Replacement Spare <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={spareSearchQuery}
                      onChange={(e) => setSpareSearchQuery(e.target.value)}
                      placeholder="Search by serial number or part number..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => searchSpares(spareSearchQuery)}
                      disabled={searchingSpares || !spareSearchQuery}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                      {searchingSpares ? 'Searching...' : 'Search'}
                    </button>
                  </div>

                  {/* Selected Spare */}
                  {selectedSpare && (
                    <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{selectedSpare.part_name}</p>
                          <p className="text-sm text-gray-600">S/N: {selectedSpare.serno} | P/N: {selectedSpare.partno}</p>
                          <p className="text-sm text-gray-600">Location: {selectedSpare.location} ({selectedSpare.loc_type})</p>
                          <p className="text-sm text-gray-600">Status: {selectedSpare.status_cd}</p>
                        </div>
                        <button
                          onClick={() => setSelectedSpare(null)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Spare Search Results */}
                  {spares.length > 0 && !selectedSpare && (
                    <div className="mt-2 border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                      {spares.map((spare) => (
                        <button
                          key={spare.asset_id}
                          onClick={() => {
                            setSelectedSpare(spare)
                            setSpares([])
                            setSpareSearchQuery('')
                          }}
                          className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0 transition-colors"
                        >
                          <p className="font-medium text-gray-900">{spare.part_name}</p>
                          <p className="text-sm text-gray-600">S/N: {spare.serno} | P/N: {spare.partno}</p>
                          <p className="text-sm text-gray-600">Location: {spare.location} | Status: {spare.status_cd}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shipper Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipper <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={shipper}
                    onChange={(e) => setShipper(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select shipper...</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="DHL">DHL</option>
                    <option value="GOV">Government (GOV)</option>
                  </select>
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Ship Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ship Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={shipDate}
                    onChange={(e) => setShipDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowFillDialog(false)
                    setSelectedSpare(null)
                    setShipper('')
                    setTrackingNumber('')
                    setShipDate('')
                    setSpareSearchQuery('')
                    setSpares([])
                    setError(null)
                  }}
                  disabled={filling}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFill}
                  disabled={filling || !selectedSpare || !shipper || !trackingNumber || !shipDate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {filling ? 'Processing...' : 'Confirm Fill Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Confirmation Dialog */}
      {showReceiveDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Receive Parts Order</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to mark this order as received? This confirms that you have physically received the parts and the order is complete.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReceiveDialog(false)}
                  disabled={receiving}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReceive}
                  disabled={receiving}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {receiving ? 'Processing...' : 'Confirm Receipt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
