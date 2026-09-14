import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductGallery({ images = [], title = 'Haecca Hijab' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback image SVG
  const fallbackImage =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" fill="%23FAF7F2"><rect width="800" height="1000" fill="%23F4EFEB"/><text x="50%" y="48%" font-family="sans-serif" font-weight="600" font-size="36" fill="%238C6D58" text-anchor="middle">HAECCA HIJAB</text><text x="50%" y="53%" font-family="sans-serif" font-size="18" fill="%23A88B77" text-anchor="middle">High Fashion Modest Wear</text></svg>';

  const displayImages = Array.isArray(images) && images.length > 0 ? images : [fallbackImage];
  const hasMultipleImages = displayImages.length > 1;

  // Reset to first (primary) image whenever the images array changes
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  // Navigate next / prev
  const handlePrev = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setActiveIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  // Touch Swipe handlers for Mobile
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const onTouchStart = (e) => {
    if (!hasMultipleImages) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (!hasMultipleImages || touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Only register horizontal swipe if horizontal movement exceeds vertical movement
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Mouse Drag handlers for Desktop
  const isDragging = useRef(false);
  const dragStartX = useRef(null);

  const onMouseDown = (e) => {
    if (!hasMultipleImages) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
  };

  const onMouseUp = (e) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const dragEndX = e.clientX;
    const diffX = dragStartX.current - dragEndX;
    if (Math.abs(diffX) > 45) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    isDragging.current = false;
    dragStartX.current = null;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
    dragStartX.current = null;
  };

  const activeImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Main Image Container */}
      <div
        className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-cream-100 border border-sand-200/80 shadow-soft group cursor-grab active:cursor-grabbing touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <img
          key={activeIndex}
          src={activeImage}
          alt={`${title} - foto ${activeIndex + 1}`}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          loading="eager"
          className="w-full h-full object-cover object-center animate-fade-in pointer-events-none transition-transform duration-500"
          draggable={false}
        />

        {/* Image Counter Badge (e.g. 1 / 4) */}
        {hasMultipleImages && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-espresso-950/70 backdrop-blur-md text-white font-sans text-xs font-semibold shadow-md tracking-wider pointer-events-none z-10">
            {activeIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Previous / Next Arrow Buttons (Desktop & Mobile) */}
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-espresso-900 shadow-md flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 z-10 focus:outline-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto selanjutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-espresso-900 shadow-md flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 z-10 focus:outline-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Bar */}
      {hasMultipleImages && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Lihat foto ${idx + 1}`}
              className={`relative aspect-[3/4] w-16 sm:w-20 rounded-xl overflow-hidden bg-cream-100 border transition-all shrink-0 ${
                activeIndex === idx
                  ? 'border-mocha-500 ring-2 ring-mocha-400/40 scale-105 shadow-sm'
                  : 'border-sand-200 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
