import { useEffect, useState } from 'react'
import { CalendarDaysIcon, ExclamationTriangleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import * as XLSX from 'xlsx'

interface PMI {
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
  interval_days: number
}

interface ReportData {
  program: {
    pgm_id: number
    name: string
    description: string
  } | null
  programs: Array<{
    pgm_id: number
    name: string
    description: string
  }>
  total: number
  by_status: {
    overdue: number
    due_soon: number
    upcoming: number
    completed: number
  }
  pmis: PMI[]
  grouped_by_status: {
    overdue: PMI[]
    due_soon: PMI[]
    upcoming: PMI[]
    completed: PMI[]
  }
  generated_at: string
}

export default function PMIScheduleReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    overdue: true,
    due_soon: true,
    upcoming: true,
    completed: false, // Collapsed by default
  })

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/reports/pmi-schedule', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch PMI schedule report')
      }

      const data = await response.json()
      setReportData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: PMI['status']) => {
    const badges = {
      overdue: 'bg-red-100 text-red-800 border-red-200',
      due_soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      upcoming: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    const labels = {
      overdue: 'OVERDUE',
      due_soon: 'DUE SOON',
      upcoming: 'UPCOMING',
      completed: 'COMPLETED',
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getDaysUntilDueBadge = (days: number) => {
    if (days < 0) {
      return (
        <span className="text-red-600 font-semibold">
          {Math.abs(days)} days overdue
        </span>
      )
    } else if (days === 0) {
      return <span className="text-red-600 font-semibold">Due today</span>
    } else if (days <= 7) {
      return <span className="text-yellow-600 font-semibold">{days} days</span>
    } else {
      return <span className="text-gray-600">{days} days</span>
    }
  }

  // Helper function to get ZULU timestamp
  const getZuluTimestamp = (): string => {
    const now = new Date()
    return now.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, 'Z')
  }

  // Helper function to get ZULU date for filename
  const getZuluDateForFilename = (): string => {
    const now = new Date()
    const year = now.getUTCFullYear()
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')
    const day = String(now.getUTCDate()).padStart(2, '0')
    return `${year}${month}${day}`
  }

  const handleExportToExcel = () => {
    if (!reportData) return

    const zuluTimestamp = getZuluTimestamp()

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()

    // Prepare data rows with CUI header
    const cuiHeaderRow = ['CONTROLLED UNCLASSIFIED INFORMATION (CUI)']
    const blankRow: string[] = []
    const reportInfoRow1 = ['RIMSS PMI Schedule Report']
    const reportInfoRow2 = [`Generated: ${zuluTimestamp}`]
    const reportInfoRow3 = reportData.program ? [`Program: ${reportData.program.name}`] : []
    const reportInfoRow4 = [`Total PMIs: ${reportData.total}`]
    const reportInfoRow5 = [`Overdue: ${reportData.by_status.overdue} | Due Soon: ${reportData.by_status.due_soon} | Upcoming: ${reportData.by_status.upcoming} | Completed: ${reportData.by_status.completed}`]

    const allRows: any[] = [
      cuiHeaderRow,
      blankRow,
      reportInfoRow1,
      reportInfoRow2,
      ...(reportInfoRow3.length ? [reportInfoRow3] : []),
      reportInfoRow4,
      reportInfoRow5,
      blankRow
    ]

    // Add each status section
    const sections: Array<{ title: string; pmis: PMI[] }> = [
      { title: 'OVERDUE PMIs', pmis: reportData.grouped_by_status.overdue },
      { title: 'DUE SOON - Within 7 Days', pmis: reportData.grouped_by_status.due_soon },
      { title: 'UPCOMING PMIs', pmis: reportData.grouped_by_status.upcoming },
      { title: 'COMPLETED PMIs', pmis: reportData.grouped_by_status.completed }
    ]

    sections.forEach(section => {
      if (section.pmis.length > 0) {
        // Section header
        allRows.push([section.title])
        allRows.push([`Count: ${section.pmis.length}`])
        allRows.push(blankRow)

        // Table header
        allRows.push([
          'Asset S/N',
          'Asset Name',
          'PMI Type',
          'WUC Code',
          'Next Due Date',
          'Days Until Due',
          'Interval (Days)',
          'Completed Date',
          'Status'
        ])

        // PMI rows
        section.pmis.forEach(pmi => {
          allRows.push([
            pmi.asset_sn,
            pmi.asset_name || '',
            pmi.pmi_type,
            pmi.wuc_cd || '',
            formatDate(pmi.next_due_date),
            pmi.days_until_due.toString(),
            pmi.interval_days.toString(),
            pmi.completed_date ? formatDate(pmi.completed_date) : '',
            pmi.status.toUpperCase().replace('_', ' ')
          ])
        })

        allRows.push(blankRow)
      }
    })

    // CUI footer row
    const cuiFooterRow = ['CUI - CONTROLLED UNCLASSIFIED INFORMATION']
    allRows.push(cuiFooterRow)

    // Create worksheet from array of arrays
    const ws = XLSX.utils.aoa_to_sheet(allRows)

    // Set column widths
    ws['!cols'] = [
      { wch: 20 },  // Asset S/N
      { wch: 30 },  // Asset Name
      { wch: 25 },  // PMI Type
      { wch: 12 },  // WUC Code
      { wch: 15 },  // Next Due Date
      { wch: 15 },  // Days Until Due
      { wch: 15 },  // Interval (Days)
      { wch: 15 },  // Completed Date
      { wch: 15 },  // Status
    ]

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'PMI Schedule')

    // Get filename with ZULU date
    const zuluDate = getZuluDateForFilename()
    const filename = `CUI-PMI-Schedule-Report-${zuluDate}.xlsx`

    // Write file
    XLSX.writeFile(wb, filename)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading PMI schedule report...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">PMI Schedule Report</h1>
        {reportData.program && (
          <p className="mt-1 text-sm text-gray-600">
            Program: {reportData.program.name}
          </p>
        )}
        <p className="text-sm text-gray-500">
          Generated: {formatDate(reportData.generated_at)}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-red-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-red-600">
                      {reportData.by_status.overdue}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-yellow-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Due Soon</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-yellow-600">
                      {reportData.by_status.due_soon}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-green-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-green-600">
                      {reportData.by_status.upcoming}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {reportData.by_status.completed}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PMI Sections by Status */}
      <div className="space-y-6">
        {/* Overdue Section */}
        {reportData.by_status.overdue > 0 && (
          <div className="bg-white shadow rounded-lg border border-red-200">
            <button
              onClick={() => toggleSection('overdue')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Overdue PMIs ({reportData.by_status.overdue})
                </h2>
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.overdue ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.overdue && (
              <div className="border-t border-red-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        PMI Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        WUC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Days Overdue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.grouped_by_status.overdue.map((pmi) => (
                      <tr key={pmi.pmi_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pmi.asset_sn}</div>
                          <div className="text-sm text-gray-500">{pmi.asset_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pmi.pmi_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pmi.wuc_cd}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(pmi.next_due_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getDaysUntilDueBadge(pmi.days_until_due)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(pmi.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Due Soon Section */}
        {reportData.by_status.due_soon > 0 && (
          <div className="bg-white shadow rounded-lg border border-yellow-200">
            <button
              onClick={() => toggleSection('due_soon')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-yellow-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Due Soon (Within 7 Days) ({reportData.by_status.due_soon})
                </h2>
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.due_soon ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.due_soon && (
              <div className="border-t border-yellow-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-yellow-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        PMI Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        WUC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Days Until Due
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.grouped_by_status.due_soon.map((pmi) => (
                      <tr key={pmi.pmi_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pmi.asset_sn}</div>
                          <div className="text-sm text-gray-500">{pmi.asset_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pmi.pmi_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pmi.wuc_cd}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(pmi.next_due_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getDaysUntilDueBadge(pmi.days_until_due)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(pmi.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Section */}
        {reportData.by_status.upcoming > 0 && (
          <div className="bg-white shadow rounded-lg border border-green-200">
            <button
              onClick={() => toggleSection('upcoming')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <CalendarDaysIcon className="h-5 w-5 text-green-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming PMIs ({reportData.by_status.upcoming})
                </h2>
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.upcoming ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.upcoming && (
              <div className="border-t border-green-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        PMI Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        WUC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Days Until Due
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.grouped_by_status.upcoming.map((pmi) => (
                      <tr key={pmi.pmi_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pmi.asset_sn}</div>
                          <div className="text-sm text-gray-500">{pmi.asset_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pmi.pmi_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pmi.wuc_cd}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(pmi.next_due_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getDaysUntilDueBadge(pmi.days_until_due)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(pmi.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Completed Section */}
        {reportData.by_status.completed > 0 && (
          <div className="bg-white shadow rounded-lg border border-gray-200">
            <button
              onClick={() => toggleSection('completed')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-gray-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Completed PMIs ({reportData.by_status.completed})
                </h2>
              </div>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedSections.completed ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.completed && (
              <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Asset
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        PMI Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        WUC
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Completed Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Next Due
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.grouped_by_status.completed.map((pmi) => (
                      <tr key={pmi.pmi_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pmi.asset_sn}</div>
                          <div className="text-sm text-gray-500">{pmi.asset_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pmi.pmi_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pmi.wuc_cd}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pmi.completed_date ? formatDate(pmi.completed_date) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(pmi.next_due_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(pmi.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleExportToExcel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <CalendarDaysIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
          Export to Excel
        </button>
      </div>
    </div>
  )
}
