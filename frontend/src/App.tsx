import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ActivityTracker } from './components/ActivityTracker'
import { TokenRefreshManager } from './components/TokenRefreshManager'
import { Layout } from './components/layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/admin/UsersPage'
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
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/assets/:id" element={<AssetDetailPage />} />
          <Route path="/configurations" element={<ConfigurationsPage />} />
          <Route path="/configurations/:id" element={<ConfigurationDetailPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/sorties" element={<SortiesPage />} />
          <Route path="/sorties/:id" element={<SortieDetailPage />} />
          <Route path="/spares" element={<PlaceholderPage title="Spares" />} />
          <Route path="/parts-ordered" element={<PlaceholderPage title="Parts Ordered" />} />
          <Route path="/notifications" element={<PlaceholderPage title="Notifications" />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="/admin" element={<PlaceholderPage title="Admin" />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
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
    </BrowserRouter>
  )
}

export default App
