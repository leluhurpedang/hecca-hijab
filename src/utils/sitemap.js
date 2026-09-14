/**
 * Sitemap utility helpers for Haecca Hijab
 */

export const DEFAULT_SITE_URL = 'https://haeccahijab.com';

/**
 * Returns the active production or runtime site URL
 */
export function getSiteBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return DEFAULT_SITE_URL;
}

/**
 * Builds a fully qualified canonical URL
 */
export function buildCanonicalUrl(path = '') {
  const base = getSiteBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
