import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatRupiah } from '../../utils/currency';
import { QuantityStepper } from '../product/QuantityStepper';
import { useCart } from '../../context/CartContext';

export function CartItemRow({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="%23FAF7F2"><rect width="200" height="200" fill="%23F4EFEB"/><text x="50%" y="50%" font-family="sans-serif" font-weight="600" font-size="14" fill="%238C6D58" text-anchor="middle">HAECCA</text></svg>';

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-3 py-3.5 border-b border-sand-200/70 items-start w-full">
      {/* Thumbnail */}
      <Link
        to={`/product/${item.slug}`}
        className="w-18 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden bg-cream-100 border border-sand-200/80 shrink-0 block"
      >
        <img
          src={item.image || fallbackImage}
          alt={item.name}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Details Container - Responsive Vertical Stack to prevent horizontal squeezing */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch text-left">
        {/* Top: Title & Delete Action */}
        <div className="flex items-start justify-between gap-1">
          <Link
            to={`/product/${item.slug}`}
            className="font-sans text-xs sm:text-sm font-semibold text-espresso-950 hover:text-mocha-600 transition-colors line-clamp-2 leading-snug break-words"
          >
            {item.name}
          </Link>
          <button
            onClick={() => removeFromCart(item.id)}
            className="p-1 -mr-1 text-stone-400 hover:text-rose-600 transition-colors shrink-0"
            title="Hapus produk"
            aria-label="Hapus produk"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Middle: Color Variant & Unit Price */}
        <div className="my-1.5 flex flex-wrap items-center gap-2 text-xs">
          {item.selectedColor && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-espresso-900 bg-sand-100/90 px-2 py-0.5 rounded-md">
              <span className="text-stone-400">Warna:</span>
              <span>{item.selectedColor}</span>
            </span>
          )}
          <span className="text-[11px] text-stone-500 font-sans">
            {formatRupiah(item.price)} / pcs
          </span>
        </div>

        {/* Bottom: Quantity Stepper & Line Item Total */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-sand-100/60 mt-auto">
          <QuantityStepper
            quantity={item.quantity}
            onChange={(newQty) => updateQuantity(item.id, newQty)}
            size="sm"
          />

          <span className="font-sans font-bold text-xs sm:text-sm text-espresso-950 tracking-tight">
            {formatRupiah(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
