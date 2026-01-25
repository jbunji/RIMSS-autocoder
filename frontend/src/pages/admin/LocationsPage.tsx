import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, MapPinIcon, TableCellsIcon, Squares2X2Icon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'
import LocationHierarchyTree from '../../components/admin/LocationHierarchyTree'
import LocationEditModal from '../../components/admin/LocationEditModal'
import LocationAddModal from '../../components/admin/LocationAddModal'

interface Location {
  loc_id: number
  display_name: string
  majcom_cd: string | null
  site_cd: string | null
  unit_cd: string | null
  squad_cd: string | null
  description: string | null
  geoloc: string | null
  active: boolean
  ins_by: string | null
  ins_date: Date | null
  chg_by: string | null
  chg_date: Date | null
}

interface Pagination {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

export default function LocationsPage() {
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const [locations, setLocations] = useState<Location[]>([])
  const [majcoms, setMajcoms] = useState<string[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    totalCount: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toggleLoading, setToggleLoading] = useState<number | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMajcom, setSelectedMajcom] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')

  // View mode state
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table')

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Add modal state
  const [addModalOpen, setAddModalOpen] = useState(false)

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch locations
  useEffect(() => {
    fetchLocations()
  }, [debouncedSearch, selectedMajcom, activeFilter, pagination.page])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (selectedMajcom !== 'all') params.append('majcom', selectedMajcom)
      if (activeFilter !== 'all') params.append('active', activeFilter)
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())

      const response = await fetch(`/api/admin/locations?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch locations')
      }

      const data = await response.json()
      setLocations(data.locations)
      setPagination(data.pagination)
      setMajcoms(data.majcoms)
    } catch (err) {
      console.error('Error fetching locations:', err)
      setError('Failed to load locations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedMajcom('all')
    setActiveFilter('all')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    fetchLocations()
  }

  const handleAddSuccess = () => {
    fetchLocations()
  }

  const handleToggleActive = async (location: Location) => {
    setToggleLoading(location.loc_id)
    try {
      const response = await fetch(`/api/admin/locations/${location.loc_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...location,
          active: !location.active
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update location')
      }

      // Refresh the list
      await fetchLocations()
    } catch (err) {
      console.error('Error toggling location status:', err)
      setError(err instanceof Error ? err.message : 'Failed to update location status')
    } finally {
      setToggleLoading(null)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Location Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and search all locations in the system. Filter by MAJCOM or active status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Location
            </button>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  viewMode === 'table'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } rounded-l-md focus:z-10 focus:ring-2 focus:ring-primary-500 focus:outline-none`}
              >
                <TableCellsIcon className="h-5 w-5 mr-2" />
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-r border-b ${
                  viewMode === 'tree'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } rounded-r-md focus:z-10 focus:ring-2 focus:ring-primary-500 focus:outline-none`}
              >
                <Squares2X2Icon className="h-5 w-5 mr-2" />
                Hierarchy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search by Base Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* MAJCOM Filter */}
          <div>
            <label htmlFor="majcom" className="block text-sm font-medium text-gray-700">
              Filter by MAJCOM
            </label>
            <select
              id="majcom"
              name="majcom"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedMajcom}
              onChange={(e) => {
                setSelectedMajcom(e.target.value)
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            >
              <option value="all">All MAJCOMs</option>
              {majcoms.map(majcom => (
                <option key={majcom} value={majcom}>{majcom}</option>
              ))}
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <label htmlFor="active" className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              id="active"
              name="active"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value)
                setPagination(prev => ({ ...prev, page: 1 }))
              }}
            >
              <option value="all">All Locations</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-6">
        <p className="text-sm text-gray-700">
          Showing {locations.length} of {pagination.totalCount} locations
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading locations...</p>
        </div>
      )}

      {/* Tree View */}
      {!loading && !error && viewMode === 'tree' && (
        <div className="mt-6">
          <LocationHierarchyTree locations={locations} />
        </div>
      )}

      {/* Locations Table */}
      {!loading && !error && viewMode === 'table' && (
        <div className="mt-6 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Location
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        MAJCOM
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Site
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Unit
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {locations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-sm text-gray-500">
                          <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2">No locations found</p>
                        </td>
                      </tr>
                    ) : (
                      locations.map((location) => (
                        <tr key={location.loc_id} className="hover:bg-gray-50 transition-colors">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <div>
                                <div className="font-medium text-gray-900">{location.display_name}</div>
                                <div className="text-gray-500">ID: {location.loc_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {location.majcom_cd || '—'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {location.site_cd || '—'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {location.unit_cd || '—'}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="max-w-xs truncate" title={location.description || ''}>
                              {location.description || '—'}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            {location.active ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleActive(location)
                                }}
                                disabled={toggleLoading === location.loc_id}
                                className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                                  location.active
                                    ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    : 'border-green-600 text-green-700 bg-green-50 hover:bg-green-100'
                                }`}
                              >
                                {toggleLoading === location.loc_id ? (
                                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-1.5"></span>
                                ) : null}
                                {location.active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditLocation(location)
                                }}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                <PencilIcon className="h-4 w-4 mr-1.5" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && viewMode === 'table' && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.totalCount)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{pagination.totalCount}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = page === 1 ||
                    page === pagination.totalPages ||
                    (page >= pagination.page - 1 && page <= pagination.page + 1)

                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (page === pagination.page - 2 || page === pagination.page + 2) {
                      return (
                        <span
                          key={page}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                        >
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === pagination.page
                          ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedLocation && (
        <LocationEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          location={selectedLocation}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Add Modal */}
      <LocationAddModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}
