"use client"
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function SuccessContent() {
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
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <div className="text-center mb-8">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => router.push('/orders')}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          View Orders
        </button>
        <button
          onClick={() => router.push('/prints')}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0000] mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
