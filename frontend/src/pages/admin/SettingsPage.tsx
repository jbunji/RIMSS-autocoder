import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useToastContext } from '../../contexts/ToastContext'

interface Setting {
  var_id: number
  var_name: string
  var_value: string
  var_desc: string
  active: boolean
  ins_by: string | null
  ins_date: string
  chg_by: string | null
  chg_date: string | null
}

export default function SettingsPage() {
  const { token } = useAuthStore()
  const { showToast } = useToastContext()
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingValues, setEditingValues] = useState<{ [key: string]: string }>({})
  const [savingSettings, setSavingSettings] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()
      setSettings(data.settings)

      // Initialize editing values with current values
      const initialValues: { [key: string]: string } = {}
      data.settings.forEach((setting: Setting) => {
        initialValues[setting.var_name] = setting.var_value
      })
      setEditingValues(initialValues)
    } catch (error) {
      console.error('Error fetching settings:', error)
      showToast('Failed to load settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSetting = async (varName: string) => {
    try {
      setSavingSettings(prev => ({ ...prev, [varName]: true }))

      const response = await fetch(`http://localhost:3001/api/settings/${varName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          var_value: editingValues[varName],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update setting')
      }

      const data = await response.json()

      // Update the settings list with the new value
      setSettings(prev =>
        prev.map(s => s.var_name === varName ? data.setting : s)
      )

      showToast('Setting updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating setting:', error)
      showToast('Failed to update setting', 'error')
    } finally {
      setSavingSettings(prev => ({ ...prev, [varName]: false }))
    }
  }

  const handleValueChange = (varName: string, value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [varName]: value,
    }))
  }

  const getSettingLabel = (varName: string): string => {
    switch (varName) {
      case 'session_timeout':
        return 'Session Timeout (minutes)'
      default:
        return varName.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    }
  }

  const getSettingInputType = (varName: string): string => {
    if (varName.includes('timeout') || varName.includes('minutes')) {
      return 'number'
    }
    return 'text'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure system-wide settings. Changes take effect immediately.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {settings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No settings found
            </div>
          ) : (
            settings.map((setting) => {
              const hasChanged = editingValues[setting.var_name] !== setting.var_value
              const isSaving = savingSettings[setting.var_name]

              return (
                <div key={setting.var_id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <label
                        htmlFor={`setting-${setting.var_name}`}
                        className="block text-sm font-medium text-gray-900 mb-1"
                      >
                        {getSettingLabel(setting.var_name)}
                      </label>
                      {setting.var_desc && (
                        <p className="text-sm text-gray-500 mb-3">
                          {setting.var_desc}
                        </p>
                      )}
                      <div className="flex items-center space-x-3">
                        <input
                          id={`setting-${setting.var_name}`}
                          type={getSettingInputType(setting.var_name)}
                          value={editingValues[setting.var_name] || ''}
                          onChange={(e) => handleValueChange(setting.var_name, e.target.value)}
                          className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          min={getSettingInputType(setting.var_name) === 'number' ? '1' : undefined}
                        />
                        <button
                          onClick={() => handleSaveSetting(setting.var_name)}
                          disabled={!hasChanged || isSaving}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            hasChanged && !isSaving
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                    {setting.chg_date && (
                      <div className="text-xs text-gray-500 text-right">
                        <div>Last modified by: {setting.chg_by || 'Unknown'}</div>
                        <div>
                          {new Date(setting.chg_date).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {settings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Important Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  All changes to system settings are logged in the audit log and take effect immediately.
                  Please ensure you understand the impact of changing these values before saving.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
