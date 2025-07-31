"use client";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCartIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
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
import { motion, useInView } from "framer-motion";

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

const stats = [
  { number: "5000+", label: "Happy Customers", icon: "👥" },
  { number: "15000+", label: "Projects Completed", icon: "📦" },
  { number: "99%", label: "Customer Satisfaction", icon: "⭐" },
  { number: "24/7", label: "Customer Support", icon: "🎧" }
];

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

  // Refs for animations
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isStatsInView = useInView(statsRef, { once: true });
  const isFeaturesInView = useInView(featuresRef, { once: true });
  const isProductsInView = useInView(productsRef, { once: true });

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
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          const randomProducts = data.data
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);
          setPopularProducts(randomProducts);
        } else {
          const text = await response.text();
          console.error("Expected JSON, got:", text);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
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
              className="w-24 h-24 md:w-32 md:h-32"
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
      <div className="flex flex-col min-h-screen bg-white overflow-hidden">
        {/* Enhanced Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-gradient-shift" />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full filter blur-3xl animate-float" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-float-delayed" />
            </div>
          </div>

          <div className="relative z-10 container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Experience{" "}
                  <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    High Class
                  </span>{" "}
                  Printing
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  We offer premium printing services tailored to your needs. From business cards 
                  to custom gift items, we transform your ideas into stunning reality with 
                  precision and creativity.
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Link href="/prints" className="btn-primary text-lg px-8 py-4">
                    Explore Products
                  </Link>
                  <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
                    Get Quote
                  </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  className="flex items-center justify-center lg:justify-start gap-6 mt-8"
                  initial={{ opacity: 0 }}
                  animate={isHeroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon key={i} className="w-5 h-5 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-300 text-sm">5.0 (1,000+ reviews)</span>
                  </div>
                  <div className="text-gray-300 text-sm">✓ 24/7 Support</div>
                </motion.div>
              </motion.div>

              {/* Hero Carousel */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl blur opacity-30 animate-pulse" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    effect="fade"
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop={true}
                    pagination={{ clickable: true }}
                    className="rounded-2xl hero-swiper"
                  >
                    <SwiperSlide>
                      <div className="relative w-full h-[500px]">
                        <Image
                          src="/images/image3.png"
                          alt="Premium Printing Services"
                          fill
                          className="object-cover rounded-2xl"
                          sizes="(max-width: 768px) 100vw, 600px"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="relative w-full h-[500px]">
                        <Image
                          src="/images/image1.png"
                          alt="Custom Gift Items"
                          fill
                          className="object-cover rounded-2xl"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="relative w-full h-[500px]">
                        <Image
                          src="/images/image2.png"
                          alt="Professional Branding"
                          fill
                          className="object-cover rounded-2xl"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/60 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section 
          ref={statsRef}
          className="py-20 bg-gradient-to-r from-red-600 to-orange-600"
        >
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-red-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          ref={featuresRef}
          className="section-spacing bg-gray-50"
        >
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Why Choose Graphics2Prints?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We combine cutting-edge technology with expert craftsmanship to deliver 
                exceptional printing solutions that exceed your expectations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gift Items Section */}
        <section className="relative section-spacing overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <motion.div 
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500 to-orange-500 rounded-full filter blur-3xl"
            />
            <motion.div 
              animate={{ 
                rotate: [360, 0],
                scale: [1.1, 1, 1.1]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-full filter blur-3xl"
            />
          </div>

          <div className="relative z-10 container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Beautifully Crafted{" "}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Gift Items
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                At Graphics2Prints, we specialize in creating stunning gift items that leave a lasting impression. 
                Whether it's for a special occasion or a corporate event, our custom designs and premium materials 
                ensure your gifts stand out from the crowd.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link href="/gift-items" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-3">
                <span>Explore Gift Items</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Popular Products Section */}
        <section 
          ref={productsRef}
          className="section-spacing bg-white"
        >
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isProductsInView ? { opacity: 1, y: 0 } : {}}
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
              animate={isProductsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
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
                      animate={isProductsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="product-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-[480px] flex flex-col border border-gray-100"
                    >
                      <div className="relative w-full h-64 overflow-hidden">
                        <Image
                          src={product.image_url}
                          alt={product.image_alt_text}
                          fill
                          className="object-cover transform hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
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
                        
                        <div className="flex items-center justify-between mb-4">
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
                          className="w-full btn-primary text-center"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Sidebar and other components continue here */}
        {/* ... (sidebar, clients section, etc.) */}
      </div>
    </PageTransition>
  );
}
