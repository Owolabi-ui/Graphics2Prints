import React, { useState } from 'react';
import { Link } from 'react-router-dom';



const Header = () => {
   
  return (
    <header className="bg-[#E5E4E2] py-3  shadow-md fixed top-0 mb-10 z-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="/">
          <img src="/images/herde_ent_logo.png" alt="Herde Logo" className="w-30 h-20 mr-4 transition duration-300 ease-in-out transform hover:scale-110" />
        </a>
        <nav>
  <ul className="flex space-x-3 md:flex ">
    <li>
        <Link to={"/prints"}>
          <button className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110">
              Prints
          </button>
      </Link>
    </li>
    <li>
      <button className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110">
        Web Solutions
      </button>
    </li>
    <li>
      <button className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110">
        Contact Us
      </button>
    </li>
  </ul>
</nav>
      </div>
    </header>
  );
};

export default Header;