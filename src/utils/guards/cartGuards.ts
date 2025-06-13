import { Product, CartItem } from '@/types/cart'

export const isProduct = (item: unknown): item is Product => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'name' in item &&
    'amount' in item &&
    'minimum_order' in item
  )
}

export const isCartItem = (item: unknown): item is CartItem => {
  return isProduct(item) && 'quantity' in item
}

export const isValidQuantity = (quantity: number, minimum_order: number): boolean => {
  return quantity >= minimum_order && Number.isInteger(quantity)
}