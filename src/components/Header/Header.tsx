"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (isMenuOpen && !(e.target as Element).closest('nav') && !(e.target as Element).closest('button')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [isMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos, visible])

  const cartItems = useCartStore(state => state.items)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <header className={`
        bg-[#000000] fixed w-full px-6 py-4 
        flex justify-between items-center z-50 
        transition-transform duration-300 top-0
        ${visible ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/g2p_logo.png"
              alt="Herde Logo"
              className="transition duration-300 ease-in-out transform hover:scale-110"
              width={60}
              height={40}
            />
          </Link>
        </div>

        <button 
          className="md:hidden p-2 z-50 relative"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <nav className={`
  ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:translate-x-0 md:opacity-100'} 
  md:flex flex-col md:flex-row absolute md:relative 
  top-24 md:top-0 left-0 md:left-auto 
  w-full md:w-auto bg-[#000000] md:bg-transparent 
  p-4 md:p-0 mb-5 md:gap-2 z-50
  transition-all duration-300 ease-in-out
`}>
  {/* Navigation Links */}
  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
   <Link 
  href="/prints"
  className="px-3 py-2 rounded-md text-white text-sm transition-all duration-200 hover:scale-105 hover:text-[#73483D] focus:scale-105 focus:text-[#73483D] hover:bg-gray-100"
  onClick={() => setIsMenuOpen(false)}
>
  Prints
</Link>
<Link 
  href="/gift-items"
  className="px-3 py-2 rounded-md text-white text-sm whitespace-nowrap transition-all duration-200 hover:scale-105 hover:text-[#73483D] focus:scale-105 focus:text-[#73483D] hover:bg-gray-100"
  onClick={() => setIsMenuOpen(false)}
>
  Gift Items
</Link>
<Link 
  href="/contact"
  className="px-3 py-2 rounded-md text-white text-sm transition-all duration-200 hover:scale-105 hover:text-[#73483D] focus:scale-105 focus:text-[#73483D] hover:bg-gray-100"
  onClick={() => setIsMenuOpen(false)}
>
  Contact
</Link>
<Link 
  href="/login"
  className="px-3 py-2 rounded-md text-white text-sm transition-all duration-200 hover:scale-105 hover:text-[#73483D] focus:scale-105 focus:text-[#73483D] hover:bg-gray-100"
  onClick={() => setIsMenuOpen(false)}
>
  Login
</Link>
<Link 
  href="/cart" 
  className="relative px-4 py-2 transition-all duration-200 hover:scale-110 focus:scale-110"
  onClick={() => setIsMenuOpen(false)}
>
  <ShoppingCartIcon className="w-6 h-6 text-white" />
  {itemCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
      {itemCount}
    </span>
  )}
</Link>
  </div>
</nav>
      </header>
    </>
  )
}
export { Header }