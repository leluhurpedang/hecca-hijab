import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) {
  const base = 'inline-flex items-center font-medium uppercase tracking-wider rounded-full';

  const variants = {
    default: 'bg-sand-100 text-espresso-800',
    bestseller: 'bg-gold-400/15 text-gold-500 border border-gold-400/30',
    new: 'bg-mocha-500/10 text-mocha-600 border border-mocha-500/20',
    discount: 'bg-rose-50 text-rose-600 border border-rose-200',
    outOfStock: 'bg-stone-200 text-stone-600',
    inStock: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-xs px-3 py-1.5'
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
}
