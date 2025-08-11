export interface BaseProduct {
    id: number
    name: string
    description: string
    amount: number
    minimum_order: number
    category: string
    delivery_time: string
    finishing_options: string
    image_url: string
    image_alt_text: string
    material: string
    specifications: string
    availability_type?: string // "in_stock", "pre_order", "custom_price"
    is_available?: boolean
    custom_price_note?: string
    pre_order_note?: string
  }
  
  export interface Product extends BaseProduct {
    quantity?: number // Optional for products not in cart
  }
  
  export interface CartItem extends BaseProduct {
    quantity: number // Required for cart items
  }
  
  export interface CartTotal {
    items: CartItem[]
    total: number
  }
  
  export interface CartStore {
    items: CartItem[]
    addItem: (product: Product, quantity: number) => void
    getItemCount: () => number
    removeItem: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
  }