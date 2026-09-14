import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../product/ProductCard';
import { useCMS } from '../../context/CMSContext';

export function BestSellerSection() {
  const { visibleProducts } = useProducts();
  const { cms } = useCMS();
  const sectionTitles = cms.homepage?.sectionTitles || {};

  const bestSellers = visibleProducts.filter((p) => p.isBestSeller).slice(0, 4);
  const displayItems = bestSellers.length > 0 ? bestSellers : visibleProducts.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-cream-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 text-left">
          <div className="space-y-2">
            <span className="text-xs tracking-[0.2em] font-semibold text-mocha-600 uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Paling Banyak Dicari
            </span>
            <h2 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
              {sectionTitles.bestSellersTitle || 'Best Sellers Terfavorit'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-lg">
              {sectionTitles.bestSellersSubtitle ||
                'Koleksi hijab yang telah dipercaya oleh ribuan muslimah dengan tingkat kepuasan ulasan 4.9/5.0.'}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-espresso-900 hover:text-mocha-600 group transition-colors"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {displayItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
