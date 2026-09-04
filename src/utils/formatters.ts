/**
 * Utility functions for formatting numbers, currency, and prices into Bangla digits (০-৯)
 */

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts any number or string containing English digits into Bangla digits.
 * Preserves commas, decimals, and surrounding text.
 */
export const toBanglaDigits = (val: number | string): string => {
  if (val === null || val === undefined) return '';
  let str = '';
  if (typeof val === 'number') {
    str = Number.isInteger(val)
      ? val.toLocaleString('en-US')
      : Number(val.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  } else {
    str = val.toString();
  }
  return str.replace(/\d/g, (digit) => BANGLA_DIGITS[parseInt(digit, 10)]);
};

/**
 * Formats an amount with the Bangla Taka currency symbol (৳) and Bangla digits.
 * Example: 1450 -> ৳১,৪৫০
 */
export const formatBDT = (amount: number): string => {
  return `৳${toBanglaDigits(amount)}`;
};
