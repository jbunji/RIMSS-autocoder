import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastContainer } from '../components/ToastContainer'
import { ToastType } from '../components/Toast'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface LegacyToast {
  message: string
  type: ToastType
  isOpen: boolean
}

interface ToastContextType {
  toasts: ToastItem[]
  showToast: (message: string, type?: ToastType) => void
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showWarning: (message: string) => void
  showInfo: (message: string) => void
  hideToast: (id: string) => void
  // Legacy compatibility
  toast: LegacyToast
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastIdCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${toastIdCounter++}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const showSuccess = useCallback((message: string) => {
    showToast(message, 'success')
  }, [showToast])

  const showError = useCallback((message: string) => {
    showToast(message, 'error')
  }, [showToast])

  const showWarning = useCallback((message: string) => {
    showToast(message, 'warning')
  }, [showToast])

  const showInfo = useCallback((message: string) => {
    showToast(message, 'info')
  }, [showToast])

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  // Legacy compatibility - for backward compatibility with old code
  // This allows old code that expects { toast, isOpen } to still work
  const legacyToast: LegacyToast = {
    message: toasts[toasts.length - 1]?.message || '',
    type: toasts[toasts.length - 1]?.type || 'success',
    isOpen: toasts.length > 0,
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideToast,
        toast: legacyToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}
