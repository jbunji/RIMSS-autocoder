import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* CUI Banner Header */}
        <div className="bg-cui-bg text-cui-text text-center text-sm py-1 font-medium">
          CUI - Controlled Unclassified Information
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              RIMSS - Remote Independent Maintenance Status System
            </h1>
            <p className="mt-2 text-gray-600">
              Military Aviation Maintenance Tracking System
            </p>
          </div>
        </main>

        {/* CUI Banner Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-cui-bg text-cui-text text-center text-sm py-1 font-medium">
          CUI - Controlled Unclassified Information
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
