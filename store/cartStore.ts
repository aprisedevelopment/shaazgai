'use client'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartState, CartStoreItem } from '@/types'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryZoneId: 0,
      deliveryUne: 0,
      noat: false,

      addItem: (item: CartStoreItem) => {
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === item.productId && i.songolt === item.songolt
          )
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === item.productId && i.songolt === item.songolt
                  ? { ...i, hed: Math.min(i.hed + item.hed, 30) }
                  : i
              ),
            }
          }
          return { items: [...s.items, item] }
        })
      },

      removeItem: (productId: number) => {
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) }))
      },

      updateQty: (productId: number, hed: number) => {
        if (hed <= 0) {
          get().removeItem(productId)
          return
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, hed: Math.min(hed, 30) } : i
          ),
        }))
      },

      setDelivery: (zoneId: number, une: number) => {
        set({ deliveryZoneId: zoneId, deliveryUne: une })
      },

      toggleNoat: () => set((s) => ({ noat: !s.noat })),

      clearCart: () => set({ items: [], deliveryZoneId: 0, deliveryUne: 0, noat: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.hed, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.une * i.hed, 0),

      total: () => {
        const s = get()
        let t = s.subtotal() + s.deliveryUne
        if (s.noat) t += Math.floor((t * 10) / 100)
        return t
      },
    }),
    {
      name: 'tugeelt-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
