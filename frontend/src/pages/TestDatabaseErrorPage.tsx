import { useState } from 'react'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { handleError, UserFriendlyError } from '../utils/errorHandler'
import { ArrowPathIcon, CheckCircleIcon, ServerIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

/**
 * Test page for Feature #447: Handle database connection errors
 * This page allows testing database error handling with retry functionality
 */
export default function TestDatabaseErrorPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<UserFriendlyError | null>(null)
  const [success, setSuccess] = useState<string>('')
  const [errorType, setErrorType] = useState<string>('connection')
  const [delayMs, setDelayMs] = useState<number>(0)
  const [requestCount, setRequestCount] = useState(0)
  const [simulateRecovery, setSimulateRecovery] = useState(false)

  const handleTestDatabaseError = async () => {
    setLoading(true)
    setError(null)
    setSuccess('')
    setRequestCount(prev => prev + 1)
    const currentRequest = requestCount + 1

    try {
      // If recovery mode is on and this is a retry (request > 1), use success endpoint
      const url = simulateRecovery && currentRequest > 1
        ? 'http://localhost:3001/api/test/database-success'
        : `http://localhost:3001/api/test/database-error?type=${errorType}&delay=${delayMs}`

      console.log(`[Test] Request #${currentRequest} - ${url}`)

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        // Parse the error from the response
        throw new Error(data.error || `Server returned ${response.status}`)
      }

      // Success
      setSuccess(`Database connection successful! Retrieved ${data.data?.items?.length || 0} records.`)
    } catch (err) {
      const friendlyError = handleError(err, 'connecting to database')
      setError(friendlyError)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    handleTestDatabaseError()
  }

  const handleReset = () => {
    setError(null)
    setSuccess('')
    setRequestCount(0)
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ServerIcon className="h-7 w-7 mr-2 text-primary-600" />
          Database Error Test Page
        </h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-700">
            <strong>Test Feature #447:</strong> This page tests database connection error handling.
            Simulates various database failures and verifies the error message and retry functionality.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>

          <div className="space-y-4">
            {/* Error Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Error Type
              </label>
              <select
                value={errorType}
                onChange={(e) => setErrorType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="connection">Connection Failed (503)</option>
                <option value="timeout">Query Timeout (504)</option>
                <option value="unavailable">Service Unavailable (503)</option>
                <option value="unknown">Unknown Error (500)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select the type of database error to simulate
              </p>
            </div>

            {/* Delay Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Delay (ms)
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                value={delayMs}
                onChange={(e) => setDelayMs(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add delay before error response (to test loading state)
              </p>
            </div>

            {/* Recovery Mode Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="simulateRecovery"
                checked={simulateRecovery}
                onChange={(e) => setSimulateRecovery(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="simulateRecovery" className="ml-2 text-sm text-gray-700">
                Simulate recovery on retry (retry will succeed)
              </label>
            </div>

            {/* Request Counter */}
            <div className="text-sm text-gray-500">
              Requests made this session: {requestCount}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex space-x-3">
              <button
                onClick={handleTestDatabaseError}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-md font-medium text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                    Testing...
                  </span>
                ) : (
                  'Test Database Error'
                )}
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Database Connected</h3>
                <p className="mt-1 text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display with Retry */}
        {error && (
          <ErrorDisplay
            error={error}
            onRetry={handleRetry}
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Test Scenarios */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-3">Feature #447 Verification Steps:</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="font-mono bg-gray-200 rounded px-1 mr-2 text-xs">1</span>
              <span><strong>Simulate database failure:</strong> Click "Test Database Error" to trigger an error</span>
            </li>
            <li className="flex items-start">
              <span className="font-mono bg-gray-200 rounded px-1 mr-2 text-xs">2</span>
              <span><strong>Verify error message:</strong> A user-friendly error message should appear</span>
            </li>
            <li className="flex items-start">
              <span className="font-mono bg-gray-200 rounded px-1 mr-2 text-xs">3</span>
              <span><strong>Verify retry button:</strong> A "Try Again" button should be visible</span>
            </li>
            <li className="flex items-start">
              <span className="font-mono bg-gray-200 rounded px-1 mr-2 text-xs">4</span>
              <span><strong>Verify page stability:</strong> The page should not crash (remain interactive)</span>
            </li>
            <li className="flex items-start">
              <span className="font-mono bg-gray-200 rounded px-1 mr-2 text-xs">5</span>
              <span><strong>Test recovery:</strong> Enable "Simulate recovery" and retry - it should succeed</span>
            </li>
          </ul>
        </div>

        {/* Error Type Descriptions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h2 className="font-semibold mb-3 text-blue-800">
            <ExclamationCircleIcon className="h-5 w-5 inline mr-1" />
            Error Types Explained:
          </h2>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>
              <strong>Connection Failed (503):</strong> Database server is not responding
            </li>
            <li>
              <strong>Query Timeout (504):</strong> Database query took too long to execute
            </li>
            <li>
              <strong>Service Unavailable (503):</strong> Database service is temporarily down
            </li>
            <li>
              <strong>Unknown Error (500):</strong> Unexpected database error occurred
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
