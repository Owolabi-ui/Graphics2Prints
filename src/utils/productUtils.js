// Utility functions for product availability and pricing
export const getProductDisplayInfo = (product) => {
  const { availability_type, amount, is_available, custom_price_note, pre_order_note } = product;
  
  if (!is_available) {
    return {
      status: 'unavailable',
      statusText: 'Currently Unavailable',
      priceText: 'N/A',
      buttonText: 'Unavailable',
      buttonDisabled: true,
      statusColor: 'text-gray-500',
      note: ''
    };
  }
  
  switch (availability_type) {
    case 'pre_order':
      return {
        status: 'pre_order',
        statusText: 'Available for Pre-Order',
        priceText: amount ? `₦${amount.toLocaleString()}` : 'Contact for Price',
        buttonText: 'Pre-Order Now',
        buttonDisabled: false,
        statusColor: 'text-orange-600',
        note: pre_order_note || 'Available for pre-order'
      };
      
    case 'custom_price':
      return {
        status: 'custom_price',
        statusText: 'Custom Pricing',
        priceText: 'Contact for Quote',
        buttonText: 'Get Quote',
        buttonDisabled: false,
        statusColor: 'text-blue-600',
        note: custom_price_note || 'Contact us for custom pricing'
      };
      
    case 'in_stock':
    default:
      return {
        status: 'in_stock',
        statusText: 'In Stock',
        priceText: amount ? `₦${amount.toLocaleString()}` : 'Price not set',
        buttonText: 'Add to Cart',
        buttonDisabled: false,
        statusColor: 'text-green-600',
        note: ''
      };
  }
};

export const getAvailabilityBadge = (availability_type, is_available) => {
  if (!is_available) {
    return {
      text: 'Unavailable',
      className: 'bg-gray-100 text-gray-800'
    };
  }
  
  switch (availability_type) {
    case 'pre_order':
      return {
        text: 'Pre-Order',
        className: 'bg-orange-100 text-orange-800'
      };
    case 'custom_price':
      return {
        text: 'Custom Price',
        className: 'bg-blue-100 text-blue-800'
      };
    case 'in_stock':
    default:
      return {
        text: 'In Stock',
        className: 'bg-green-100 text-green-800'
      };
  }
};
