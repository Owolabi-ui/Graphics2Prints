"use client"
import { useRef, useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'



interface ClientProvidersProps {
  children: React.ReactNode 
   }

const ClientProviders = ({ children }: ClientProvidersProps) => {




  return (

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
