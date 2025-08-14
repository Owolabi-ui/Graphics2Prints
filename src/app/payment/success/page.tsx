"use client"
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import DesignUpload from '@/components/ui/DesignUpload'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clearCart = useCartStore(state => state.clearCart)
  const [showUpload, setShowUpload] = useState(false)
  const [orderReference, setOrderReference] = useState<string | null>(null)
  
  useEffect(() => {
    const reference = searchParams.get('reference')
    if (reference) {
      setOrderReference(reference)
      clearCart()
      // Verify payment status with backend if needed
    }
  }, [searchParams, clearCart])
  
  const handleUploadComplete = (uploadData: { url: string; publicId: string }) => {
    console.log('Upload completed:', uploadData)
    // Optionally redirect or show a completion message
  }

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
        {orderReference && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Order Reference: <span className="font-mono">{orderReference}</span>
          </p>
        )}
      </div>

      {/* Design Upload Section */}
      <div className="mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Upload Your Design Files
          </h2>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            Now that your payment is complete, you can upload your design files for printing.
            Our team will review your designs and contact you if any adjustments are needed.
          </p>
          {!showUpload ? (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-[#FF0000] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Upload Design Files
            </button>
          ) : (
            <button
              onClick={() => setShowUpload(false)}
              className="text-blue-800 dark:text-blue-200 underline hover:no-underline"
            >
              Skip for now (you can upload later)
            </button>
          )}
        </div>

        {showUpload && (
          <DesignUpload
            orderId={orderReference || undefined}
            onUploadComplete={handleUploadComplete}
          />
        )}
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

      {/* Additional Information */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            What happens next?
          </h3>
          <div className="text-left space-y-2 text-gray-600 dark:text-gray-400">
            <p>• We'll review your uploaded designs within 24 hours</p>
            <p>• If adjustments are needed, our team will contact you</p>
            <p>• Production will begin once designs are approved</p>
            <p>• You'll receive updates on your order progress</p>
            <p>• Delivery will be made according to the specified timeline</p>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact us via WhatsApp: +234 816 641 1702
          </div>
        </div>
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