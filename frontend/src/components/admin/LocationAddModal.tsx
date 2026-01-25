import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'

interface LocationAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function LocationAddModal({ isOpen, onClose, onSuccess }: LocationAddModalProps) {
  const { token } = useAuthStore()
  const [formData, setFormData] = useState({
    display_name: '',
    majcom_cd: '',
    site_cd: '',
    unit_cd: '',
    squad_cd: '',
    description: '',
    geoloc: '',
    active: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create location')
      }

      // Reset form
      setFormData({
        display_name: '',
        majcom_cd: '',
        site_cd: '',
        unit_cd: '',
        squad_cd: '',
        description: '',
        geoloc: '',
        active: true
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating location:', err)
      setError(err instanceof Error ? err.message : 'Failed to create location')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Add New Location
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Create a new location record. All fields except Display Name are optional.
                      </p>
                    </div>

                    {error && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      {/* Display Name */}
                      <div>
                        <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                          Display Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="display_name"
                          name="display_name"
                          required
                          value={formData.display_name}
                          onChange={handleChange}
                          placeholder="e.g., Main Warehouse"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* MAJCOM */}
                      <div>
                        <label htmlFor="majcom_cd" className="block text-sm font-medium text-gray-700">
                          MAJCOM
                        </label>
                        <input
                          type="text"
                          id="majcom_cd"
                          name="majcom_cd"
                          value={formData.majcom_cd}
                          onChange={handleChange}
                          placeholder="e.g., ACC"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* Site Code */}
                      <div>
                        <label htmlFor="site_cd" className="block text-sm font-medium text-gray-700">
                          Site Code (Base)
                        </label>
                        <input
                          type="text"
                          id="site_cd"
                          name="site_cd"
                          value={formData.site_cd}
                          onChange={handleChange}
                          placeholder="e.g., JBSA"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* Unit Code */}
                      <div>
                        <label htmlFor="unit_cd" className="block text-sm font-medium text-gray-700">
                          Unit Code
                        </label>
                        <input
                          type="text"
                          id="unit_cd"
                          name="unit_cd"
                          value={formData.unit_cd}
                          onChange={handleChange}
                          placeholder="e.g., 433"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* Squad Code */}
                      <div>
                        <label htmlFor="squad_cd" className="block text-sm font-medium text-gray-700">
                          Squad Code
                        </label>
                        <input
                          type="text"
                          id="squad_cd"
                          name="squad_cd"
                          value={formData.squad_cd}
                          onChange={handleChange}
                          placeholder="e.g., A"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Optional description..."
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* Geolocation */}
                      <div>
                        <label htmlFor="geoloc" className="block text-sm font-medium text-gray-700">
                          Geolocation
                        </label>
                        <input
                          type="text"
                          id="geoloc"
                          name="geoloc"
                          value={formData.geoloc}
                          onChange={handleChange}
                          placeholder="e.g., 35.1234,-120.5678"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        />
                      </div>

                      {/* Active Status */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="active"
                          name="active"
                          checked={formData.active}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Creating...' : 'Create Location'}
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
  )
}
