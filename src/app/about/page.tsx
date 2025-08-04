"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  CheckCircleIcon, 
  StarIcon,
  UsersIcon,
  TrophyIcon,
  HeartIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

// Note: For client components, metadata should be handled in layout.tsx or a separate metadata file
// This page focuses on the UI implementation

export default function AboutPage() {
  const stats = [
    { icon: UsersIcon, label: "Happy Customers", value: "5,000+" },
    { icon: TrophyIcon, label: "Projects Completed", value: "10,000+" },
    { icon: StarIcon, label: "Customer Satisfaction", value: "99%" },
    { icon: ClockIcon, label: "Years of Experience", value: "8+" }
  ];

  const values = [
    {
      icon: CheckCircleIcon,
      title: "Creativity",
      description: "Turning ideas into visually striking, impactful solutions."
    },
    {
      icon: StarIcon,
      title: "Quality",
      description: "Delivering only the best in design, print, and branded products."
    },
    {
      icon: HeartIcon,
      title: "Customer-Centricity",
      description: "Putting clients' goals at the center of our work."
    },
    {
      icon: ClockIcon,
      title: "Innovation",
      description: "Exploring new trends, technologies, and ideas for better results."
    },
    {
      icon: CheckCircleIcon,
      title: "Integrity",
      description: "Building trust through transparency and reliable service."
    }
  ];



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-section relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Graphics<span className="text-red-500">2</span>Prints
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Transforming ideas into stunning prints since 2002. We&apos;re more than just a printing company – 
              we&apos;re your creative partners in bringing visions to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-red-600 text-white hover:bg-red-700">
                Get in Touch
              </Link>
              <Link href="/prints" className="btn-secondary border-white text-white hover:bg-white hover:text-black">
                View Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-xl font-semibold text-gray-900">
                Graphics2Prints – Design. Print. Gift.
              </p>
              <p>
                Since 2002, Graphics2Prints has been helping businesses stand out with creative design, high-quality printing, and branded gift solutions.
              </p>
              <p className="font-medium text-gray-700">
                We specialize in:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Creative Design & Brand Identity</strong> – making your brand unforgettable.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Quality Printing</strong> – from business essentials to marketing collateral.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span><strong>Corporate & Event Gift Items</strong> – souvenirs, promotional products, and branded merchandise that leave a lasting impression.</span>
                </li>
              </ul>
              <p>
                Our approach is simple: smart, cost-effective solutions that deliver real value. Whether you're planning a corporate event, refreshing your brand identity, or looking for unique gifts for clients and stakeholders, we've got you covered.
              </p>
              <p className="font-semibold text-gray-900">
                Let's make your brand unforgettable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and define who we are as a company.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Mission Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 text-gray-300">
              To provide innovative, high-quality design, print, and branded gift solutions that help businesses communicate their identity, connect with their audience, and create lasting impressions—efficiently and affordably.
            </p>
            <Link href="/contact" className="btn-primary bg-red-600 text-white hover:bg-red-700">
              Start Your Project Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl mb-8 text-gray-300">
              To be Nigeria&apos;s leading one-stop hub for creative print, design, and corporate gift solutions, recognized for transforming ideas into impactful brand experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Work With Us?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you need business cards, banners, promotional items, or custom printing solutions, 
              we&apos;re here to help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary bg-red-600 text-white hover:bg-red-700">
                Get Started
              </Link>
              <Link href="/prints" className="btn-secondary border-gray-300 text-gray-700 hover:bg-gray-100">
                View Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
