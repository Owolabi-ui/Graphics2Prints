"use client"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface ClientProvidersProps {
  children: React.ReactNode 
   }

const ClientProviders = ({ children }: ClientProvidersProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
    let smoother: ScrollSmoother | undefined
    if (typeof window !== "undefined") {
      // Only create if not already created
      if (!ScrollSmoother.get()) {
        smoother = ScrollSmoother.create({
          smooth: 1,
          effects: true,
          smoothTouch: 0.1,
        })
      }
    }
    return () => {
      if (smoother) smoother.kill()
    }
  }, [])

  return (
    // <div id="smooth-wrapper" ref={wrapperRef}>
    //   <div id="smooth-content" ref={contentRef}>
    <SessionProvider>
       {children}
      <ToastContainer 
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable={true}
        pauseOnHover={false}
        theme="light"
      />
    </SessionProvider>
    // </div>
    // </div>
  )
}

export default ClientProviders
