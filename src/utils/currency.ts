/**
 * Utility functions for currency formatting in Nigerian context
 */

/**
 * Formats a number as Nigerian Naira currency
 * @param price - The price to format
 * @returns Formatted price string with proper Nigerian locale formatting
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(price);
};

/**
 * Formats a number as Nigerian Naira with currency symbol
 * @param price - The price to format
 * @returns Formatted price string with ₦ symbol
 */
export const formatCurrency = (price: number): string => {
  return `₦${formatPrice(price)}`;
};

/**
 * Parses a price string to a number, handling common formats
 * @param priceString - The price string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parsePrice = (priceString: string): number => {
  // Remove currency symbols and commas, then parse
  const cleanString = priceString.replace(/[₦$,\s]/g, '');
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Nigerian currency configuration
 */
export const CURRENCY = {
  symbol: '₦',
  code: 'NGN',
  name: 'Nigerian Naira',
  locale: 'en-NG'
} as const;
