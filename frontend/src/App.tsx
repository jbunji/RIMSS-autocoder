import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ActivityTracker } from './components/ActivityTracker'
import { TokenRefreshManager } from './components/TokenRefreshManager'
import { Layout } from './components/layout'
import { ToastProvider } from './contexts/ToastContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/admin/UsersPage'
import AuditLogsPage from './pages/admin/AuditLogsPage'
import SettingsPage from './pages/admin/SettingsPage'
import ProgramLocationsPage from './pages/admin/ProgramLocationsPage'
import LocationsPage from './pages/admin/LocationsPage'
import ProfilePage from './pages/ProfilePage'
import PMIDetailPage from './pages/PMIDetailPage'
import PMIPage from './pages/PMIPage'
import MaintenanceDetailPage from './pages/MaintenanceDetailPage'
import TCTODetailPage from './pages/TCTODetailPage'
import PartsOrderDetailPage from './pages/PartsOrderDetailPage'
import AssetsPage from './pages/AssetsPage'
import AssetDetailPage from './pages/AssetDetailPage'
import ConfigurationsPage from './pages/ConfigurationsPage'
import ConfigurationDetailPage from './pages/ConfigurationDetailPage'
import MaintenancePage from './pages/MaintenancePage'
import SortiesPage from './pages/SortiesPage'
import SortieDetailPage from './pages/SortieDetailPage'
import SparesPage from './pages/SparesPage'
import PartsOrderedPage from './pages/PartsOrderedPage'
import SoftwarePage from './pages/SoftwarePage'
import NotificationsPage from './pages/NotificationsPage'
import ReportsPage from './pages/ReportsPage'
import InventoryReportPage from './pages/InventoryReportPage'
import MaintenanceBacklogReportPage from './pages/MaintenanceBacklogReportPage'
import PMIScheduleReportPage from './pages/PMIScheduleReportPage'
import PartsOrderedReportPage from './pages/PartsOrderedReportPage'
import SortieReportPage from './pages/SortieReportPage'
import BadActorReportPage from './pages/BadActorReportPage'
import TestTimeoutPage from './pages/TestTimeoutPage'
import TestToastsPage from './pages/TestToastsPage'
import SearchResultsPage from './pages/SearchResultsPage'

// Placeholder page component for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-600">This page is under construction.</p>
    </div>
  )
}

function App() {
  const { token, setLoading, setUser, clearAuth } = useAuthStore()

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Token is invalid or expired
          clearAuth()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [token, setLoading, setUser, clearAuth])

  return (
    <BrowserRouter>
      <ToastProvider>
        <TokenRefreshManager>
          <ActivityTracker>
            <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/assets/:id" element={<AssetDetailPage />} />
          <Route path="/configurations" element={<ConfigurationsPage />} />
          <Route path="/configurations/:id" element={<ConfigurationDetailPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/sorties" element={<SortiesPage />} />
          <Route path="/sorties/:id" element={<SortieDetailPage />} />
          <Route path="/spares" element={<SparesPage />} />
          <Route path="/parts-ordered" element={<PartsOrderedPage />} />
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/inventory" element={<InventoryReportPage />} />
          <Route path="/reports/maintenance-backlog" element={<MaintenanceBacklogReportPage />} />
          <Route path="/reports/pmi-schedule" element={<PMIScheduleReportPage />} />
          <Route path="/reports/parts-ordered" element={<PartsOrderedReportPage />} />
          <Route path="/reports/sorties" element={<SortieReportPage />} />
          <Route path="/reports/bad-actors" element={<BadActorReportPage />} />

          {/* Admin-only routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <PlaceholderPage title="Admin" />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AuditLogsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/program-locations" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <ProgramLocationsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/locations" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <LocationsPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          <Route path="/test-timeout" element={<TestTimeoutPage />} />
          <Route path="/test-toasts" element={<TestToastsPage />} />
          <Route path="/pmi" element={<PMIPage />} />
          <Route path="/pmi/:id" element={<PMIDetailPage />} />
          <Route path="/maintenance/:id" element={<MaintenanceDetailPage />} />
          <Route path="/tcto/:id" element={<TCTODetailPage />} />
          <Route path="/parts-orders/:id" element={<PartsOrderDetailPage />} />
        </Route>

        {/* Redirect root to dashboard (which will redirect to login if not authenticated) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Unauthorized page */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">403</h1>
                <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
                <a href="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">
                  Return to Dashboard
                </a>
              </div>
            </div>
          }
        />

        {/* Catch all - 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-400">404</h1>
                <p className="mt-2 text-gray-600">Page not found.</p>
                <a href="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">
                  Return to Dashboard
                </a>
              </div>
            </div>
          }
        />
            </Routes>
          </ActivityTracker>
        </TokenRefreshManager>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
