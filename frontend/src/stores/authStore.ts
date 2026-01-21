import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  currentProgramId: number | null
  currentLocationId: number | null
  sessionExpired: boolean

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setCurrentProgram: (programId: number) => void
  setCurrentLocation: (locationId: number) => void
  setSessionExpired: (expired: boolean) => void
  login: (user: User, token: string) => void
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      currentProgramId: null,
      currentLocationId: null,
      sessionExpired: false,

      setUser: (user) => set((state) => ({
        user,
        isAuthenticated: !!user,
        // Only set currentProgramId if not already persisted
        currentProgramId: state.currentProgramId || user?.programs?.find(p => p.is_default)?.pgm_id || user?.programs?.[0]?.pgm_id || null,
        // Only set currentLocationId if not already persisted
        currentLocationId: state.currentLocationId || user?.locations?.find(l => l.is_default)?.loc_id || user?.locations?.[0]?.loc_id || null
      })),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setCurrentProgram: (programId) => set({ currentProgramId: programId }),

      setCurrentLocation: (locationId) => set({ currentLocationId: locationId }),

      setSessionExpired: (sessionExpired) => set({ sessionExpired }),

      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        sessionExpired: false,
        currentProgramId: user.programs?.find(p => p.is_default)?.pgm_id || user.programs?.[0]?.pgm_id || null,
        currentLocationId: user?.locations?.find(l => l.is_default)?.loc_id || user?.locations?.[0]?.loc_id || null
      }),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        currentProgramId: null,
        currentLocationId: null
      }),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        currentProgramId: null,
        currentLocationId: null
      }),
    }),
    {
      name: 'rimss-auth-storage',
      partialize: (state) => ({
        token: state.token,
        currentProgramId: state.currentProgramId,
        currentLocationId: state.currentLocationId
      }),
    }
  )
)
