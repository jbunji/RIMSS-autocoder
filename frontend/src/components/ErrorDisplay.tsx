import { ExclamationTriangleIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { UserFriendlyError } from '../utils/errorHandler'

interface ErrorDisplayProps {
  error: UserFriendlyError | string | null
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

/**
 * ErrorDisplay component - Shows user-friendly error messages with retry option
 *
 * Features:
 * - User-friendly error messages (no technical jargon or stack traces)
 * - Retry button for recoverable errors (network failures, server errors)
 * - Dismiss button to close the error message
 * - Visual styling with warning icon
 * - Responsive design
 */
export function ErrorDisplay({ error, onRetry, onDismiss, className = '' }: ErrorDisplayProps) {
  if (!error) return null

  // Handle both UserFriendlyError objects and simple string errors
  const errorObj: UserFriendlyError = typeof error === 'string'
    ? {
        message: error,
        type: 'unknown',
        canRetry: false,
      }
    : error

  return (
    <div className={`rounded-lg bg-red-50 border border-red-200 p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {errorObj.type === 'network' ? 'Connection Problem' : 'Error'}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorObj.message}</p>
          </div>
          {(onRetry && errorObj.canRetry) && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                Try Again
              </button>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * InlineErrorMessage component - Smaller inline error message (for forms)
 */
interface InlineErrorMessageProps {
  message: string | null
  className?: string
}

export function InlineErrorMessage({ message, className = '' }: InlineErrorMessageProps) {
  if (!message) return null

  return (
    <div className={`flex items-center text-sm text-red-600 mt-2 ${className}`}>
      <ExclamationTriangleIcon className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
