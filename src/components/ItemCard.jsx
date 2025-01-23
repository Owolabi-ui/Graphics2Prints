import React, { useState } from "react";

const ItemCard = ({ image, name, description, price, material, finishing, category, delivery, onButtonClick }) => {
  const [isModalOpen, setModalOpen] = useState(false);

    const handleImageClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image Section */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover item-image" // Added class for hover effect
            onClick={handleImageClick} // Click handler for image
          />
        </div>
  
        {/* Content Section */}
        <div className="p-4">
          {/* Name */}
          <h3 className="text-xl font-semibold mb-2">{name}</h3>
  
          {/* Description */}
          {description && <p className="text-gray-600 mb-4">{description}</p>}
  
          {/* Price */}
          {price && <p className="text-lg font-bold text-primary mb-4">${price}</p>}
  
          {/* Material */}
          {material && (
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Material:</span> {material}
            </p>
          )}
  
          {/* Finishing */}
          {finishing && (
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Finishing:</span> {finishing}
            </p>
          )}
  
          {/* Category */}
          {category && (
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Category:</span> {category}
            </p>
          )}
  
          {/* Delivery */}
          {delivery && (
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Delivery:</span> {delivery}
            </p>
          )}
  
          {/* Call-to-Action Button */}
          {onButtonClick && (
            <button
              onClick={onButtonClick}
              className="bg-gradient-to-r from-[#000000] to-[#000000] text-white px-4 py-2 rounded-md hover:bg-gradient-to-r hover:from-[#73483D] hover:to-[#a45e4d] transition duration-300 ease-in-out transform hover:scale-110"
            >
              See More
            </button>
          )}
        </div>

        {isModalOpen && (
          <div className="modal">
            <span onClick={handleCloseModal} className="close-button">X</span>
            <img src={image} alt={name} className="full-image" />
          </div>
        )}

      </div>
    );
  };
  
  export default ItemCard;
