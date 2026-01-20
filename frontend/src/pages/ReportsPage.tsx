import { DocumentChartBarIcon, CubeIcon, WrenchScrewdriverIcon, CalendarDaysIcon, TruckIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

interface ReportCard {
  id: string
  name: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  category: string
  route: string
  available: boolean
}

const reports: ReportCard[] = [
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Comprehensive inventory status report by system type, including asset counts, status breakdown, and program distribution.',
    icon: CubeIcon,
    category: 'Inventory',
    route: '/spares',
    available: true,
  },
  {
    id: 'maintenance-backlog',
    name: 'Maintenance Backlog Report',
    description: 'Current maintenance backlog including open jobs, repair status, labor hours, and overdue items.',
    icon: WrenchScrewdriverIcon,
    category: 'Maintenance',
    route: '/maintenance',
    available: true,
  },
  {
    id: 'pmi-schedule',
    name: 'PMI Schedule Report',
    description: 'Preventive Maintenance Inspection (PMI) schedule showing upcoming, due, and overdue inspections.',
    icon: CalendarDaysIcon,
    category: 'Maintenance',
    route: '/pmi',
    available: true,
  },
  {
    id: 'parts-ordered',
    name: 'Parts Ordered Report',
    description: 'Parts requisition status report including requested, acknowledged, filled, and shipped orders.',
    icon: TruckIcon,
    category: 'Supply',
    route: '/parts-ordered',
    available: true,
  },
]

// Group reports by category
const reportsByCategory = reports.reduce((acc, report) => {
  if (!acc[report.category]) {
    acc[report.category] = []
  }
  acc[report.category].push(report)
  return acc
}, {} as Record<string, ReportCard[]>)

export default function ReportsPage() {
  const navigate = useNavigate()

  const handleReportClick = (report: ReportCard) => {
    if (report.available) {
      navigate(report.route)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-600">
          Access comprehensive reports for inventory, maintenance, and supply operations.
        </p>
      </div>

      {/* Report Categories */}
      <div className="space-y-8">
        {Object.entries(reportsByCategory).map(([category, categoryReports]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{category}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryReports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => handleReportClick(report)}
                  disabled={!report.available}
                  className={`
                    relative rounded-lg border p-6 text-left transition-all
                    ${
                      report.available
                        ? 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md cursor-pointer'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                    }
                  `}
                >
                  <div className="flex items-start">
                    <div
                      className={`
                        flex-shrink-0 rounded-lg p-3
                        ${report.available ? 'bg-primary-50' : 'bg-gray-100'}
                      `}
                    >
                      <report.icon
                        className={`h-6 w-6 ${report.available ? 'text-primary-600' : 'text-gray-400'}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">
                          {report.name}
                        </h3>
                        {report.available && (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500 flex-shrink-0 ml-2"
                            aria-hidden="true"
                            title="Available"
                          />
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {report.description}
                      </p>
                      {report.available && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
                            View Report →
                          </span>
                        </div>
                      )}
                      {!report.available && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-8 rounded-lg bg-blue-50 p-4 border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <DocumentChartBarIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Reports</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Click on any available report to navigate to the corresponding page where you can view detailed data,
                apply filters, and export to PDF or Excel formats with CUI markings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
