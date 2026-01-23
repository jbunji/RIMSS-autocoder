import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

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

interface PartsAwaitingActionBarChartProps {
  partsData: PartsData
}

// Group parts by urgency level and status
function groupPartsByUrgency(partsData: PartsData): { name: string; critical: number; urgent: number; routine: number; total: number }[] {
  // Group orders by status
  const statusGroups: Record<string, { critical: number; urgent: number; routine: number }> = {
    pending: { critical: 0, urgent: 0, routine: 0 },
    acknowledged: { critical: 0, urgent: 0, routine: 0 },
    shipped: { critical: 0, urgent: 0, routine: 0 },
  }

  partsData.orders.forEach((order) => {
    const status = order.status
    if (statusGroups[status]) {
      statusGroups[status][order.priority]++
    }
  })

  // Convert to array format for Recharts
  return Object.entries(statusGroups)
    .filter(([_, counts]) => counts.critical + counts.urgent + counts.routine > 0)
    .map(([status, counts]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      critical: counts.critical,
      urgent: counts.urgent,
      routine: counts.routine,
      total: counts.critical + counts.urgent + counts.routine,
    }))
}

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>
  label?: string
}) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
            </div>
            <span className="font-medium text-gray-900">{entry.value}</span>
          </div>
        ))}
        <div className="border-t border-gray-200 mt-2 pt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total:</span>
          <span className="text-sm font-bold text-gray-900">
            {payload.reduce((sum, p) => sum + p.value, 0)}
          </span>
        </div>
      </div>
    )
  }
  return null
}

// Custom legend component
const CustomLegend = ({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>
}) => {
  if (!payload) return null

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-2">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center space-x-2">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Color definitions for urgency levels
const URGENCY_COLORS = {
  critical: '#dc2626', // red-600
  urgent: '#f97316',   // orange-500
  routine: '#6b7280',  // gray-500
}

export default function PartsAwaitingActionBarChart({ partsData }: PartsAwaitingActionBarChartProps) {
  const chartData = groupPartsByUrgency(partsData)

  // If no data, show empty state
  if (chartData.length === 0 || partsData.summary.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <svg
          className="w-16 h-16 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
        <p className="text-sm">No parts awaiting action</p>
      </div>
    )
  }

  // Calculate max value for Y-axis scaling
  const maxValue = Math.max(...chartData.map((d) => d.total))
  const yAxisMax = Math.ceil(maxValue * 1.2) || 5 // Add 20% padding or default to 5

  return (
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-red-50 rounded-lg p-2 text-center">
          <p className="text-xs text-red-600 font-medium">Critical</p>
          <p className="text-lg font-bold text-red-800">{partsData.summary.critical}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-2 text-center">
          <p className="text-xs text-orange-600 font-medium">Urgent</p>
          <p className="text-lg font-bold text-orange-800">{partsData.summary.urgent}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600 font-medium">Routine</p>
          <p className="text-lg font-bold text-gray-800">{partsData.summary.routine}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-xs text-blue-600 font-medium">Total</p>
          <p className="text-lg font-bold text-blue-800">{partsData.summary.total}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              domain={[0, yAxisMax]}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={{ stroke: '#d1d5db' }}
              allowDecimals={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="critical" name="Critical" stackId="urgency" fill={URGENCY_COLORS.critical} radius={[0, 0, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-critical-${index}`} fill={URGENCY_COLORS.critical} />
              ))}
            </Bar>
            <Bar dataKey="urgent" name="Urgent" stackId="urgency" fill={URGENCY_COLORS.urgent} radius={[0, 0, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-urgent-${index}`} fill={URGENCY_COLORS.urgent} />
              ))}
            </Bar>
            <Bar dataKey="routine" name="Routine" stackId="urgency" fill={URGENCY_COLORS.routine} radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-routine-${index}`} fill={URGENCY_COLORS.routine} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded bg-red-600 mr-1"></span>
            Critical priority
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded bg-orange-500 mr-1"></span>
            Urgent priority
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded bg-gray-500 mr-1"></span>
            Routine priority
          </span>
        </div>
      </div>
    </div>
  )
}
