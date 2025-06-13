"use client"
import Script from "next/script"

export function PaystackScript() {
  return (
    <Script 
      src="https://js.paystack.co/v1/inline.js"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log('Paystack script loaded successfully')
        window.dispatchEvent(new Event('paystackLoaded'))
      }}
      onError={(e) => {
        console.error('Paystack failed to load:', e)
      }}
    />
  )
}