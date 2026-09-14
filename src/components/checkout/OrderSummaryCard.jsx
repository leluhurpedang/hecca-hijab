import React from 'react';
import { MessageCircle, ShieldCheck, Truck, Lock } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';
import { Button } from '../common/Button';

export function OrderSummaryCard({
  items = [],
  subtotal = 0,
  shippingFee = 0,
  discount = 0,
  totalPrice = 0,
  onPlaceOrder,
  isSubmitting = false,
}) {
  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23FAF7F2"><rect width="100" height="100" fill="%23F4EFEB"/></svg>';

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-200/80 shadow-card text-left space-y-5 sticky top-24">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200">
        <h3 className="text-lg font-bold text-espresso-950">
          Ringkasan Pesanan
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 bg-sand-100 text-espresso-900 rounded-full">
          {items.length} Produk
        </span>
      </div>

      {/* Item List Compact Preview */}
      <div className="max-h-60 overflow-y-auto divide-y divide-sand-100 pr-1 no-scrollbar space-y-2">
        {items.map((item) => (
          <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
            <img
              src={item.image || fallbackImage}
              alt={item.name}
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
              className="w-12 h-14 object-cover rounded-lg bg-cream-100 border border-sand-200 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-medium text-espresso-950 truncate">
                {item.name}
              </h5>
              <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                <span>{item.selectedColor}</span>
                <span>•</span>
                <span>{item.quantity} pcs</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-espresso-950 shrink-0">
              {formatRupiah(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="pt-3 border-t border-sand-200 space-y-2.5 text-xs text-stone-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-espresso-900">{formatRupiah(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Ongkos Kirim</span>
          <span className="font-semibold text-espresso-900">
            {shippingFee === 0 ? (
              <span className="text-emerald-700 font-bold uppercase">GRATIS</span>
            ) : (
              formatRupiah(shippingFee)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Diskon Voucher</span>
            <span>-{formatRupiah(discount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline text-base font-sans">
          <span className="font-bold text-espresso-950">Total Tagihan</span>
          <span className="font-bold text-mocha-600 text-lg sm:text-xl">
            {formatRupiah(totalPrice)}
          </span>
        </div>
      </div>

      {/* Place Order via WhatsApp Button */}
      <div className="pt-2 space-y-3">
        <Button
          variant="whatsapp"
          size="lg"
          className="w-full flex items-center justify-center gap-2 text-sm shadow-card"
          onClick={onPlaceOrder}
          loading={isSubmitting}
          disabled={items.length === 0 || isSubmitting}
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Kirim Pesanan via WhatsApp</span>
        </Button>

        <div className="space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] text-stone-500">
            <Lock className="w-3 h-3 text-stone-400" />
            <span>Format pesanan akan otomatis terbuat di WhatsApp Anda</span>
          </div>
          <p className="text-[10px] text-stone-400">
            Admin Haecca Hijab akan segera membalas untuk konfirmasi stok & rekening.
          </p>
        </div>
      </div>
    </div>
  );
}
