import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-sand-200/60 shadow-soft animate-pulse flex flex-col">
      <div className="aspect-[3/4] w-full bg-sand-100 rounded-xl mb-3" />
      <div className="flex gap-1.5 mb-2">
        <div className="w-3.5 h-3.5 rounded-full bg-sand-200" />
        <div className="w-3.5 h-3.5 rounded-full bg-sand-200" />
        <div className="w-3.5 h-3.5 rounded-full bg-sand-200" />
      </div>
      <div className="h-4 bg-sand-200 rounded w-3/4 mb-2" />
      <div className="h-3.5 bg-sand-100 rounded w-1/2 mb-3" />
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-5 bg-sand-200 rounded w-1/3" />
        <div className="w-8 h-8 rounded-full bg-sand-100" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-[4/5] bg-sand-100 rounded-2xl w-full" />
        <div className="flex flex-col gap-4">
          <div className="h-4 bg-sand-200 rounded w-1/4" />
          <div className="h-8 bg-sand-200 rounded w-3/4" />
          <div className="h-6 bg-sand-200 rounded w-1/3" />
          <div className="h-20 bg-sand-100 rounded w-full mt-4" />
          <div className="h-10 bg-sand-200 rounded-full w-full mt-6" />
        </div>
      </div>
    </div>
  );
}
