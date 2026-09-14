import React from 'react';
import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({
  quantity = 1,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className = ''
}) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const sizeStyles = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  return (
    <div
      className={`inline-flex items-center bg-white border border-sand-200 rounded-full shadow-sm ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        aria-label="Kurangi jumlah"
        className="p-1 text-stone-500 hover:text-espresso-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-8 text-center font-semibold text-espresso-900 select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        aria-label="Tambah jumlah"
        className="p-1 text-stone-500 hover:text-espresso-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
