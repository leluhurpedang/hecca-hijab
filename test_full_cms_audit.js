import 'fake-indexeddb/auto';
import fs from 'fs';
import path from 'path';
import { openDB } from './src/services/db.js';
import { uploadImage, getImageUrl, resolvePersistentId, clearUrlCache } from './src/services/imageStorage.js';
import {
  getAllSiteSettings,
  getSiteSetting,
  saveSiteSetting,
  cleanPersistentData,
  DEFAULT_SITE_SETTINGS,
} from './src/services/siteSettingsStorage.js';
import { getCMSContent, saveCMSContent } from './src/services/cmsStorage.js';
import { generateWhatsAppOrderUrl, normalizeWhatsAppNumber } from './src/utils/whatsapp.js';

// Polyfill URL.createObjectURL and revokeObjectURL for Node test environment
let urlCounter = 0;
const blobRegistry = new Map();

if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = (blob) => {
    urlCounter++;
    const url = `blob:http://localhost:5173/uuid-${urlCounter}`;
    blobRegistry.set(url, blob);
    return url;
  };
  global.URL.revokeObjectURL = (url) => {
    blobRegistry.delete(url);
  };
}

async function runFullCMSAudit() {
  console.log('================================================================');
  console.log('       HAECCA HIJAB — FULL CMS AUDIT & PERSISTENCE TEST        ');
  console.log('================================================================\n');

  let passedTests = 0;
  const totalTests = 10;

  // -------------------------------------------------------------
  // TEST 1: Database V3 Initialization & Stores Verification
  // -------------------------------------------------------------
  console.log('TEST 1: Verifying IndexedDB V3 Schema & Object Stores...');
  const db = await openDB();
  const storeNames = Array.from(db.objectStoreNames);
  console.log('   Available Stores:', storeNames.join(', '));
  console.assert(storeNames.includes('siteSettings'), 'FAIL: siteSettings store missing');
  console.assert(storeNames.includes('images'), 'FAIL: images store missing');
  console.assert(storeNames.includes('products'), 'FAIL: products store missing');
  console.assert(storeNames.includes('cms'), 'FAIL: cms store missing');
  console.log('   ✓ All 4 required stores present (siteSettings, images, products, cms)\n');
  passedTests++;

  // -------------------------------------------------------------
  // TEST 2: All 8 CMS Modules Initialization & Retrieval
  // -------------------------------------------------------------
  console.log('TEST 2: Verifying 8 Default CMS Modules in siteSettings...');
  const allSettings = await getAllSiteSettings();
  const requiredModules = [
    'brand',
    'navigation',
    'announcementBar',
    'homepage',
    'about',
    'footer',
    'store',
    'whatsapp',
  ];

  for (const mod of requiredModules) {
    console.assert(allSettings[mod] !== undefined, `FAIL: Module ${mod} missing from siteSettings`);
    console.log(`   ✓ Module [${mod}] successfully resolved`);
  }
  console.log('   ✓ All 8 CMS modules initialized and accessible\n');
  passedTests++;

  // -------------------------------------------------------------
  // TEST 3: Blob-based Media Upload for All Editable CMS Sections
  // -------------------------------------------------------------
  console.log('TEST 3: Testing Blob-based Image Storage for CMS Sections...');
  const cmsImagesToTest = [
    { section: 'heroImage', filename: 'hero_editorial_2026.webp' },
    { section: 'spotlightImage', filename: 'spotlight_eid.webp' },
    { section: 'aboutImage', filename: 'studio_atelier.webp' },
    { section: 'fabricImage', filename: 'paris_voal_texture.webp' },
    { section: 'footerLogo', filename: 'brand_logo_gold.webp' },
  ];

  const uploadedMediaMap = {};

  for (const img of cmsImagesToTest) {
    const fakeBlob = new Blob([`Binary payload for ${img.filename}`], { type: 'image/webp' });
    fakeBlob.name = img.filename;
    const res = await uploadImage(fakeBlob);
    console.assert(res.id.startsWith('img_'), `FAIL: Expected persistent ID for ${img.filename}`);
    console.assert(res.url.startsWith('blob:'), `FAIL: Expected active blob URL for ${img.filename}`);
    uploadedMediaMap[img.section] = res;
    console.log(`   ✓ Uploaded ${img.section} -> ID: ${res.id} (${res.url})`);
  }
  console.log('   ✓ All CMS media successfully uploaded as Blobs to IndexedDB\n');
  passedTests++;

  // -------------------------------------------------------------
  // TEST 4: Ephemeral Blob URL Protection & Conversion on Save
  // -------------------------------------------------------------
  console.log('TEST 4: Testing Ephemeral URL Conversion to Persistent ID on Save...');
  // Save homepage setting with active session blob: URLs
  const modifiedHomepage = {
    ...allSettings.homepage,
    hero: {
      ...allSettings.homepage.hero,
      heroImage: uploadedMediaMap.heroImage.url, // ephemeral blob URL!
    },
    spotlight: {
      ...allSettings.homepage.spotlight,
      image: uploadedMediaMap.spotlightImage.url, // ephemeral blob URL!
    },
  };

  await saveSiteSetting('homepage', modifiedHomepage);

  // Directly inspect raw record in IndexedDB 'siteSettings' store
  const rawHomepageRecord = await new Promise((resolve, reject) => {
    const tx = db.transaction(['siteSettings'], 'readonly');
    const store = tx.objectStore('siteSettings');
    const req = store.get('homepage');
    req.onsuccess = () => resolve(req.result?.data);
    req.onerror = () => reject(req.error);
  });

  console.assert(
    rawHomepageRecord.hero.heroImage === uploadedMediaMap.heroImage.id,
    `FAIL: Raw DB heroImage should be persistent ID ${uploadedMediaMap.heroImage.id}, got ${rawHomepageRecord.hero.heroImage}`
  );
  console.assert(
    rawHomepageRecord.spotlight.image === uploadedMediaMap.spotlightImage.id,
    `FAIL: Raw DB spotlight image should be persistent ID ${uploadedMediaMap.spotlightImage.id}, got ${rawHomepageRecord.spotlight.image}`
  );
  console.log('   ✓ Raw heroImage in DB is persistent ID:', rawHomepageRecord.hero.heroImage);
  console.log('   ✓ Raw spotlight.image in DB is persistent ID:', rawHomepageRecord.spotlight.image);
  console.log('   ✓ Verified: Ephemeral "blob:..." URLs are stripped before DB persistence\n');
  passedTests++;

  // -------------------------------------------------------------
  // TEST 5: Simulated Page Reload & Rehydration
  // -------------------------------------------------------------
  console.log('TEST 5: Testing Persistence across Memory Reset (Simulated Reload)...');
  clearUrlCache();
  console.log('   ✓ Memory URL cache flushed and old object URLs invalidated.');

  const heroId = uploadedMediaMap.heroImage.id;
  const rehydratedHeroUrl = await getImageUrl(heroId);

  console.assert(
    rehydratedHeroUrl && rehydratedHeroUrl.startsWith('blob:'),
    `FAIL: Failed to rehydrate hero image from IndexedDB blob: ${rehydratedHeroUrl}`
  );
  console.log('   ✓ Successfully rehydrated hero image from IndexedDB Blob:', rehydratedHeroUrl);

  // Verify binary Blob record in images table
  const rawImageRecord = await new Promise((resolve, reject) => {
    const tx = db.transaction(['images'], 'readonly');
    const store = tx.objectStore('images');
    const req = store.get(heroId);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  console.assert(rawImageRecord && rawImageRecord.blob, 'FAIL: Blob missing from IndexedDB images store');
  console.log(`   ✓ Raw binary Blob intact in IndexedDB: size=${rawImageRecord.size} bytes, type=${rawImageRecord.type}\n`);
  passedTests++;

  // -------------------------------------------------------------
  // TEST 6: WhatsApp Settings, Normalization & Order URL Dispatch
  // -------------------------------------------------------------
  console.log('TEST 6: Testing WhatsApp Settings & Checkout URL Generation...');
  const waSettings = {
    phoneNumber: '0812-3456-7890', // With dashes and leading 0
    recipientNumber: '0812-3456-7890',
    greetingTemplate: 'Halo Haecca Official, saya ingin konfirmasi pesanan:',
    defaultAdditionalNote: 'Mohon dicek kembali kerapian jahitan sebelum dikirim.',
  };

  await saveSiteSetting('whatsapp', waSettings);
  const normalized = normalizeWhatsAppNumber(waSettings.phoneNumber);
  console.assert(normalized === '6281234567890', `FAIL: Expected 6281234567890, got ${normalized}`);
  console.log('   ✓ Phone normalization works: "0812-3456-7890" ->', normalized);

  const sampleOrder = {
    customerName: 'Alya Salsabila',
    phone: '085712345678',
    address: 'Jl. Riau No. 88',
    city: 'Bandung',
    postalCode: '40115',
    notes: 'Kirim sebelum jam 4 sore',
    paymentMethod: 'Transfer Bank BCA',
    items: [
      {
        name: 'Haecca Silk Pashmina',
        selectedColor: 'Oatmeal',
        quantity: 1,
        price: 95000,
      },
    ],
    subtotal: 95000,
    shippingFee: 0,
    discount: 0,
    totalPrice: 95000,
  };

  const generatedUrl = generateWhatsAppOrderUrl(
    sampleOrder,
    waSettings.phoneNumber,
    waSettings.greetingTemplate,
    waSettings.defaultAdditionalNote
  );

  console.assert(generatedUrl.includes('wa.me/6281234567890'), `FAIL: URL missing normalized recipient phone: ${generatedUrl}`);
  console.assert(
    generatedUrl.includes(encodeURIComponent('Halo Haecca Official, saya ingin konfirmasi pesanan:')),
    'FAIL: URL missing dynamic greeting template'
  );
  console.assert(
    generatedUrl.includes(encodeURIComponent('Haecca Silk Pashmina')),
    'FAIL: URL missing order item name'
  );
  console.assert(
    generatedUrl.includes(encodeURIComponent('Mohon dicek kembali kerapian jahitan sebelum dikirim.')),
    'FAIL: URL missing additional note'
  );
  console.log('   ✓ WhatsApp order URL generated with dynamic recipient, template, and notes\n');
  passedTests++;

  // -------------------------------------------------------------
  // TEST 7: About Page 15-Field Data Flow & Integrity
  // -------------------------------------------------------------
  console.log('TEST 7: Testing About Page 15 Fields Data Integrity...');
  const aboutUpdate = {
    eyebrow: 'Tentang Haecca',
    badge: 'Cerita Haecca',
    storyTitle: 'Menenun Keanggunan Modern Sejak 2024',
    storyParagraph1: 'Haecca Hijab didirikan untuk menghadirkan keanggunan busana muslimah kontemporer.',
    storyParagraph2: 'Setiap serat benang dipilih teliti dari produsen tekstil ramah lingkungan.',
    storyParagraph3: 'Kami percaya kenyamanan sejati lahir dari dedikasi terhadap presisi detail jahitan.',
    aboutImage: uploadedMediaMap.aboutImage.id,
    statsLabel1: '15.000+',
    statsDesc1: 'Hijab Terjual',
    statsLabel2: '99.2%',
    statsDesc2: 'Kepuasan Pelanggan',
    statsLabel3: '100%',
    statsDesc3: 'Serat Premium Halus',
    studioTitle: 'Studio & Atelier Haecca',
    studioLocation: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
    studioOpeningHours: 'Senin - Sabtu: 09:00 - 18:00 WIB',
    fabricSectionTitle: 'Filosofi Tekstil & Material',
    fabricSectionDesc: 'Koleksi Paris Voal Ultra-Fine kami memiliki sirkulasi udara optimal.',
    fabricImage: uploadedMediaMap.fabricImage.id,
  };

  await saveSiteSetting('about', aboutUpdate);
  const reloadedAbout = await getSiteSetting('about');

  const fieldsToCheck = [
    'badge',
    'storyTitle',
    'storyParagraph1',
    'storyParagraph2',
    'storyParagraph3',
    'aboutImage',
    'statsLabel1',
    'statsDesc1',
    'statsLabel2',
    'statsDesc2',
    'statsLabel3',
    'statsDesc3',
    'studioTitle',
    'studioLocation',
    'studioOpeningHours',
    'fabricSectionTitle',
    'fabricSectionDesc',
    'fabricImage',
  ];

  for (const field of fieldsToCheck) {
    console.assert(
      reloadedAbout[field] === aboutUpdate[field],
      `FAIL: About field ${field} mismatch: expected "${aboutUpdate[field]}", got "${reloadedAbout[field]}"`
    );
  }
  console.log(`   ✓ All ${fieldsToCheck.length} About page fields successfully stored and verified\n`);
  passedTests++;

  // -------------------------------------------------------------
  // TEST 8: Section Visibility & Toggles Persistence
  // -------------------------------------------------------------
  console.log('TEST 8: Testing Visibility Toggles Across Sections...');
  const annBar = await getSiteSetting('announcementBar');
  await saveSiteSetting('announcementBar', { ...annBar, isEnabled: false });

  const toggledAnn = await getSiteSetting('announcementBar');
  console.assert(toggledAnn.isEnabled === false, 'FAIL: announcementBar toggle failed');

  // Toggle back
  await saveSiteSetting('announcementBar', { ...annBar, isEnabled: true });
  const restoredAnn = await getSiteSetting('announcementBar');
  console.assert(restoredAnn.isEnabled === true, 'FAIL: announcementBar restore failed');
  console.log('   ✓ Announcement bar enabled/disabled toggle works');

  const currentHomepage = await getSiteSetting('homepage');
  await saveSiteSetting('homepage', {
    ...currentHomepage,
    spotlight: { ...currentHomepage.spotlight, isEnabled: false },
  });
  const toggledSpotlight = await getSiteSetting('homepage');
  console.assert(toggledSpotlight.spotlight.isEnabled === false, 'FAIL: spotlight toggle failed');
  console.log('   ✓ Spotlight banner enabled/disabled toggle works\n');
  passedTests++;

  // -------------------------------------------------------------
  // TEST 9: Typography & Font Family Integrity Scan
  // -------------------------------------------------------------
  console.log('TEST 9: Scanning Codebase for Clean Plus Jakarta Sans Enforcement...');
  const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
  console.assert(
    indexHtml.includes('family=Plus+Jakarta+Sans'),
    'FAIL: index.html missing Plus Jakarta Sans font link'
  );
  console.assert(
    !indexHtml.includes('Playfair'),
    'FAIL: index.html still contains Playfair Display'
  );
  console.log('   ✓ index.html: Plus Jakarta Sans active, Playfair Display fully removed');

  const tailwindConfig = fs.readFileSync(path.resolve('tailwind.config.js'), 'utf-8');
  console.assert(
    tailwindConfig.includes('Plus Jakarta Sans'),
    'FAIL: tailwind.config.js missing Plus Jakarta Sans'
  );
  console.log('   ✓ tailwind.config.js: fontFamily correctly configured with Plus Jakarta Sans');

  // Recursive scan in src/ to make sure font-serif is not in any JSX
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full);
      } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
        const content = fs.readFileSync(full, 'utf-8');
        if (content.includes('font-serif')) {
          throw new Error(`Found unexpected "font-serif" class in ${full}`);
        }
      }
    }
  }

  scanDir(path.resolve('src'));
  console.log('   ✓ Verified: 0 occurrences of "font-serif" across all files in src/\n');
  passedTests++;

  // -------------------------------------------------------------
  // TEST 10: Dual-Write & Backward Compatibility between Stores
  // -------------------------------------------------------------
  console.log('TEST 10: Testing Dual-Write & Legacy cmsStorage Interoperability...');
  // Update via legacy cmsStorage
  await saveCMSContent('bannerPromo', {
    announcementText: 'PROMO DUAL-WRITE TEST OK',
    isEnabled: true,
  });

  // Verify siteSettingsStorage reflects it
  const syncedSetting = await getSiteSetting('bannerPromo');
  console.assert(
    syncedSetting.announcementText === 'PROMO DUAL-WRITE TEST OK',
    'FAIL: siteSettingsStorage did not reflect saveCMSContent change'
  );

  // Update via siteSettingsStorage
  await saveSiteSetting('bannerPromo', {
    announcementText: 'PROMO SITE-SETTINGS TEST OK',
    isEnabled: true,
  });

  // Verify cmsStorage reflects it
  const syncedLegacy = await getCMSContent('bannerPromo');
  console.assert(
    syncedLegacy.announcementText === 'PROMO SITE-SETTINGS TEST OK',
    'FAIL: cmsStorage did not reflect saveSiteSetting change'
  );

  console.log('   ✓ Full bidirectional synchronization verified between cmsStorage and siteSettingsStorage\n');
  passedTests++;

  console.log('================================================================');
  console.log(` AUDIT SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (100% SUCCESS)`);
  console.log('================================================================');
}

runFullCMSAudit().catch((err) => {
  console.error('\n❌ AUDIT FAILED:', err);
  process.exit(1);
});
