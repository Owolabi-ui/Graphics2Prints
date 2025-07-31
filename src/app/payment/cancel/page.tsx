"use client"
import { useRouter } from 'next/navigation'
import { XCircleIcon } from '@heroicons/react/24/outline'

export default function Cancel() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your payment was cancelled. No charges were made.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-black text-white px-6 py-3 rounded hover:bg-[#FF0000] transition-colors"
          >
            Return to Cart
          </button>
          <button
            onClick={() => router.push('/prints')}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}