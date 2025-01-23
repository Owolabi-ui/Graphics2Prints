import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Testimonials from './Testimonials';
import testimonialsData from './testimonialsData';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import ItemCard from './ItemCard';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const LandingPageContent = () => {
    const { toggleTheme } = useTheme();
    const [products, setProducts] = useState([]);
    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
      
        fetchProducts();
      }, []);

      const popularProducts = products.slice(0, 16);
  
   

  return (
    
    <div className="landing-page">
  
    <div>
       <Header />
</div>

     {/* Flex Container for Carousel and Text */}
     <div className="carTextContainer flex flex-col md:flex-row items-center justify-center p-8 gap-8 h-screen mt-10">
        {/* Text Section (Fixed Width) */}
        <div className="w-full md:w-1/3 text-center md:text-left">
          <h2 className="carText text-4xl font-bold mb-4">Experience High Class Printing</h2>
          <p className="text-lg mb-6">
            We offer high-quality printing services tailored to your needs. From business cards to posters to custom gift items, we've got you covered.
          </p>
          <button className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110">
            Learn More
          </button>
        </div>

           {/* Carousel Section (Remaining Space) */}
        <div className="carContainer w-full md:w-2/3 h-full mt-16">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            // navigation
            // pagination={{ clickable: false }}
            // scrollbar={{ draggable: false }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="  rounded-lg shadow-lg mt-5"
          >
            <SwiperSlide>
              <img
                src="/images/image3.png"
                alt="Slide 1"
                className="w-full h-full object-cover rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/images/image1.png"
                alt="Slide 2"
                className="w-full h-full object-cover rounded-lg"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src="/images/image2.png"
                alt="Slide 3"
                className="w-full h-full object-cover rounded-lg"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <section className="hero bg-[#73483D] text-primary-foreground py-20">
        <div className="w-full px-2 text-center">
          <h1 className="text-4xl font-bold mb-4">Experience Swift Web Solutions</h1>
          <p className="text-xl mb-8">One Page Websites | E-commerce Websites | Custom Web Applications | API Integrations | Website Maintenance</p>
           <a href="#services" className="bg-gradient-to-r from-[white] to-[white] text-black px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110">
            Learn More
          </a>
        </div>
      </section>

      <h1 className="text-3xl font-bold mb-8 mt-20 text-center">Popular Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-7 mr-7">
        {popularProducts.map((product) => (
          <ItemCard
            key={product.id}
            image={product.image}
            name={product.name}
            description={product.description}
            // price={null}
            // material={null}
            // finishing={product.finishing}
            // category={product.category}
            // delivery={product.delivery}
            onButtonClick={() => handleAddToCart(product.id)}
          />
        ))}
      </div>
        <div>
     
      </div>

      <div>
            <Testimonials testimonials={testimonialsData} />
        </div>

     
          <Footer />
        

           </div>
     );
};
const LandingPage = () => (
    <ThemeProvider>
      <LandingPageContent />
    </ThemeProvider>
  );

export default LandingPage;