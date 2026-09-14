import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItemRow } from './CartItemRow';
import { Button } from '../common/Button';
import { formatRupiah } from '../../utils/currency';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, totalItems, subtotal, freeShippingRemaining } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 animate-fade-in border-l border-sand-200">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-sand-200 bg-cream-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-mocha-500" />
            <h3 className="text-lg font-bold text-espresso-950">
              Keranjang Belanja ({totalItems})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-400 hover:text-espresso-900 rounded-full hover:bg-sand-200/50 transition-colors"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping notice in drawer */}
        {totalItems > 0 && (
          <div className="px-5 py-2.5 bg-cream-100 border-b border-sand-200 text-xs text-center text-espresso-900">
            {freeShippingRemaining === 0 ? (
              <span className="font-semibold text-emerald-700">
                🎉 Pesanan Anda mendapatkan Gratis Ongkir!
              </span>
            ) : (
              <span>
                Tambah <strong>{formatRupiah(freeShippingRemaining)}</strong> lagi untuk Gratis Ongkir
              </span>
            )}
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-sand-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center text-mocha-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-xl text-espresso-900 font-bold mb-1">
                Keranjang Masih Kosong
              </h4>
              <p className="text-xs text-stone-500 mb-6 max-w-xs">
                Temukan koleksi voal ultrafine dan pashmina silk terbaik kami untuk hari istimewamu.
              </p>
              <Link to="/shop" onClick={() => setIsCartOpen(false)}>
                <Button variant="primary" size="md">
                  Mulai Belanja
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item) => <CartItemRow key={item.id} item={item} />)
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-sand-200 bg-cream-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-bold text-espresso-950 text-lg">
                {formatRupiah(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-stone-400">
              Biaya ongkir & diskon akan dihitung di halaman berikutnya.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="block w-full"
              >
                <Button variant="outline" size="md" className="w-full text-xs">
                  Lihat Keranjang
                </Button>
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="block w-full"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="w-full text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
