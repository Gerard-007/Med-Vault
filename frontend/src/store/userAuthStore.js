import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useUserAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      error: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      clearError: () => set({ error: null }),
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Reset all state
      reset: () => {
        set({
          user: null,
          token: null,
          error: null,
          isLoading: false,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'user-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserAuthStore;




