"use client";

import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = "+2348166411702";
  const message = "Hello! I'm interested in your products.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 left-5 z-50 flex items-center group"
      aria-label="Chat with us on WhatsApp"
    >
      <div className="bg-green-500 text-white p-3 rounded-full shadow-lg group-hover:bg-green-600 transition-all duration-300 transform group-hover:scale-110">
        <FaWhatsapp className="w-8 h-8" />
      </div>
      <span className="absolute left-full ml-3 px-4 py-2 bg-gray-800 text-white text-sm rounded-md shadow-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;