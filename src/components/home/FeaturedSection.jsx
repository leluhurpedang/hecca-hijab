import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../product/ProductCard';
import { useCMS } from '../../context/CMSContext';

export function FeaturedSection() {
  const { visibleProducts } = useProducts();
  const { cms } = useCMS();
  const sectionTitles = cms.homepage?.sectionTitles || {};

  // Pick items marked as isNew or latest items
  const newProducts = visibleProducts.filter((p) => p.isNew).slice(0, 4);
  const displayItems = newProducts.length > 0 ? newProducts : visibleProducts.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 text-left">
          <div className="space-y-2">
            <span className="text-xs tracking-[0.2em] font-semibold text-mocha-600 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Koleksi Musim Ini
            </span>
            <h2 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
              {sectionTitles.newArrivalsTitle || 'Rilisan Terbaru'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-lg">
              {sectionTitles.newArrivalsSubtitle ||
                'Eksplorasi warna-warna hangat dan material inovatif water-repellent yang dirilis khusus untuk menyempurnakan penampilan Anda.'}
            </p>
          </div>

          <Link
            to="/shop?sort=newest"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-espresso-900 hover:text-mocha-600 group transition-colors"
          >
            <span>Lihat Semua Rilisan</span>
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
