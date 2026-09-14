import React from 'react';
import { Check } from 'lucide-react';

export function ColorPicker({
  colors = [],
  selectedColor,
  onChange,
  size = 'md',
  showLabel = true,
  className = ''
}) {
  if (!colors || colors.length === 0) return null;

  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-stone-500">Pilihan Warna:</span>
          <span className="font-semibold text-espresso-950">{selectedColor}</span>
        </div>
      )}
      <div className="flex items-center flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;
          const isWhiteOrLight = ['#FAF7F0', '#F7F5F0', '#FDF9F2', '#F6F2EA', '#FAF7F2', '#FFFFFF'].includes(
            color.hex.toUpperCase()
          );

          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onChange && onChange(color.name)}
              title={color.name}
              aria-label={`Pilih warna ${color.name}`}
              className={`group relative rounded-full p-0.5 transition-all focus:outline-none ${
                isSelected
                  ? 'ring-2 ring-mocha-500 ring-offset-2 scale-110'
                  : 'hover:scale-105'
              }`}
            >
              <span
                style={{ backgroundColor: color.hex }}
                className={`block ${sizeMap[size] || sizeMap.md} rounded-full border ${
                  isWhiteOrLight ? 'border-sand-300' : 'border-black/10'
                } shadow-sm flex items-center justify-center transition-transform`}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 ${
                      isWhiteOrLight ? 'text-espresso-950' : 'text-white'
                    }`}
                  />
                )}
              </span>

              {/* Hover Tooltip */}
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-espresso-900 text-cream-50 text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-20">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
