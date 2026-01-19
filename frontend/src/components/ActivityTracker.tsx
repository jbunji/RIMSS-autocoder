import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

// Session timeout in milliseconds (30 minutes as per spec)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

// For testing purposes, allow override via localStorage
const getTimeoutDuration = (): number => {
  const override = localStorage.getItem('rimss-session-timeout-override')
  if (override) {
    const parsed = parseInt(override, 10)
    if (!isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }
  return SESSION_TIMEOUT_MS
}

interface ActivityTrackerProps {
  children: React.ReactNode
}

export function ActivityTracker({ children }: ActivityTrackerProps) {
  const navigate = useNavigate()
  const { isAuthenticated, logout, setSessionExpired } = useAuthStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // Function to handle session timeout
  const handleSessionTimeout = useCallback(() => {
    if (isAuthenticated) {
      console.log('[ActivityTracker] Session timed out due to inactivity')
      setSessionExpired(true)
      logout()
      navigate('/login', {
        state: {
          sessionExpired: true,
          message: 'Your session has expired due to inactivity. Please log in again.'
        },
        replace: true
      })
    }
  }, [isAuthenticated, logout, navigate, setSessionExpired])

  // Function to reset the inactivity timer
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now()

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Only set new timeout if user is authenticated
    if (isAuthenticated) {
      const timeout = getTimeoutDuration()
      timeoutRef.current = setTimeout(handleSessionTimeout, timeout)
    }
  }, [isAuthenticated, handleSessionTimeout])

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timeout when not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    // Events that indicate user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ]

    // Throttled activity handler (reset timer at most every 1 second to avoid excessive resets)
    let lastReset = 0
    const throttledResetTimer = () => {
      const now = Date.now()
      if (now - lastReset > 1000) {
        lastReset = now
        resetTimer()
      }
    }

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, throttledResetTimer, { passive: true })
    })

    // Initial timer setup
    resetTimer()

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, throttledResetTimer)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isAuthenticated, resetTimer])

  // Also check on visibility change (tab becomes visible again)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        // Check if session should have expired while tab was hidden
        const timeout = getTimeoutDuration()
        const timeSinceLastActivity = Date.now() - lastActivityRef.current

        if (timeSinceLastActivity >= timeout) {
          handleSessionTimeout()
        } else {
          // Reset timer for remaining time
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          const remainingTime = timeout - timeSinceLastActivity
          timeoutRef.current = setTimeout(handleSessionTimeout, remainingTime)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated, handleSessionTimeout])

  return <>{children}</>
}
