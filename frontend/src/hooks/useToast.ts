import { useState, useCallback } from 'react'
import { ToastType } from '../components/Toast'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

let toastIdCounter = 0

export function useToast() {
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
  const legacyToast = {
    message: toasts[toasts.length - 1]?.message || '',
    type: toasts[toasts.length - 1]?.type || 'success',
    isOpen: toasts.length > 0,
  }

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
    // Legacy support
    toast: legacyToast,
  }
}
