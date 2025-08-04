// src/components/ui/CloudinaryImage.tsx
// Reusable Cloudinary Image component with optimizations

import React, { useState } from 'react';
import { CloudinaryImageProps, getOptimizedImageUrl, getImageFilenameFromUrl } from '@/utils/cloudinary';
import { getPlaceholderImage, createDataUrlPlaceholder } from '@/utils/placeholder';

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  alt,
  width = 400,
  height = 300,
  className = '',
  quality = 'auto',
  format = 'auto',
  placeholderType = 'product'
}) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  
  if (!cloudName) {
    console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined');
    return (
      <img
        src={createDataUrlPlaceholder(width, height, '#f3f4f6', 'Config Error')}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    );
  }
  
  // Add support for folder paths in publicId
  let fullPublicId = '';
  
  if (!publicId || publicId.trim() === '') {
    // If no publicId or empty string, use placeholder immediately
    setError(true);
    fullPublicId = '';
  } else if (publicId.includes('cloudinary.com')) {
    // It's a full Cloudinary URL, extract the public ID
    fullPublicId = getImageFilenameFromUrl(publicId);
  } else if (publicId.startsWith('graphics2prints_products/')) {
    // It's already in the correct format with folder
    fullPublicId = publicId;
  } else if (publicId.startsWith('/')) {
    // It's a local path like /images/product.jpg
    const filename = publicId.split('/').pop() || '';
    fullPublicId = `graphics2prints_products/${filename.split('.')[0]}`;
  } else {
    // It's just a filename, add the folder
    fullPublicId = `graphics2prints_products/${publicId.split('.')[0]}`;
  }
    
  const imageUrl = !error && fullPublicId
    ? getOptimizedImageUrl(fullPublicId, { width, height, quality, format })
    : createDataUrlPlaceholder(width, height, '#f3f4f6', 'Product Image');

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      onError={(e) => {
        if (!error) {
          const target = e.target as HTMLImageElement;
          // Use a data URL placeholder if the Cloudinary image fails to load
          const fallbackSrc = createDataUrlPlaceholder(width, height, '#f3f4f6', 'Image unavailable');
          target.src = fallbackSrc;
          setError(true);
          // Log error but don't throw to avoid breaking the React error boundary
          console.warn(`Failed to load Cloudinary image: ${fullPublicId}`);
        }
      }}
    />
  );
};

export default CloudinaryImage;
