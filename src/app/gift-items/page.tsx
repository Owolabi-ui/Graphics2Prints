"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import PageTransition from "@/components/PageTransition/PageTransition";
import "react-toastify/dist/ReactToastify.css";
import { Product } from "@/types/cart";
import Image from "next/image";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import { getImageFilenameFromUrl } from "@/utils/cloudinary";

export default function GiftItems() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState<number>(0);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [pricePerPiece, setPricePerPiece] = useState<number>(0);

 



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        // Filter only products with "gift-item" category
        const giftItems = (data.data || []).filter(
          (product: Product) => product.category === "gift-item"
        );
        setProducts(giftItems);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Filtering products by search
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Price formatting function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (!quantity || quantity < selectedProduct.minimum_order) {
      toast.error(`Minimum order is ${selectedProduct.minimum_order} pieces`);
      return;
    }

    addToCart(selectedProduct, quantity);
    toast.success("Added to cart");
    setIsSidebarOpen(false);
  };

  return (
    <PageTransition>
      <div className="relative pt-32 dark:bg-gray-800">
        {/* Search Section */}
        <div className="container mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search gift items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-12 py-3 rounded-full border-2 border-gray-200 
              focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 
              outline-none transition-all duration-300 
              bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
              text-gray-900 dark:text-white placeholder-gray-500 
              dark:placeholder-gray-400"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="dark:bg-gray-800 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 p-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-[500px] flex flex-col mb-4"
            >
              <div className="relative w-full h-80">
                {product.image_url ? (
                  <CloudinaryImage
                    publicId={getImageFilenameFromUrl(product.image_url)}
                    alt={product.image_alt_text || product.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    width={400}
                    height={320}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2 text-black line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setQuantity(product.minimum_order);
                    const pricePerPiece =
                      product.amount / product.minimum_order;
                    setCalculatedPrice(product.amount);
                    setPricePerPiece(pricePerPiece);
                    setIsSidebarOpen(true);
                  }}
                  className="w-full bg-black text-white px-4 py-2 rounded hover:bg-[#FF0000] transition-colors mt-auto"
                >
                  See More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No gift items found matching your criteria
          </div>
        )}

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Product Details Sidebar */}
        <div
          className={`
          fixed top-0 right-0 h-full bg-white dark:bg-gray-900 z-50
          p-4 sm:p-8 overflow-y-auto shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          w-full sm:w-4/5 md:w-1/2 max-w-md sm:max-w-lg md:max-w-2xl
        `}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            e.currentTarget.dataset.startX = touch.clientX.toString();
            e.currentTarget.dataset.startY = touch.clientY.toString();
          }}
          onTouchMove={(e) => {
            const startX = parseFloat(e.currentTarget.dataset.startX || '0');
            const startY = parseFloat(e.currentTarget.dataset.startY || '0');
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = currentX - startX;
            const diffY = Math.abs(currentY - startY);
            
            // Only allow horizontal swiping right (positive diffX) and only on mobile
            // Ensure it's more horizontal than vertical movement
            if (diffX > 0 && diffY < 50 && window.innerWidth < 640) {
              e.preventDefault(); // Prevent scrolling
              const translateX = Math.min(diffX, window.innerWidth);
              e.currentTarget.style.transform = `translateX(${translateX}px)`;
            }
          }}
          onTouchEnd={(e) => {
            const startX = parseFloat(e.currentTarget.dataset.startX || '0');
            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;
            
            // Reset transform
            e.currentTarget.style.transform = '';
            
            // Close sidebar if swiped right more than 100px, only close sidebar, don't navigate
            if (diffX > 100 && window.innerWidth < 640) {
              setIsSidebarOpen(false);
            }
          }}
        >
          {selectedProduct && (
            <>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="mt-6 sm:mt-8">
                <div className="relative w-80 mx-auto sm:w-full mb-6 rounded-lg overflow-hidden shadow-lg bg-gray-50 dark:bg-gray-800">
                  {selectedProduct.image_url ? (
                    <CloudinaryImage
                      publicId={getImageFilenameFromUrl(selectedProduct.image_url)}
                      alt={selectedProduct.image_alt_text || selectedProduct.name}
                      className="w-full min-h-96 object-contain sm:w-full sm:h-auto sm:object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">No Image Available</span>
                    </div>
                  )}
                </div>
                <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedProduct.name}
                </h2>
                <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="mt-8 space-y-6">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Specifications
                      </h3>
                      <p className="text-gray-600">
                        {selectedProduct.specifications}
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">Material</h3>
                      <p className="text-gray-600">
                        {selectedProduct.material}
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Finishing Options
                      </h3>
                      <p className="text-gray-600">
                        {selectedProduct.finishing_options}
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Delivery Time
                      </h3>
                      <p className="text-gray-600">
                        {selectedProduct.delivery_time}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mb-4">
                      <label
                        htmlFor="quantity"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Quantity:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (quantity > selectedProduct.minimum_order) {
                            setQuantity(
                              quantity - selectedProduct.minimum_order
                            );
                            setCalculatedPrice(
                              pricePerPiece *
                                (quantity - selectedProduct.minimum_order)
                            );
                          }
                        }}
                        className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 transition"
                        disabled={quantity <= selectedProduct.minimum_order}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min={selectedProduct.minimum_order}
                        step={selectedProduct.minimum_order}
                        value={quantity || ""}
                        onChange={(e) => {
                          let val = parseInt(e.target.value) || selectedProduct.minimum_order;
                          if (val < selectedProduct.minimum_order)
                            val = selectedProduct.minimum_order;
                          setQuantity(val);
                          setCalculatedPrice(pricePerPiece * val);
                        }}
                        className="w-20 px-2 py-1 border-t border-b border-gray-300 text-center focus:ring-2 focus:ring-[#FF0000]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setQuantity(quantity + selectedProduct.minimum_order);
                          setCalculatedPrice(
                            pricePerPiece *
                              (quantity + selectedProduct.minimum_order)
                          );
                        }}
                        className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300 transition"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">Pricing</h3>
                      <p className="text-3xl font-bold text-gray-900">
                        ₦
                        {formatPrice(
                          quantity > selectedProduct.minimum_order
                            ? calculatedPrice
                            : selectedProduct.amount
                        )}
                      </p>
                      <p className="text-gray-600 mt-2">
                        Minimum order: {selectedProduct.minimum_order} pieces
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={`https://wa.me/+2348166411702?text=I'm%20interested%20in%20${selectedProduct.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-black text-white text-center py-4 rounded-lg hover:bg-[#FF0000] transition-colors"
                    >
                      Order via WhatsApp
                    </a>
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 flex-1 bg-[#FF0000] text-white py-4 rounded-lg hover:bg-black transition-colors"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}