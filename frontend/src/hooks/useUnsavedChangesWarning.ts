import { useEffect } from 'react'

/**
 * Hook to warn users when they try to leave a page with unsaved form changes
 *
 * @param isDirty - Whether the form has unsaved changes (from react-hook-form's formState.isDirty)
 * @param message - Optional custom warning message
 */
export function useUnsavedChangesWarning(
  isDirty: boolean,
  message: string = 'You have unsaved changes. Are you sure you want to leave?'
) {
  useEffect(() => {
    if (!isDirty) return

    // Handler for browser refresh/close
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
}
