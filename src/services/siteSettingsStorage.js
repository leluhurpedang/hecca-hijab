import { openDB, withStore } from './db.js';
import { resolvePersistentId } from './imageStorage.js';

export const DEFAULT_SITE_SETTINGS = {
  brand: {
    key: 'brand',
    brandName: 'Haecca Hijab',
    tagline: 'Premium Modest Fashion',
    shortDescription: 'Brand hijab & busana muslimah modern dengan sentuhan elegan, material berkualitas tinggi, dan harga yang bersahabat untuk setiap wanita Indonesia.',
    logoText: 'HAECCA',
    logoImage: '',
    copyrightText: '© 2026 Haecca Hijab. Seluruh hak cipta dilindungi undang-undang.',
  },
  navigation: {
    key: 'navigation',
    items: [
      { id: 'nav-1', label: 'Beranda', type: 'page', path: '/', isEnabled: true },
      { id: 'nav-2', label: 'Semua Produk', type: 'page', path: '/shop', isEnabled: true },
      { id: 'nav-3', label: 'Pashmina', type: 'category', category: 'pashmina', path: '/shop?category=pashmina', isEnabled: true },
      { id: 'nav-4', label: 'Voal', type: 'category', category: 'voal', path: '/shop?category=voal', isEnabled: true },
      { id: 'nav-5', label: 'Hijab', type: 'category', category: 'hijab', path: '/shop?category=hijab', isEnabled: true },
      { id: 'nav-6', label: 'Aksesoris', type: 'category', category: 'accessories', path: '/shop?category=accessories', isEnabled: true },
      { id: 'nav-7', label: 'Tentang Kami', type: 'page', path: '/about', isEnabled: true },
    ],
  },
  announcementBar: {
    key: 'announcementBar',
    isEnabled: true,
    announcementText: 'Special Launch: Gratis Ongkir min. belanja Rp250.000 • Gunakan kode HAECCANEW diskon 10%',
    voucherCode: 'HAECCANEW',
    discountPercentage: 10,
    link: '/shop',
  },
  homepage: {
    key: 'homepage',
    hero: {
      eyebrow: 'Koleksi Signature 2026',
      heading: 'Sentuhan Keanggunan dalam Setiap Helai Hijab',
      description: 'Diciptakan dengan material voal ultrafine dan serat silk premium berstandar butik. Lembut, adem, tegak paripurna di dahi, serta memancarkan pesona anggun setiap muslimah modern.',
      primaryCtaText: 'Belanja Sekarang',
      primaryCtaLink: '/shop',
      secondaryCtaText: 'Lihat Voal Premium',
      secondaryCtaLink: '/shop?category=voal',
      heroImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80',
      materialLabel: 'Bahan Eksklusif',
      materialTitle: 'Ultrafine Voal Voile Import',
      startingPrice: 'Mulai Rp 89.000',
    },
    spotlight: {
      isEnabled: true,
      eyebrow: 'Limited Edition Series',
      title: 'The Silk Harmony: Kemewahan yang Nyaman Seharian',
      description: 'Dibuat dari benang sutra cradenza grade 6A dengan kilau shimmer natural yang memikat. Setiap pembelian seri ini mendapatkan kemasan exclusive rigid giftbox berpita satin emas.',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85',
      ctaText: 'Miliki Sekarang',
      ctaLink: '/shop?category=pashmina',
    },
    sections: {
      showCategories: true,
      showNewArrivals: true,
      showSpotlight: true,
      showBestSellers: true,
      showValueProps: true,
      showTestimonials: true,
      showNewsletter: true,
    },
    sectionTitles: {
      categoriesTitle: 'Pilihan Koleksi',
      categoriesSubtitle: 'Temukan padanan hijab sempurna untuk setiap momen istimewa',
      newArrivalsTitle: 'Koleksi Terbaru',
      newArrivalsSubtitle: 'Sentuhan warna & siluet terkini yang dirancang untuk muslimah modern',
      bestSellersTitle: 'Produk Terlaris',
      bestSellersSubtitle: 'Favorit ribuan #HaeccaLadies untuk kenyamanan dan keanggunan sehari-hari',
    },
    valueProps: [
      { title: 'Material Adem & Ringan', desc: 'Serat alami breathable yang sejuk dan tidak mendengung di telinga.', icon: 'Sparkles' },
      { title: 'Jahitan Standar Butik', desc: 'Tepian clean laser cut & jahit tepi presisi tanpa benang terurai.', icon: 'ShieldCheck' },
      { title: 'Packaging Mewah Siap Kado', desc: 'Kemasan reusable pouch & hardbox eksklusif berlabel gold foil.', icon: 'Truck' },
      { title: 'Tegak Paripurna di Dahi', desc: 'Mudah dibentuk melengkung rapi tanpa perlu hairspray pelicin.', icon: 'RefreshCw' },
    ],
    testimonials: [
      {
        id: 1,
        name: 'dr. Aisyah Ramadhani',
        role: 'Dokter & Hijab Enthusiast',
        city: 'Jakarta Selatan',
        rating: 5,
        review: 'Voal ultrafine Haecca benar-benar penyelamat dinas jaga panjang. Tidak gerah sama sekali, tidak berdengung di telinga waktu pakai stetoskop, dan bentuk tegaknya konsisten seharian tanpa geser!',
      },
      {
        id: 2,
        name: 'Nadia Salsabila',
        role: 'Fashion Content Creator',
        city: 'Bandung',
        rating: 5,
        review: 'Warna Sandstone dan Soft Mocca-nya pas banget di kulit sawo matang! Jatuhnya mewah berkelas seperti pashmina desainer jutaan rupiah. Unboxing package hardbox-nya wangi dan estetik banget.',
      },
      {
        id: 3,
        name: 'Fitri Handayani',
        role: 'Corporate Professional',
        city: 'Surabaya',
        rating: 5,
        review: 'Sudah order ketiga kalinya di Haecca. Bahan Silk Cradenza-nya jatuh anggun, shimmer-nya halus tidak lebay, cocok banget dipakai meeting formal maupun kondangan keluarga.',
      }
    ],
  },
  about: {
    key: 'about',
    eyebrow: 'Tentang Haecca',
    heading: 'Merayakan Keanggunan Muslimah Melalui Kualitas Tanpa Kompromi',
    intro: 'Haecca Hijab lahir dari sebuah keyakinan sederhana: bahwa setiap wanita berhak merasakan kenyamanan sejati dan keanggunan berkelas tanpa harus membayar harga yang tak masuk akal.',
    storyLabel: 'Awal Mula Haecca',
    quote: '"Hijab seharusnya tidak hanya indah dipandang, namun terasa seperti hembusan angin sejuk saat dikenakan."',
    storyP1: 'Didirikan di Jakarta Selatan pada tahun 2024, Haecca berawal dari pencarian pribadi akan bahan voal yang benar-benar tidak mendengung di telinga, adem seharian di cuaca tropis, dan tegak rapi di dahi tanpa perlu disemprot pelicin kimia.',
    storyP2: 'Kami bekerja sama langsung dengan pabrik tenun serat ultrafine terbaik untuk memproduksi kain berdensitas tinggi dengan finishing laser cut presisi. Setiap helai hijab melewati 3 tahap quality control ketat sebelum dikemas dalam signature packaging mewah siap hadiah.',
    aboutImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
    fabricStoryTitle: 'Boutique Studio & Layanan Pelanggan',
    fabricStoryText: 'Ada pertanyaan mengenai panduan warna, ketersediaan stok, atau pesanan khusus untuk acara pernikahan/bridesmaid? Tim konsultan hijab Haecca siap membantu Anda dengan senang hati.',
    fabricImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
    studioAddress: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190',
    studioHours: 'Senin - Sabtu: 09.00 - 20.00 WIB | Minggu: 10.00 - 18.00 WIB',
    email: 'hello@haeccahijab.com',
    whatsapp: '6281234567890',
  },
  footer: {
    key: 'footer',
    brandName: 'Haecca Hijab',
    tagline: 'Premium Modest Fashion',
    description: 'Brand hijab & busana muslimah modern dengan sentuhan elegan, material berkualitas tinggi, dan harga yang bersahabat untuk setiap wanita Indonesia.',
    footerLogoImage: '',
    socials: {
      instagram: 'https://instagram.com/haeccahijab',
      whatsapp: 'https://wa.me/6281234567890',
      email: 'hello@haeccahijab.com',
      tiktok: 'https://tiktok.com/@haeccahijab',
      showInstagram: true,
      showWhatsapp: true,
      showEmail: true,
      showTiktok: true,
    },
    collectionLinks: [
      { label: 'Pashmina Silk', to: '/shop?category=pashmina' },
      { label: 'Voal Premium', to: '/shop?category=voal' },
      { label: 'Hijab Segiempat', to: '/shop?category=hijab' },
      { label: 'Aksesoris Hijab', to: '/shop?category=accessories' },
      { label: 'Koleksi Terbaru', to: '/shop' },
    ],
    helpLinks: [
      { label: 'Tentang Kami', to: '/about' },
      { label: 'Panduan Ukuran & Perawatan', to: '/about' },
      { label: 'Kebijakan Pengembalian', to: '/about' },
      { label: 'Hubungi WhatsApp Care', to: 'https://wa.me/6281234567890' },
    ],
    paymentMethods: ['BCA', 'Mandiri', 'BSI', 'QRIS', 'COD / WhatsApp'],
    copyright: '© 2026 Haecca Hijab. Seluruh hak cipta dilindungi undang-undang.',
    showAdminLink: true,
  },
  store: {
    key: 'store',
    storeName: 'Haecca Hijab',
    legalEntity: 'PT Haecca Busana Indonesia',
    tagline: 'Sentuhan Keanggunan dalam Setiap Helai',
    whatsappNumber: '6281234567890',
    email: 'hello@haeccahijab.com',
    address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190',
    operatingHours: 'Setiap Hari, 08:00 - 21:00 WIB',
    instagramUrl: 'https://instagram.com/haeccahijab',
    tiktokUrl: 'https://tiktok.com/@haeccahijab',
    freeShippingThreshold: 250000,
    currencySymbol: 'Rp',
  },
  whatsapp: {
    key: 'whatsapp',
    recipientNumber: '6281234567890',
    greetingTemplate: 'Halo Admin Haecca Hijab, saya ingin memesan produk berikut:',
    defaultAdditionalNote: 'Mohon info total pembayaran dan nomor rekening transfer resmi.',
    showFloatingButton: true,
  },
};

