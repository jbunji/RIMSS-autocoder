import { useMemo } from 'react'

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

interface PMIData {
  pmi: PMIRecord[]
  summary: {
    overdue: number
    red: number
    yellow: number
    green: number
    total: number
  }
}

interface PMICalendarHeatMapProps {
  pmiData: PMIData
}

// Get color intensity based on PMI count
function getColorIntensity(count: number): string {
  if (count === 0) return 'bg-gray-100'
  if (count <= 2) return 'bg-yellow-200' // Light yellow
  if (count <= 5) return 'bg-orange-300' // Medium orange
  if (count <= 10) return 'bg-orange-400' // Darker orange
  return 'bg-red-500' // Heavy load - red
}

// Get PMI count for a specific date
function getPMICountForDate(pmiData: PMIData, date: Date): number {
  const dateStr = date.toISOString().split('T')[0]
  return pmiData.pmi.filter(pmi => {
    const pmiDate = new Date(pmi.next_due_date)
    const pmiDateStr = pmiDate.toISOString().split('T')[0]
    return pmiDateStr === dateStr && !pmi.completed_date
  }).length
}

// Get PMI records for a specific date (for tooltip)
function getPMIsForDate(pmiData: PMIData, date: Date): PMIRecord[] {
  const dateStr = date.toISOString().split('T')[0]
  return pmiData.pmi.filter(pmi => {
    const pmiDate = new Date(pmi.next_due_date)
    const pmiDateStr = pmiDate.toISOString().split('T')[0]
    return pmiDateStr === dateStr && !pmi.completed_date
  })
}

export default function PMICalendarHeatMap({ pmiData }: PMICalendarHeatMapProps) {
  // Generate calendar data for the next 90 days
  const calendarData = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weeks: Array<{ date: Date; count: number; intensity: string; pmiRecords: PMIRecord[] }>[] = []
    const currentWeek: Array<{ date: Date; count: number; intensity: string; pmiRecords: PMIRecord[] }> = []

    // Start from the beginning of the current week (Sunday)
    const startOfWeek = new Date(today)
    const dayOfWeek = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)

    // Add days from start of week to today (past days)
    for (let i = 0; i < dayOfWeek; i++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + i)
      const count = getPMICountForDate(pmiData, date)
      currentWeek.push({
        date,
        count,
        intensity: getColorIntensity(count),
        pmiRecords: getPMIsForDate(pmiData, date),
      })
    }

    // Add today and future days (90 days total)
    const totalDays = 90
    for (let day = dayOfWeek; day < totalDays; day++) {
      const date = new Date(startOfWeek)
      date.setDate(date.getDate() + day)

      const count = getPMICountForDate(pmiData, date)
      const dayData = {
        date,
        count,
        intensity: getColorIntensity(count),
        pmiRecords: getPMIsForDate(pmiData, date),
      }

      currentWeek.push(dayData)

      // When we complete a week (Sunday), start a new week
      if (date.getDay() === 6 && currentWeek.length === 7) {
        weeks.push([...currentWeek])
        currentWeek.length = 0
      }
    }

    // Add remaining days in the last week
    if (currentWeek.length > 0) {
      weeks.push([...currentWeek])
    }

    return weeks
  }, [pmiData])

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const totalPMIs = pmiData.pmi.filter(p => !p.completed_date).length
    const maxCount = Math.max(...calendarData.flat().map(d => d.count))
    const avgCount = totalPMIs / 90

    return { totalPMIs, maxCount, avgCount }
  }, [pmiData, calendarData])

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatDayOfWeek = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate.getTime() === today.getTime()
  }

  // Check if date is in the past
  const isPast = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate.getTime() < today.getTime()
  }

  return (
    <div className="w-full">
      {/* Statistics summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-50 rounded-lg p-2 text-center">
          <p className="text-xs text-red-600 font-medium">Peak Load</p>
          <p className="text-lg font-bold text-red-800">{stats.maxCount} PMIs</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-xs text-blue-600 font-medium">Avg/Day</p>
          <p className="text-lg font-bold text-blue-800">{stats.avgCount.toFixed(1)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <p className="text-xs text-green-600 font-medium">Total</p>
          <p className="text-lg font-bold text-green-800">{stats.totalPMIs}</p>
        </div>
      </div>

      {/* Calendar Heat Map */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-xs font-medium text-gray-500 w-16">Week</th>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <th key={day} className="p-1 text-xs font-medium text-gray-500 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarData.map((week, weekIndex) => (
              <tr key={`week-${weekIndex}`}>
                <td className="p-1 text-xs text-gray-400 font-mono">
                  W{weekIndex + 1}
                </td>
                {week.map((dayData, dayIndex) => {
                  const date = dayData.date
                  const past = isPast(date)
                  const today = isToday(date)

                  return (
                    <td key={dayIndex} className="p-1">
                      <div
                        className={`
                          relative aspect-square rounded cursor-pointer
                          ${dayData.intensity}
                          ${past ? 'opacity-40' : ''}
                          ${today ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                          hover:opacity-80 transition-opacity
                          group
                        `}
                        title={`${formatDate(date)}: ${dayData.count} PMIs due`}
                      >
                        {dayData.count > 0 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800">
                            {dayData.count}
                          </span>
                        )}

                        {/* Tooltip */}
                        {dayData.count > 0 && (
                          <div className="absolute z-10 hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white shadow-lg rounded-lg p-2 border border-gray-200">
                            <p className="font-semibold text-gray-900 text-xs mb-1">
                              {formatDate(date)}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              {dayData.count} PMI{dayData.count !== 1 ? 's' : ''} due
                            </p>
                            <div className="max-h-24 overflow-y-auto">
                              {dayData.pmiRecords.slice(0, 5).map(pmi => (
                                <div key={pmi.pmi_id} className="text-xs text-gray-700 truncate">
                                  • {pmi.asset_name}
                                </div>
                              ))}
                              {dayData.pmiRecords.length > 5 && (
                                <p className="text-xs text-gray-500 italic">
                                  +{dayData.pmiRecords.length - 5} more...
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color Legend */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">PMI Count (Heat Map Scale):</p>
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-gray-100 mr-1"></div>
            <span className="text-xs text-gray-600">0</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-yellow-200 mr-1"></div>
            <span className="text-xs text-gray-600">1-2</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-orange-300 mr-1"></div>
            <span className="text-xs text-gray-600">3-5</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-orange-400 mr-1"></div>
            <span className="text-xs text-gray-600">6-10</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded bg-red-500 mr-1"></div>
            <span className="text-xs text-gray-600">11+</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Darker/warmer colors indicate more PMIs due on that day
        </p>
      </div>
    </div>
  )
}
