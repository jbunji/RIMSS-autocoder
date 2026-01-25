import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'

interface Code {
  code_id: number
  code_type: string
  code_value: string
  description: string | null
  active: boolean
  sort_order: number
  ins_by: string | null
  ins_date: string
  chg_by: string | null
  chg_date: string | null
}

interface CreateCodeFormData {
  code_type: string
  code_value: string
  description: string
  active: boolean
  sort_order: number
}

export default function CodeManagementPage() {
  const { token } = useAuthStore()
  const [codes, setCodes] = useState<Code[]>([])
  const [codeTypes, setCodeTypes] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>('')
  const [showInactive, setShowInactive] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Create/Edit modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCode, setEditingCode] = useState<Code | null>(null)
  const [formData, setFormData] = useState<CreateCodeFormData>({
    code_type: '',
    code_value: '',
    description: '',
    active: true,
    sort_order: 0,
  })

  // Message state
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadCodeTypes()
    loadCodes()
  }, [selectedType, showInactive])

  const loadCodeTypes = async () => {
    try {
      const response = await fetch('/api/admin/code-types', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCodeTypes(data.code_types || [])
      }
    } catch (error) {
      console.error('Error loading code types:', error)
    }
  }

  const loadCodes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedType) params.append('code_type', selectedType)
      if (showInactive) params.append('active', 'false')
      else params.append('active', 'true')

      const response = await fetch(`/api/admin/codes?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCodes(data.codes || [])
      } else {
        showMessage('error', 'Failed to load codes')
      }
    } catch (error) {
      console.error('Error loading codes:', error)
      showMessage('error', 'Error loading codes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCode = async () => {
    try {
      const response = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        showMessage('success', 'Code created successfully')
        setShowCreateModal(false)
        resetForm()
        loadCodes()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'Failed to create code')
      }
    } catch (error) {
      console.error('Error creating code:', error)
      showMessage('error', 'Error creating code')
    }
  }

  const handleUpdateCode = async () => {
    if (!editingCode) return

    try {
      const response = await fetch(`/api/admin/codes/${editingCode.code_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code_value: formData.code_value,
          description: formData.description,
          active: formData.active,
          sort_order: formData.sort_order,
        }),
      })

      if (response.ok) {
        showMessage('success', 'Code updated successfully')
        setEditingCode(null)
        setShowCreateModal(false)
        resetForm()
        loadCodes()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'Failed to update code')
      }
    } catch (error) {
      console.error('Error updating code:', error)
      showMessage('error', 'Error updating code')
    }
  }

  const handleDeactivateCode = async (code: Code) => {
    if (!confirm(`Are you sure you want to deactivate "${code.code_type}/${code.code_value}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/codes/${code.code_id}/deactivate`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        showMessage('success', 'Code deactivated successfully')
        loadCodes()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'Failed to deactivate code')
      }
    } catch (error) {
      console.error('Error deactivating code:', error)
      showMessage('error', 'Error deactivating code')
    }
  }

  const handleReactivateCode = async (code: Code) => {
    try {
      const response = await fetch(`/api/admin/codes/${code.code_id}/activate`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        showMessage('success', 'Code reactivated successfully')
        loadCodes()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'Failed to reactivate code')
      }
    } catch (error) {
      console.error('Error reactivating code:', error)
      showMessage('error', 'Error reactivating code')
    }
  }

  const handleDeleteCode = async (code: Code) => {
    if (!confirm(`Are you sure you want to PERMANENTLY DELETE "${code.code_type}/${code.code_value}"? This cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/codes/${code.code_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        showMessage('success', 'Code deleted successfully')
        loadCodes()
      } else {
        const error = await response.json()
        showMessage('error', error.error || 'Failed to delete code')
      }
    } catch (error) {
      console.error('Error deleting code:', error)
      showMessage('error', 'Error deleting code')
    }
  }

  const openEditModal = (code: Code) => {
    setEditingCode(code)
    setFormData({
      code_type: code.code_type,
      code_value: code.code_value,
      description: code.description || '',
      active: code.active,
      sort_order: code.sort_order,
    })
    setShowCreateModal(true)
  }

  const resetForm = () => {
    setFormData({
      code_type: '',
      code_value: '',
      description: '',
      active: true,
      sort_order: 0,
    })
    setEditingCode(null)
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const filteredCodes = codes.filter(
    (code) =>
      code.code_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.code_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Code Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage code table values (soft delete supported)</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowCreateModal(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Code
            </button>
          </div>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div
            className={`p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Code Type Filter */}
            <div>
              <label htmlFor="code-type-filter" className="block text-sm font-medium text-gray-700">
                Code Type
              </label>
              <select
                id="code-type-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                {codeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Show Inactive Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status Filter</label>
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  id="show-inactive"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="show-inactive" className="ml-2 block text-sm text-gray-900">
                  Show inactive codes
                </label>
              </div>
            </div>

            {/* Search */}
            <div className="sm:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by type, value, or description..."
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Codes Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sort Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No codes found
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map((code) => (
                    <tr key={code.code_id} className={code.active ? '' : 'bg-gray-50 opacity-60'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {code.code_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.code_value}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{code.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            code.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {code.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{code.sort_order}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(code)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        {code.active ? (
                          <button
                            onClick={() => handleDeactivateCode(code)}
                            className="text-orange-600 hover:text-orange-900 mr-3"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReactivateCode(code)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCode(code)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowCreateModal(false)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editingCode ? 'Edit Code' : 'Create New Code'}
                </h3>

                <div className="space-y-4">
                  {/* Code Type */}
                  <div>
                    <label htmlFor="code-type" className="block text-sm font-medium text-gray-700">
                      Code Type <span className="text-red-500">*</span>
                    </label>
                    {editingCode ? (
                      <input
                        type="text"
                        id="code-type"
                        value={formData.code_type}
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        id="code-type"
                        value={formData.code_type}
                        onChange={(e) => setFormData({ ...formData, code_type: e.target.value })}
                        required
                        maxLength={50}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    )}
                  </div>

                  {/* Code Value */}
                  <div>
                    <label htmlFor="code-value" className="block text-sm font-medium text-gray-700">
                      Code Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="code-value"
                      value={formData.code_value}
                      onChange={(e) => setFormData({ ...formData, code_value: e.target.value })}
                      required
                      maxLength={50}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      maxLength={255}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      id="sort-order"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Active */}
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Inactive codes won't appear in dropdowns but existing records will still show the value
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={editingCode ? handleUpdateCode : handleCreateCode}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {editingCode ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
