import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'
import Breadcrumbs from '../../components/Breadcrumbs'

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
  ins_date: string | null
  chg_by: string | null
  chg_date: string | null
  old_loc_id: number | null
}

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('No location ID provided')
      setLoading(false)
      return
    }

    fetchLocation()
  }, [id])

  const fetchLocation = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/locations/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Location not found')
        }
        throw new Error('Failed to fetch location')
      }

      const data = await response.json()
      setLocation(data)
    } catch (err) {
      console.error('Error fetching location:', err)
      setError(err instanceof Error ? err.message : 'Failed to load location')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading location details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={() => navigate('/admin/locations')}
            className="mt-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Locations
          </button>
        </div>
      </div>
    )
  }

  if (!location) {
    return null
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Admin', path: '/admin/users' },
          { label: 'Locations', path: '/admin/locations' },
          { label: location.display_name, path: `/admin/locations/${location.loc_id}` },
        ]}
      />

      {/* Header */}
      <div className="mt-4 md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <MapPinIcon className="h-8 w-8 text-gray-400 mr-3" />
            <div>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {location.display_name}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  Location ID: {location.loc_id}
                </div>
                {location.old_loc_id && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    Legacy ID: {location.old_loc_id}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate('/admin/locations')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to List
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-6">
        {location.active ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        )}
      </div>

      {/* Location Details */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Location Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detailed information about this location
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Display Name */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Display Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.display_name}</dd>
            </div>

            {/* MAJCOM */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">MAJCOM</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.majcom_cd || '—'}</dd>
            </div>

            {/* Site/Base */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Site/Base</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.site_cd || '—'}</dd>
            </div>

            {/* Unit */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Unit</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.unit_cd || '—'}</dd>
            </div>

            {/* Squad */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Squad</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.squad_cd || '—'}</dd>
            </div>

            {/* GEOLOC */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">GEOLOC</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.geoloc || '—'}</dd>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.description || '—'}</dd>
            </div>

            {/* Active Status */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {location.active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Audit Information */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Audit Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Record creation and modification history
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {/* Created By */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created By</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.ins_by || '—'}</dd>
            </div>

            {/* Created Date */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Created Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(location.ins_date)}</dd>
            </div>

            {/* Last Modified By */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Modified By</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.chg_by || '—'}</dd>
            </div>

            {/* Last Modified Date */}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Last Modified Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(location.chg_date)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
