// src/utils/placeholder.ts
// Utility to handle placeholder images

/**
 * Get a placeholder image URL for when Cloudinary images fail to load
 */
export const getPlaceholderImage = (type: 'product' | 'profile' | 'logo' = 'product'): string => {
  const placeholders = {
    product: '/images/placeholder.jpg',
    profile: '/images/profile-placeholder.jpg',
    logo: '/images/logo-placeholder.jpg'
  };
  
  return placeholders[type];
};

/**
 * Create a data URL placeholder with a specified color
 */
export const createDataUrlPlaceholder = (
  width: number = 400, 
  height: number = 300, 
  background: string = '#f0f0f0',
  text: string = 'Image not found'
): string => {
  // This function creates a data URL for a simple SVG placeholder
  // Useful for very lightweight placeholders before actual images load
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${background}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial" 
        font-size="20" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="#999"
      >
        ${text}
      </text>
    </svg>
  `;
  
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
};