// Aliases mapping between legacy CMS keys and new SiteSettings keys
export const KEY_ALIASES = {
  bannerPromo: 'announcementBar',
  announcementBar: 'bannerPromo',
  storeSettings: 'store',
  store: 'storeSettings',
  whatsappSettings: 'whatsapp',
  whatsapp: 'whatsappSettings',
};

/**
 * Clean data before persisting: ensures ephemeral blob: URLs are converted to persistent img_ IDs
 * @param {any} data 
 * @returns {any}
 */
export function cleanPersistentData(data) {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map(cleanPersistentData);
  }

  const cleaned = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string') {
      cleaned[k] = resolvePersistentId(v);
    } else if (typeof v === 'object' && v !== null) {
      cleaned[k] = cleanPersistentData(v);
    } else {
      cleaned[k] = v;
    }
  }
  return cleaned;
}

/**
 * Get Site Setting by key
 * Automatically checks 'siteSettings' store, then legacy 'cms' store, and falls back to default.
 * @param {string} key 
 * @returns {Promise<any>}
 */
export async function getSiteSetting(key) {
  const normalizedKey = KEY_ALIASES[key] && DEFAULT_SITE_SETTINGS[key] ? key : (DEFAULT_SITE_SETTINGS[key] ? key : (KEY_ALIASES[key] || key));
  const fallback = DEFAULT_SITE_SETTINGS[normalizedKey] || DEFAULT_SITE_SETTINGS[key] || null;

  try {
    const db = await openDB();

    // 1. First attempt to read from siteSettings store
    if (db.objectStoreNames.contains('siteSettings')) {
      const record = await new Promise((resolve, reject) => {
        const tx = db.transaction('siteSettings', 'readonly');
        const store = tx.objectStore('siteSettings');
        const req = store.get(normalizedKey);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (record && record.data) {
        if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
          return { ...fallback, ...record.data, key: normalizedKey };
        }
        return record.data;
      }
    }

    // 2. Check legacy cms store if siteSettings didn't have it
    const legacyKey = KEY_ALIASES[normalizedKey] || normalizedKey;
    if (db.objectStoreNames.contains('cms')) {
      const legacyRecord = await new Promise((resolve, reject) => {
        const tx = db.transaction('cms', 'readonly');
        const store = tx.objectStore('cms');
        const req = store.get(legacyKey);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (legacyRecord && legacyRecord.data) {
        if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
          return { ...fallback, ...legacyRecord.data, key: normalizedKey };
        }
        return legacyRecord.data;
      }
    }
  } catch (err) {
    console.error(`[SiteSettingsStorage] Failed to read key "${key}":`, err);
  }

  return fallback;
}

/**
 * Save Site Setting by key
 * Persists to both 'siteSettings' and legacy 'cms' store to guarantee 100% backward compatibility.
 * Ephemeral blob: URLs are automatically resolved to persistent img_ IDs.
 * @param {string} key 
 * @param {any} data 
 * @returns {Promise<any>}
 */
export async function saveSiteSetting(key, data) {
  const normalizedKey = DEFAULT_SITE_SETTINGS[key] ? key : (KEY_ALIASES[key] || key);
  const cleanedData = cleanPersistentData(data);

  try {
    const db = await openDB();

    // 1. Save to siteSettings store
    if (db.objectStoreNames.contains('siteSettings')) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction('siteSettings', 'readwrite');
        const store = tx.objectStore('siteSettings');
        const record = {
          key: normalizedKey,
          data: cleanedData,
          updatedAt: Date.now(),
        };
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }

    // 2. Dual-write to legacy cms store for total backwards compatibility
    const legacyKey = KEY_ALIASES[normalizedKey] || normalizedKey;
    if (db.objectStoreNames.contains('cms')) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction('cms', 'readwrite');
        const store = tx.objectStore('cms');
        const record = {
          key: legacyKey,
          data: cleanedData,
          updatedAt: Date.now(),
        };
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }

    return cleanedData;
  } catch (err) {
    console.error(`[SiteSettingsStorage] Failed to save key "${key}":`, err);
    throw err;
  }
}

