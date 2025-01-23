import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
    return (
        <div className="whatsapp-button">
            <a href="https://wa.me/+2348166411702" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="whatsapp-icon " />
            </a>
            <span className="whatsapp-text">Contact us for more information</span>
        </div>
    );
};

export default WhatsAppButton;