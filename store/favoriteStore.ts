import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteState {
  favorites: number[] // Array of product IDs
  sesid: string
  initSesid: () => void
  toggleFavorite: (productId: number) => Promise<boolean>
  fetchFavorites: () => Promise<void>
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      sesid: '',
      initSesid: () => {
        if (!get().sesid) {
          set({ sesid: 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) })
        }
      },
      toggleFavorite: async (productId: number) => {
        get().initSesid()
        const isFav = get().favorites.includes(productId)
        
        // Optimistic UI update
        if (isFav) {
          set({ favorites: get().favorites.filter(id => id !== productId) })
        } else {
          set({ favorites: [...get().favorites, productId] })
        }

        try {
          const res = await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, sesid: get().sesid })
          })
          const data = await res.json()
          if (!data.success) {
            // Revert on failure
            if (isFav) {
              set({ favorites: [...get().favorites, productId] })
            } else {
              set({ favorites: get().favorites.filter(id => id !== productId) })
            }
            return false
          }
          return true
        } catch (error) {
          // Revert on failure
          if (isFav) {
            set({ favorites: [...get().favorites, productId] })
          } else {
            set({ favorites: get().favorites.filter(id => id !== productId) })
          }
          return false
        }
      },
      fetchFavorites: async () => {
        get().initSesid()
        try {
          const res = await fetch(`/api/favorites?sesid=${get().sesid}`)
          const data = await res.json()
          if (data.success && Array.isArray(data.favorites)) {
            set({ favorites: data.favorites })
          }
        } catch (error) {
          console.error('Failed to fetch favorites', error)
        }
      }
    }),
    {
      name: 'tugeelt-favorites',
      partialize: (state) => ({ sesid: state.sesid, favorites: state.favorites }) // Only persist sesid and local cache
    }
  )
)
