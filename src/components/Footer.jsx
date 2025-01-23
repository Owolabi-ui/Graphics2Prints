import React from 'react';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <div className="flex flex-col items-center p-5 bg-black">
                <div className="flex flex-col items-center mb-2 text-2xl text-white">
                    <p>Contact Us</p>
                </div>
                <div className='flex flex-row items-center mb-10 text-white'>
                    <p className="mr-10 flex items-center">
                        <FaInstagram className="mr-2" />
                        <a href="https://www.instagram.com/herde_enterprise/profilecard/?igsh=bGZ0bTcwbzlleXp4" target="_blank" rel="noopener noreferrer">
                            Instagram
                        </a>
                    </p>
                    <p className="mr-10 flex items-center">
                        <FaWhatsapp className="mr-2" />
                        <a href="https://wa.me/+2348166411702" target="_blank" rel="noopener noreferrer">
                            WhatsApp
                        </a>
                    </p>
                    <p className="mr-10 flex items-center">
                        <FaEnvelope className="mr-2" />
                        <a href="mailto:just4prints1@gmail.com">
                            Email
                        </a>
                    </p>
                </div>
                <div className="footer-copyright text-center text-white">
                    <p>&copy; {currentYear} Herde Ent. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;