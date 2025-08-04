// src/utils/imageUtils.js
/**
 * Utility functions for handling product images
 */

/**
 * Check if an image URL is valid and not empty
 * @param {string} imageUrl - The image URL to validate
 * @returns {boolean} - Whether the image URL is valid
 */
export function isValidImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return false;
  }
  
  // Check if it's not just whitespace or empty string
  if (imageUrl.trim() === '') {
    return false;
  }
  
  // Basic URL validation
  try {
    new URL(imageUrl);
    return true;
  } catch (error) {
    // If it's a relative path, it might still be valid
    return imageUrl.startsWith('/') || imageUrl.startsWith('./') || imageUrl.startsWith('../');
  }
}

/**
 * Get a safe image URL with fallback to placeholder
 * @param {string} imageUrl - The original image URL
 * @param {string} placeholder - The placeholder image path
 * @returns {string} - A safe image URL
 */
export function getSafeImageUrl(imageUrl, placeholder = '/images/placeholder-product.svg') {
  return isValidImageUrl(imageUrl) ? imageUrl : placeholder;
}

/**
 * Get image URL for API responses
 * @param {Object} product - Product object
 * @returns {string} - Safe image URL for the product
 */
export function getProductImageUrl(product) {
  if (!product) return '/images/placeholder-product.svg';
  
  return getSafeImageUrl(product.image_url, '/images/placeholder-product.svg');
}

/**
 * Check if a product has a valid image
 * @param {Object} product - Product object
 * @returns {boolean} - Whether the product has a valid image
 */
export function productHasImage(product) {
  return product && isValidImageUrl(product.image_url);
}
