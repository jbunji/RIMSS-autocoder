import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useToastContext } from '../../contexts/ToastContext'

interface Location {
  loc_id: number
  display_name: string
  majcom_cd: string | null
  site_cd: string | null
  unit_cd: string | null
  squad_cd: string | null
  description: string | null
}

interface ProgramLocation {
  program_location_id: number
  pgm_id: number
  loc_id: number
  active: boolean
  location: Location
}

interface Program {
  pgm_id: number
  pgm_cd: string
  pgm_name: string
  pgm_desc: string | null
  programLocations: ProgramLocation[]
}

export default function ProgramLocationsPage() {
  const { token } = useAuthStore()
  const { showToast } = useToastContext()
  const [programs, setPrograms] = useState<Program[]>([])
  const [allLocations, setAllLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null)
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [isDeletingLocation, setIsDeletingLocation] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch programs with their locations
      const programsResponse = await fetch('/api/program-locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!programsResponse.ok) {
        throw new Error('Failed to fetch program locations')
      }

      const programsData = await programsResponse.json()
      setPrograms(programsData.programs)

      // Fetch all available locations
      const locationsResponse = await fetch('/api/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!locationsResponse.ok) {
        throw new Error('Failed to fetch locations')
      }

      const locationsData = await locationsResponse.json()
      setAllLocations(locationsData.locations)
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('Failed to load program locations', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProgram = (program: Program) => {
    setSelectedProgram(program)
  }

  const handleAddLocationClick = () => {
    setShowAddLocationModal(true)
    setSelectedLocationId(null)
  }

  const handleAddLocation = async () => {
    if (!selectedProgram || !selectedLocationId) return

    try {
      setIsAddingLocation(true)

      const response = await fetch(`/api/program-locations/${selectedProgram.pgm_id}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          loc_id: selectedLocationId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add location')
      }

      showToast('Location added successfully!', 'success')
      setShowAddLocationModal(false)
      setSelectedLocationId(null)

      // Refresh data
      await fetchData()

      // Update selected program with fresh data
      const updatedProgram = programs.find(p => p.pgm_id === selectedProgram.pgm_id)
      if (updatedProgram) {
        setSelectedProgram(updatedProgram)
      }
    } catch (error: any) {
      console.error('Error adding location:', error)
      showToast(error.message || 'Failed to add location', 'error')
    } finally {
      setIsAddingLocation(false)
    }
  }

  const handleRemoveLocation = async (locationId: number) => {
    if (!selectedProgram) return

    const location = selectedProgram.programLocations.find(pl => pl.loc_id === locationId)?.location
    const locationName = location?.display_name || 'this location'

    if (!confirm(`Are you sure you want to remove ${locationName} from ${selectedProgram.pgm_name}?`)) {
      return
    }

    try {
      setIsDeletingLocation(locationId)

      const response = await fetch(`/api/program-locations/${selectedProgram.pgm_id}/locations/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove location')
      }

      showToast('Location removed successfully!', 'success')

      // Refresh data
      await fetchData()

      // Update selected program with fresh data
      const updatedProgram = programs.find(p => p.pgm_id === selectedProgram.pgm_id)
      if (updatedProgram) {
        setSelectedProgram(updatedProgram)
      }
    } catch (error: any) {
      console.error('Error removing location:', error)
      showToast(error.message || 'Failed to remove location', 'error')
    } finally {
      setIsDeletingLocation(null)
    }
  }

  const getAvailableLocations = () => {
    if (!selectedProgram) return []

    const assignedLocationIds = selectedProgram.programLocations.map(pl => pl.loc_id)
    return allLocations.filter(loc => !assignedLocationIds.includes(loc.loc_id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading program locations...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Program Location Mappings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage which locations are valid for each defense program. Users can only be assigned to locations that are mapped to their programs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programs List */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Programs</h2>
            <p className="text-sm text-gray-600 mt-1">Select a program to manage its locations</p>
          </div>
          <div className="divide-y divide-gray-200">
            {programs.map((program) => (
              <button
                key={program.pgm_id}
                onClick={() => handleSelectProgram(program)}
                className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                  selectedProgram?.pgm_id === program.pgm_id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{program.pgm_name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{program.pgm_cd}</div>
                    {program.pgm_desc && (
                      <div className="text-sm text-gray-600 mt-1">{program.pgm_desc}</div>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      program.programLocations.length > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.programLocations.length} {program.programLocations.length === 1 ? 'location' : 'locations'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Assigned Locations */}
        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProgram ? `${selectedProgram.pgm_name} Locations` : 'Select a Program'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedProgram
                  ? 'Locations assigned to this program'
                  : 'Choose a program from the left to view and manage its locations'}
              </p>
            </div>
            {selectedProgram && (
              <button
                onClick={handleAddLocationClick}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                Add Location
              </button>
            )}
          </div>

          {selectedProgram ? (
            <div className="divide-y divide-gray-200">
              {selectedProgram.programLocations.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="mt-2">No locations assigned to this program</p>
                  <button
                    onClick={handleAddLocationClick}
                    className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Add your first location
                  </button>
                </div>
              ) : (
                selectedProgram.programLocations.map((programLocation) => (
                  <div key={programLocation.program_location_id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {programLocation.location.display_name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                          {programLocation.location.majcom_cd && (
                            <div>MAJCOM: {programLocation.location.majcom_cd}</div>
                          )}
                          {programLocation.location.site_cd && (
                            <div>Site: {programLocation.location.site_cd}</div>
                          )}
                          {programLocation.location.unit_cd && (
                            <div>Unit: {programLocation.location.unit_cd}</div>
                          )}
                          {programLocation.location.description && (
                            <div className="text-gray-500">{programLocation.location.description}</div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLocation(programLocation.loc_id)}
                        disabled={isDeletingLocation === programLocation.loc_id}
                        className="ml-4 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeletingLocation === programLocation.loc_id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2">Select a program to view its assigned locations</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddLocationModal && selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Location to {selectedProgram.pgm_name}
              </h3>
            </div>

            <div className="px-6 py-4">
              <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Location
              </label>
              <select
                id="location-select"
                value={selectedLocationId || ''}
                onChange={(e) => setSelectedLocationId(parseInt(e.target.value, 10))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Choose a location...</option>
                {getAvailableLocations().map((location) => (
                  <option key={location.loc_id} value={location.loc_id}>
                    {location.display_name}
                    {location.majcom_cd ? ` (${location.majcom_cd})` : ''}
                  </option>
                ))}
              </select>

              {getAvailableLocations().length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                  All available locations have been assigned to this program.
                </p>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddLocationModal(false)
                  setSelectedLocationId(null)
                }}
                disabled={isAddingLocation}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocation}
                disabled={!selectedLocationId || isAddingLocation}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingLocation ? 'Adding...' : 'Add Location'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              About Program-Location Mappings
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Program-location mappings define which locations are valid for each defense program (CRIIS, ACTS, ARDS, 236).
                When assigning locations to users, only locations that are mapped to the user's programs will be available.
                This ensures proper data isolation and access control across the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
