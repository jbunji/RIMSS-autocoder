import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Maintenance level types - determines what maintenance actions a user can perform
// SHOP (I-level): Can REQUEST parts, create maintenance events
// DEPOT (D-level): Can ACKNOWLEDGE, FILL, and SHIP parts orders
export type MaintenanceLevel = 'SHOP' | 'DEPOT'

export interface User {
  user_id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'ADMIN' | 'DEPOT_MANAGER' | 'FIELD_TECHNICIAN' | 'VIEWER'
  programs: Array<{
    pgm_id: number
    pgm_cd: string
    pgm_name: string
    is_default: boolean
  }>
  locations?: Array<{
    loc_id: number
    display_name: string
    majcom_cd?: string
    site_cd?: string
    is_default: boolean
  }>
  // Allowed maintenance levels based on user permissions
  // Users with both can switch between them
  allowedMaintenanceLevels?: MaintenanceLevel[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  currentProgramId: number | null
  currentLocationId: number | null
  currentMaintenanceLevel: MaintenanceLevel | null
  sessionExpired: boolean

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setCurrentProgram: (programId: number) => void
  setCurrentLocation: (locationId: number) => void
  setCurrentMaintenanceLevel: (level: MaintenanceLevel) => void
  setSessionExpired: (expired: boolean) => void
  login: (user: User, token: string) => void
  logout: () => void
  clearAuth: () => void

  // Computed helpers
  isDepotUser: () => boolean
  isShopUser: () => boolean
  canFulfillOrders: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      currentProgramId: null,
      currentLocationId: null,
      currentMaintenanceLevel: null,
      sessionExpired: false,

      setUser: (user) => set((state) => {
        // Determine default maintenance level based on user's allowed levels
        const allowedLevels = user?.allowedMaintenanceLevels || []
        let defaultLevel: MaintenanceLevel | null = state.currentMaintenanceLevel

        // If no current level or current level not in allowed, pick first allowed
        if (!defaultLevel || !allowedLevels.includes(defaultLevel)) {
          defaultLevel = allowedLevels[0] || null
        }

        return {
          user,
          isAuthenticated: !!user,
          // Only set currentProgramId if not already persisted
          currentProgramId: state.currentProgramId || user?.programs?.find(p => p.is_default)?.pgm_id || user?.programs?.[0]?.pgm_id || null,
          // Only set currentLocationId if not already persisted
          currentLocationId: state.currentLocationId || user?.locations?.find(l => l.is_default)?.loc_id || user?.locations?.[0]?.loc_id || null,
          currentMaintenanceLevel: defaultLevel
        }
      }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setCurrentProgram: (programId) => set({ currentProgramId: programId }),

      setCurrentLocation: (locationId) => set({ currentLocationId: locationId }),

      setCurrentMaintenanceLevel: (level) => set({ currentMaintenanceLevel: level }),

      setSessionExpired: (sessionExpired) => set({ sessionExpired }),

      login: (user, token) => {
        // Determine default maintenance level
        const allowedLevels = user?.allowedMaintenanceLevels || []
        const defaultLevel = allowedLevels[0] || null

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          sessionExpired: false,
          currentProgramId: user.programs?.find(p => p.is_default)?.pgm_id || user.programs?.[0]?.pgm_id || null,
          currentLocationId: user?.locations?.find(l => l.is_default)?.loc_id || user?.locations?.[0]?.loc_id || null,
          currentMaintenanceLevel: defaultLevel
        })
      },

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        currentProgramId: null,
        currentLocationId: null,
        currentMaintenanceLevel: null
      }),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        currentProgramId: null,
        currentLocationId: null,
        currentMaintenanceLevel: null
      }),

      // Computed helpers for checking maintenance level permissions
      isDepotUser: () => {
        const state = get()
        return state.currentMaintenanceLevel === 'DEPOT'
      },

      isShopUser: () => {
        const state = get()
        return state.currentMaintenanceLevel === 'SHOP'
      },

      // DEPOT users and ADMINs can fulfill (acknowledge, fill, ship) parts orders
      canFulfillOrders: () => {
        const state = get()
        return state.currentMaintenanceLevel === 'DEPOT' || state.user?.role === 'ADMIN'
      },
    }),
    {
      name: 'rimss-auth-storage',
      partialize: (state) => ({
        token: state.token,
        currentProgramId: state.currentProgramId,
        currentLocationId: state.currentLocationId,
        currentMaintenanceLevel: state.currentMaintenanceLevel
      }),
    }
  )
)
