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
  MapPinIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'

interface NavbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate()
  const { user, logout, currentProgramId, setCurrentProgram, currentLocationId, setCurrentLocation, token } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Get current program from user's programs
  const currentProgram = user?.programs?.find(p => p.pgm_id === currentProgramId)
  const availablePrograms = user?.programs || []

  // Get current location from user's locations
  const currentLocation = user?.locations?.find(l => l.loc_id === currentLocationId)
  // Filter locations by current program - only show locations valid for the selected program
  const availableLocations = user?.locations?.filter(l => l.pgm_id === currentProgramId) || []

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

    // When switching programs, check if current location is valid for the new program
    // If not, switch to the first valid location for the new program
    const locationsForNewProgram = user?.locations?.filter(l => l.pgm_id === programId) || []
    const currentLocationIsValid = locationsForNewProgram.some(l => l.loc_id === currentLocationId)

    if (!currentLocationIsValid && locationsForNewProgram.length > 0) {
      // Find the default location for this program, or use the first one
      const defaultLocation = locationsForNewProgram.find(l => l.is_default) || locationsForNewProgram[0]
      setCurrentLocation(defaultLocation.loc_id)
    }
  }

  const handleLocationChange = (locationId: number) => {
    setCurrentLocation(locationId)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <nav className="bg-primary-800 shadow-lg overflow-x-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-full overflow-x-hidden">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Left side - Menu button and logo */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-200 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white min-h-[44px] min-w-[44px]"
              onClick={onMenuClick}
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="ml-4 flex items-center">
              <span className="text-white font-bold text-xl tracking-tight">RIMSS</span>
              <span className="ml-2 text-gray-300 text-sm hidden sm:block">
                RAMPOD Inventory & Maintenance System Software
              </span>
            </div>
          </div>

          {/* Center - Search bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-0 bg-primary-700 py-2 pl-10 pr-3 text-white placeholder:text-gray-300 focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 sm:text-sm min-h-[44px]"
                  placeholder="Search assets, events, configs..."
                  aria-label="Global search"
                />
              </div>
            </form>
          </div>

          {/* Right side - Notifications, Program selector and user menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative inline-flex items-center rounded-md p-2.5 text-gray-200 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white min-h-[44px] min-w-[44px]"
              aria-label="View notifications"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full border-2 border-primary-800">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Location Display/Selector */}
            {availableLocations.length > 0 && (
              availableLocations.length > 1 ? (
                // Multiple locations - show dropdown selector
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center rounded-md bg-primary-700 px-2 sm:px-3 py-2.5 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 min-h-[44px]">
                    <MapPinIcon className="h-5 w-5 sm:mr-1.5 flex-shrink-0" aria-hidden="true" />
                    <span className="hidden xl:inline">Location:</span>
                    <span className="hidden sm:inline ml-1 font-semibold truncate max-w-[80px] md:max-w-[120px]">{currentLocation?.display_name || 'Select'}</span>
                    <ChevronDownIcon className="ml-1 sm:ml-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
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
                      {availableLocations.map((location) => (
                        <Menu.Item key={location.loc_id}>
                          {({ active }) => (
                            <button
                              onClick={() => handleLocationChange(location.loc_id)}
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } ${
                                currentLocationId === location.loc_id ? 'bg-primary-50 text-primary-800' : 'text-gray-700'
                              } block w-full px-4 py-2 text-left text-sm`}
                            >
                              <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
                                <span className="font-medium">{location.display_name}</span>
                              </div>
                              {location.is_default && (
                                <div className="text-xs text-gray-500 ml-6">Default location</div>
                              )}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                // Single location - show static display (no dropdown)
                <div className="flex items-center rounded-md bg-primary-700 px-2 sm:px-3 py-2.5 text-sm font-medium text-white min-h-[44px]">
                  <MapPinIcon className="h-5 w-5 sm:mr-1.5 flex-shrink-0" aria-hidden="true" />
                  <span className="hidden xl:inline">Location:</span>
                  <span className="hidden sm:inline ml-1 font-semibold truncate max-w-[80px] md:max-w-[120px]">{currentLocation?.display_name || 'None'}</span>
                </div>
              )
            )}

            {/* Program Selector */}
            {availablePrograms.length > 0 && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center rounded-md bg-primary-700 px-2 sm:px-3 py-2.5 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 min-h-[44px]">
                  <span className="hidden md:inline">Program:</span>
                  <span className="ml-0 md:ml-1 font-semibold flex-shrink-0">{currentProgram?.pgm_cd || 'Select'}</span>
                  <ChevronDownIcon className="ml-1 sm:ml-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
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
              <Menu.Button className="flex items-center rounded-md bg-primary-700 px-2 sm:px-3 py-2.5 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 min-h-[44px]">
                <UserCircleIcon className="h-6 w-6 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                <span className="hidden lg:inline truncate max-w-[120px]">{user?.first_name} {user?.last_name}</span>
                <ChevronDownIcon className="hidden sm:inline ml-1 sm:ml-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
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
