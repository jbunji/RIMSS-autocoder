import { useEffect, useCallback, useRef } from 'react'
import { useAuthStore } from '../stores/authStore'

// Token refresh timing configuration
// Tokens expire after 30 minutes, refresh 5 minutes before expiration
const TOKEN_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes (must match backend)
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000 // Refresh 5 minutes before expiry

// For testing purposes, allow override via localStorage
// Set localStorage 'rimss-token-refresh-override' to a number in ms
const getRefreshInterval = (): number => {
  const override = localStorage.getItem('rimss-token-refresh-override')
  if (override) {
    const parsed = parseInt(override, 10)
    if (!isNaN(parsed) && parsed > 0) {
      console.log(`[TokenRefreshManager] Using override refresh interval: ${parsed}ms`)
      return parsed
    }
  }
  return TOKEN_EXPIRY_MS - REFRESH_BEFORE_EXPIRY_MS // Refresh 25 minutes after login
}

// Helper to get token expiration time from token payload
const getTokenExpirationTime = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token))
    return payload.exp || null
  } catch {
    return null
  }
}

interface TokenRefreshManagerProps {
  children: React.ReactNode
}

export function TokenRefreshManager({ children }: TokenRefreshManagerProps) {
  const { token, isAuthenticated, setToken, setUser, clearAuth } = useAuthStore()
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef<boolean>(false)
  const lastRefreshRef = useRef<number>(0)

  // Refresh the token
  const refreshToken = useCallback(async () => {
    if (!token || !isAuthenticated || isRefreshingRef.current) {
      return false
    }

    // Prevent multiple simultaneous refresh attempts
    isRefreshingRef.current = true
    console.log('[TokenRefreshManager] Initiating token refresh...')

    try {
      const response = await fetch('http://localhost:3001/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        console.log('[TokenRefreshManager] Token refreshed successfully')

        // Update the token and user in store
        setToken(data.token)
        if (data.user) {
          setUser(data.user)
        }

        lastRefreshRef.current = Date.now()

        // Dispatch a custom event so other parts of the app can react
        window.dispatchEvent(new CustomEvent('token-refreshed', {
          detail: { timestamp: Date.now() }
        }))

        isRefreshingRef.current = false
        return true
      } else {
        console.error('[TokenRefreshManager] Token refresh failed:', response.status)

        // If refresh fails with 401, token is invalid - clear auth
        if (response.status === 401) {
          console.log('[TokenRefreshManager] Token invalid, clearing auth')
          clearAuth()
        }

        isRefreshingRef.current = false
        return false
      }
    } catch (error) {
      console.error('[TokenRefreshManager] Token refresh error:', error)
      isRefreshingRef.current = false
      return false
    }
  }, [token, isAuthenticated, setToken, setUser, clearAuth])

  // Schedule the next token refresh
  const scheduleRefresh = useCallback(() => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = null
    }

    if (!token || !isAuthenticated) {
      return
    }

    // Check for test override first
    const override = localStorage.getItem('rimss-token-refresh-override')
    let refreshDelay: number

    if (override) {
      const parsed = parseInt(override, 10)
      if (!isNaN(parsed) && parsed > 0) {
        console.log(`[TokenRefreshManager] Using override refresh interval: ${parsed}ms`)
        refreshDelay = parsed
      } else {
        refreshDelay = getRefreshInterval()
      }
    } else {
      // Calculate when to refresh based on token expiration
      const expTime = getTokenExpirationTime(token)
      if (expTime) {
        // Refresh 5 minutes before expiration
        const timeUntilExpiry = expTime - Date.now()
        refreshDelay = Math.max(timeUntilExpiry - REFRESH_BEFORE_EXPIRY_MS, 1000) // At least 1 second
      } else {
        // Fall back to default interval if we can't parse token
        refreshDelay = getRefreshInterval()
      }
    }

    console.log(`[TokenRefreshManager] Scheduling token refresh in ${Math.round(refreshDelay / 1000)}s`)

    refreshTimeoutRef.current = setTimeout(async () => {
      const success = await refreshToken()
      if (success) {
        // Schedule next refresh after successful refresh
        scheduleRefresh()
      }
    }, refreshDelay)
  }, [token, isAuthenticated, refreshToken])

  // Set up token refresh scheduling
  useEffect(() => {
    if (isAuthenticated && token) {
      // Schedule initial refresh
      scheduleRefresh()
    } else {
      // Clear timeout when not authenticated
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = null
      }
    }

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
        refreshTimeoutRef.current = null
      }
    }
  }, [isAuthenticated, token, scheduleRefresh])

  // Handle visibility change - check if token needs refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isAuthenticated && token) {
        const expTime = getTokenExpirationTime(token)

        if (expTime) {
          const timeUntilExpiry = expTime - Date.now()

          // If token is expired or about to expire, refresh immediately
          if (timeUntilExpiry <= REFRESH_BEFORE_EXPIRY_MS) {
            console.log('[TokenRefreshManager] Token near expiry on visibility change, refreshing...')
            const success = await refreshToken()
            if (success) {
              scheduleRefresh()
            }
          } else {
            // Reschedule refresh based on current token
            scheduleRefresh()
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated, token, refreshToken, scheduleRefresh])

  return <>{children}</>
}
