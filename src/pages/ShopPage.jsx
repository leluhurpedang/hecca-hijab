import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductFilter } from '../components/product/ProductFilter';
import { ProductSort } from '../components/product/ProductSort';
import { ProductGrid } from '../components/product/ProductGrid';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../data/categories';

export function ShopPage() {
  const { visibleProducts, isLoading: productsLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const urlSort = searchParams.get('sort') || 'featured';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState(urlSort);

  // Sync state if URL query params change
  useEffect(() => {
    if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
    if (urlSearch !== searchQuery) setSearchQuery(urlSearch);
    if (urlSort !== sortBy) setSortBy(urlSort);
  }, [urlCategory, urlSearch, urlSort]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchParams((prev) => {
      if (cat === 'all') prev.delete('category');
      else prev.set('category', cat);
      return prev;
    });
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    setSearchParams((prev) => {
      if (!q.trim()) prev.delete('search');
      else prev.set('search', q.trim());
      return prev;
    });
  };

  const handleSortChange = (s) => {
    setSortBy(s);
    setSearchParams((prev) => {
      if (s === 'featured') prev.delete('sort');
      else prev.set('sort', s);
      return prev;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (product.name || '').toLowerCase().includes(query);
        const matchesDesc = (product.description || '').toLowerCase().includes(query);
        const matchesMaterial = (product.material || '').toLowerCase().includes(query);
        const matchesColors = (product.colors || []).some((c) => (c.name || '').toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesMaterial && !matchesColors) {
          return false;
        }
      }

      // Price range filter
      if (selectedPriceRange === 'under-75k' && product.price >= 75000) return false;
      if (selectedPriceRange === '75k-100k' && (product.price < 75000 || product.price > 100000)) return false;
      if (selectedPriceRange === 'above-100k' && product.price <= 100000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [visibleProducts, selectedCategory, selectedPriceRange, searchQuery, sortBy]);

  const currentCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);
  const pageHeading = currentCategoryObj ? currentCategoryObj.name : 'Semua Koleksi';
  const pageSubheading = currentCategoryObj
    ? currentCategoryObj.description
    : 'Temukan pilihan hijab voal ultrafine, pashmina silk, dan modest accessories berkualitas butik.';

  return (
    <>
      <SEO
        title={`${pageHeading} | Haecca Hijab`}
        description={pageSubheading}
        url={
          typeof window !== 'undefined'
            ? `${window.location.origin}/shop${selectedCategory && selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`
            : undefined
        }
      />

      <main className="min-h-screen bg-cream-100/60 pb-20">
        <section className="bg-white border-b border-sand-200/80 pt-8 pb-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <Breadcrumb items={[{ label: 'Katalog', to: '/shop' }, { label: pageHeading }]} />

            <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs tracking-[0.2em] font-semibold text-mocha-600 uppercase">
                  Haecca Collection
                </span>
                <h1 className="text-3xl sm:text-4xl text-espresso-950 font-bold tracking-tight">
                  {pageHeading}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                  {pageSubheading}
                </p>
              </div>

              <div className="shrink-0">
                <ProductSort value={sortBy} onChange={handleSortChange} />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ProductFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            selectedPriceRange={selectedPriceRange}
            onSelectPriceRange={setSelectedPriceRange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
          />

          <ProductGrid
            products={filteredProducts}
            loading={productsLoading}
            emptyTitle={
              searchQuery
                ? `Tidak ada hasil untuk "${searchQuery}"`
                : 'Tidak ada produk dalam kategori ini'
            }
            emptyDescription="Coba ubah kata kunci pencarian Anda atau reset filter harga dan kategori."
            onResetFilters={handleResetFilters}
          />
        </section>
      </main>
    </>
  );
}
