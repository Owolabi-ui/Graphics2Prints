"use client"
import PageTransition from '@/components/PageTransition/PageTransition'
import Link from 'next/link'
import Image from 'next/image'

export default function WebSolutions() {
  const portfolioItems = [
    {
      title: 'E-commerce Store',
      description: 'Modern online store with cart and payment integration',
      image: '/images/ecommerce-demo.jpg',
      demoUrl: '#'
    },
    // Add more portfolio items
  ]

  const pricingPlans = [
    {
      name: 'Basic Website',
      price: '150,000',
      features: [
        'Responsive Design',
        'Up to 5 Pages',
        'Contact Form',
        'Basic SEO',
        '3 Months Support'
      ]
    },
    {
      name: 'E-commerce Store',
      price: '300,000',
      features: [
        'Everything in Basic',
        'Product Management',
        'Payment Integration',
        'Order Management',
        '6 Months Support'
      ]
    },
    {
      name: 'Custom Solution',
      price: 'Custom',
      features: [
        'Custom Features',
        'API Integration',
        'Database Design',
        'Advanced Security',
        '12 Months Support'
      ]
    }
  ]

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="bg-[#73483D] text-white py-20 mt-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-6">Web Solutions</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Custom web solutions tailored to your business needs. From simple landing pages to complex e-commerce platforms.
            </p>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">Our Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-black">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <a 
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#73483D] hover:underline"
                    >
                      View Demo →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-[#E5E4E2] mb-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">Pricing Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                  <h3 className="text-2xl font-bold mb-4 text-black">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-6 text-black">
                    ₦{plan.price}
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://wa.me/+2348166411702?text=I'm%20interested%20in%20the%20web%20solution%20services"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-black text-white text-center py-3 rounded-md hover:bg-[#73483D] transition-colors duration-300"
                  >
                    Contact Us
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}