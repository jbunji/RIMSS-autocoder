import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Hook to warn users when they try to leave a page with unsaved form changes
 * Handles both browser navigation (refresh/close) and in-app React Router navigation
 *
 * @param isDirty - Whether the form has unsaved changes
 * @param message - Optional custom warning message
 * @returns Object with dialog state and control functions
 */
export function useUnsavedChangesWarning(
  isDirty: boolean,
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
) {
  const [showDialog, setShowDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const isNavigatingRef = useRef(false)

  // Handler for browser refresh/close
  useEffect(() => {
    if (!isDirty) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Modern browsers ignore the custom message and show their own
      // But we still need to set returnValue to trigger the warning
      e.preventDefault()
      e.returnValue = message
      return message
    }

    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty, message])

  // Intercept navigation link clicks
  useEffect(() => {
    if (!isDirty) return

    const handleClick = (e: MouseEvent) => {
      // Only intercept if we're currently editing
      if (isNavigatingRef.current) return

      const target = e.target as HTMLElement
      const link = target.closest('a[href]') as HTMLAnchorElement

      if (link && link.href) {
        const url = new URL(link.href)
        const targetPath = url.pathname

        // Only intercept internal navigation to different pages
        if (url.origin === window.location.origin && targetPath !== location.pathname) {
          e.preventDefault()
          e.stopPropagation()
          setPendingNavigation(targetPath)
          setShowDialog(true)
        }
      }
    }

    // Capture phase to intercept before React Router handles it
    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [isDirty, location.pathname])

  // Functions to control navigation
  const confirmNavigation = useCallback(() => {
    setShowDialog(false)
    if (pendingNavigation) {
      isNavigatingRef.current = true
      navigate(pendingNavigation)
      setPendingNavigation(null)
      // Reset the flag after navigation completes
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 100)
    }
  }, [pendingNavigation, navigate])

  const cancelNavigation = useCallback(() => {
    setShowDialog(false)
    setPendingNavigation(null)
  }, [])

  return {
    showDialog,
    confirmNavigation,
    cancelNavigation,
    message,
  }
}
