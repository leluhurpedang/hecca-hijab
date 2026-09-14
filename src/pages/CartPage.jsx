import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Button } from '../components/common/Button';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const { items, totalItems, clearCart } = useCart();

  return (
    <>
      <SEO
        title="Keranjang Belanja | Haecca Hijab"
        description="Periksa dan kelola item hijab pilihan Anda dalam keranjang belanja Haecca Hijab."
        url={typeof window !== 'undefined' ? `${window.location.origin}/cart` : undefined}
      />

      <main className="min-h-screen bg-cream-100/50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 text-left">
          <Breadcrumb items={[{ label: 'Keranjang Belanja' }]} />

          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200/80 mb-8">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-mocha-600">
                Pemesanan Online
              </span>
              <h1 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
                Keranjang Belanja ({totalItems})
              </h1>
            </div>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-rose-600 inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kosongkan Keranjang
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="py-12">
              <EmptyState
                icon={ShoppingBag}
                title="Keranjang Anda Masih Kosong"
                description="Sepertinya Anda belum memilih koleksi hijab impian Anda. Temukan berbagai pilihan pashmina silk dan voal premium kami sekarang."
                actionLabel="Jelajahi Koleksi Haecca"
                actionTo="/shop"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-soft">
                <div className="hidden sm:grid grid-cols-12 pb-3 border-b border-sand-200 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  <span className="col-span-6">Produk</span>
                  <span className="col-span-3 text-center">Jumlah</span>
                  <span className="col-span-3 text-right">Total</span>
                </div>

                <div className="divide-y divide-sand-100">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>

                <div className="pt-6 mt-4 border-t border-sand-100 flex items-center justify-between">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-mocha-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Lanjut Berbelanja</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4">
                <CartSummary showCheckoutButton={true} />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
