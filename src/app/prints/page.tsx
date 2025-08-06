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

export default function Prints() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState<number>(0);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const items = useCartStore((state) => state.items);
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setProducts(data.data || []);
        } else {
          const text = await response.text();
          console.error("Expected JSON, got:", text);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [items]);

  if (loading) return <div>Loading...</div>;

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

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "All Categories",
    ...new Set(products.map((product) => product.category)),
  ];

  // Group products by category for display
  const groupedProducts = () => {
    if (selectedCategory !== "All Categories") {
      return { [selectedCategory]: filteredProducts };
    }
    
    const grouped: { [key: string]: Product[] } = {};
    filteredProducts.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  };

  const productGroups = groupedProducts();

  //price formatting function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(price);
  };

  return (
    <PageTransition>
      <div className="relative pt-32 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        {/* Search and Filter Section */}
        <div className="container mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-12 py-3 rounded-full border-2 border-gray-200 dark:border-gray-600
              focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 
              outline-none transition-all duration-300 
              bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400"
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

            {/* Category Filter */}
            <div className="relative w-full md:w-72">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none w-full px-12 py-3 rounded-full 
        border-2 border-gray-200 focus:border-[#FF0000] 
        focus:ring-2 focus:ring-[#FF0000]/20 outline-none 
        transition-all duration-300 bg-gray-50 
        dark:bg-gray-700 dark:border-gray-600 
        text-gray-900 dark:text-white cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="absolute left-4 top-3.5">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {Object.keys(productGroups).length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div>No products found matching your criteria</div>
            {/* Suggest a few products */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-200">You might also like</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                {[...products]
                  .filter((p) => p) // filter out undefined products
                  .sort(() => 0.5 - Math.random()) // randomize order
                  .slice(0, 8) // take only 8 products
                  .map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-[350px] md:h-[500px] flex flex-col mb-4"
                    >
                      <div className="relative w-full h-48 md:h-80">
                        {product.image_url ? (
                          <CloudinaryImage
                            publicId={getImageFilenameFromUrl(product.image_url)}
                            alt={product.image_alt_text || product.name}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                            width={400}
                            height={320}
                          />
                        ) : (
                          <Image
                            src="/images/placeholder.jpg"
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        )}
                      </div>
                      <div className="p-3 md:p-6 flex flex-col flex-grow">
                        <h3 className="font-semibold text-sm md:text-lg mb-2 text-black dark:text-white line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setQuantity(product.minimum_order);
                            const pricePerPiece =
                              product.amount / product.minimum_order;
                            setCalculatedPrice(product.amount);
                            setIsSidebarOpen(true);
                          }}
                          className="w-full bg-black hover:bg-red-600 dark:bg-gray-800 dark:hover:bg-red-600 text-white px-4 py-2 rounded transition-colors mt-auto text-xs md:text-sm"
                        >
                          See More
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="dark:bg-gray-800 p-8">
            {Object.entries(productGroups).map(([category, categoryProducts]) => (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white border-b-2 border-red-500 pb-4">
                  {category}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                  {categoryProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-[350px] md:h-[500px] flex flex-col mb-4"
                    >
                      <div className="relative w-full h-48 md:h-80">
                        {product.image_url ? (
                          <CloudinaryImage
                            publicId={getImageFilenameFromUrl(product.image_url)}
                            alt={product.image_alt_text || product.name}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                            width={400}
                            height={320}
                          />
                        ) : (
                          <Image
                            src="/images/placeholder.jpg"
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                        )}
                      </div>
                      <div className="p-3 md:p-6 flex flex-col flex-grow">
                        <h3 className="font-semibold text-sm md:text-lg mb-2 text-black dark:text-white line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setQuantity(product.minimum_order);
                            const pricePerPiece =
                              product.amount / product.minimum_order;
                            setCalculatedPrice(product.amount);
                            setIsSidebarOpen(true);
                          }}
                          className="w-full bg-black hover:bg-red-600 dark:bg-gray-800 dark:hover:bg-red-600 text-white px-4 py-2 rounded transition-colors mt-auto text-xs md:text-sm"
                        >
                          See More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
          p-4 sm:p-8 overflow-y-auto shadow-2xl border-l border-gray-200 dark:border-gray-700
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
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
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

              <div className="mt-8 sm:mt-12">
                <div className="relative w-80 mx-auto sm:w-full sm:h-80 mb-6 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                  {selectedProduct.image_url ? (
                    <CloudinaryImage
                      publicId={getImageFilenameFromUrl(selectedProduct.image_url)}
                      alt={selectedProduct.image_alt_text || selectedProduct.name}
                      className="w-full min-h-96 object-contain sm:w-full sm:h-full sm:object-contain"
                    />
                  ) : (
                    <Image
                      src="/images/placeholder.jpg"
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                  )}
                </div>

                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {selectedProduct.name}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Category:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedProduct.category}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        Minimum Order:
                      </span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedProduct.minimum_order} pieces
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Quantity (minimum {selectedProduct.minimum_order} pieces)
                  </label>
                  <input
                    type="number"
                    min={selectedProduct.minimum_order}
                    value={quantity || ""}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 0;
                      setQuantity(newQuantity);
                      const pricePerPiece =
                        selectedProduct.amount / selectedProduct.minimum_order;
                      setCalculatedPrice(newQuantity * pricePerPiece);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:border-transparent
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="mb-6 p-4 bg-[#FF0000]/10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Price per piece:
                    </span>
                    <span className="text-[#FF0000] font-bold">
                      ₦{formatPrice(selectedProduct.amount / selectedProduct.minimum_order)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Total ({quantity} pieces):
                    </span>
                    <span className="text-[#FF0000] font-bold text-xl">
                      ₦{formatPrice(calculatedPrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#FF0000] text-white py-3 px-6 rounded-lg font-medium
                  hover:bg-[#FF0000]/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
