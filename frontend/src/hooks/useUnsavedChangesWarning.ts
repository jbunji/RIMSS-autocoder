import { useEffect, useState } from 'react'
import { useBlocker, UNSAFE_DataRouterContext } from 'react-router-dom'
import { useContext } from 'react'

/**
 * Hook to warn users when they try to leave a page with unsaved form changes
 * Handles both browser navigation (refresh/close) and in-app React Router navigation
 *
 * @param isDirty - Whether the form has unsaved changes (from react-hook-form's formState.isDirty)
 * @param message - Optional custom warning message
 * @returns Object with blocker state and control functions
 */
export function useUnsavedChangesWarning(
  isDirty: boolean,
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
) {
  const [showDialog, setShowDialog] = useState(false)

  // Check if we're in a data router context (required for useBlocker)
  // @ts-ignore - UNSAFE_DataRouterContext is not typed but exists
  const dataRouterContext = useContext(UNSAFE_DataRouterContext)
  const hasDataRouter = dataRouterContext != null

  // Block React Router navigation when form is dirty (only if data router is available)
  // If not available, we only support beforeunload warning
  let blocker: any = { state: 'unblocked', proceed: undefined, reset: undefined }

  if (hasDataRouter) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    blocker = useBlocker(
      ({ currentLocation, nextLocation }) =>
        isDirty && currentLocation.pathname !== nextLocation.pathname
    )
  }

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

  // Show dialog when navigation is blocked
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowDialog(true)
    }
  }, [blocker.state])

  // Functions to control navigation
  const confirmNavigation = () => {
    setShowDialog(false)
    blocker.proceed?.()
  }

  const cancelNavigation = () => {
    setShowDialog(false)
    blocker.reset?.()
  }

  return {
    showDialog,
    confirmNavigation,
    cancelNavigation,
    message,
  }
}
