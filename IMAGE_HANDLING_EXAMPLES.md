// Example: How to use the safe image components in your product pages

// Option 1: Using the new ProductImage component
import ProductImage from '@/components/ui/ProductImage';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <ProductImage
        src={product.image_url}
        alt={product.name}
        width={300}
        height={300}
        className="rounded-lg"
      />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}

// Option 2: Using CloudinaryImage (for Cloudinary URLs specifically)
import CloudinaryImage from '@/components/ui/CloudinaryImage';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <CloudinaryImage
        publicId={product.image_url}
        alt={product.name}
        width={300}
        height={300}
        className="rounded-lg"
        placeholderType="product"
      />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}

// Option 3: Using utility functions for safety checks
import { getProductImageUrl, productHasImage } from '@/utils/imageUtils';

function ProductCard({ product }) {
  const safeImageUrl = getProductImageUrl(product);
  const hasImage = productHasImage(product);
  
  return (
    <div className="product-card">
      <div className="relative">
        <img 
          src={safeImageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        {!hasImage && (
          <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
            Image Coming Soon
          </div>
        )}
      </div>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
}
