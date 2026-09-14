import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Tag, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';

export function CartSummary({ showCheckoutButton = true, className = '' }) {
  const {
    subtotal,
    shippingFee,
    discount,
    totalPrice,
    freeShippingRemaining,
    freeShippingThreshold,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
  } = useCart();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');

  // Progress percentage to free shipping
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    setVoucherError('');
    if (!voucherInput.trim()) return;

    const result = applyVoucher(voucherInput.trim());
    if (!result.success) {
      setVoucherError(result.message);
    } else {
      setVoucherInput('');
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-sand-200/80 shadow-soft text-left ${className}`}>
      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-cream-50 rounded-xl border border-sand-200/60 mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-espresso-900 mb-2">
          <Truck className="w-4 h-4 text-mocha-500" />
          {freeShippingRemaining === 0 ? (
            <span className="text-emerald-700">Selamat! Anda mendapatkan GRATIS ONGKIR! 🎉</span>
          ) : (
            <span>
              Tambah <strong className="text-mocha-600">{formatRupiah(freeShippingRemaining)}</strong> lagi untuk Gratis Ongkir!
            </span>
          )}
        </div>
        <div className="w-full bg-sand-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-mocha-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-espresso-950 mb-4 pb-3 border-b border-sand-200">
        Ringkasan Pesanan
      </h3>

      {/* Breakdown */}
      <div className="space-y-3 text-xs sm:text-sm text-stone-600 mb-6">
        <div className="flex justify-between">
          <span>Subtotal Produk</span>
          <span className="font-semibold text-espresso-900">{formatRupiah(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Estimasi Ongkir</span>
          <span className="font-semibold text-espresso-900">
            {shippingFee === 0 ? (
              <span className="text-emerald-700 uppercase text-xs font-bold">GRATIS</span>
            ) : (
              formatRupiah(shippingFee)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Diskon Voucher
            </span>
            <span>-{formatRupiah(discount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-sand-200 flex justify-between items-baseline text-base sm:text-lg font-sans">
          <span className="font-semibold text-espresso-950">Total Akhir</span>
          <span className="font-bold text-mocha-600 text-lg sm:text-xl">
            {formatRupiah(totalPrice)}
          </span>
        </div>
      </div>

      {/* Voucher Input */}
      <div className="mb-6 pt-2 border-t border-sand-200/80">
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
          Kode Promo / Voucher
        </label>
        {appliedVoucher ? (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            <div className="flex items-center gap-1.5 font-medium">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              <span>{appliedVoucher.code} ({appliedVoucher.label})</span>
            </div>
            <button
              onClick={removeVoucher}
              className="text-emerald-600 hover:text-rose-600 p-0.5"
              aria-label="Hapus voucher"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyVoucher} className="space-y-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value)}
                placeholder="Contoh: HAECCANEW"
                className="flex-1 px-3.5 py-2 bg-cream-50 border border-sand-200 rounded-xl text-xs text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:border-mocha-500 uppercase"
              />
              <Button type="submit" variant="secondary" size="sm">
                Terapkan
              </Button>
            </div>
            {voucherError && <p className="text-[11px] text-rose-600">{voucherError}</p>}
            <p className="text-[11px] text-stone-400">Gunakan HAECCANEW untuk potongan 10%</p>
          </form>
        )}
      </div>

      {/* Checkout CTA Button */}
      {showCheckoutButton && (
        <div className="space-y-3">
          <Link to="/checkout" className="block w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2 shadow-card"
              disabled={subtotal === 0}
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pemesanan aman & langsung via WhatsApp Official</span>
          </div>
        </div>
      )}
    </div>
  );
}