/**
 * Retrieve all 8 site setting modules in a single call, with alias synchronization
 * @returns {Promise<Record<string, any>>}
 */
export async function getAllSiteSettings() {
  const keys = Object.keys(DEFAULT_SITE_SETTINGS);
  const results = {};

  await Promise.all(
    keys.map(async (key) => {
      results[key] = await getSiteSetting(key);
    })
  );

  // Synchronize legacy aliases
  results.bannerPromo = results.announcementBar;
  results.storeSettings = results.store;
  results.whatsappSettings = results.whatsapp;

  return results;
}

/**
 * Delete a site setting by key from IndexedDB ('siteSettings' and legacy 'cms' stores)
 * @param {string} key 
 * @returns {Promise<boolean>}
 */
export async function deleteSiteSetting(key) {
  const normalizedKey = DEFAULT_SITE_SETTINGS[key] ? key : (KEY_ALIASES[key] || key);
  try {
    const db = await openDB();
    if (db.objectStoreNames.contains('siteSettings')) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction('siteSettings', 'readwrite');
        const store = tx.objectStore('siteSettings');
        const req = store.delete(normalizedKey);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }

    const legacyKey = KEY_ALIASES[normalizedKey] || normalizedKey;
    if (db.objectStoreNames.contains('cms')) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction('cms', 'readwrite');
        const store = tx.objectStore('cms');
        const req = store.delete(legacyKey);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }

    return true;
  } catch (err) {
    console.error(`[SiteSettingsStorage] Failed to delete key "${key}":`, err);
    return false;
  }
}
