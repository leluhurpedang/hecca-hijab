import { useEffect } from 'react';

const DEFAULT_TITLE = 'Haecca Hijab | Hijab & Fashion Muslimah';
const DEFAULT_DESCRIPTION =
  'Brand modest fashion dan hijab premium dengan material voal ultrafine, pashmina silk, serta aksesoris eksklusif berstandar butik. Lembut, elegan, dan nyaman seharian.';
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_SITE_NAME = 'Haecca Hijab';
const DEFAULT_LOCALE = 'id_ID';

/**
 * Helper to update or create a meta tag by attribute name and value
 */
function updateMetaTag(attributeName, attributeValue, content) {
  if (typeof document === 'undefined') return;
  const selector = `meta[${attributeName}="${attributeValue}"]`;
  let element = document.querySelector(selector);

  if (content !== undefined && content !== null && content !== '') {
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  } else if (element) {
    element.removeAttribute('content');
  }
}

/**
 * Helper to update or create canonical link tag
 */
function updateCanonical(url) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector('link[rel="canonical"]');
  if (url) {
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      document.head.appendChild(element);
    }
    element.setAttribute('href', url);
  } else if (element) {
    element.remove();
  }
}

/**
 * Helper to update or remove dynamic Schema.org JSON-LD script tag
 */
function updateJsonLd(jsonLdData, elementId = 'haecca-page-jsonld') {
  if (typeof document === 'undefined') return;
  let element = document.getElementById(elementId);

  if (jsonLdData) {
    if (!element) {
      element = document.createElement('script');
      element.setAttribute('type', 'application/ld+json');
      element.setAttribute('id', elementId);
      document.head.appendChild(element);
    }
    try {
      element.textContent =
        typeof jsonLdData === 'string' ? jsonLdData : JSON.stringify(jsonLdData, null, 2);
    } catch (err) {
      console.warn('[SEO] Failed to serialize JSON-LD:', err);
    }
  } else if (element) {
    element.remove();
  }
}

/**
 * Custom React hook for dynamic SEO Metadata, Open Graph, Twitter Cards, and Schema.org
 */
export function useSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
  jsonLd = null,
} = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Determine Title
    let fullTitle;
    if (!title) {
      fullTitle = DEFAULT_TITLE;
    } else if (title.toLowerCase().includes('haecca hijab')) {
      fullTitle = title;
    } else {
      fullTitle = `${title} | Haecca Hijab`;
    }
    document.title = fullTitle;

    // 2. Primary Meta Tags
    const activeDesc = description || DEFAULT_DESCRIPTION;
    updateMetaTag('name', 'title', fullTitle);
    updateMetaTag('name', 'description', activeDesc);
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // 3. Robots Meta Tag (index/follow or noindex/nofollow)
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
    updateMetaTag('name', 'robots', robotsContent);

    // 4. URL & Canonical Link
    const currentOrigin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://haeccahijab.com';
    const currentHref =
      typeof window !== 'undefined' && window.location.href
        ? window.location.href.split('#')[0]
        : 'https://haeccahijab.com/';
    const canonicalUrl = url || currentHref;
    updateCanonical(canonicalUrl);

    // 5. Resolving Social Sharing Image
    let finalImage = image;
    if (!finalImage) {
      finalImage = DEFAULT_OG_IMAGE;
    } else if (finalImage.startsWith('/')) {
      finalImage = `${currentOrigin}${finalImage}`;
    }

    // 6. Open Graph Tags
    updateMetaTag('property', 'og:site_name', DEFAULT_SITE_NAME);
    updateMetaTag('property', 'og:locale', DEFAULT_LOCALE);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:title', fullTitle);
    updateMetaTag('property', 'og:description', activeDesc);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:image', finalImage);

    // 7. Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', fullTitle);
    updateMetaTag('name', 'twitter:description', activeDesc);
    updateMetaTag('name', 'twitter:image', finalImage);

    // 8. Schema.org JSON-LD injection
    updateJsonLd(jsonLd);

    // Cleanup when component unmounts: remove page-specific JSON-LD
    return () => {
      updateJsonLd(null);
    };
  }, [title, description, keywords, image, url, type, noindex, jsonLd]);
}
