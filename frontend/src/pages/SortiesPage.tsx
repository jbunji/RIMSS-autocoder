import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'

// Sortie interface matching backend
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

interface ProgramInfo {
  pgm_id: number
  pgm_cd: string
  pgm_name: string
}

interface SortiesResponse {
  sorties: Sortie[]
  total: number
}

export default function SortiesPage() {
  const navigate = useNavigate()
  const { token, currentProgramId } = useAuthStore()

  // State
  const [sorties, setSorties] = useState<Sortie[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSorties, setFilteredSorties] = useState<Sortie[]>([])

  // Fetch sorties
  useEffect(() => {
    const fetchSorties = async () => {
      if (!token) return

      setLoading(true)
      setError(null)

      try {
        const url = new URL('http://localhost:3001/api/sorties')

        // Apply program filter
        if (currentProgramId) {
          url.searchParams.append('program_id', currentProgramId.toString())
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data: SortiesResponse = await response.json()
        setSorties(data.sorties)
        setTotal(data.total)
      } catch (err) {
        console.error('Error fetching sorties:', err)
        setError(err instanceof Error ? err.message : 'Failed to load sorties')
      } finally {
        setLoading(false)
      }
    }

    fetchSorties()
  }, [token, currentProgramId])

  // Apply search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSorties(sorties)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = sorties.filter(sortie =>
      sortie.mission_id.toLowerCase().includes(query) ||
      sortie.serno.toLowerCase().includes(query) ||
      (sortie.ac_tailno && sortie.ac_tailno.toLowerCase().includes(query)) ||
      (sortie.sortie_effect && sortie.sortie_effect.toLowerCase().includes(query))
    )
    setFilteredSorties(filtered)
  }, [searchQuery, sorties])

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sorties...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error loading sorties</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sorties</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track sortie missions and aircraft operations
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by mission ID, serial number, tail number, or effect..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Sorties Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mission ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tail Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sortie Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sortie Effect
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Unit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSorties.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'No sorties match your search' : 'No sorties found'}
                  </td>
                </tr>
              ) : (
                filteredSorties.map((sortie) => (
                  <tr
                    key={sortie.sortie_id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/sorties/${sortie.sortie_id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sortie.mission_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sortie.serno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sortie.ac_tailno || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(sortie.sortie_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sortie.sortie_effect ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          sortie.sortie_effect.includes('Full')
                            ? 'bg-green-100 text-green-800'
                            : sortie.sortie_effect.includes('Partial')
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sortie.sortie_effect}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sortie.range || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sortie.current_unit || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with count */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredSorties.length}</span> of{' '}
              <span className="font-medium">{total}</span> sorties
              {searchQuery && (
                <span className="text-gray-500"> (filtered by "{searchQuery}")</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
