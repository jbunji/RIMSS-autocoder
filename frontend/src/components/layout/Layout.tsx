import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Skip to main content link - accessible for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-8 focus:left-4 focus:z-[100] focus:bg-primary-800 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* CUI Banner Header */}
      <div className="fixed top-0 left-0 right-0 bg-cui-bg text-cui-text text-center text-sm py-1 font-medium z-[70]">
        CUI - Controlled Unclassified Information
      </div>

      {/* Fixed Navbar - z-[60] ensures dropdowns appear above main content, overflow-visible for dropdown menus */}
      <div className="fixed top-7 left-0 right-0 z-[60]">
        <Navbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1 pt-[calc(1.75rem+4rem)] overflow-x-hidden bg-subtle-pattern">
        <main id="main-content" className="flex-1 pb-16 overflow-x-hidden" tabIndex={-1}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
            <Outlet />
          </div>
        </main>
      </div>

      {/* CUI Banner Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-cui-bg text-cui-text text-center text-sm py-1 font-medium z-[70]">
        CUI - Controlled Unclassified Information
      </footer>
    </div>
  )
}
