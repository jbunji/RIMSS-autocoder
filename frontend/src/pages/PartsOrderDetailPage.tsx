import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

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

export default function PartsOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuthStore()
  const [order, setOrder] = useState<PartsOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAcknowledgeDialog, setShowAcknowledgeDialog] = useState(false)
  const [acknowledging, setAcknowledging] = useState(false)

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

  const canAcknowledge = user && (user.role === 'depot_manager' || user.role === 'admin') && order?.status === 'pending'

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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityBadge.bg} ${priorityBadge.text}`}>
              {priorityBadge.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>
      </div>

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
            {order.shipping_tracking ? (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Tracking Number</dt>
                <dd className="text-sm font-medium text-blue-600 font-mono">{order.shipping_tracking}</dd>
              </div>
            ) : (
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Tracking Number</dt>
                <dd className="text-sm text-gray-400 italic">Not yet shipped</dd>
              </div>
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
    </div>
  )
}
