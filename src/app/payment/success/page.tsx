"use client"
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export default function Success() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clearCart = useCartStore(state => state.clearCart)
  
  useEffect(() => {
    const reference = searchParams.get('reference')
    if (reference) {
      clearCart()
      // Verify payment status with backend if needed
    }
  }, [searchParams, clearCart])

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-8">Payment Successful!</h1>
      <p className="mb-8">Thank you for your purchase.</p>
      <button
        onClick={() => router.push('/prints')}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Continue Shopping
      </button>
    </div>
  )
}