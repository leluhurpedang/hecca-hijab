import React from 'react';
import { ArrowDownUp } from 'lucide-react';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Paling Populer' },
  { value: 'newest', label: 'Produk Terbaru' },
  { value: 'price-low', label: 'Harga: Terendah' },
  { value: 'price-high', label: 'Harga: Tertinggi' },
  { value: 'rating', label: 'Rating Tertinggi' },
];

export function ProductSort({ value = 'featured', onChange }) {
  return (
    <div className="flex items-center gap-2">
      <ArrowDownUp className="w-4 h-4 text-stone-400 hidden sm:block shrink-0" />
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-sand-200 text-xs sm:text-sm text-espresso-900 py-2 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-mocha-400/30 focus:border-mocha-500 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
          ▼
        </span>
      </div>
    </div>
  );
}
