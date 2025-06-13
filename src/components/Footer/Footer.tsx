"use client"
import { Route } from 'next'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface FooterItem {
  href: string
  name: string
}

interface FooterNav {
  label: string
  items: FooterItem[]
}

const Footer = () => { 
  const [currentYear, setCurrentYear] = useState("2024")

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString())
  }, [])

  return (
    <footer className="bg-[#E5E4E2] px-4 py-8 max-w-screen-xxl mx-auto md:px-8 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        <div className="flex flex-col items-start gap-1">
          <img src="/images/g2p_logo.png" className="w-12" alt="Logo" />
           <p className="text-gray-600 text-sm font-semibold ">
            Graphics2Prints
          </p>
          <p className="text-gray-600 text-sm mt-5">
            Experts in printing, gift items and many more.
          </p>
        </div>
        <nav>
          <ul className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-700 text-base font-medium">
            <li>
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-[#73483D]"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors duration-200 hover:text-[#73483D]"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/prints"
                className="transition-colors duration-200 hover:text-[#73483D]"
              >
                Prints
              </Link>
            </li>
            <li>
              <Link
                href="/web-solutions"
                className="transition-colors duration-200 hover:text-[#73483D]"
              >
                Web Solutions
              </Link>
            </li>
          </ul>
        </nav>
        <form
          onSubmit={e => e.preventDefault()}
          className="flex flex-col gap-2"
        >
          <label className="text-gray-700 text-sm">Stay up to date</label>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#73483D] transition-all"
            />
            <button
              className="p-2 bg-[#000000] text-white rounded-r-md hover:bg-[#a45e4d] transition-all duration-200"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
      <div className="mt-8 border-t pt-4 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
        <span>&copy; {currentYear} Graphics2Prints. All rights reserved.</span>
         <div className="flex gap-4 mt-2 md:mt-0">
          {/* Instagram */}
          <a
            href="https://instagram.com/herde_enterprise"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-200 hover:scale-110"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </a>
          <a
           /* Facebook */
            href="https://www.facebook.com/share/1C26ckQmu6/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-200 hover:scale-110"
            aria-label="Facebook"
          >
            <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 17 22 12z" />
            </svg>
          </a>
           {/* WhatsApp */}
          <a
            href="https://wa.me/+2348166411702"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-200 hover:scale-110"
            aria-label="WhatsApp"
          >
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.98L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.22-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.6c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.27-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.99 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.23.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"/>
            </svg>
          </a>
           </div>
      </div>
    </footer>
  )
}

export { Footer }