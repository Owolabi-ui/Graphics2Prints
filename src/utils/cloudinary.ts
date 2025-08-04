// src/utils/cloudinary.ts
// Utility functions for Cloudinary image management

/**
 * Get an optimized Cloudinary URL with transformations
 */
export const getOptimizedImageUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
}) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const { width, height, quality = 'auto', format = 'auto' } = options || {};
  
  let transformations = `f_${format},q_${quality}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Get a product image URL with responsive sizing
 */
export const getProductImageUrl = (imageName: string, size: 'thumbnail' | 'medium' | 'large' = 'medium') => {
  const sizes = {
    thumbnail: { width: 150, height: 150 },
    medium: { width: 400, height: 300 },
    large: { width: 800, height: 600 }
  };
  
  return getOptimizedImageUrl(`graphics2prints_products/${imageName}`, sizes[size]);
};

/**
 * Extract the image filename from a Cloudinary URL
 */
export const getImageFilenameFromUrl = (url: string): string => {
  // Extract the filename from URLs like:
  // https://res.cloudinary.com/cloud-name/image/upload/v1234567890/graphics2prints_products/image.jpg
  try {
    if (!url) return '';
    
    // If it's already a full Cloudinary URL
    if (url.includes('cloudinary.com')) {
      const urlParts = url.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1];
      
      // Check if the filename contains the folder
      if (urlParts[urlParts.length - 2] === 'graphics2prints_products') {
        return `graphics2prints_products/${filenameWithExt.split('.')[0]}`; // Include folder in publicId
      }
      
      return filenameWithExt.split('.')[0]; // Just return filename without extension
    }
    
    // If it's a local path like /images/product.jpg
    if (url.startsWith('/images/') || url.includes('/public/images/')) {
      const filename = url.split('/').pop() || '';
      return filename.split('.')[0]; // Return filename without extension
    }
    
    // If it's just a filename
    return url.split('.')[0];
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return '';
  }
};

/**
 * CloudinaryImage Component Props
 */
export type CloudinaryImageProps = {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: string;
  format?: string;
  placeholderType?: 'product' | 'profile' | 'logo';
};
