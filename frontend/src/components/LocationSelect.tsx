import { useState, useEffect, useMemo } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

export interface Location {
  loc_id: number
  majcom_cd: string | null
  site_cd: string | null
  unit_cd: string | null
  squad_cd: string | null
  display_name: string
  description?: string | null
  geoloc?: string | null
  active?: boolean
}

interface LocationSelectProps {
  value: string | number
  onChange: (value: string) => void
  locations: Location[]
  majcoms?: string[] // Optional: pass in MAJCOM list if already available
  label?: string
  required?: boolean
  error?: string
  id?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function LocationSelect({
  value,
  onChange,
  locations,
  majcoms: providedMajcoms,
  label = 'Location',
  required = false,
  error,
  id = 'location',
  placeholder = 'Select location...',
  className = '',
  disabled = false,
}: LocationSelectProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMajcom, setSelectedMajcom] = useState<string>('all')

  // Extract unique MAJCOMs from locations if not provided
  const majcoms = useMemo(() => {
    if (providedMajcoms) return providedMajcoms

    const uniqueMajcoms = Array.from(
      new Set(
        locations
          .map(loc => loc.majcom_cd)
          .filter((majcom): majcom is string => majcom !== null && majcom !== undefined)
      )
    ).sort()

    return uniqueMajcoms
  }, [locations, providedMajcoms])

  // Filter locations based on search and MAJCOM filter
  const filteredLocations = useMemo(() => {
    let filtered = locations

    // Filter by MAJCOM if selected
    if (selectedMajcom !== 'all') {
      filtered = filtered.filter(loc => loc.majcom_cd === selectedMajcom)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(loc => {
        const displayText = getLocationDisplayText(loc).toLowerCase()
        return (
          displayText.includes(query) ||
          loc.majcom_cd?.toLowerCase().includes(query) ||
          loc.site_cd?.toLowerCase().includes(query) ||
          loc.unit_cd?.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  }, [locations, selectedMajcom, searchQuery])

  // Format location for display: BASE - UNIT (MAJCOM)
  function getLocationDisplayText(location: Location): string {
    const parts: string[] = []

    // Add Base/Site
    if (location.site_cd) {
      parts.push(location.site_cd)
    }

    // Add Unit
    if (location.unit_cd) {
      if (parts.length > 0) {
        parts.push(`- ${location.unit_cd}`)
      } else {
        parts.push(location.unit_cd)
      }
    }

    // Add MAJCOM in parentheses
    if (location.majcom_cd) {
      if (parts.length > 0) {
        parts.push(`(${location.majcom_cd})`)
      } else {
        parts.push(location.majcom_cd)
      }
    }

    // Fallback to display_name if no structured parts
    if (parts.length === 0) {
      return location.display_name
    }

    return parts.join(' ')
  }

  // Reset MAJCOM filter when locations change
  useEffect(() => {
    setSelectedMajcom('all')
  }, [locations])

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* MAJCOM Filter */}
      {majcoms.length > 1 && (
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={selectedMajcom}
              onChange={(e) => setSelectedMajcom(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              disabled={disabled}
            >
              <option value="all">All MAJCOMs</option>
              {majcoms.map(majcom => (
                <option key={majcom} value={majcom}>
                  {majcom}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locations..."
          className="block w-full pl-9 pr-3 py-2 text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          disabled={disabled}
        />
      </div>

      {/* Location Select Dropdown */}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full rounded-md shadow-sm text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        }`}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        size={Math.min(filteredLocations.length + 1, 10)} // Show multiple options at once
      >
        <option value="">{placeholder}</option>
        {filteredLocations.map(location => (
          <option key={location.loc_id} value={location.loc_id}>
            {getLocationDisplayText(location)}
          </option>
        ))}
      </select>

      {/* Show count of filtered results */}
      {(selectedMajcom !== 'all' || searchQuery) && (
        <p className="mt-1 text-xs text-gray-500">
          Showing {filteredLocations.length} of {locations.length} locations
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
