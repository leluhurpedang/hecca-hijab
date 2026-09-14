import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { Sparkles } from 'lucide-react';

export function ProductGrid({
  products = [],
  loading = false,
  emptyTitle = 'Produk Tidak Ditemukan',
  emptyDescription = 'Coba ubah kata kunci pencarian atau sesuaikan filter kategori Anda.',
  onResetFilters
}) {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? 'Reset Filter' : 'Lihat Semua Koleksi'}
        onAction={onResetFilters}
        actionTo={!onResetFilters ? '/shop' : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
