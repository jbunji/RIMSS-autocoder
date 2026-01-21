import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { Fragment } from 'react'
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'

// User role options
const ROLES = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'DEPOT_MANAGER', label: 'Depot Manager' },
  { value: 'FIELD_TECHNICIAN', label: 'Field Technician' },
  { value: 'VIEWER', label: 'Viewer' },
] as const

// Programs list
const PROGRAMS = [
  { pgm_id: 1, pgm_cd: 'CRIIS', pgm_name: 'Common Remotely Operated Integrated Reconnaissance System' },
  { pgm_id: 2, pgm_cd: 'ACTS', pgm_name: 'Advanced Targeting Capability System' },
  { pgm_id: 3, pgm_cd: 'ARDS', pgm_name: 'Airborne Reconnaissance Data System' },
  { pgm_id: 4, pgm_cd: '236', pgm_name: 'Program 236' },
]

// Zod schema for user creation
const createUserSchema = z.object({
  username: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().trim().email('Invalid email address'),
  first_name: z.string().trim().min(1, 'First name is required').max(50, 'First name must be at most 50 characters'),
  last_name: z.string().trim().min(1, 'Last name is required').max(50, 'Last name must be at most 50 characters'),
  role: z.enum(['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN', 'VIEWER'], {
    errorMap: () => ({ message: 'Please select a role' })
  }),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  program_ids: z.array(z.number()).min(1, 'At least one program must be selected'),
  location_ids: z.array(z.number()).optional(),
})

// Zod schema for user editing (password is optional, admin_password required when role changes)
const editUserSchema = z.object({
  username: z.string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().trim().email('Invalid email address'),
  first_name: z.string().trim().min(1, 'First name is required').max(50, 'First name must be at most 50 characters'),
  last_name: z.string().trim().min(1, 'Last name is required').max(50, 'Last name must be at most 50 characters'),
  role: z.enum(['ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN', 'VIEWER'], {
    errorMap: () => ({ message: 'Please select a role' })
  }),
  password: z.string()
    .refine(val => !val || val.length >= 12, 'Password must be at least 12 characters')
    .refine(val => !val || /[A-Z]/.test(val), 'Password must contain at least one uppercase letter')
    .refine(val => !val || /[a-z]/.test(val), 'Password must contain at least one lowercase letter')
    .refine(val => !val || /[0-9]/.test(val), 'Password must contain at least one number')
    .refine(val => !val || /[^A-Za-z0-9]/.test(val), 'Password must contain at least one special character')
    .optional(),
  program_ids: z.array(z.number()).min(1, 'At least one program must be selected'),
  default_program_id: z.number().optional(),
  location_ids: z.array(z.number()).optional(),
  default_location_id: z.number().optional(),
  admin_password: z.string().optional(),
})

type CreateUserFormData = z.infer<typeof createUserSchema>
type EditUserFormData = z.infer<typeof editUserSchema>

interface User {
  user_id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  active: boolean
  programs: Array<{
    pgm_id: number
    pgm_cd: string
    pgm_name: string
    is_default: boolean
  }>
  locations?: Array<{
    loc_id: number
    display_name: string
    is_default: boolean
  }>
}

