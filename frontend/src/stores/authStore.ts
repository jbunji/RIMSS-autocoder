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
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  currentProgramId: number | null

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setCurrentProgram: (programId: number) => void
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

      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        currentProgramId: user?.programs?.find(p => p.is_default)?.pgm_id || user?.programs?.[0]?.pgm_id || null
      }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      setCurrentProgram: (programId) => set({ currentProgramId: programId }),

      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        currentProgramId: user.programs?.find(p => p.is_default)?.pgm_id || user.programs?.[0]?.pgm_id || null
      }),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        currentProgramId: null
      }),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        currentProgramId: null
      }),
    }),
    {
      name: 'rimss-auth-storage',
      partialize: (state) => ({
        token: state.token,
        currentProgramId: state.currentProgramId
      }),
    }
  )
)
