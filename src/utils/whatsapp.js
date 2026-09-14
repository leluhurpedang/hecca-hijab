import { formatRupiah } from './currency.js';

export const DEFAULT_ADMIN_WHATSAPP = '6281234567890'; // Haecca Hijab Official WhatsApp

/**
 * Generate a clean, professional WhatsApp order URL with formatted message
 */
export function generateWhatsAppOrderUrl(
  orderData,
  adminPhone = DEFAULT_ADMIN_WHATSAPP,
  customGreeting = '',
  additionalNote = ''
) {
  const {
    customerName,
    phone,
    address,
    city,
    postalCode,
    notes,
    paymentMethod,
    items,
    subtotal,
    shippingFee,
    discount = 0,
    totalPrice
  } = orderData;

  const itemListText = items
    .map((item, index) => {
      const itemSubtotal = item.price * item.quantity;
      return `${index + 1}. *${item.name}*\n   - Varian Warna: ${item.selectedColor}\n   - Jumlah: ${item.quantity} pcs x ${formatRupiah(item.price)} = ${formatRupiah(itemSubtotal)}`;
    })
    .join('\n\n');

  const shippingText = shippingFee === 0 
    ? 'GRATIS (Promo Pembelian Min. Rp 250.000)' 
    : formatRupiah(shippingFee);

  const discountText = discount > 0 ? `\n• Diskon Voucher: -${formatRupiah(discount)}` : '';

  const greeting = customGreeting?.trim() 
    ? customGreeting.trim()
    : 'Halo Admin Haecca Hijab, saya ingin melakukan pemesanan produk berikut:';

  const noteSnippet = additionalNote?.trim() ? `\n${additionalNote.trim()}\n` : '';

  const message = 
`${greeting}

━━━━━━━━━━━━━━━━━━
*DATA PEMESAN:*
• Nama: ${customerName}
• No. WhatsApp: ${phone}
• Alamat Pengiriman: ${address}
• Kota / Kabupaten: ${city}
• Kode Pos: ${postalCode || '-'}
• Catatan Tambahan: ${notes || '-'}
• Metode Pembayaran: ${paymentMethod || 'Transfer Bank'}

━━━━━━━━━━━━━━━━━━
*DAFTAR PESANAN:*
${itemListText}

━━━━━━━━━━━━━━━━━━
*RINCIAN PEMBAYARAN:*
• Subtotal: ${formatRupiah(subtotal)}
• Biaya Pengiriman: ${shippingText}${discountText}
• *TOTAL AKHIR: ${formatRupiah(totalPrice)}*
━━━━━━━━━━━━━━━━━━
${noteSnippet}
Mohon bantuannya untuk memproses pesanan dan mengonfirmasi ketersediaan stok serta instruksi pembayaran. Terima kasih!`;

  const cleanPhone = normalizeWhatsAppNumber(adminPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function normalizeWhatsAppNumber(phone) {
  let cleanPhone = (phone || DEFAULT_ADMIN_WHATSAPP).replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('08')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  return cleanPhone;
}

/**
 * Format Indonesian WhatsApp/phone numbers for display and validation
 */
export function validateIndonesianPhone(phone) {
  const cleaned = (phone || '').replace(/[^0-9+]/g, '');
  const regex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;
  return regex.test(cleaned);
}