export default function UsersPage() {
  const { token } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedPrograms, setSelectedPrograms] = useState<number[]>([])
  const [editSelectedPrograms, setEditSelectedPrograms] = useState<number[]>([])
  const [editDefaultProgramId, setEditDefaultProgramId] = useState<number | null>(null)
  const [originalRole, setOriginalRole] = useState<string | null>(null)
  const [isRoleChanged, setIsRoleChanged] = useState(false)

  // Location state
  const [locations, setLocations] = useState<Array<{ loc_id: number; display_name: string }>>([])
  const [selectedLocations, setSelectedLocations] = useState<number[]>([])
  const [editSelectedLocations, setEditSelectedLocations] = useState<number[]>([])
  const [editDefaultLocationId, setEditDefaultLocationId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: undefined,
      password: '',
      program_ids: [],
    },
  })

  // Edit form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: undefined,
      password: '',
      program_ids: [],
    },
  })

  // Fetch users and locations on component mount
  useEffect(() => {
    fetchUsers()
    fetchLocations()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLocations(data.locations || [])
      } else {
        console.error('Failed to fetch locations')
      }
    } catch (err) {
      console.error('Error fetching locations:', err)
    }
  }

  const handleProgramToggle = (programId: number) => {
    setSelectedPrograms(prev => {
      const newSelection = prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
      setValue('program_ids', newSelection, { shouldValidate: true })
      return newSelection
    })
  }

  const handleEditProgramToggle = (programId: number) => {
    setEditSelectedPrograms(prev => {
      const newSelection = prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
      setValueEdit('program_ids', newSelection, { shouldValidate: true })

      // If the unchecked program was the default, reset default to first selected
      if (!newSelection.includes(editDefaultProgramId || 0)) {
        const newDefault = newSelection[0] || null
        setEditDefaultProgramId(newDefault)
        setValueEdit('default_program_id', newDefault ?? undefined)
      }

      return newSelection
    })
  }

  const handleEditDefaultProgramChange = (programId: number) => {
    setEditDefaultProgramId(programId)
    setValueEdit('default_program_id', programId)
  }

  // Location handlers (similar to program handlers)
  const handleLocationToggle = (locationId: number) => {
    setSelectedLocations(prev => {
      const newSelection = prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
      setValue('location_ids', newSelection)
      return newSelection
    })
  }

  const handleEditLocationToggle = (locationId: number) => {
    setEditSelectedLocations(prev => {
      const newSelection = prev.includes(locationId)
        ? prev.filter(id => id !== locationId)
        : [...prev, locationId]
      setValueEdit('location_ids', newSelection)

      // If the unchecked location was the default, reset default to first selected
      if (!newSelection.includes(editDefaultLocationId || 0)) {
        const newDefault = newSelection[0] || null
        setEditDefaultLocationId(newDefault)
        setValueEdit('default_location_id', newDefault ?? undefined)
      }

      return newSelection
    })
  }

  const handleEditDefaultLocationChange = (locationId: number) => {
    setEditDefaultLocationId(locationId)
    setValueEdit('default_location_id', locationId)
  }

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setError(null)
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage(`User "${result.user.username}" created successfully!`)
        setIsModalOpen(false)
        reset()
        setSelectedPrograms([])
        setSelectedLocations([])
        fetchUsers() // Refresh the user list

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create user')
      }
    } catch (err) {
      setError('Failed to create user. Please try again.')
      console.error('Error creating user:', err)
    }
  }

  const openModal = () => {
    reset()
    setSelectedPrograms([])
    setSelectedLocations([])
    setError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    reset()
    setSelectedPrograms([])
    setSelectedLocations([])
    setError(null)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setError(null)
    setOriginalRole(user.role)
    setIsRoleChanged(false)
    // Find the default program
    const defaultProgram = user.programs?.find(p => p.is_default)
    const defaultProgramId = defaultProgram?.pgm_id || (user.programs?.[0]?.pgm_id ?? null)
    // Pre-fill form with user data
    resetEdit({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role as 'ADMIN' | 'DEPOT_MANAGER' | 'FIELD_TECHNICIAN' | 'VIEWER',
      password: '',
      program_ids: user.programs?.map(p => p.pgm_id) || [],
      default_program_id: defaultProgramId ?? undefined,
      admin_password: '',
    })
    setEditSelectedPrograms(user.programs?.map(p => p.pgm_id) || [])
    setEditDefaultProgramId(defaultProgramId)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingUser(null)
    resetEdit()
    setEditSelectedPrograms([])
    setEditDefaultProgramId(null)
    setOriginalRole(null)
    setIsRoleChanged(false)
    setError(null)
  }

  const openDeleteModal = (user: User) => {
    setDeletingUser(user)
    setError(null)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setDeletingUser(null)
    setError(null)
  }

  const handleDelete = async () => {
    if (!deletingUser) return

    try {
      setIsDeleting(true)
      setError(null)
      const response = await fetch(`http://localhost:3001/api/users/${deletingUser.user_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage(`User "${deletingUser.username}" deleted successfully!`)
        setIsDeleteModalOpen(false)
        setDeletingUser(null)
        fetchUsers() // Refresh the user list

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to delete user')
      }
    } catch (err) {
      setError('Failed to delete user. Please try again.')
      console.error('Error deleting user:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const onEditSubmit = async (data: EditUserFormData) => {
    if (!editingUser) return

    // Check if role is being changed
    const roleChanged = originalRole !== data.role

    // If role is being changed, require admin password
    if (roleChanged && (!data.admin_password || data.admin_password.trim() === '')) {
      setError('Admin password is required when changing user roles')
      return
    }

    try {
      setError(null)
      const payload: Record<string, unknown> = {
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        program_ids: data.program_ids,
        default_program_id: editDefaultProgramId || data.program_ids[0],
      }

      // Only include password if provided
      if (data.password && data.password.length > 0) {
        payload.password = data.password
      }

      // Include admin password if role is being changed
      if (roleChanged && data.admin_password) {
        payload.admin_password = data.admin_password
      }

      const response = await fetch(`http://localhost:3001/api/users/${editingUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage(`User "${result.user.username}" updated successfully!`)
        setIsEditModalOpen(false)
        setEditingUser(null)
        resetEdit()
        setEditSelectedPrograms([])
        setOriginalRole(null)
        setIsRoleChanged(false)
        fetchUsers() // Refresh the user list

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update user')
      }
    } catch (err) {
      setError('Failed to update user. Please try again.')
      console.error('Error updating user:', err)
    }
  }

  const getRoleBadgeColor = (role: string) => {
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

  const getRoleLabel = (role: string) => {
    const roleObj = ROLES.find(r => r.value === role)
    return roleObj ? roleObj.label : role
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts, roles, and program assignments
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add User
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !isModalOpen && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programs
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found. Click "Add User" to create one.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium text-sm">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.programs?.map((program) => (
                        <span
                          key={program.pgm_id}
                          className={`px-2 py-0.5 text-xs rounded ${
                            program.is_default
                              ? 'bg-primary-100 text-primary-800 font-semibold ring-1 ring-primary-300'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                          title={program.is_default ? 'Default program' : ''}
                        >
                          {program.pgm_cd}{program.is_default && ' ★'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-primary-600 hover:text-primary-900 mr-4"
                      onClick={() => openEditModal(user)}
                      title="Edit user"
                      aria-label="Edit user"
                    >
                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Delete user"
                      onClick={() => openDeleteModal(user)}
                      aria-label="Delete user"
                    >
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <UserPlusIcon className="h-6 w-6 mr-2 text-primary-600" />
                    Add New User
                  </Dialog.Title>

                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    {/* Error display inside modal */}
                    {error && (
                      <div className="rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    {/* Username */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        {...register('username')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.username
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="john_doe"
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="john.doe@example.mil"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          {...register('first_name')}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.first_name
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          placeholder="John"
                        />
                        {errors.first_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          {...register('last_name')}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.last_name
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          placeholder="Doe"
                        />
                        {errors.last_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Role Select */}
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="role"
                        {...register('role')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.role
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      >
                        <option value="">Select a role...</option>
                        {ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors.role && (
                        <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                      )}
                    </div>

                    {/* Program Assignments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Program Assignments <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Select one or more programs</p>
                      <div className="mt-2 space-y-2">
                        {PROGRAMS.map((program) => (
                          <label
                            key={program.pgm_id}
                            className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                              selectedPrograms.includes(program.pgm_id)
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPrograms.includes(program.pgm_id)}
                              onChange={() => handleProgramToggle(program.pgm_id)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <div className="ml-3">
                              <span className="text-sm font-medium text-gray-900">{program.pgm_cd}</span>
                              <span className="text-xs text-gray-500 ml-2">- {program.pgm_name}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.program_ids && (
                        <p className="mt-1 text-sm text-red-600">{errors.program_ids.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        {...register('password')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="Enter password"
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Min 12 characters, must include uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Creating...' : 'Create User'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit User Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <PencilIcon className="h-6 w-6 mr-2 text-primary-600" />
                    Edit User: {editingUser?.username}
                  </Dialog.Title>

                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    onClick={closeEditModal}
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <form onSubmit={handleSubmitEdit(onEditSubmit)} className="mt-4 space-y-4">
                    {/* Error display inside modal */}
                    {error && isEditModalOpen && (
                      <div className="rounded-md bg-red-50 p-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    {/* Username */}
                    <div>
                      <label htmlFor="edit_username" className="block text-sm font-medium text-gray-700">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="edit_username"
                        {...registerEdit('username')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errorsEdit.username
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="john_doe"
                      />
                      {errorsEdit.username && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.username.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="edit_email" className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="edit_email"
                        {...registerEdit('email')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errorsEdit.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="john.doe@example.mil"
                      />
                      {errorsEdit.email && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.email.message}</p>
                      )}
                    </div>

                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="edit_first_name" className="block text-sm font-medium text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="edit_first_name"
                          {...registerEdit('first_name')}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errorsEdit.first_name
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          placeholder="John"
                        />
                        {errorsEdit.first_name && (
                          <p className="mt-1 text-sm text-red-600">{errorsEdit.first_name.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="edit_last_name" className="block text-sm font-medium text-gray-700">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="edit_last_name"
                          {...registerEdit('last_name')}
                          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errorsEdit.last_name
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                          }`}
                          placeholder="Doe"
                        />
                        {errorsEdit.last_name && (
                          <p className="mt-1 text-sm text-red-600">{errorsEdit.last_name.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Role Select */}
                    <div>
                      <label htmlFor="edit_role" className="block text-sm font-medium text-gray-700">
                        Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="edit_role"
                        {...registerEdit('role', {
                          onChange: (e) => {
                            setIsRoleChanged(e.target.value !== originalRole)
                          }
                        })}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errorsEdit.role
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                      >
                        <option value="">Select a role...</option>
                        {ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errorsEdit.role && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.role.message}</p>
                      )}
                    </div>

                    {/* Admin Password Confirmation (required when changing role) */}
                    {isRoleChanged && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-yellow-800">Security Verification Required</h3>
                            <p className="text-sm text-yellow-700 mt-1">
                              You are changing this user's role. Please enter your admin password to confirm this action.
                            </p>
                            <div className="mt-3">
                              <label htmlFor="admin_password" className="block text-sm font-medium text-gray-700">
                                Your Admin Password <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="password"
                                id="admin_password"
                                {...registerEdit('admin_password')}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                  errorsEdit.admin_password
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                                }`}
                                placeholder="Enter your admin password"
                                autoComplete="current-password"
                              />
                              {errorsEdit.admin_password && (
                                <p className="mt-1 text-sm text-red-600">{errorsEdit.admin_password.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Program Assignments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Program Assignments <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Select one or more programs, then set the default program</p>
                      <div className="mt-2 space-y-2">
                        {PROGRAMS.map((program) => {
                          const isSelected = editSelectedPrograms.includes(program.pgm_id)
                          const isDefault = editDefaultProgramId === program.pgm_id
                          return (
                            <div
                              key={program.pgm_id}
                              className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <label className="flex items-center cursor-pointer flex-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleEditProgramToggle(program.pgm_id)}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <div className="ml-3">
                                  <span className="text-sm font-medium text-gray-900">{program.pgm_cd}</span>
                                  <span className="text-xs text-gray-500 ml-2">- {program.pgm_name}</span>
                                </div>
                              </label>
                              {isSelected && (
                                <div className="flex items-center ml-4">
                                  <input
                                    type="radio"
                                    name="default_program"
                                    checked={isDefault}
                                    onChange={() => handleEditDefaultProgramChange(program.pgm_id)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                  />
                                  <span className={`ml-2 text-xs ${isDefault ? 'text-primary-700 font-semibold' : 'text-gray-500'}`}>
                                    {isDefault ? 'Default' : 'Set as Default'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      {errorsEdit.program_ids && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.program_ids.message}</p>
                      )}
                    </div>

                    {/* Password (optional for edit) */}
                    <div>
                      <label htmlFor="edit_password" className="block text-sm font-medium text-gray-700">
                        Password <span className="text-gray-400">(leave blank to keep current)</span>
                      </label>
                      <input
                        type="password"
                        id="edit_password"
                        {...registerEdit('password')}
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errorsEdit.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                        }`}
                        placeholder="Enter new password (optional)"
                      />
                      {errorsEdit.password && (
                        <p className="mt-1 text-sm text-red-600">{errorsEdit.password.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        If changing password: min 12 characters, must include uppercase, lowercase, number, and special character
                      </p>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingEdit}
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDeleteModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <TrashIcon className="h-6 w-6 mr-2 text-red-600" />
                    Delete User
                  </Dialog.Title>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the user{' '}
                      <span className="font-semibold text-gray-900">
                        {deletingUser?.username}
                      </span>
                      ? This action cannot be undone.
                    </p>

                    {deletingUser && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {deletingUser.first_name} {deletingUser.last_name}
                          </p>
                          <p className="text-gray-500">{deletingUser.email}</p>
                          <p className="text-gray-500">Role: {getRoleLabel(deletingUser.role)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error display inside modal */}
                  {error && isDeleteModalOpen && (
                    <div className="mt-4 rounded-md bg-red-50 p-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeDeleteModal}
                      disabled={isDeleting}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete User'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
