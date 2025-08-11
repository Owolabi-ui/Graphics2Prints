import { Product } from "@/types/cart";
import { formatPrice } from "./currency";

export function getProductPriceDisplay(product: Product) {
  if (product.availability_type === 'custom_price') {
    return {
      priceText: 'Custom Price',
      priceValue: null,
      priceNote: product.custom_price_note || 'Contact us for pricing',
      showAddToCart: false,
      availabilityText: 'Custom Pricing'
    };
  }
  
  if (product.availability_type === 'pre_order') {
    return {
      priceText: `₦${formatPrice(product.amount / product.minimum_order)}`,
      priceValue: product.amount / product.minimum_order,
      priceNote: product.pre_order_note || 'Available for pre-order',
      showAddToCart: true,
      availabilityText: 'Pre-Order'
    };
  }
  
  // Default: in_stock
  return {
    priceText: `₦${formatPrice(product.amount / product.minimum_order)}`,
    priceValue: product.amount / product.minimum_order,
    priceNote: null,
    showAddToCart: true,
    availabilityText: 'In Stock'
  };
}

export function getAvailabilityBadgeColor(availabilityType?: string) {
  switch (availabilityType) {
    case 'pre_order':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'custom_price':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-green-100 text-green-800 border-green-200';
  }
}
