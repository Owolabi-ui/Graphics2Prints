"use client"
import { useState, useEffect } from 'react'
import PageTransition from '@/components/PageTransition/PageTransition'

interface Product {
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
}

export default function Prints() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.data || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <PageTransition>
      <div className="relative pt-24 dark:bg-gray-800">
        {/* Products Grid */}
        <div className="dark:bg-gray-800 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
             <div className="aspect-w-16 aspect-h-9 overflow-hidden">
    <img 
      src={product.image_url} 
      alt={product.image_alt_text}
      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
    />
  </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-black">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <button 
                  onClick={() => {
                    setSelectedProduct(product)
                    setIsSidebarOpen(true)
                  }}
                  className="w-full bg-black text-white px-4 py-2 rounded hover:bg-[#73483D] transition-colors"
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Product Details Sidebar */}
        <div className={`
          fixed top-0 right-0 h-full bg-white z-50
          p-8 overflow-y-auto dark:bg-gray-900 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          md:w-1/2 w-full max-w-2xl
        `}>
          {selectedProduct && (
            <>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mt-8   ">
                <img 
                  src={selectedProduct.image_url} 
                  alt={selectedProduct.image_alt_text}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
                
                <div className="mt-8">
                  <h2 className="text-3xl font-bold text-gray-900 ">{selectedProduct.name}</h2>
                  <p className="mt-4 text-gray-600 text-lg leading-relaxed">{selectedProduct.description}</p>
                  
                  <div className="mt-8 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Pricing</h3>
                      <p className="text-3xl font-bold text-gray-900">₦{selectedProduct.amount}</p>
                      <p className="text-gray-600 mt-2">Minimum order: {selectedProduct.minimum_order} pieces</p>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                        <p className="text-gray-600">{selectedProduct.specifications}</p>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Material</h3>
                        <p className="text-gray-600">{selectedProduct.material}</p>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Finishing Options</h3>
                        <p className="text-gray-600">{selectedProduct.finishing_options}</p>
                      </div>

                      <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-2">Delivery Time</h3>
                        <p className="text-gray-600">{selectedProduct.delivery_time}</p>
                      </div>
                    </div>

                    <a 
                      href={`https://wa.me/+2348166411702?text=I'm%20interested%20in%20${selectedProduct.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-black text-white text-center py-4 rounded-lg hover:bg-[#73483D] transition-colors mt-8"
                    >
                      Order via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}