"use client";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCartIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import PageTransition from "@/components/PageTransition/PageTransition";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import Link from "next/link";
import { Navigation, Pagination, Scrollbar, Autoplay, EffectFade } from "swiper/modules";

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

const CLIENT_LOGO_COUNT = 30;

const features = [
  {
    title: "Premium Quality",
    description: "We use only the finest materials and cutting-edge printing technology",
    icon: "🏆"
  },
  {
    title: "Fast Delivery",
    description: "Quick turnaround times without compromising on quality",
    icon: "⚡"
  },
  {
    title: "Custom Design",
    description: "Personalized designs tailored to your unique requirements",
    icon: "🎨"
  },
  {
    title: "Affordable Pricing",
    description: "Competitive prices for all budgets without hidden costs",
    icon: "💰"
  }
];

// Counter animation hook
const useCountUp = (end: number, duration: number = 2000, isInView: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const startValue = 0;
    const endValue = end;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isInView]);

  return count;
};

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const addToCart = useCartStore((state) => state.addItem);
  const [loading, setLoading] = useState(true);
  const [pricePerPiece, setPricePerPiece] = useState<number>(0);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAllClients, setShowAllClients] = useState(false);

  // Add refs and intersection observer for stats section
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [isStatsInView, setIsStatsInView] = useState(false);

  // Add refs and intersection observer for features section
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const [isFeaturesInView, setIsFeaturesInView] = useState(false);

  // Add refs and intersection observer for products section
  const productsRef = useRef<HTMLDivElement | null>(null);
  const [isProductsInView, setIsProductsInView] = useState(false);

  // Counter states for stats (to comply with Rules of Hooks)
  const count1 = useCountUp(5000, 2000, isStatsInView);
  const count2 = useCountUp(15000, 2000, isStatsInView);
  const count3 = useCountUp(99, 2000, isStatsInView);
  const count4 = useCountUp(24, 2000, isStatsInView);

  const statsWithCounts = [
    { count: count1, suffix: "+", label: "Happy Customers", icon: "👥" },
    { count: count2, suffix: "+", label: "Projects Completed", icon: "📦" },
    { count: count3, suffix: "%", label: "Customer Satisfaction", icon: "⭐" },
    { count: count4, suffix: "/7", label: "Customer Support", icon: "🎧" }
  ];

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsStatsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!featuresRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsFeaturesInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!productsRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsProductsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(productsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (!quantity || quantity < selectedProduct.minimum_order) {
      toast.error(`Minimum order is ${selectedProduct.minimum_order} pieces`);
      return;
    }

    addToCart(selectedProduct, quantity);
    toast.success("Added to cart successfully! 🎉");
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
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && Array.isArray(data.data)) {
            if (data.data.length > 0) {
              const randomProducts = data.data
                .sort(() => Math.random() - 0.5)
                .slice(0, 8);
              setPopularProducts(randomProducts);
            } else {
              setPopularProducts([]);
            }
          } else {
            setPopularProducts([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setPopularProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/images/g2p_logo.png"
              alt="Graphics2Prints Logo"
              width={120}
              height={120}
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
              priority
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Graphics2Prints</h2>
            <div className="flex space-x-1 justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-3 h-3 bg-red-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Enhanced Hero Section */}
        <section 
          className="hero-section relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10" />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full filter blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl" />
            </div>
          </div>

          <div className="relative z-10 container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Experience{" "}
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    High Class
                  </span>{" "}
                  Printing
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                  We offer premium printing services tailored to your needs. From business cards 
                  to custom gift items, we transform your ideas into stunning reality with 
                  precision and creativity.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/prints" className="btn-primary text-lg px-8 py-4">
                    Explore Products
                  </Link>
                  <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
                    Get Quote
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center lg:justify-start gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-300 text-sm">5.0 (1,000+ reviews)</span>
                  </div>
                  <div className="text-gray-300 text-sm">✓ 24/7 Support</div>
                </div>
              </div>

              {/* Hero Product Showcase */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {/* Main Featured Product */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="col-span-2 relative group"
                  >
                    <div className="relative h-[300px] sm:h-[350px] rounded-2xl overflow-hidden">
                      <Image
                        src="/images/businesscard.png"
                        alt="Premium Business Cards"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="inline-block bg-red-500 px-3 py-1 rounded-full text-sm font-medium mb-3">
                          ⭐ Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Premium Business Cards</h3>
                        <p className="text-white/90 text-sm">Professional quality that makes lasting impressions</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Secondary Products */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative group"
                  >
                    <div className="relative h-[180px] sm:h-[200px] rounded-xl overflow-hidden">
                      <Image
                        src="/images/tshirt.jpeg"
                        alt="Custom T-Shirts"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, 300px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-bold text-sm mb-1">Custom T-Shirts</h4>
                        <p className="text-xs text-white/80">Premium fabric & prints</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative group"
                  >
                    <div className="relative h-[180px] sm:h-[200px] rounded-xl overflow-hidden">
                      <Image
                        src="/images/magicmug.jpg"
                        alt="Magic Mugs"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, 300px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h4 className="font-bold text-sm mb-1">Magic Mugs</h4>
                        <p className="text-xs text-white/80">Color-changing designs</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Action Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
                >
                  <Link href="/prints" className="group relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <div className="absolute -top-8 sm:-top-10 -right-2 sm:right-0 bg-black text-white px-2 py-1 sm:px-3 rounded-lg text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      View All
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
            </div>
          </div>
        </section>

        {/* Quick Value Proposition Section */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Turnaround</h3>
                <p className="text-gray-600">Get your prints in 24-48 hours with our express service</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
                <p className="text-gray-600">100% satisfaction guarantee or your money back</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Free Delivery</h3>
                <p className="text-gray-600">Free delivery within Lagos and Abuja on orders above ₦10,000</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Our Print Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From business essentials to custom gifts, we offer comprehensive printing solutions 
                to meet all your personal and professional needs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="group bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Business Printing</h3>
                <p className="text-gray-600 mb-6">Business cards, letterheads, brochures, and all your corporate printing needs.</p>
                <Link href="/prints?category=business" className="text-red-600 font-semibold hover:text-red-700 inline-flex items-center gap-2">
                  Explore Business Prints <span>→</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Custom Gifts</h3>
                <p className="text-gray-600 mb-6">Personalized mugs, t-shirts, photo frames, and unique gift items for every occasion.</p>
                <Link href="/gift-items" className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-2">
                  Browse Gift Items <span>→</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v1M7 4V3a1 1 0 011-1m0 0h8m-8 0h8m-8 4v10a1 1 0 001 1h6a1 1 0 001-1V8M7 8v10a1 1 0 001 1h6a1 1 0 001-1V8M7 8h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Large Format</h3>
                <p className="text-gray-600 mb-6">Banners, posters, vehicle wraps, and large-scale printing for events and advertising.</p>
                <Link href="/prints?category=large-format" className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center gap-2">
                  View Large Prints <span>→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Popular Products Section */}
        <section 
          ref={productsRef}
          className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50"
        >
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Popular Products</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our most loved printing solutions that have helped thousands of businesses 
                and individuals create lasting impressions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {popularProducts.length > 0 ? (
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                  }}
                  className="pb-16 products-swiper"
                >
                  {popularProducts.map((product, index) => (
                    <SwiperSlide key={product.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="product-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-[480px] flex flex-col border border-gray-100"
                      >
                        <div className="relative w-full h-64 overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.image_alt_text || product.name}
                              fill
                              className="object-cover transform hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 300px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">No Image</span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4">
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Popular
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4 flex-shrink-0">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-500 ml-1">(4.9)</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Min: {product.minimum_order} pcs
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedProduct(product);
                              setQuantity(product.minimum_order);
                              const pricePerItem = product.amount / product.minimum_order;
                              setPricePerPiece(pricePerItem);
                              setCalculatedPrice(product.amount);
                              setIsSidebarOpen(true);
                            }}
                            className="w-full btn-primary text-center flex-shrink-0"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Popular products will appear here once available.</p>
                  <Link href="/prints" className="btn-primary inline-block">
                    Browse All Products
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Clients Section */}
        <section className="py-4 sm:py-12 bg-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Trusted by Amazing{" "}
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Brands
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We are proud to have worked with these incredible brands and organizations, 
                delivering high-quality print products and exceptional service.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: showAllClients ? CLIENT_LOGO_COUNT : 12 }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-32 flex items-center justify-center border border-gray-200 group-hover:border-red-200">
                    <Image
                      src={`/images/logos/C_${idx + 1}.jpg`}
                      alt={`Client ${idx + 1}`}
                      width={120}
                      height={120}
                      className="object-contain max-h-16 max-w-full grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-2 sm:mt-4">
              {!showAllClients && CLIENT_LOGO_COUNT > 12 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAllClients(true)}
                  className="btn-primary px-8 py-3"
                >
                  View All Clients
                </motion.button>
              ) : showAllClients && CLIENT_LOGO_COUNT > 12 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAllClients(false)}
                  className="btn-secondary px-8 py-3"
                >
                  Show Less
                </motion.button>
              ) : null}
            </div>
          </div>
        </section>

        {/* Stats Section with Counter Animation */}
        <section 
          ref={statsRef}
          className="py-12 bg-gradient-to-r from-gray-50 to-white"
        >
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {statsWithCounts.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4 text-red-600">{stat.icon}</div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900">
                    {stat.count.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Sidebar and other components continue here */}
        {/* Enhanced Sidebar Overlay */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Enhanced Product Details Sidebar */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isSidebarOpen ? 0 : "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 h-full bg-white z-50 p-8 overflow-y-auto shadow-2xl md:w-1/2 w-full max-w-2xl"
        >
          {selectedProduct && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <div className="mt-12">
                <div className="relative w-full h-80 mb-6 rounded-2xl overflow-hidden">
                  {selectedProduct.image_url ? (
                    <Image
                      src={selectedProduct.image_url}
                      alt={selectedProduct.image_alt_text || selectedProduct.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-2xl">
                      <span className="text-gray-500 text-lg">No Image Available</span>
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {selectedProduct.description}
                </p>

                {/* Product Details */}
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Material</h3>
                      <p className="text-gray-600">{selectedProduct.material}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Delivery Time</h3>
                      <p className="text-gray-600">{selectedProduct.delivery_time}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                    <p className="text-gray-600">{selectedProduct.specifications}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Finishing Options</h3>
                    <p className="text-gray-600">{selectedProduct.finishing_options}</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-3">
                    Quantity (Min: {selectedProduct.minimum_order} pieces)
                  </label>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        if (quantity > selectedProduct.minimum_order) {
                          setQuantity(quantity - selectedProduct.minimum_order);
                          setCalculatedPrice(pricePerPiece * (quantity - selectedProduct.minimum_order));
                        }
                      }}
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center font-bold text-lg transition-colors"
                      disabled={quantity <= selectedProduct.minimum_order}
                    >
                      −
                    </motion.button>
                    
                    <input
                      type="number"
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
                      className="w-24 h-12 text-center border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-medium"
                    />
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setQuantity(quantity + selectedProduct.minimum_order);
                        setCalculatedPrice(pricePerPiece * (quantity + selectedProduct.minimum_order));
                      }}
                      className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl flex items-center justify-center font-bold text-lg transition-colors"
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-semibold mb-4">Pricing</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ₦{formatPrice(quantity > selectedProduct.minimum_order ? calculatedPrice : selectedProduct.amount)}
                  </div>
                  <p className="text-gray-600">
                    For {quantity} pieces • ₦{formatPrice(pricePerPiece)} per piece
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={`https://wa.me/+2348166411702?text=I%27m%20interested%20in%20${selectedProduct.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-center"
                  >
                    Order via WhatsApp
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
