"use client"
import PageTransition from '@/components/PageTransition/PageTransition'
import { FaWhatsapp, FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa'

export default function Contact() {
  const socialLinks = [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/+2347019976637',
      icon: <FaWhatsapp className="w-8 h-8" />,
      color: 'bg-[#25D366] hover:bg-[#128C7E]'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/graphics2prints',
      icon: <FaInstagram className="w-8 h-8" />,
      color: 'bg-[#E4405F] hover:bg-[#D93C50]'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1C26ckQmu6/?mibextid=wwXIfr',
      icon: <FaFacebook className="w-8 h-8" />,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@herde.enterprises?_t=ZM-8tv4nLBIXmY&_r=1',
      icon: <FaTiktok className="w-8 h-8" />,
      color: 'bg-[#000000] hover:bg-[#333333]'
    }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#E5E4E2]">
        <div className="container mx-auto px-6 py-24 pt-32">
          <h1 className="text-4xl font-bold text-center mb-12 text-black">Contact Us</h1>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-black">Send us a message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input 
                      type="text"
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input 
                      type="email"
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF0000]"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-[#FF0000] transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Social Links & Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-black">Connect with us</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${social.color} text-white p-4 rounded-lg flex items-center justify-center transition-colors duration-300`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                  
                  <div className="mt-8 space-y-4 text-gray-600">
                  <div className="w-full h-64 rounded-lg overflow-hidden">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.5914232524636!2d3.3641493!3d6.5289587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c0f7bc8de43%3A0x7e3efb0e8b1b!2s51%20Isaac%20John%20St%2C%20Fadeyi%20101212%2C%20Lagos!5e0!3m2!1sen!2sng!4v1710852547925!5m2!1sen!2sng"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Email:</span>
                      graphics2prints@gmail.com 
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Phone:</span>
                      +234 816 641 1702
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}