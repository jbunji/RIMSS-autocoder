import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface StatusItem {
  status_cd: string
  status_name: string
  description: string
  count: number
}

interface AssetStatusPieChartProps {
  statusSummary: StatusItem[]
  totalAssets: number
}

// Group status codes into FMC, PMC, and NMC categories
function groupByCapability(statusSummary: StatusItem[]): { name: string; value: number; color: string; description: string }[] {
  const groups = {
    FMC: { name: 'FMC', value: 0, color: '#22c55e', description: 'Fully Mission Capable' }, // green-500
    PMC: { name: 'PMC', value: 0, color: '#f59e0b', description: 'Partially Mission Capable' }, // amber-500
    NMC: { name: 'NMC', value: 0, color: '#ef4444', description: 'Non-Mission Capable' }, // red-500
  }

  statusSummary.forEach((status) => {
    const code = status.status_cd.toUpperCase()
    if (code === 'FMC') {
      groups.FMC.value += status.count
    } else if (code.startsWith('PMC')) {
      // PMC, PMCM, PMCS, PMCB
      groups.PMC.value += status.count
    } else if (code.startsWith('NMC')) {
      // NMCM, NMCS, NMCB
      groups.NMC.value += status.count
    }
  })

  // Only return categories with values
  return Object.values(groups).filter((g) => g.value > 0)
}

// Custom label renderer for pie slices
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  name: string
}) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Only show label if segment is large enough (> 5%)
  if (percent < 0.05) return null

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
      style={{ fontSize: '12px', fontWeight: 600 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { name: string; value: number; color: string; description: string } }>
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200">
        <div className="flex items-center space-x-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-gray-900">{data.name}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{data.description}</p>
        <p className="text-lg font-bold text-gray-900 mt-1">
          {data.value} asset{data.value !== 1 ? 's' : ''}
        </p>
      </div>
    )
  }
  return null
}

// Custom legend
const CustomLegend = ({
  payload,
}: {
  payload?: Array<{ value: string; color: string; payload: { description: string; value: number } }>
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
          <span className="text-sm text-gray-700 font-medium">{entry.value}</span>
          <span className="text-sm text-gray-500">({entry.payload.value})</span>
        </div>
      ))}
    </div>
  )
}

export default function AssetStatusPieChart({ statusSummary, totalAssets }: AssetStatusPieChartProps) {
  const chartData = groupByCapability(statusSummary)

  // If no data, show empty state
  if (chartData.length === 0 || totalAssets === 0) {
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
            d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
          />
        </svg>
        <p className="text-sm">No asset data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={40}
            dataKey="value"
            nameKey="name"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
