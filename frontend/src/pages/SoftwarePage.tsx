import { useState, useEffect, Fragment } from 'react'
import {
  CodeBracketIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  PlusIcon,
  XMarkIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { useAuthStore } from '../stores/authStore'

// Software interface matching backend response
interface Software {
  sw_id: number
  sw_number: string
  sw_title: string
  sw_type: string
  revision: string
  revision_date: string
  effective_date: string
  cpin: string | null
  sw_desc: string | null
  pgm_id: number
  active: boolean
  program?: {
    pgm_id: number
    pgm_cd: string
    pgm_name: string
  }
}

interface SoftwareResponse {
  software: Software[]
  total: number
}

type SortField = 'sw_number' | 'sw_title' | 'revision' | 'sw_type' | 'revision_date' | 'effective_date'
type SortDirection = 'asc' | 'desc'

// Programs interface
interface Program {
  pgm_id: number
  pgm_cd: string
  pgm_name: string
}

export default function SoftwarePage() {
  const { token, user } = useAuthStore()
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('sw_number')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [programs, setPrograms] = useState<Program[]>([])

  // Form state
  const [formData, setFormData] = useState({
    sw_number: '',
    sw_type: 'FIRMWARE',
    revision: '',
    sw_title: '',
    sw_desc: '',
    effective_date: new Date().toISOString().split('T')[0],
    cpin: false,
    pgm_id: user?.programs?.[0]?.pgm_id || 1,
  })

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

  // Set programs from user's assigned programs
  useEffect(() => {
    if (user && user.programs) {
      setPrograms(user.programs)
    }
  }, [user])

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

      if (sortField === 'revision_date' || sortField === 'effective_date') {
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
    // Parse date as local date (not UTC) to avoid timezone shift
    const [year, month, day] = dateStr.split('T')[0].split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Get unique software types for filter
  const softwareTypes = Array.from(new Set(software.map(sw => sw.sw_type))).sort()

  // Handle form submission (Create)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)

    try {
      const response = await fetch('http://localhost:3001/api/software', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create software')
      }

      // Success - close modal and refresh list
      setShowAddModal(false)
      setFormData({
        sw_number: '',
        sw_type: 'FIRMWARE',
        revision: '',
        sw_title: '',
        sw_desc: '',
        effective_date: new Date().toISOString().split('T')[0],
        cpin: false,
        pgm_id: user?.programs?.[0]?.pgm_id || 1,
      })
      fetchSoftware()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error creating software:', err)
    } finally {
      setSaving(false)
    }
  }

  // Handle edit click
  const handleEditClick = (sw: Software) => {
    setEditingSoftware(sw)
    setFormData({
      sw_number: sw.sw_number,
      sw_type: sw.sw_type,
      revision: sw.revision,
      sw_title: sw.sw_title,
      sw_desc: sw.sw_desc || '',
      effective_date: sw.effective_date,
      cpin: sw.cpin === 'Yes',
      pgm_id: sw.pgm_id,
    })
    setShowEditModal(true)
  }

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSoftware) return

    setSaving(true)
    setSaveError(null)

    try {
      const response = await fetch(`http://localhost:3001/api/software/${editingSoftware.sw_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update software')
      }

      // Success - close modal and refresh list
      setShowEditModal(false)
      setEditingSoftware(null)
      setFormData({
        sw_number: '',
        sw_type: 'FIRMWARE',
        revision: '',
        sw_title: '',
        sw_desc: '',
        effective_date: new Date().toISOString().split('T')[0],
        cpin: false,
        pgm_id: user?.programs?.[0]?.pgm_id || 1,
      })
      fetchSoftware()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error updating software:', err)
    } finally {
      setSaving(false)
    }
  }

  // Check if user can create/edit software (admin only)
  const canEdit = user?.role === 'ADMIN'

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
        {canEdit && (
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Software
            </button>
          </div>
        )}
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
                    onClick={() => handleSort('effective_date')}
                  >
                    <div className="flex items-center">
                      Effective Date
                      {getSortIcon('effective_date')}
                    </div>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    CPIN
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Program
                  </th>
                  {canEdit && (
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAndSortedSoftware.map((sw) => (
                  <tr key={sw.sw_id} className="hover:bg-gray-50 cursor-pointer transition-colors">
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
                      {formatDate(sw.effective_date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {sw.cpin || '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {sw.program?.pgm_cd || '—'}
                    </td>
                    {canEdit && (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEditClick(sw)}
                          className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </td>
                    )}
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

      {/* Add Software Modal */}
      <Transition.Root show={showAddModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowAddModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={() => setShowAddModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CodeBracketIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Add New Software Version
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Create a new software version record in the catalog.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        {/* Software Number */}
                        <div>
                          <label htmlFor="sw_number" className="block text-sm font-medium text-gray-700">
                            Software Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="sw_number"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_number}
                            onChange={(e) => setFormData({ ...formData, sw_number: e.target.value })}
                            placeholder="e.g., SW-CAM-CTRL-001"
                          />
                        </div>

                        {/* Software Type */}
                        <div>
                          <label htmlFor="sw_type" className="block text-sm font-medium text-gray-700">
                            Software Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="sw_type"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_type}
                            onChange={(e) => setFormData({ ...formData, sw_type: e.target.value })}
                          >
                            <option value="FIRMWARE">FIRMWARE</option>
                            <option value="APPLICATION">APPLICATION</option>
                            <option value="DSP">DSP</option>
                            <option value="OS">OS</option>
                            <option value="DRIVER">DRIVER</option>
                            <option value="UTILITY">UTILITY</option>
                          </select>
                        </div>

                        {/* Revision */}
                        <div>
                          <label htmlFor="revision" className="block text-sm font-medium text-gray-700">
                            Revision/Version <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="revision"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.revision}
                            onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                            placeholder="e.g., 2.1.5"
                          />
                        </div>

                        {/* Title */}
                        <div>
                          <label htmlFor="sw_title" className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="sw_title"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_title}
                            onChange={(e) => setFormData({ ...formData, sw_title: e.target.value })}
                            placeholder="e.g., Camera Control Software"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="sw_desc" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="sw_desc"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_desc}
                            onChange={(e) => setFormData({ ...formData, sw_desc: e.target.value })}
                            placeholder="Brief description of the software"
                          />
                        </div>

                        {/* Effective Date */}
                        <div>
                          <label htmlFor="effective_date" className="block text-sm font-medium text-gray-700">
                            Effective Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            id="effective_date"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.effective_date}
                            onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                          />
                        </div>

                        {/* Program */}
                        <div>
                          <label htmlFor="pgm_id" className="block text-sm font-medium text-gray-700">
                            Program <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="pgm_id"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.pgm_id}
                            onChange={(e) => setFormData({ ...formData, pgm_id: parseInt(e.target.value, 10) })}
                          >
                            {programs.map((program) => (
                              <option key={program.pgm_id} value={program.pgm_id}>
                                {program.pgm_cd} - {program.pgm_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* CPIN Flag */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="cpin"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            checked={formData.cpin}
                            onChange={(e) => setFormData({ ...formData, cpin: e.target.checked })}
                          />
                          <label htmlFor="cpin" className="ml-2 block text-sm text-gray-900">
                            CPIN (Computer Program Identification Number)
                          </label>
                        </div>

                        {/* Error Message */}
                        {saveError && (
                          <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-800">{saveError}</p>
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-6 flex gap-3 justify-end">
                          <button
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setShowAddModal(false)}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                                Creating...
                              </>
                            ) : (
                              'Create Software'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Edit Software Modal */}
      <Transition.Root show={showEditModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setShowEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={() => setShowEditModal(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PencilIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Edit Software Version
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Update the software version details below.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
                        {/* Software Number */}
                        <div>
                          <label htmlFor="edit_sw_number" className="block text-sm font-medium text-gray-700">
                            Software Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="edit_sw_number"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_number}
                            onChange={(e) => setFormData({ ...formData, sw_number: e.target.value })}
                            placeholder="e.g., SW-CAM-CTRL-001"
                          />
                        </div>

                        {/* Software Type */}
                        <div>
                          <label htmlFor="edit_sw_type" className="block text-sm font-medium text-gray-700">
                            Software Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="edit_sw_type"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_type}
                            onChange={(e) => setFormData({ ...formData, sw_type: e.target.value })}
                          >
                            <option value="FIRMWARE">FIRMWARE</option>
                            <option value="APPLICATION">APPLICATION</option>
                            <option value="DSP">DSP</option>
                            <option value="OS">OS</option>
                            <option value="DRIVER">DRIVER</option>
                            <option value="UTILITY">UTILITY</option>
                          </select>
                        </div>

                        {/* Revision */}
                        <div>
                          <label htmlFor="edit_revision" className="block text-sm font-medium text-gray-700">
                            Revision/Version <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="edit_revision"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.revision}
                            onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                            placeholder="e.g., 2.1.5"
                          />
                        </div>

                        {/* Title */}
                        <div>
                          <label htmlFor="edit_sw_title" className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="edit_sw_title"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_title}
                            onChange={(e) => setFormData({ ...formData, sw_title: e.target.value })}
                            placeholder="e.g., Camera Control Software"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="edit_sw_desc" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="edit_sw_desc"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.sw_desc}
                            onChange={(e) => setFormData({ ...formData, sw_desc: e.target.value })}
                            placeholder="Brief description of the software"
                          />
                        </div>

                        {/* Effective Date */}
                        <div>
                          <label htmlFor="edit_effective_date" className="block text-sm font-medium text-gray-700">
                            Effective Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            id="edit_effective_date"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.effective_date}
                            onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                          />
                        </div>

                        {/* Program */}
                        <div>
                          <label htmlFor="edit_pgm_id" className="block text-sm font-medium text-gray-700">
                            Program <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="edit_pgm_id"
                            required
                            className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={formData.pgm_id}
                            onChange={(e) => setFormData({ ...formData, pgm_id: parseInt(e.target.value, 10) })}
                          >
                            {programs.map((program) => (
                              <option key={program.pgm_id} value={program.pgm_id}>
                                {program.pgm_cd} - {program.pgm_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* CPIN Flag */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="edit_cpin"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                            checked={formData.cpin}
                            onChange={(e) => setFormData({ ...formData, cpin: e.target.checked })}
                          />
                          <label htmlFor="edit_cpin" className="ml-2 block text-sm text-gray-900">
                            CPIN (Computer Program Identification Number)
                          </label>
                        </div>

                        {/* Error Message */}
                        {saveError && (
                          <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-800">{saveError}</p>
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-6 flex gap-3 justify-end">
                          <button
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => setShowEditModal(false)}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              'Update Software'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}
