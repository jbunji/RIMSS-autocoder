import { useState } from 'react'
import { fetchWithErrorHandling } from '../utils/errorHandler'

/**
 * Test page for Feature #255: Timeout doesn't hang the UI
 * This page allows testing timeout behavior with configurable delays
 */
export default function TestTimeoutPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [delaySeconds, setDelaySeconds] = useState(5)
  const [timeoutSeconds, setTimeoutSeconds] = useState(3)

  const handleTestSlowRequest = async () => {
    setLoading(true)
    setResult('')
    setError('')

    try {
      const data = await fetchWithErrorHandling(
        `http://localhost:3001/api/test/slow?delay=${delaySeconds * 1000}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        'testing slow operation',
        timeoutSeconds * 1000 // Convert to milliseconds
      )
      setResult(`✅ Success! Server responded after ${data.delay}ms`)
    } catch (err: any) {
      if (err.name === 'TimeoutError') {
        setError(`⏱️ Timeout! Request took longer than ${timeoutSeconds} seconds.`)
      } else {
        setError(err.message || 'An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Timeout Test Page</h1>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-700">
            <strong>Test Feature #255:</strong> This page tests timeout behavior.
            Configure the server delay and client timeout below.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Server Delay (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                How long the server should wait before responding
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Timeout (seconds)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={timeoutSeconds}
                onChange={(e) => setTimeoutSeconds(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                How long to wait before timing out the request
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleTestSlowRequest}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-md font-medium text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Testing... (UI remains responsive)
                  </span>
                ) : (
                  'Start Test'
                )}
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <p className="text-sm text-green-700">{result}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={handleTestSlowRequest}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="font-semibold mb-2">Test Scenarios:</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              <strong>✅ Success Case:</strong> Set timeout &gt; delay (e.g., timeout=10s, delay=5s)
            </li>
            <li>
              <strong>⏱️ Timeout Case:</strong> Set timeout &lt; delay (e.g., timeout=3s, delay=10s)
            </li>
            <li>
              <strong>🖱️ UI Responsive:</strong> While loading, you should be able to interact with
              the page (change values, click buttons)
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
