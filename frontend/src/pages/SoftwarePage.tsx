import { useState, useEffect } from 'react'
import {
  CodeBracketIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// Software interface matching backend
interface Software {
  sw_id: number
  sw_number: string
  sw_title: string
  sw_type: string
  sys_id: string
  revision: string
  revision_date: string
  eff_date: string
  cpin_flag: boolean
  sw_desc: string | null
  pgm_id: number
  active: boolean
  program_cd?: string
  program_name?: string
}

interface SoftwareResponse {
  software: Software[]
  total: number
}

type SortField = 'sw_number' | 'sw_title' | 'revision' | 'sw_type' | 'revision_date' | 'eff_date'
type SortDirection = 'asc' | 'desc'

export default function SoftwarePage() {
  const { token, user } = useAuthStore()
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('sw_number')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Fetch software catalog
  const fetchSoftware = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (typeFilter !== 'all') {
        params.append('type', typeFilter)
      }

      const url = `http://localhost:3001/api/software${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch software catalog')
      }

      const data: SoftwareResponse = await response.json()
      setSoftware(data.software)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching software:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSoftware()
  }, [typeFilter])

  // Filter and sort software
  const filteredAndSortedSoftware = software
    .filter(sw => {
      const searchLower = searchTerm.toLowerCase()
      return (
        sw.sw_number.toLowerCase().includes(searchLower) ||
        sw.sw_title.toLowerCase().includes(searchLower) ||
        sw.revision.toLowerCase().includes(searchLower) ||
        (sw.sw_desc && sw.sw_desc.toLowerCase().includes(searchLower))
      )
    })
    .sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      if (sortField === 'revision_date' || sortField === 'eff_date') {
        aValue = new Date(a[sortField]).getTime()
        bValue = new Date(b[sortField]).getTime()
      } else {
        aValue = a[sortField] || ''
        bValue = b[sortField] || ''
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc'
      ? <ChevronUpIcon className="h-4 w-4 text-primary-600" />
      : <ChevronDownIcon className="h-4 w-4 text-primary-600" />
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Get unique software types for filter
  const softwareTypes = Array.from(new Set(software.map(sw => sw.sw_type))).sort()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <CodeBracketIcon className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Software Catalog</h1>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Manage software versions and configurations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search software..."
              className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {softwareTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Software Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-500">Loading software catalog...</p>
          </div>
        ) : filteredAndSortedSoftware.length === 0 ? (
          <div className="p-8 text-center">
            <CodeBracketIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No software found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No software versions available.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sw_number')}
                  >
                    <div className="flex items-center">
                      Software Number
                      {getSortIcon('sw_number')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sw_title')}
                  >
                    <div className="flex items-center">
                      Title
                      {getSortIcon('sw_title')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sw_type')}
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIcon('sw_type')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('revision')}
                  >
                    <div className="flex items-center">
                      Version
                      {getSortIcon('revision')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('revision_date')}
                  >
                    <div className="flex items-center">
                      Revision Date
                      {getSortIcon('revision_date')}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('eff_date')}
                  >
                    <div className="flex items-center">
                      Effective Date
                      {getSortIcon('eff_date')}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    CPIN
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Program
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAndSortedSoftware.map((sw) => (
                  <tr key={sw.sw_id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {sw.sw_number}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <div className="font-medium">{sw.sw_title}</div>
                      {sw.sw_desc && (
                        <div className="text-gray-500 text-xs mt-1 truncate max-w-xs">
                          {sw.sw_desc}
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {sw.sw_type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                      {sw.revision}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(sw.revision_date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatDate(sw.eff_date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {sw.cpin_flag ? 'Yes' : '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {sw.program_cd || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && filteredAndSortedSoftware.length > 0 && (
        <div className="text-sm text-gray-700">
          Showing {filteredAndSortedSoftware.length} of {software.length} software version{software.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
