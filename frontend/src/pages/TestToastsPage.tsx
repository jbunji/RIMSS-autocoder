import { useToast } from '../hooks/useToast'

export default function TestToastsPage() {
  const { showSuccess, showError, showWarning, showInfo } = useToast()

  const triggerMultipleToasts = () => {
    showSuccess('First success toast')
    setTimeout(() => showError('Second error toast'), 100)
    setTimeout(() => showWarning('Third warning toast'), 200)
    setTimeout(() => showInfo('Fourth info toast'), 300)
    setTimeout(() => showSuccess('Fifth success toast'), 400)
  }

  const triggerRapidToasts = () => {
    showSuccess('Toast 1')
    showSuccess('Toast 2')
    showSuccess('Toast 3')
    showSuccess('Toast 4')
    showSuccess('Toast 5')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Test Multiple Toasts - Feature #307
      </h1>

      <div className="space-y-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Scenarios</h2>

          <div className="space-y-3">
            <button
              onClick={triggerMultipleToasts}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Trigger 5 Toasts (Staggered - 100ms apart)
            </button>

            <button
              onClick={triggerRapidToasts}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Trigger 5 Toasts (Rapid Fire - Simultaneous)
            </button>

            <button
              onClick={() => showSuccess('Single success toast')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Trigger Single Success Toast
            </button>

            <button
              onClick={() => showError('Single error toast')}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Trigger Single Error Toast
            </button>

            <button
              onClick={() => showWarning('Single warning toast')}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Trigger Single Warning Toast
            </button>

            <button
              onClick={() => showInfo('Single info toast')}
              className="w-full bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
            >
              Trigger Single Info Toast
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Expected Behavior:</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Multiple toasts should stack vertically</li>
            <li>Each toast should be readable</li>
            <li>Toasts should not overlap</li>
            <li>Each toast can be dismissed individually</li>
            <li>Toasts auto-dismiss after 5 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
