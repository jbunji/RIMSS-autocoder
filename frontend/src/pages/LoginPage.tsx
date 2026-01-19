import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Implement actual login API call
      console.log('Login attempt:', { username })
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setError('Login functionality not yet implemented')
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* CUI Banner Header */}
      <div className="bg-cui-bg text-cui-text text-center text-sm py-1 font-medium">
        CUI - Controlled Unclassified Information
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo/Title Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary-800">RIMSS</h1>
            <p className="mt-2 text-sm text-gray-600">
              Remote Independent Maintenance Status System
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Military Aviation Maintenance Tracking
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white shadow-md rounded-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Sign In
              </h2>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Username Field */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Forgot Password Link */}
              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </form>

          {/* Additional Info */}
          <div className="text-center text-xs text-gray-500">
            <p>Authorized users only. All activity is monitored.</p>
          </div>
        </div>
      </main>

      {/* CUI Banner Footer */}
      <footer className="bg-cui-bg text-cui-text text-center text-sm py-1 font-medium">
        CUI - Controlled Unclassified Information
      </footer>
    </div>
  )
}
