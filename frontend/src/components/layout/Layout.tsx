import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* CUI Banner Header */}
      <div className="bg-cui-bg text-cui-text text-center text-sm py-1 font-medium z-50 relative">
        CUI - Controlled Unclassified Information
      </div>

      {/* Fixed Navbar */}
      <div className="fixed top-7 left-0 right-0 z-40">
        <Navbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 pt-[calc(1.75rem+4rem)]">
        <main className="flex-1 pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* CUI Banner Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-cui-bg text-cui-text text-center text-sm py-1 font-medium z-50">
        CUI - Controlled Unclassified Information
      </footer>
    </div>
  )
}
