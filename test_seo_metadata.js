import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log('         HAECCA HIJAB — SEO & METADATA AUDIT TEST               ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passCount++;
  } else {
    console.error(`✗ FAILED: ${message}`);
    failCount++;
  }
}

// 1. Audit index.html
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

console.log('1. Auditing index.html (Global SEO & Social Sharing):');
assert(indexHtml.includes('lang="id"'), 'index.html specifies lang="id"');
assert(indexHtml.includes('<title>Haecca Hijab | Hijab & Fashion Muslimah</title>'), 'index.html has brand natural title');
assert(indexHtml.includes('name="description"'), 'index.html has meta description');
assert(indexHtml.includes('name="robots" content="index, follow"'), 'index.html has meta robots index, follow');
assert(indexHtml.includes('rel="canonical"'), 'index.html has canonical link tag');
assert(indexHtml.includes('property="og:type" content="website"'), 'index.html has og:type');
assert(indexHtml.includes('property="og:site_name" content="Haecca Hijab"'), 'index.html has og:site_name');
assert(indexHtml.includes('property="og:locale" content="id_ID"'), 'index.html has og:locale');
assert(indexHtml.includes('property="og:image"'), 'index.html has og:image');
assert(indexHtml.includes('name="twitter:card" content="summary_large_image"'), 'index.html has twitter:card');
assert(indexHtml.includes('id="haecca-global-jsonld"'), 'index.html has Schema.org Organization/WebSite JSON-LD');

// 2. Audit src/utils/seo.js
console.log('\n2. Auditing src/utils/seo.js (Dynamic Head Manager):');
const seoJsPath = path.join(__dirname, 'src', 'utils', 'seo.js');
const seoJs = fs.readFileSync(seoJsPath, 'utf-8');
assert(seoJs.includes('function updateMetaTag'), 'seo.js implements updateMetaTag helper');
assert(seoJs.includes('function updateCanonical'), 'seo.js implements updateCanonical helper');
assert(seoJs.includes('function updateJsonLd'), 'seo.js implements updateJsonLd helper');
assert(seoJs.includes('noindex ? \'noindex, nofollow\' : \'index, follow\''), 'seo.js handles robots noindex toggle');
assert(seoJs.includes('og:locale'), 'seo.js updates og:locale');
assert(seoJs.includes('twitter:card'), 'seo.js updates twitter:card');

// 3. Audit ProductDetailPage.jsx
console.log('\n3. Auditing ProductDetailPage.jsx (Dynamic Product SEO & Schema):');
const pdpPath = path.join(__dirname, 'src', 'pages', 'ProductDetailPage.jsx');
const pdp = fs.readFileSync(pdpPath, 'utf-8');
assert(pdp.includes('title={`${product.name} | Haecca Hijab`}'), 'ProductDetailPage sets dynamic product title');
assert(pdp.includes('description={product.description}'), 'ProductDetailPage sets dynamic product description');
assert(pdp.includes('image={primaryImage}'), 'ProductDetailPage sets dynamic product image');
assert(pdp.includes('url={productCanonicalUrl}'), 'ProductDetailPage sets dynamic canonical URL');
assert(pdp.includes('type="product"'), 'ProductDetailPage sets Open Graph type="product"');
assert(pdp.includes('\'@type\': \'Product\''), 'ProductDetailPage creates Schema.org Product schema');
assert(pdp.includes('priceCurrency: \'IDR\''), 'ProductDetailPage sets priceCurrency to IDR');
assert(pdp.includes('https://schema.org/InStock'), 'ProductDetailPage sets dynamic availability');
assert(pdp.includes('name: \'Haecca Hijab\''), 'ProductDetailPage sets Brand to Haecca Hijab');
assert(pdp.includes('SEO title="Produk Tidak Ditemukan | Haecca Hijab" noindex={true}'), 'ProductDetailPage 404 state has noindex');

