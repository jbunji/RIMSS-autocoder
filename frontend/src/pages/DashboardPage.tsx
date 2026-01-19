import { useAuthStore } from '../stores/authStore'

export default function DashboardPage() {
  const { user, currentProgramId } = useAuthStore()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Welcome, {user?.first_name} {user?.last_name}
        </h2>
        <p className="text-gray-600">
          You are logged in as <span className="font-medium">{user?.role?.replace('_', ' ')}</span>
        </p>
        {currentProgramId && (
          <p className="text-gray-600 mt-2">
            Current Program: <span className="font-medium">{user?.programs?.find(p => p.pgm_id === currentProgramId)?.pgm_name || 'Unknown'}</span>
          </p>
        )}
      </div>

      {/* Placeholder widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Asset Status Summary</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">--</p>
          <p className="text-xs text-gray-400 mt-1">Coming soon</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">PMI Due Soon</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">--</p>
          <p className="text-xs text-gray-400 mt-1">Coming soon</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Open Maintenance Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">--</p>
          <p className="text-xs text-gray-400 mt-1">Coming soon</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500">Parts Awaiting Action</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">--</p>
          <p className="text-xs text-gray-400 mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  )
}
