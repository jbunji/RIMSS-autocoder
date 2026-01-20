/**
 * Error handling utilities for providing user-friendly error messages
 * and distinguishing between different types of errors (network, server, validation, etc.)
 */

export interface UserFriendlyError {
  message: string
  type: 'network' | 'server' | 'validation' | 'unknown'
  canRetry: boolean
  technicalDetails?: string
}

/**
 * Converts various error types into user-friendly error messages
 * @param error - The error to convert (can be Error, Response, string, or unknown)
 * @param context - Optional context about what operation failed
 * @returns UserFriendlyError object with user-friendly message and retry info
 */
export function handleError(error: unknown, context?: string): UserFriendlyError {
  // Network failure (no response received)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: 'Unable to connect to the server. Please check your network connection and try again.',
      type: 'network',
      canRetry: true,
      technicalDetails: error.message,
    }
  }

  // Handle fetch errors (NetworkError, connection refused, etc.)
  if (error instanceof Error) {
    const lowerMessage = error.message.toLowerCase()

    // Network/connection errors
    if (lowerMessage.includes('network') ||
        lowerMessage.includes('connection') ||
        lowerMessage.includes('timeout') ||
        lowerMessage.includes('fetch')) {
      return {
        message: 'Network connection lost. Please check your internet connection and try again.',
        type: 'network',
        canRetry: true,
        technicalDetails: error.message,
      }
    }

    // Server errors (5xx)
    if (lowerMessage.includes('server error') || lowerMessage.includes('500') || lowerMessage.includes('503')) {
      return {
        message: 'The server is experiencing issues. Please try again in a few moments.',
        type: 'server',
        canRetry: true,
        technicalDetails: error.message,
      }
    }

    // Validation/client errors (4xx)
    if (lowerMessage.includes('validation') || lowerMessage.includes('400') || lowerMessage.includes('invalid')) {
      return {
        message: error.message, // Use the specific validation message
        type: 'validation',
        canRetry: false,
        technicalDetails: error.message,
      }
    }

    // Authorization errors
    if (lowerMessage.includes('401') || lowerMessage.includes('unauthorized') || lowerMessage.includes('403') || lowerMessage.includes('forbidden')) {
      return {
        message: 'You do not have permission to perform this action. Please contact your administrator if you believe this is an error.',
        type: 'validation',
        canRetry: false,
        technicalDetails: error.message,
      }
    }
  }

  // Generic error
  const contextMessage = context ? ` while ${context}` : ''
  return {
    message: `An unexpected error occurred${contextMessage}. Please try again.`,
    type: 'unknown',
    canRetry: true,
    technicalDetails: error instanceof Error ? error.message : String(error),
  }
}

/**
 * Enhanced fetch wrapper that provides better error handling with timeout support
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param context - Optional context about what operation is being performed
 * @param timeoutMs - Timeout in milliseconds (default: 30000 / 30 seconds)
 * @returns Promise that resolves to the response data or rejects with UserFriendlyError
 */
export async function fetchWithErrorHandling<T = any>(
  url: string,
  options?: RequestInit,
  context?: string,
  timeoutMs: number = 30000
): Promise<T> {
  // Create AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    // Clear timeout on successful response
    clearTimeout(timeoutId)

    // Handle HTTP error responses
    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `Server returned ${response.status} ${response.statusText}`
      try {
        const errorData = await response.json()
        if (errorData.error || errorData.message) {
          errorMessage = errorData.error || errorData.message
        }
      } catch {
        // Ignore JSON parse errors
      }

      throw new Error(errorMessage)
    }

    // Parse JSON response
    const data = await response.json()
    return data
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeoutId)

    // Handle abort/timeout specifically
    if (error instanceof Error && error.name === 'AbortError') {
      const timeoutError: UserFriendlyError = {
        message: 'The request took too long to complete. The server may be busy. Please try again.',
        type: 'network',
        canRetry: true,
        technicalDetails: `Request timed out after ${timeoutMs}ms`,
      }
      const enhancedError = new Error(timeoutError.message)
      enhancedError.name = 'TimeoutError'
      Object.assign(enhancedError, timeoutError)
      throw enhancedError
    }

    // Convert to user-friendly error and rethrow
    const friendlyError = handleError(error, context)
    // Attach the friendly error properties to the error object
    const enhancedError = error instanceof Error ? error : new Error(String(error))
    Object.assign(enhancedError, friendlyError)
    throw enhancedError
  }
}

/**
 * Get a simple error message string from an error
 * @param error - The error to convert
 * @param fallback - Fallback message if error cannot be parsed
 * @returns User-friendly error message string
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (!error) return fallback

  // Check if it's already a UserFriendlyError
  if (typeof error === 'object' && 'message' in error && 'type' in error) {
    return (error as UserFriendlyError).message
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return handleError(error).message
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  return fallback
}
