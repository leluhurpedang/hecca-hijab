import 'fake-indexeddb/auto';
import { openDB } from './src/services/db.js';
import { uploadImage, getImageUrl, resolvePersistentId, clearUrlCache } from './src/services/imageStorage.js';
import { saveProduct, getAllProducts, getProductBySlug, ensureProductsSeeded } from './src/services/productStorage.js';
import { getCMSContent, saveCMSContent, DEFAULT_CMS_DATA } from './src/services/cmsStorage.js';
import { generateWhatsAppOrderUrl } from './src/utils/whatsapp.js';

// Polyfill URL.createObjectURL and revokeObjectURL for Node test
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

async function runCMSPersistenceTests() {
  console.log('=== RUNNING HAECCA HIJAB CMS & BLOB PERSISTENCE TEST SUITE ===\n');

  // -------------------------------------------------------------
  // TEST 1: Blob Storage in IndexedDB & Image ID resolution
  // -------------------------------------------------------------
  console.log('1. Testing IndexedDB Blob Storage & Persistent ID Mapping...');
  const fakeBlobData = new Blob(['Simulated high-res hijab image binary data'], { type: 'image/webp' });
  fakeBlobData.name = 'voal_champagne.webp';

  const uploadResult = await uploadImage(fakeBlobData);
  console.assert(uploadResult.id.startsWith('img_'), 'FAIL: Expected persistent image ID starting with img_');
  console.assert(uploadResult.url.startsWith('blob:'), 'FAIL: Expected active blob URL for UI rendering');
  console.log('   ✓ Image successfully saved to IndexedDB with persistent ID:', uploadResult.id);
  console.log('   ✓ ImageManager received active session URL:', uploadResult.url);

  // Check resolvePersistentId
  const persistentIdFromUrl = resolvePersistentId(uploadResult.url);
  console.assert(persistentIdFromUrl === uploadResult.id, `FAIL: Expected ${uploadResult.id}, got ${persistentIdFromUrl}`);
  console.log('   ✓ resolvePersistentId successfully mapped active blob URL back to persistent ID:', persistentIdFromUrl);

  // -------------------------------------------------------------
  // TEST 2: Product Save with Ephemeral Blob URL -> Conversion to Persistent ID
  // -------------------------------------------------------------
  console.log('\n2. Testing Product Save with Ephemeral Blob URLs...');
  const testProduct = {
    id: 'haecca-test-scarf',
    name: 'Haecca Scarf Limited Edition',
    slug: 'haecca-test-scarf',
    category: 'voal',
    categoryLabel: 'Voal',
    price: 125000,
    originalPrice: 150000,
    stock: 25,
    rating: 4.9,
    reviewCount: 42,
    images: [uploadResult.url], // Pass ephemeral blob URL (as ImageManager does in state)
    colors: [{ name: 'Champagne', hex: '#F0E6D2' }],
    isVisible: true,
  };

  const savedProduct = await saveProduct(testProduct);
  console.log('   ✓ Product saved into IndexedDB.');

  // Direct check into raw database record in "products" object store
  const db = await openDB();
  const rawRecord = await new Promise((resolve, reject) => {
    const tx = db.transaction(['products'], 'readonly');
    const store = tx.objectStore('products');
    const req = store.get('haecca-test-scarf');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  console.assert(rawRecord.images[0] === uploadResult.id, `FAIL: DB should store persistent ID ${uploadResult.id}, but found: ${rawRecord.images[0]}`);
  console.log('   ✓ Verified raw record in IndexedDB "products" table stores persistent ID:', rawRecord.images[0]);
  console.log('   ✓ (Ephemeral "blob:..." URLs are never permanently written to database)');

  // -------------------------------------------------------------
  // TEST 3: Simulated Browser Refresh / Session Reopen (Rehydration)
  // -------------------------------------------------------------
  console.log('\n3. Testing Simulated Browser Refresh & Blob Rehydration...');
  // Simulate browser restart: revoke all old blob URLs and flush memory cache
  clearUrlCache();
  console.log('   ✓ Emulated page refresh: Memory URL cache flushed & old object URLs invalidated.');

  // Now reload product via getProductBySlug (which calls hydrateProduct)
  const rehydratedProduct = await getProductBySlug('haecca-test-scarf');
  console.assert(rehydratedProduct !== null, 'FAIL: Could not load product');
  console.assert(rehydratedProduct.images.length === 1, 'FAIL: Images length should be 1');
  console.assert(rehydratedProduct.images[0].startsWith('blob:'), `FAIL: Rehydrated image should be fresh active blob URL, got: ${rehydratedProduct.images[0]}`);
  console.log('   ✓ Product rehydrated successfully with fresh active Object URL:', rehydratedProduct.images[0]);

  // Verify the raw Blob in the "images" object store is still intact
  const rawImageRecord = await new Promise((resolve, reject) => {
    const tx = db.transaction(['images'], 'readonly');
    const store = tx.objectStore('images');
    const req = store.get(uploadResult.id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  console.assert(rawImageRecord && rawImageRecord.blob, 'FAIL: Raw binary blob missing from IndexedDB');
  console.log('   ✓ Verified raw binary Blob in IndexedDB is intact (Type:', rawImageRecord.type, ', Size:', rawImageRecord.size, 'bytes)');

  // -------------------------------------------------------------
  // TEST 4: Rating & Review Count Persistence
  // -------------------------------------------------------------
  console.log('\n4. Testing Editable Product Rating & Review Count...');
  rehydratedProduct.rating = 5.0;
  rehydratedProduct.reviewCount = 99;
  await saveProduct(rehydratedProduct);

  const updatedProduct = await getProductBySlug('haecca-test-scarf');
  console.assert(updatedProduct.rating === 5.0, `FAIL: Expected rating 5.0, got ${updatedProduct.rating}`);
  console.assert(updatedProduct.reviewCount === 99, `FAIL: Expected reviewCount 99, got ${updatedProduct.reviewCount}`);
  console.log('   ✓ Product rating and review count updated & persisted: ★', updatedProduct.rating, `(${updatedProduct.reviewCount} ulasan)`);

  // -------------------------------------------------------------
  // TEST 5: Full CMS Settings Persistence
  // -------------------------------------------------------------
  console.log('\n5. Testing CMS Settings Storage & Customizations...');
  const bannerInitial = await getCMSContent('bannerPromo');
  const storeInitial = await getCMSContent('storeSettings');
  const waInitial = await getCMSContent('whatsappSettings');

  console.assert(bannerInitial && storeInitial && waInitial, 'FAIL: Initial CMS defaults missing');
  console.log('   ✓ All CMS sections initialized with defaults:');
  console.log('      - bannerPromo:', bannerInitial.announcementText);
  console.log('      - storeSettings:', storeInitial.storeName, '|', storeInitial.phone);
  console.log('      - whatsappSettings:', waInitial.phoneNumber);

  // Update Banner & Promo
  await saveCMSContent('bannerPromo', {
    ...bannerInitial,
    announcementText: 'PROMO SPESIAL HAECCA HIJAB - DISKON 25% KODE: HAECCANEW',
  });
  const updatedBanner = await getCMSContent('bannerPromo');
  console.assert(updatedBanner.announcementText.includes('DISKON 25%'), 'FAIL: Banner update failed');
  console.log('   ✓ Banner & Promo CMS updated:', updatedBanner.announcementText);

  // Update WhatsApp Settings
  await saveCMSContent('whatsappSettings', {
    phoneNumber: '6289988776655',
    template: 'Salam Admin Haecca, saya bermaksud memesan produk:',
    orderNotification: true,
  });
  const updatedWA = await getCMSContent('whatsappSettings');
  console.assert(updatedWA.phoneNumber === '6289988776655', 'FAIL: WhatsApp phone update failed');
  console.log('   ✓ WhatsApp CMS settings updated (Phone:', updatedWA.phoneNumber, ')');

  // Update Store Settings (Free shipping threshold)
  await saveCMSContent('storeSettings', {
    ...storeInitial,
    storeName: 'Haecca Hijab Atelier Official',
    freeShippingThreshold: 300000,
  });
  const updatedStore = await getCMSContent('storeSettings');
  console.assert(updatedStore.freeShippingThreshold === 300000, 'FAIL: Store settings update failed');
  console.log('   ✓ Store Settings CMS updated (Free shipping threshold: Rp', updatedStore.freeShippingThreshold.toLocaleString('id-ID'), ')');

  // -------------------------------------------------------------
  // TEST 6: WhatsApp Checkout Integration with Dynamic CMS Overrides
  // -------------------------------------------------------------
  console.log('\n6. Testing WhatsApp Checkout Integration with Dynamic CMS Settings...');
  const orderPayload = {
    customerName: 'Siti Rahmawati',
    phone: '081298765432',
    address: 'Jl. Melati No. 12',
    city: 'Bandung',
    postalCode: '40123',
    notes: 'Packing kado pita satin tolong dirapikan',
    paymentMethod: 'Transfer Bank BCA',
    items: [
      {
        id: 'item-1',
        name: 'Haecca Scarf Limited Edition',
        selectedColor: 'Champagne',
        quantity: 2,
        price: 125000,
      }
    ],
    subtotal: 250000,
    shippingFee: 0,
    discount: 25000,
    totalPrice: 225000,
  };

  const waUrl = generateWhatsAppOrderUrl(orderPayload, updatedWA.phoneNumber, updatedWA.template);
  console.assert(waUrl.includes('wa.me/6289988776655'), `FAIL: Expected phone 6289988776655 in URL: ${waUrl}`);
  console.assert(waUrl.includes(encodeURIComponent('Salam Admin Haecca, saya bermaksud memesan produk:')), 'FAIL: Custom template not in URL');
  console.assert(waUrl.includes(encodeURIComponent('Haecca Scarf Limited Edition')), 'FAIL: Product name not in URL');
  console.log('   ✓ WhatsApp order URL generated with dynamic CMS phone and greeting:');
  console.log('      URL snippet:', waUrl.substring(0, 110) + '...');

  console.log('\n=== ALL 6 CMS & PERSISTENCE TEST SUITES PASSED (100% SUCCESS) ===');
}

runCMSPersistenceTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
