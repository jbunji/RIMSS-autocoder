import { useAuthStore } from '../stores/authStore'

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
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

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

            {/* User ID (for reference) */}
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-500 sm:col-span-2 sm:mt-0 font-mono">
                #{user.user_id}
              </dd>
            </div>
          </dl>
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
    </div>
  )
}
