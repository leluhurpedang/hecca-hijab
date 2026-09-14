/**
 * Sitemap Generator for Haecca Hijab
 * 
 * Usage:
 *   node scripts/generate-sitemap.js
 * 
 * With custom production domain:
 *   VITE_SITE_URL=https://myproductiondomain.com node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Determine Base URL
const baseUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://haeccahijab.com').replace(/\/+$/, '');

// 2. Static Storefront Routes (never include admin or recovery routes)
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/cart', priority: '0.5', changefreq: 'weekly' },
];

// 3. Fallback Product Slugs
const defaultProductSlugs = [
  'aluna-voal-ultrafine-taupe',
  'samira-silk-cradenza-sage',
  'nayla-crinkle-shawl-mauve',
  'zahra-paris-premium-champagne',
  'diana-instant-voal-black',
  'clea-silk-chiffon-rose',
  'inner-ninja-antem-rayon-nude',
  'hijab-ring-brooch-rose-gold',
];

async function generateSitemap() {
  console.log(`[Sitemap Generator] Generating sitemap with Base URL: ${baseUrl}`);

  let productSlugs = defaultProductSlugs;

  // Try reading from .env.local if present
  const envPath = path.join(rootDir, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const urlMatch = envContent.match(/VITE_SITE_URL=(.+)/);
    if (urlMatch && urlMatch[1] && !process.env.VITE_SITE_URL) {
      const parsedUrl = urlMatch[1].trim().replace(/\/+$/, '');
      if (parsedUrl.startsWith('http')) {
        console.log(`[Sitemap Generator] Found VITE_SITE_URL in .env.local: ${parsedUrl}`);
      }
    }
  }

  // Build XML
  const xmlEntries = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <!-- Base URL: ${baseUrl} -->`,
    '  <!-- Static Pages -->',
  ];

  for (const route of staticRoutes) {
    xmlEntries.push('  <url>');
    xmlEntries.push(`    <loc>${baseUrl}${route.path}</loc>`);
    xmlEntries.push(`    <changefreq>${route.changefreq}</changefreq>`);
    xmlEntries.push(`    <priority>${route.priority}</priority>`);
    xmlEntries.push('  </url>');
  }

  xmlEntries.push('  <!-- Product Pages -->');
  for (const slug of productSlugs) {
    xmlEntries.push('  <url>');
    xmlEntries.push(`    <loc>${baseUrl}/product/${slug}</loc>`);
    xmlEntries.push('    <changefreq>weekly</changefreq>');
    xmlEntries.push('    <priority>0.8</priority>');
    xmlEntries.push('  </url>');
  }

  xmlEntries.push('</urlset>');
  xmlEntries.push('');

  const outputPath = path.join(rootDir, 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xmlEntries.join('\n'), 'utf-8');
  console.log(`[Sitemap Generator] Successfully written sitemap to ${outputPath}`);
}

generateSitemap().catch((err) => {
  console.error('[Sitemap Generator] Error:', err);
  process.exit(1);
});
