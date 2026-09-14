import React from 'react';
import { Star } from 'lucide-react';

export function RatingStars({ rating = 5, reviewCount, size = 'sm', showNumber = true }) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClasses = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="inline-flex items-center gap-1.5 text-gold-500">
      <div className="flex items-center">
        {stars.map((starIndex) => (
          <Star
            key={starIndex}
            className={`${sizeClasses} ${
              starIndex <= Math.round(rating)
                ? 'fill-gold-400 text-gold-400'
                : 'fill-stone-200 text-stone-200'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-espresso-900 tracking-tight ml-0.5">
          {Number(rating || 5).toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && reviewCount !== null && (
        <span className="text-xs text-stone-500 font-normal">
          ({Number(reviewCount)})
        </span>
      )}
    </div>
  );
}
