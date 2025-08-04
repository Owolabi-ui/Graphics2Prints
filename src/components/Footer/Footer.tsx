"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import { 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaTiktok 
} from 'react-icons/fa'

const Footer = () => { 
  const [currentYear, setCurrentYear] = useState("2024")
  const [email, setEmail] = useState("")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString())
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add newsletter subscription logic here
    console.log('Newsletter subscription:', email)
    setEmail("")
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1FC3wJpJcR/?mibextid=wwXIfr',
      icon: FaFacebook,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/graphics2prints',
      icon: FaInstagram,
      color: 'text-pink-600 hover:text-pink-700'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/+2347019976637',
      icon: FaWhatsapp,
      color: 'text-green-600 hover:text-green-700'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@graphics2prints?_t=ZS-8ybW2qIPPQ0&_r=1',
      icon: FaTiktok,
      color: 'text-blue-400 hover:text-blue-500'
    }
  ]

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Prints', href: '/prints' },
    { name: 'Gift Items', href: '/gift-items' },
    { name: 'Contact', href: '/contact' },
    { name: 'About Us', href: '/about' },
  ]

  const services = [
    'Business Cards',
    'Flyers & Brochures',
    'Custom Gifts',
    'Banners & Signage',
    'Promotional Items',
    'Wedding Prints'
  ]

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="w-6 h-6" />
      </motion.button>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative">
          {/* Main Footer Content */}
          <div className="container-custom section-spacing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src="/images/g2p_logo.png"
                    width={48}
                    height={48} 
                    alt="Graphics2Prints Logo"
                    className="w-12 h-12 object-contain"
                    priority
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">Graphics2Prints</h3>
                    <p className="text-gray-400 text-sm">Print Excellence</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  Your trusted partner for high-quality printing services, custom gifts, 
                  and professional branding solutions. We bring your ideas to life with 
                  precision and creativity.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      Lagos, Nigeria
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <a 
                      href="tel:+2347019976637" 
                      className="text-gray-300 text-sm hover:text-white transition-colors"
                    >
                      +234 701 997 6637
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <a 
                      href="mailto:graphics2prints@gmail.com" 
                      className="text-gray-300 text-sm hover:text-white transition-colors"
                    >
                      graphics2prints@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-red-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-semibold text-white">Our Services</h4>
                <ul className="space-y-3">
                  {services.map((service) => (
                    <li key={service} className="text-gray-300 text-sm flex items-center">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 flex-shrink-0"></span>
                      {service}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-semibold text-white">Stay Updated</h4>
                <p className="text-gray-300 text-sm">
                  Subscribe to our newsletter for the latest updates, special offers, and design inspiration.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Subscribe
                  </motion.button>
                </form>

                {/* Social Links */}
                <div className="space-y-3">
                  <h5 className="text-white font-medium">Follow Us</h5>
                  <div className="flex space-x-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 ${social.color}`}
                        aria-label={social.name}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700">
            <div className="container-custom py-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-gray-400 text-sm text-center md:text-left"
                >
                  &copy; {currentYear} Graphics2Prints. All rights reserved. Made with ❤️ in Nigeria.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="flex space-x-6 text-sm"
                >
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export { Footer }