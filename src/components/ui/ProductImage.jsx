// src/components/ui/ProductImage.jsx
"use client";

import { useState } from 'react';
import Image from 'next/image';

/**
 * Product image component that handles missing images gracefully
 * @param {Object} props
 * @param {string} props.src - Image URL (can be empty or invalid)
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS classes
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {boolean} props.fill - Whether to fill the container
 * @param {string} props.placeholder - Custom placeholder image path
 * @returns {JSX.Element}
 */
export default function ProductImage({ 
  src, 
  alt = "Product image", 
  className = "", 
  width, 
  height, 
  fill = false,
  placeholder = "/images/placeholder-product.jpg" 
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Determine what image to show
  const getImageSrc = () => {
    // If no src provided or it's an empty string, use placeholder
    if (!src || src.trim() === "") {
      return placeholder;
    }
    
    // If there was an error loading the image, use placeholder
    if (imageError) {
      return placeholder;
    }
    
    return src;
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (fill) {
    return (
      <div className={`relative ${className}`}>
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <Image
          src={getImageSrc()}
          alt={alt}
          fill
          className={`object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <Image
        src={getImageSrc()}
        alt={alt}
        width={width}
        height={height}
        className={`${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
