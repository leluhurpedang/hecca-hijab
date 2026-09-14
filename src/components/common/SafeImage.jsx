import React, { useState, useEffect } from 'react';
import { getImageUrl, HAECCA_FALLBACK_IMAGE } from '../../services/imageStorage.js';

/**
 * SafeImage component that automatically rehydrates persistent image IDs (img_...)
 * from IndexedDB Blobs, handles external/static URLs, and provides graceful fallbacks.
 */
export function SafeImage({
  src,
  fallback = HAECCA_FALLBACK_IMAGE,
  alt = '',
  className = '',
  ...props
}) {
  const [displaySrc, setDisplaySrc] = useState(src || fallback);

  useEffect(() => {
    let isCancelled = false;

    if (!src) {
      setDisplaySrc(fallback);
      return;
    }

    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:')) {
      setDisplaySrc(src);
      return;
    }

    // Otherwise it's a persistent img_ ID in IndexedDB
    getImageUrl(src)
      .then((url) => {
        if (!isCancelled) {
          setDisplaySrc(url || fallback);
        }
      })
      .catch((err) => {
        console.warn('[SafeImage] Failed to rehydrate image URL:', err);
        if (!isCancelled) {
          setDisplaySrc(fallback);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [src, fallback]);

  return (
    <img
      src={displaySrc || fallback}
      alt={alt}
      className={className}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        }
      }}
      {...props}
    />
  );
}
