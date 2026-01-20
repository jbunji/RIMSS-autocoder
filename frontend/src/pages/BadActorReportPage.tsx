import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { ExclamationTriangleIcon, DocumentArrowDownIcon, ClockIcon, CubeIcon } from '@heroicons/react/24/outline'

interface BadActor {
  asset_id: number
  serno: string
  partno: string
  part_name: string
  system_type: string
  status_cd: string
  status_name: string
  location: string
  loc_type: string
  program: {
    pgm_id: number
    pgm_cd: string
    pgm_name: string
  } | null
  failure_count: number
  critical_failures: number
  urgent_failures: number
  last_failure_date: string | null
  remarks: string | null
}

interface BadActorReportData {
  program: {
    pgm_id: number
    pgm_cd: string
    pgm_name: string
  } | null
  programs: Array<{
    pgm_id: number
    pgm_cd: string
    pgm_name: string
  }>
  summary: {
    total_bad_actors: number
    total_failures: number
    critical_failures: number
    urgent_failures: number
    average_failures_per_asset: string
  }
  bad_actors: BadActor[]
  generated_at: string
}

export default function BadActorReportPage() {
  const { token, user } = useAuthStore()
  const [reportData, setReportData] = useState<BadActorReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBadActorReport()
  }, [])

  const fetchBadActorReport = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/reports/bad-actors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch bad actor report')
      }

      const data = await response.json()
      setReportData(data)
    } catch (err) {
      console.error('Error fetching bad actor report:', err)
      setError('Failed to load bad actor report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    // TODO: Implement export to PDF with CUI markings
    console.log('Export to PDF functionality to be implemented')
  }

  const handleExportExcel = () => {
    // TODO: Implement export to Excel with CUI markings
    console.log('Export to Excel functionality to be implemented')
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getSeverityBadge = (criticalCount: number, urgentCount: number) => {
    if (criticalCount >= 2) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          High Risk
        </span>
      )
    } else if (criticalCount >= 1 || urgentCount >= 3) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
          Medium Risk
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
          Monitor
        </span>
      )
    }
  }

  const getRecommendation = (failureCount: number, criticalCount: number, urgentCount: number) => {
    if (criticalCount >= 3) {
      return 'Consider immediate replacement or depot-level inspection'
    } else if (criticalCount >= 2) {
      return 'Schedule comprehensive maintenance review and diagnostics'
    } else if (failureCount >= 5) {
      return 'Investigate root cause and review maintenance procedures'
    } else if (urgentCount >= 3) {
      return 'Monitor closely and schedule preventive maintenance'
    } else {
      return 'Continue monitoring failure patterns'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Loading bad actor report...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 border border-red-200">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Report</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return null
  }

  return (
    <div>
      {/* CUI Header Banner */}
      <div className="bg-purple-900 text-white text-center py-1 text-xs font-semibold mb-4">
        CUI//SP-CTI - CONTROLLED UNCLASSIFIED INFORMATION
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bad Actor Report</h1>
              <p className="mt-1 text-sm text-gray-600">
                Assets flagged as bad actors due to repeated failures
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bad Actors</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.total_bad_actors}</p>
            </div>
            <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Failures</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.total_failures}</p>
            </div>
            <ClockIcon className="h-10 w-10 text-orange-600" />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-rose-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Failures</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.critical_failures}</p>
            </div>
            <ExclamationTriangleIcon className="h-10 w-10 text-rose-600" />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Failures/Asset</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{reportData.summary.average_failures_per_asset}</p>
            </div>
            <CubeIcon className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* No bad actors message */}
      {reportData.bad_actors.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">No Bad Actors Found</h3>
          <p className="text-green-700">
            Great news! There are no assets currently flagged as bad actors in your program.
          </p>
        </div>
      ) : (
        <>
          {/* Bad Actors Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Bad Actor Assets</h2>
              <p className="mt-1 text-sm text-gray-600">
                Assets with repeated failures requiring management attention
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      System Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Failures
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Failure
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.bad_actors.map((badActor) => (
                    <tr key={badActor.asset_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {badActor.serno}
                            </div>
                            <div className="text-sm text-gray-500">
                              {badActor.partno}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {badActor.part_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{badActor.system_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {badActor.status_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{badActor.location}</div>
                        <div className="text-xs text-gray-500">{badActor.loc_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{badActor.failure_count}</div>
                        <div className="text-xs text-gray-500">
                          {badActor.critical_failures > 0 && (
                            <span className="text-red-600 font-medium">
                              {badActor.critical_failures} Critical
                            </span>
                          )}
                          {badActor.critical_failures > 0 && badActor.urgent_failures > 0 && ', '}
                          {badActor.urgent_failures > 0 && (
                            <span className="text-orange-600 font-medium">
                              {badActor.urgent_failures} Urgent
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(badActor.last_failure_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSeverityBadge(badActor.critical_failures, badActor.urgent_failures)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs">
                          {getRecommendation(badActor.failure_count, badActor.critical_failures, badActor.urgent_failures)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Report Metadata */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>
                <span className="font-medium">Report Generated:</span>{' '}
                {new Date(reportData.generated_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </div>
              <div>
                <span className="font-medium">Total Bad Actors:</span> {reportData.summary.total_bad_actors}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CUI Footer Banner */}
      <div className="bg-purple-900 text-white text-center py-1 text-xs font-semibold mt-6">
        CUI//SP-CTI - CONTROLLED UNCLASSIFIED INFORMATION
      </div>
    </div>
  )
}
