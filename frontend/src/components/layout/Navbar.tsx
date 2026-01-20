import { Fragment, useState, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BellIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'

interface NavbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate()
  const { user, logout, currentProgramId, setCurrentProgram, token } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState<number>(0)

  // Get current program from user's programs
  const currentProgram = user?.programs?.find(p => p.pgm_id === currentProgramId)
  const availablePrograms = user?.programs || []

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!token) return

      try {
        const response = await fetch('http://localhost:3001/api/notifications/unread-count', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.count)
        }
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    }

    fetchUnreadCount()

    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    // Listen for notification acknowledgment events to refresh count immediately
    const handleNotificationChange = () => {
      fetchUnreadCount()
    }

    window.addEventListener('notificationAcknowledged', handleNotificationChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('notificationAcknowledged', handleNotificationChange)
    }
  }, [token])

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to invalidate token
      if (token) {
        await fetch('http://localhost:3001/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with local logout even if API call fails
    }

    // Clear local auth state
    logout()
    navigate('/login')
  }

  const handleProgramChange = (programId: number) => {
    setCurrentProgram(programId)
  }

  return (
    <nav className="bg-primary-800 shadow-lg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Menu button and logo */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onMenuClick}
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="ml-4 flex items-center">
              <span className="text-white font-bold text-xl tracking-tight">RIMSS</span>
              <span className="ml-2 text-gray-300 text-sm hidden sm:block">
                Remote Independent Maintenance Status System
              </span>
            </div>
          </div>

          {/* Right side - Notifications, Program selector and user menu */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative inline-flex items-center rounded-md p-2 text-gray-200 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="View notifications"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-primary-800">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Program Selector */}
            {availablePrograms.length > 0 && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center rounded-md bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800">
                  <span className="hidden sm:inline">Program:</span>
                  <span className="ml-1 font-semibold">{currentProgram?.pgm_cd || 'Select'}</span>
                  <ChevronDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {availablePrograms.map((program) => (
                      <Menu.Item key={program.pgm_id}>
                        {({ active }) => (
                          <button
                            onClick={() => handleProgramChange(program.pgm_id)}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } ${
                              currentProgramId === program.pgm_id ? 'bg-primary-50 text-primary-800' : 'text-gray-700'
                            } block w-full px-4 py-2 text-left text-sm`}
                          >
                            <div className="font-medium">{program.pgm_cd}</div>
                            <div className="text-xs text-gray-500 truncate">{program.pgm_name}</div>
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center rounded-md bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800">
                <UserCircleIcon className="h-6 w-6 mr-2" aria-hidden="true" />
                <span className="hidden md:inline">{user?.first_name} {user?.last_name}</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-primary-600 capitalize mt-1">
                      {user?.role?.replace('_', ' ').toLowerCase()}
                    </p>
                  </div>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Your Profile
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>

                  <div className="border-t border-gray-100">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex w-full items-center px-4 py-2 text-sm text-red-700`}
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}
