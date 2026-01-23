import { Fragment, useEffect, useRef } from 'react'
import { Transition } from '@headlessui/react'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ToastType } from './Toast'
import { ToastItem } from '../contexts/ToastContext'

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  duration?: number // Auto-dismiss duration in milliseconds (default: 5000)
  allowManualDismiss?: boolean // Whether to show close button (default: true)
}

export function ToastContainer({
  toasts,
  onDismiss,
  duration = 5000,
  allowManualDismiss = true,
}: ToastContainerProps) {
  // Track which toasts we've already set timers for
  const timerRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Auto-dismiss toasts after duration
  useEffect(() => {
    if (duration <= 0) return

    // Set timers for new toasts
    toasts.forEach((toast) => {
      if (!timerRefs.current.has(toast.id)) {
        const timer = setTimeout(() => {
          onDismiss(toast.id)
          timerRefs.current.delete(toast.id)
        }, duration)
        timerRefs.current.set(toast.id, timer)
      }
    })

    // Clean up timers for removed toasts
    const currentToastIds = new Set(toasts.map((t) => t.id))
    timerRefs.current.forEach((timer, id) => {
      if (!currentToastIds.has(id)) {
        clearTimeout(timer)
        timerRefs.current.delete(id)
      }
    })

    // Cleanup on unmount
    return () => {
      timerRefs.current.forEach((timer) => clearTimeout(timer))
      timerRefs.current.clear()
    }
  }, [toasts, duration, onDismiss])

  const config = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      borderColor: 'border-green-400',
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      borderColor: 'border-red-400',
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-400',
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-400',
    },
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-start px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => {
          const { icon: Icon, bgColor, textColor, iconColor, borderColor } = config[toast.type]

          return (
            <Transition
              key={toast.id}
              show={true}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg ${bgColor} shadow ring-1 ring-black ring-opacity-5 border-l-4 ${borderColor}`}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className={`text-sm font-medium ${textColor}`}>{toast.message}</p>
                    </div>
                    {allowManualDismiss && (
                      <div className="ml-4 flex flex-shrink-0">
                        <button
                          type="button"
                          className={`inline-flex rounded-md ${bgColor} ${textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          onClick={() => onDismiss(toast.id)}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Transition>
          )
        })}
      </div>
    </div>
  )
}
