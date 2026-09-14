import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const PRICE_RANGES = [
  { value: 'all', label: 'Semua Harga' },
  { value: 'under-75k', label: '< Rp 75.000' },
  { value: '75k-100k', label: 'Rp 75.000 - Rp 100.000' },
  { value: 'above-100k', label: '> Rp 100.000' },
];

export function ProductFilter({
  selectedCategory = 'all',
  onSelectCategory,
  selectedPriceRange = 'all',
  onSelectPriceRange,
  searchQuery = '',
  onSearchChange,
  onResetFilters,
  totalResults = 0,
}) {
  const hasActiveFilters =
    selectedCategory !== 'all' || selectedPriceRange !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Category Quick Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-espresso-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-sand-200 hover:border-mocha-400 hover:text-espresso-950'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari berdasarkan nama/bahan..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-sand-200 rounded-xl text-xs sm:text-sm text-espresso-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-mocha-400/30 focus:border-mocha-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-espresso-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Bar: Price Range Pills + Active Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-sand-200/60 text-xs">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-stone-400 font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Harga:
          </span>
          {PRICE_RANGES.map((pr) => (
            <button
              key={pr.value}
              onClick={() => onSelectPriceRange(pr.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedPriceRange === pr.value
                  ? 'bg-mocha-500 text-white'
                  : 'bg-cream-50 text-stone-600 hover:bg-sand-100'
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>

        {/* Results Counter & Reset Button */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-stone-500 font-medium">
            {totalResults} produk ditemukan
          </span>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-mocha-600 hover:text-mocha-800 font-semibold underline underline-offset-4 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
