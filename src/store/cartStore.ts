import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem, CartStore } from '@/types/cart'
import { isProduct, isValidQuantity } from '../utils/guards/cartGuards'


// Updated the addItem function to accept a quantity parameter
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        if (!isProduct(product) || !isValidQuantity(quantity, product.minimum_order)) {
          console.error('Invalid product or quantity')
          return
        }
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id)
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity }
                  : item
              )
            }
          }
          return { items: [...state.items, { ...product, quantity }] }
        })
      },
        getItemCount: () => get().items.length,
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity }
              : item
          )
        })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'cart-storage'
    }
  )
)