import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { DocumentArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface Sortie {
  sortie_id: number
  pgm_id: number
  asset_id: number
  mission_id: string
  serno: string
  ac_tailno: string | null
  sortie_date: string
  sortie_effect: string | null
  current_unit: string | null
  assigned_unit: string | null
  range: string | null
  reason: string | null
  remarks: string | null
}

interface SortieSummary {
  total_sorties: number
  fmc_count: number
  pmc_count: number
  nmcm_count: number
  nmcs_count: number
  date_range: {
    start: string
    end: string
  }
}

export default function SortieReportPage() {
  const { token, user } = useAuthStore()
  const [sorties, setSorties] = useState<Sortie[]>([])
  const [summary, setSummary] = useState<SortieSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Date range filters
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Set default date range (last 30 days)
  useEffect(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    setEndDate(today.toISOString().split('T')[0])
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0])
  }, [])

  // Fetch sorties when date range changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchSortieReport()
    }
  }, [startDate, endDate])

  const fetchSortieReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      params.append('start_date', startDate)
      params.append('end_date', endDate)
      params.append('limit', '1000') // Get all sorties in date range

      const url = `http://localhost:3001/api/sorties?${params.toString()}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sortie report')
      }

      const data = await response.json()
      setSorties(data.sorties || [])

      // Calculate summary statistics
      const sortieList = data.sorties || []
      const summary: SortieSummary = {
        total_sorties: sortieList.length,
        fmc_count: sortieList.filter((s: Sortie) =>
          s.sortie_effect === 'FMC' || s.sortie_effect === 'Full Mission Capable'
        ).length,
        pmc_count: sortieList.filter((s: Sortie) =>
          s.sortie_effect === 'PMC' || s.sortie_effect === 'Partial Mission Capable'
        ).length,
        nmcm_count: sortieList.filter((s: Sortie) =>
          s.sortie_effect === 'NMCM' || s.sortie_effect === 'Non-Mission Capable Maintenance' ||
          s.sortie_effect === 'Non-Mission Capable'
        ).length,
        nmcs_count: sortieList.filter((s: Sortie) =>
          s.sortie_effect === 'NMCS' || s.sortie_effect === 'Non-Mission Capable Supply'
        ).length,
        date_range: {
          start: startDate,
          end: endDate,
        },
      }
      setSummary(summary)
    } catch (err) {
      console.error('Error fetching sortie report:', err)
      setError('Failed to load sortie report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = () => {
    fetchSortieReport()
  }

  const handleExport = () => {
    // TODO: Implement export to PDF/Excel
    console.log('Export functionality to be implemented')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getEffectBadgeColor = (effect: string | null) => {
    if (!effect) return 'bg-gray-100 text-gray-800'

    if (effect === 'FMC' || effect === 'Full Mission Capable') {
      return 'bg-green-100 text-green-800'
    }
    if (effect === 'PMC' || effect === 'Partial Mission Capable') {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (effect === 'NMCM' || effect.includes('Non-Mission Capable')) {
      return 'bg-orange-100 text-orange-800'
    }
    if (effect === 'NMCS' || effect === 'Non-Mission Capable Supply') {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  if (loading && !sorties.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sortie report...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* CUI Header Banner */}
      <div className="bg-green-600 text-white text-center py-1 text-xs font-semibold mb-4">
        CUI
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sortie Activity Report</h1>
        <p className="mt-2 text-sm text-gray-600">
          View sortie activity and effectiveness data for the selected date range.
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
          Date Range
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading || !startDate || !endDate}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Summary Section */}
      {summary && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600 mb-1">Total Sorties</div>
              <div className="text-3xl font-bold text-blue-600">{summary.total_sorties}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600 mb-1">FMC</div>
              <div className="text-3xl font-bold text-green-600">{summary.fmc_count}</div>
              <div className="text-xs text-gray-500 mt-1">
                {summary.total_sorties > 0
                  ? `${((summary.fmc_count / summary.total_sorties) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600 mb-1">PMC</div>
              <div className="text-3xl font-bold text-yellow-600">{summary.pmc_count}</div>
              <div className="text-xs text-gray-500 mt-1">
                {summary.total_sorties > 0
                  ? `${((summary.pmc_count / summary.total_sorties) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600 mb-1">NMCM</div>
              <div className="text-3xl font-bold text-orange-600">{summary.nmcm_count}</div>
              <div className="text-xs text-gray-500 mt-1">
                {summary.total_sorties > 0
                  ? `${((summary.nmcm_count / summary.total_sorties) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-600 mb-1">NMCS</div>
              <div className="text-3xl font-bold text-red-600">{summary.nmcs_count}</div>
              <div className="text-xs text-gray-500 mt-1">
                {summary.total_sorties > 0
                  ? `${((summary.nmcs_count / summary.total_sorties) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sorties Table */}
      {sorties.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Sortie Details ({sorties.length} sorties)
            </h2>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mission ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asset S/N
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tail Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Effectiveness
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorties.map((sortie) => (
                  <tr key={sortie.sortie_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sortie.mission_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sortie.serno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sortie.ac_tailno || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(sortie.sortie_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sortie.sortie_effect ? (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEffectBadgeColor(sortie.sortie_effect)}`}>
                          {sortie.sortie_effect}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sortie.range || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sortie.current_unit || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Sorties Message */}
      {!loading && sorties.length === 0 && summary && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">
            No sorties found for the selected date range.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Try selecting a different date range.
          </p>
        </div>
      )}

      {/* CUI Footer Banner */}
      <div className="bg-green-600 text-white text-center py-1 text-xs font-semibold mt-6">
        CUI
      </div>
    </div>
  )
}
