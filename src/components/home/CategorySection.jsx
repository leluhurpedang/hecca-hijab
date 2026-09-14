import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useCMS } from '../../context/CMSContext';

export function CategorySection() {
  const { cms } = useCMS();
  const displayCategories = CATEGORIES.filter((c) => c.id !== 'all');
  const sectionTitles = cms.homepage?.sectionTitles || {};

  return (
    <section className="py-16 sm:py-20 bg-cream-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs tracking-[0.2em] font-semibold text-mocha-600 uppercase">
            Jelajahi Koleksi
          </span>
          <h2 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
            {sectionTitles.categoriesTitle || 'Pilihan Kategori Favorit'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            {sectionTitles.categoriesSubtitle ||
              'Didesain dari material kain bermutu tinggi yang disesuaikan dengan kebutuhan aktivitas harian dan momen spesial Anda.'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-cream-200 shadow-soft border border-sand-200/80 block"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-espresso-950/20 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-left text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] tracking-wider uppercase font-medium text-cream-200 block mb-1">
                    {cat.itemCount} Pilihan Produk
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-cream-50 leading-tight">
                    {cat.name}
                  </h3>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-mocha-500 group-hover:rotate-45 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
