import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: Array<'ADMIN' | 'DEPOT_MANAGER' | 'FIELD_TECHNICIAN' | 'VIEWER'>
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access if requiredRoles is specified
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    // User doesn't have required role - redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
