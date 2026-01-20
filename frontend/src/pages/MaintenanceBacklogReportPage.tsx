import { useState, useEffect } from 'react'
import { WrenchScrewdriverIcon, ArrowDownTrayIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface MaintenanceEvent {
  event_id: number
  job_no: string
  asset_sn: string
  asset_name: string
  system_type: string
  discrepancy: string
  start_job: string
  priority: string
  status: string
  event_type: string
  location: string
  assigned_to: string | null
  estimated_hours: number | null
  pqdr: boolean
}

interface BacklogSummary {
  totalOpen: number
  critical: number
  urgent: number
  routine: number
  overduePMI: number
  openPQDR: number
}

export default function MaintenanceBacklogReportPage() {
  const [events, setEvents] = useState<MaintenanceEvent[]>([])
  const [summary, setSummary] = useState<BacklogSummary>({
    totalOpen: 0,
    critical: 0,
    urgent: 0,
    routine: 0,
    overduePMI: 0,
    openPQDR: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [groupBy, setGroupBy] = useState<'configuration' | 'priority' | 'type'>('configuration')

  useEffect(() => {
    fetchBacklogData()
  }, [])

  const fetchBacklogData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Fetch open maintenance events
      const response = await fetch('/api/events?status=open&limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch maintenance backlog')
      }

      const data = await response.json()
      const openEvents: MaintenanceEvent[] = data.events || []

      setEvents(openEvents)

      // Calculate summary statistics
      const summaryData: BacklogSummary = {
        totalOpen: openEvents.length,
        critical: openEvents.filter(e => e.priority === 'Critical').length,
        urgent: openEvents.filter(e => e.priority === 'Urgent').length,
        routine: openEvents.filter(e => e.priority === 'Routine').length,
        overduePMI: openEvents.filter(e => e.event_type === 'PMI' && isOverdue(e.start_job)).length,
        openPQDR: openEvents.filter(e => e.pqdr === true).length,
      }

      setSummary(summaryData)
      setError(null)
    } catch (err) {
      console.error('Error fetching backlog:', err)
      setError('Failed to load maintenance backlog data')
    } finally {
      setLoading(false)
    }
  }

  const isOverdue = (startDate: string): boolean => {
    const start = new Date(startDate)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff > 30 // Consider overdue if open for more than 30 days
  }

  const getFilteredEvents = (): MaintenanceEvent[] => {
    let filtered = [...events]

    if (selectedPriority) {
      filtered = filtered.filter(e => e.priority === selectedPriority)
    }

    if (selectedType) {
      filtered = filtered.filter(e => e.event_type === selectedType)
    }

    return filtered
  }

  const groupEvents = (eventsList: MaintenanceEvent[]): Record<string, MaintenanceEvent[]> => {
    const grouped: Record<string, MaintenanceEvent[]> = {}

    eventsList.forEach(event => {
      let key: string

      switch (groupBy) {
        case 'configuration':
          key = event.system_type || 'Unknown System'
          break
        case 'priority':
          key = event.priority
          break
        case 'type':
          key = event.event_type
          break
        default:
          key = 'All'
      }

      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(event)
    })

    return grouped
  }

  const exportToPDF = () => {
    alert('PDF export functionality will be implemented')
  }

  const exportToExcel = () => {
    alert('Excel export functionality will be implemented')
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-50'
      case 'Urgent':
        return 'text-orange-600 bg-orange-50'
      case 'Routine':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredEvents = getFilteredEvents()
  const groupedEvents = groupEvents(filteredEvents)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading maintenance backlog...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 border border-red-200">
        <div className="text-sm text-red-800">{error}</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Backlog Report</h1>
            <p className="mt-2 text-sm text-gray-600">
              Current maintenance backlog including open jobs, repair status, and overdue items
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportToPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <WrenchScrewdriverIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Open</dt>
                  <dd className="text-lg font-semibold text-gray-900">{summary.totalOpen}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">!</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Critical</dt>
                  <dd className="text-lg font-semibold text-red-600">{summary.critical}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-600">!</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Urgent</dt>
                  <dd className="text-lg font-semibold text-orange-600">{summary.urgent}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">R</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Routine</dt>
                  <dd className="text-lg font-semibold text-blue-600">{summary.routine}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-600">P</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue PMI</dt>
                  <dd className="text-lg font-semibold text-yellow-600">{summary.overduePMI}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-600">Q</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open PQDR</dt>
                  <dd className="text-lg font-semibold text-purple-600">{summary.openPQDR}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Group By */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Priority:</label>
            <select
              value={selectedPriority || ''}
              onChange={(e) => setSelectedPriority(e.target.value || null)}
              className="rounded-md border-gray-300 shadow-sm text-sm"
            >
              <option value="">All</option>
              <option value="Critical">Critical</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Type:</label>
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              className="rounded-md border-gray-300 shadow-sm text-sm"
            >
              <option value="">All</option>
              <option value="Standard">Standard</option>
              <option value="PMI">PMI</option>
              <option value="TCTO">TCTO</option>
              <option value="BIT/PC">BIT/PC</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedPriority || selectedType) && (
            <button
              onClick={() => {
                setSelectedPriority(null)
                setSelectedType(null)
              }}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}

          <div className="flex-1"></div>

          {/* Group By */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Group by:</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as 'configuration' | 'priority' | 'type')}
              className="rounded-md border-gray-300 shadow-sm text-sm"
            >
              <option value="configuration">Configuration</option>
              <option value="priority">Priority</option>
              <option value="type">Event Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grouped Events */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([groupName, groupEvents]) => (
          <div key={groupName} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {groupName} ({groupEvents.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      System Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discrepancy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupEvents.map((event) => (
                    <tr key={event.event_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.job_no}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{event.asset_name}</div>
                        <div className="text-gray-500">{event.asset_sn}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.system_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                        <div className="line-clamp-2">{event.discrepancy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.event_type}
                        {event.pqdr && (
                          <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full text-purple-600 bg-purple-50">
                            PQDR
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(event.start_job).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No open maintenance events</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no open maintenance events in the backlog.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