// 4. Audit Robots Protection & Noindex on Admin/Private Routes
console.log('\n4. Auditing Admin & Private Route Protection (noindex):');
const adminLoginPath = path.join(__dirname, 'src', 'admin', 'pages', 'AdminLoginPage.jsx');
const adminLogin = fs.readFileSync(adminLoginPath, 'utf-8');
assert(adminLogin.includes('noindex={true}'), 'AdminLoginPage has noindex={true}');

const adminLayoutPath = path.join(__dirname, 'src', 'admin', 'components', 'AdminLayout.jsx');
const adminLayout = fs.readFileSync(adminLayoutPath, 'utf-8');
assert(adminLayout.includes('noindex={true}'), 'AdminLayout has noindex={true}');

const resetPwPath = path.join(__dirname, 'src', 'pages', 'ResetPasswordPage.jsx');
const resetPw = fs.readFileSync(resetPwPath, 'utf-8');
assert(resetPw.includes('noindex={true}'), 'ResetPasswordPage has noindex={true}');

const checkoutPath = path.join(__dirname, 'src', 'pages', 'CheckoutPage.jsx');
const checkout = fs.readFileSync(checkoutPath, 'utf-8');
assert(checkout.includes('noindex={true}'), 'CheckoutPage has noindex={true}');

const notFoundPath = path.join(__dirname, 'src', 'pages', 'NotFoundPage.jsx');
const notFound = fs.readFileSync(notFoundPath, 'utf-8');
assert(notFound.includes('noindex={true}'), 'NotFoundPage has noindex={true}');

// 5. Audit public/robots.txt
console.log('\n5. Auditing public/robots.txt:');
const robotsPath = path.join(__dirname, 'public', 'robots.txt');
const robots = fs.readFileSync(robotsPath, 'utf-8');
assert(robots.includes('Allow: /'), 'robots.txt allows root /');
assert(robots.includes('Allow: /shop'), 'robots.txt allows /shop');
assert(robots.includes('Allow: /product/'), 'robots.txt allows /product/');
assert(robots.includes('Disallow: /admin'), 'robots.txt disallows /admin');
assert(robots.includes('Disallow: /admin/*'), 'robots.txt disallows /admin/*');
assert(robots.includes('Disallow: /reset-password'), 'robots.txt disallows /reset-password');
assert(robots.includes('Sitemap:'), 'robots.txt declares Sitemap');

// 6. Audit public/sitemap.xml
console.log('\n6. Auditing public/sitemap.xml:');
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'sitemap.xml has standard schema namespace');
assert(sitemap.includes('/shop'), 'sitemap.xml includes /shop');
assert(sitemap.includes('/about'), 'sitemap.xml includes /about');
assert(sitemap.includes('/cart'), 'sitemap.xml includes /cart');
assert(sitemap.includes('/product/aluna-voal-ultrafine-taupe'), 'sitemap.xml includes product URLs');
assert(!sitemap.includes('/admin'), 'sitemap.xml does NOT include /admin');
assert(!sitemap.includes('/reset-password'), 'sitemap.xml does NOT include /reset-password');

// 7. Performance & Accessibility
console.log('\n7. Auditing Image Performance & Alt attributes:');
const heroPath = path.join(__dirname, 'src', 'components', 'home', 'HeroSection.jsx');
const hero = fs.readFileSync(heroPath, 'utf-8');
assert(hero.includes('loading="eager"') && hero.includes('fetchPriority="high"'), 'Hero image has eager loading and high priority');

const galleryPath = path.join(__dirname, 'src', 'components', 'product', 'ProductGallery.jsx');
const gallery = fs.readFileSync(galleryPath, 'utf-8');
assert(gallery.includes('loading="eager"'), 'Main product gallery image has loading="eager"');
assert(gallery.includes('loading="lazy"'), 'Gallery thumbnails have loading="lazy"');

console.log('\n================================================================');
console.log(` RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
