import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Package, CheckCircle2, ExternalLink } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useProducts } from '../../hooks/useProducts';
import { CATEGORIES } from '../../data/categories';
import { getCategories } from '../../lib/storage/dataProvider.js';

export function AdminCategoriesPage() {
  const { products } = useProducts();
  const [categoriesList, setCategoriesList] = useState(CATEGORIES);

  useEffect(() => {
    let isMounted = true;
    getCategories().then((cats) => {
      if (isMounted && Array.isArray(cats) && cats.length > 0) {
        setCategoriesList(cats);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Calculate live product count per category
  const categoriesWithCounts = categoriesList.filter((c) => c.slug !== 'all' && c.id !== 'all').map((cat) => {
    const matchingProducts = products.filter((p) => p.category === cat.slug);
    const activeCount = matchingProducts.filter((p) => p.isVisible !== false).length;
    const totalCount = matchingProducts.length;

    return {
      ...cat,
      activeCount,
      totalCount,
    };
  });

  return (
    <AdminLayout>
      <div className="space-y-6 text-left">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-espresso-950">
              Kategori Produk
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans">
              Kelola dan pantau persebaran katalog produk Haecca Hijab berdasarkan kategori.
            </p>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-mocha-500 hover:bg-mocha-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors self-start sm:self-auto font-sans"
          >
            <Package className="w-4 h-4" />
            <span>Kelola Katalog Produk</span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoriesWithCounts.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-5 border border-sand-200 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-mocha-500/10 text-mocha-600 flex items-center justify-center font-bold text-lg font-sans">
                    {cat.name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3 h-3" />
                    Aktif
                  </span>
                </div>

                <h3 className="font-sans text-base font-bold text-espresso-950 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4 font-sans">
                  {cat.description || `Koleksi ${cat.name} eksklusif berbahan premium dengan jahitan butik.`}
                </p>
              </div>

              <div className="pt-3 border-t border-sand-100 flex items-center justify-between text-xs font-sans">
                <span className="text-stone-500">
                  Total:{' '}
                  <strong className="text-espresso-950 font-semibold">
                    {cat.totalCount} Produk
                  </strong>
                </span>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  target="_blank"
                  className="text-mocha-600 hover:text-mocha-700 font-semibold inline-flex items-center gap-1"
                >
                  <span>Lihat Toko</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Card */}
        <div className="bg-cream-50 rounded-2xl p-5 sm:p-6 border border-sand-200 text-xs sm:text-sm text-stone-600 space-y-2 font-sans">
          <h4 className="font-bold text-espresso-950 flex items-center gap-2">
            <Layers className="w-4 h-4 text-mocha-600" />
            Integrasi Navigasi & Kategori
          </h4>
          <p className="leading-relaxed">
            Kategori produk di atas terhubung langsung dengan sistem filter katalog dan dapat diatur sebagai item menu navigasi melalui menu{' '}
            <Link to="/admin/navigation" className="text-mocha-600 font-semibold underline">
              Konten Website → Navigasi
            </Link>
            .
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
