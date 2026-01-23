import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface TrendDataPoint {
  date: string
  created: number
  completed: number
  inProgress: number
}

interface TrendsSummary {
  totalCreated: number
  totalCompleted: number
  currentInProgress: number
  avgPerDay: number
  days: number
}

interface MaintenanceTrendsChartProps {
  trends: TrendDataPoint[]
  summary: TrendsSummary
}

// Format date for X-axis (show month/day)
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">{entry.value}</span>
          </div>
        ))}
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

export default function MaintenanceTrendsChart({
  trends,
  summary,
}: MaintenanceTrendsChartProps) {
  // If no data, show empty state
  if (!trends || trends.length === 0) {
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
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
        <p className="text-sm">No maintenance trend data available</p>
      </div>
    )
  }

  // Calculate max value for Y-axis scaling
  const maxValue = Math.max(
    ...trends.map(d => Math.max(d.created, d.completed, d.inProgress))
  )
  const yAxisMax = Math.ceil(maxValue * 1.1) || 5 // Add 10% padding or default to 5

  // Determine appropriate tick interval based on data range
  const tickInterval = trends.length <= 10 ? 0 : Math.floor(trends.length / 7)

  return (
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-xs text-blue-600 font-medium">Created</p>
          <p className="text-lg font-bold text-blue-800">{summary.totalCreated}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <p className="text-xs text-green-600 font-medium">Completed</p>
          <p className="text-lg font-bold text-green-800">{summary.totalCompleted}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-2 text-center">
          <p className="text-xs text-orange-600 font-medium">In Progress</p>
          <p className="text-lg font-bold text-orange-800">{summary.currentInProgress}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-600 font-medium">Avg/Day</p>
          <p className="text-lg font-bold text-gray-800">{summary.avgPerDay}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trends}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              interval={tickInterval}
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
            <Line
              type="monotone"
              dataKey="created"
              name="Created"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3, fill: '#22c55e' }}
              activeDot={{ r: 5, fill: '#22c55e' }}
            />
            <Line
              type="monotone"
              dataKey="inProgress"
              name="In Progress"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f97316' }}
              activeDot={{ r: 5, fill: '#f97316' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Period indicator */}
      <p className="text-xs text-gray-400 mt-2 text-right">
        Last {summary.days} days
      </p>
    </div>
  )
}
