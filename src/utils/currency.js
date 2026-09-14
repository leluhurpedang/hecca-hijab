/**
 * Format a number as Indonesian Rupiah (IDR)
 * e.g. 89000 -> "Rp 89.000"
 */
export function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice, currentPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
