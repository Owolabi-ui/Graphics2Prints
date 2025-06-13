"use client";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTransition from "@/components/PageTransition/PageTransition";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Link from "next/link";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper/modules";

interface Product {
  id: number;
  name: string;
  description: string;
  amount: number;
  minimum_order: number;
  category: string;
  delivery_time: string;
  quantity: number;
  finishing_options: string;
  image_url: string;
  image_alt_text: string;
  material: string;
  specifications: string;
}

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const addToCart = useCartStore((state) => state.addItem);
  const [loading, setLoading] = useState(true);
  const [pricePerPiece, setPricePerPiece] = useState<number>(0);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(price);
  };
 

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        const randomProducts = data.data
          .sort(() => Math.random() - 0.5)
          .slice(0, 8);
        setPopularProducts(randomProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 mt-24 gap-8">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-2 mt-4">
              Experience High Class Printing
            </h2>
            <p className="text-lg mb-3">
              We offer high-quality printing services tailored to your needs.
              From business cards to posters to custom gift items, we&apos;ve got you
              covered.
            </p>
            <Link
  href="/prints"
  className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#ED3237] transition duration-300 ease-in-out transform hover:scale-110 inline-block"
>
  Learn More
</Link>
          </div>

          {/* Carousel Section */}
          <div className="w-full md:w-2/3 mt-2 md:mt-20">
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="rounded-lg shadow-lg"
            >
              {/* ...Swiper slides... */}
              <SwiperSlide>
  <div className="relative w-full h-[500px]"> {/* Set a fixed height for the carousel */}
    <Image
      src="/images/image3.png"
      alt="Slide 1"
      fill
      className="object-cover rounded-lg"
      sizes="(max-width: 768px) 100vw, 900px"
      priority
    />
  </div>
</SwiperSlide>
<SwiperSlide>
  <div className="relative w-full h-[500px]">
    <Image
      src="/images/image1.png"
      alt="Slide 2"
      fill
      className="object-cover rounded-lg"
      sizes="(max-width: 768px) 100vw, 900px"
      priority
    />
  </div>
</SwiperSlide>
<SwiperSlide>
  <div className="relative w-full h-[500px]">
    <Image
      src="/images/image2.png"
      alt="Slide 3"
      fill
      className="object-cover rounded-lg"
      sizes="(max-width: 768px) 100vw, 900px"
      priority
    />
  </div>
</SwiperSlide>
            </Swiper>
          </div>
        </div>

       {/* Gift Items Section */}
<section className="relative py-20 mt-20 mb-20 overflow-hidden bg-gradient-to-br from-[#000000] via-[#2d2d2d] to-[#73483D]">
  {/* Decorative SVG background */}
  <svg
    className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      fill="#ED3237"
      fillOpacity="0.3"
      d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
    />
  </svg>
  <div className="relative container mx-auto px-6 text-center z-10">
    
    <h1 className="text-4xl text-white md:text-5xl font-extrabold mb-4 bg-clip-text drop-shadow-lg">
      Beautifully Crafted Gift Items
    </h1>
    <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
      At <span className="font-bold text-[#ED3237]">Graphics2Prints</span>, we specialize in creating stunning gift items
      that leave a lasting impression. Whether it&apos;s for a special
      occasion or a corporate event, our custom designs and high-quality
      materials ensure your gifts stand out.
    </p>
   <Link
  href="/gift-items"
  className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-md font-semibold shadow-lg hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#ED3237] hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
  Learn More
</Link>
  </div>
</section>

        {/* Popular Products Section */}
        <section className="py-15 bg-white dark:bg-gray-900 mb-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Popular Products
            </h2>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="pb-20" // Space for pagination dots
            >
              {popularProducts.map((product) => (
                <SwiperSlide
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-[450px] flex flex-col"
                >
                  <div className="relative w-full h-60">
                    <Image
                       src={product.image_url}
                      alt={product.image_alt_text}
                      fill
                      className="object-cover transform hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
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
                        setQuantity(product.minimum_order); // Set initial quantity to minimum_order
                        const pricePerItem =
                          product.amount / product.minimum_order;
                        setPricePerPiece(pricePerItem);
                        setCalculatedPrice(product.amount); // Set initial price to product amount
                        setIsSidebarOpen(true);
                      }}
                      className="w-full bg-black text-white px-4 py-2 rounded hover:bg-[#73483D] transition-colors mt-auto"
                    >
                      See More
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Sidebar Overlay - Same as prints page */}
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
          p-8 overflow-y-auto shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          md:w-1/2 w-full max-w-2xl
        `}
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

              <div className="mt-8">
                <Image
                  width={700}
                  height={500}
                  src={selectedProduct.image_url}
                  alt={selectedProduct.image_alt_text}
                  className="object-cover rounded-lg shadow-lg"
                />
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
                        value={quantity}
                        onChange={(e) => {
                          let val = parseInt(e.target.value);
                          if (isNaN(val) || val < selectedProduct.minimum_order)
                            val = selectedProduct.minimum_order;
                          setQuantity(val);
                          setCalculatedPrice(pricePerPiece * val);
                        }}
                        className="w-20 px-2 py-1 border-t border-b border-gray-300 text-center focus:ring-2 focus:ring-[#73483D]"
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
                      href={`https://wa.me/+2348166411702?text=I%27m%20interested%20in%20${selectedProduct.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-black text-white text-center py-4 rounded-lg hover:bg-[#73483D] transition-colors"
                    >
                      Order via WhatsApp
                    </a>
                    <button
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 flex-1 bg-[#73483D] text-white py-4 rounded-lg hover:bg-black transition-colors"
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
        {/* Testimonials Section */}
        <section className="py-20 bg-[#E5E4E2] mb-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-black">
              What Our Clients Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/avatar1.jpg"
                    alt="Client"
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-black">John Doe</h3>
                    <p className="text-gray-600">CEO, Tech Corp</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  &quot;Exceptional service! The team delivered our website ahead of
                  schedule and exceeded our expectations.&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/avatar2.jpg"
                    alt="Client"
                    width={48}
                    height={48}  
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-black">Jane Smith</h3>
                    <p className="text-gray-600">Marketing Director</p>
                  </div>
                </div>
                <p className="text-gray-700 text-black">
                  &quot;The print quality is outstanding. Their attention to detail
                  sets them apart from others.&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/avatar3.jpg"
                    alt="Client"
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-black">Mike Johnson</h3>
                    <p className="text-gray-600">Small Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  &quot;From business cards to banners, they handle everything with
                  professionalism and quality.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
