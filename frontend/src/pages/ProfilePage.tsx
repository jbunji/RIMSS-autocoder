import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { PencilIcon, XMarkIcon, CheckIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

// Helper function to format role display
function formatRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'Administrator'
    case 'DEPOT_MANAGER':
      return 'Depot Manager'
    case 'FIELD_TECHNICIAN':
      return 'Field Technician'
    case 'VIEWER':
      return 'Viewer'
    default:
      return role
  }
}

// Helper function to get role badge color
function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'ADMIN':
      return 'bg-red-100 text-red-800'
    case 'DEPOT_MANAGER':
      return 'bg-blue-100 text-blue-800'
    case 'FIELD_TECHNICIAN':
      return 'bg-green-100 text-green-800'
    case 'VIEWER':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function ProfilePage() {
  const { user, setUser, token } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Form state for editing
  const [formData, setFormData] = useState({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  })

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] = useState(false)
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  const handleEditClick = () => {
    setFormData({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    })
    setIsEditing(true)
    setSuccessMessage('')
    setErrorMessage('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setErrorMessage('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to update profile')
        setIsSaving(false)
        return
      }

      // Update the user in the store
      setUser(data.user)
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Password change handlers
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true)
    setPasswordSuccessMessage('')
    setPasswordErrorMessage('')
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false)
    setPasswordErrorMessage('')
    setPasswordFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleSavePassword = async () => {
    setIsChangingPasswordLoading(true)
    setPasswordErrorMessage('')
    setPasswordSuccessMessage('')

    // Client-side validation
    if (!passwordFormData.currentPassword || !passwordFormData.newPassword || !passwordFormData.confirmPassword) {
      setPasswordErrorMessage('All password fields are required')
      setIsChangingPasswordLoading(false)
      return
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordErrorMessage('New passwords do not match')
      setIsChangingPasswordLoading(false)
      return
    }

    // Validate new password requirements
    if (passwordFormData.newPassword.length < 12) {
      setPasswordErrorMessage('Password must be at least 12 characters')
      setIsChangingPasswordLoading(false)
      return
    }
    if (!/[A-Z]/.test(passwordFormData.newPassword)) {
      setPasswordErrorMessage('Password must contain at least one uppercase letter')
      setIsChangingPasswordLoading(false)
      return
    }
    if (!/[a-z]/.test(passwordFormData.newPassword)) {
      setPasswordErrorMessage('Password must contain at least one lowercase letter')
      setIsChangingPasswordLoading(false)
      return
    }
    if (!/[0-9]/.test(passwordFormData.newPassword)) {
      setPasswordErrorMessage('Password must contain at least one number')
      setIsChangingPasswordLoading(false)
      return
    }
    if (!/[^A-Za-z0-9]/.test(passwordFormData.newPassword)) {
      setPasswordErrorMessage('Password must contain at least one special character')
      setIsChangingPasswordLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordFormData),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordErrorMessage(data.error || 'Failed to change password')
        setIsChangingPasswordLoading(false)
        return
      }

      setIsChangingPassword(false)
      setPasswordSuccessMessage('Password changed successfully!')
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      // Clear success message after 3 seconds
      setTimeout(() => setPasswordSuccessMessage(''), 5000)
    } catch (error) {
      setPasswordErrorMessage('Network error. Please try again.')
    } finally {
      setIsChangingPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary-600 px-6 py-8">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-primary-600 text-3xl font-bold">
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-primary-200">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-6 py-6">
          {isEditing ? (
            /* Edit Form */
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              {/* First Name Field */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              {/* Last Name Field */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <dl className="divide-y divide-gray-200">
              {/* Username */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-mono">
                  {user.username}
                </dd>
              </div>

              {/* Email */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {user.email}
                </dd>
              </div>

              {/* Full Name */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {user.first_name} {user.last_name}
                </dd>
              </div>

              {/* Role */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    {formatRole(user.role)}
                  </span>
                </dd>
              </div>

              {/* Assigned Programs */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Assigned Programs</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {user.programs && user.programs.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.programs.map((program) => (
                        <span
                          key={program.pgm_id}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            program.is_default
                              ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-600'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {program.pgm_cd}
                          {program.is_default && (
                            <span className="ml-1 text-primary-600">(default)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No programs assigned</span>
                  )}
                </dd>
              </div>

              {/* Assigned Locations */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Assigned Locations</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {user.locations && user.locations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.locations.map((location) => (
                        <span
                          key={location.loc_id}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            location.is_default
                              ? 'bg-primary-100 text-primary-800 ring-1 ring-primary-600'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {location.display_name}
                          {location.is_default && (
                            <span className="ml-1 text-primary-600">(default)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">No locations assigned</span>
                  )}
                </dd>
              </div>

              {/* User ID (for reference) */}
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0 font-mono">
                  #{user.user_id}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {/* Program Details Section */}
        {user.programs && user.programs.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Program Details</h3>
            <div className="space-y-3">
              {user.programs.map((program) => (
                <div
                  key={program.pgm_id}
                  className={`p-4 rounded-lg ${
                    program.is_default ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{program.pgm_cd}</p>
                      <p className="text-sm text-gray-500">{program.pgm_name}</p>
                    </div>
                    {program.is_default && (
                      <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <KeyIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            </div>
            {!isChangingPassword && (
              <button
                onClick={handleChangePasswordClick}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change Password
              </button>
            )}
          </div>

          {/* Password Success Message */}
          {passwordSuccessMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">{passwordSuccessMessage}</p>
            </div>
          )}

          {/* Password Error Message */}
          {passwordErrorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{passwordErrorMessage}</p>
            </div>
          )}

          {isChangingPassword ? (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordFormData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={passwordFormData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 12 characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancelPasswordChange}
                  disabled={isChangingPasswordLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <XMarkIcon className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePassword}
                  disabled={isChangingPasswordLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isChangingPasswordLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2" />
                      Save Password
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Click the button above to change your password. You will need to enter your current password to verify your identity.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
