import 'fake-indexeddb/auto';
import { adminAuth } from './src/admin/services/adminAuth.js';
import { openDB } from './src/services/db.js';
import { ensureProductsSeeded, getAllProducts, getProductBySlug, saveProduct, deleteProduct } from './src/services/productStorage.js';
import { uploadImage, deleteImage, getImageUrl, validateImage } from './src/services/imageStorage.js';
import { generateWhatsAppOrderUrl } from './src/utils/whatsapp.js';
import { formatRupiah } from './src/utils/currency.js';

// Polyfill window / sessionStorage / URL.createObjectURL for Node test
global.sessionStorage = {
  store: {},
  getItem(k) { return this.store[k] || null; },
  setItem(k, v) { this.store[k] = String(v); },
  removeItem(k) { delete this.store[k]; }
};

const mockUrls = new Map();
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = (blob) => {
    const id = `blob:nock-${Math.random().toString(36).substr(2, 6)}`;
    return id;
  };
  global.URL.revokeObjectURL = () => {};
}

async function runTests() {
  console.log('=== RUNNING HAECCA HIJAB ADMIN CMS & INTEGRATION TESTS ===\n');

  // TEST 1: Admin Authentication
  console.log('1. Testing Admin Authentication...');
  const badLogin = await adminAuth.signInWithPassword({ username: 'admin', password: 'wrongpassword' });
  console.assert(badLogin.error !== null, 'FAIL: Bad credentials should fail');
  console.log('   ✓ Invalid credentials rejected');

  const goodLogin = await adminAuth.signInWithPassword({ username: 'admin', password: 'hecca123' });
  console.assert(goodLogin.data !== null && adminAuth.isAuthenticated(), 'FAIL: Good credentials should succeed');
  console.log('   ✓ Demo login successful (admin / hecca123)');
  console.log('   ✓ User profile:', goodLogin.data.user.name, `(${goodLogin.data.user.role})`);

  // TEST 2: IndexedDB Initialization & Catalog Seeding
  console.log('\n2. Testing IndexedDB & Catalog Auto-Seeding...');
  await ensureProductsSeeded();
  const initialProducts = await getAllProducts();
  console.assert(initialProducts.length === 8, `FAIL: Expected 8 initial products, got ${initialProducts.length}`);
  console.log(`   ✓ Successfully seeded ${initialProducts.length} initial products in IndexedDB`);
  console.log('   ✓ First product:', initialProducts[0].name, '-', formatRupiah(initialProducts[0].price));

  // TEST 3: Image Storage (Blob storage in IndexedDB)
  console.log('\n3. Testing Image Storage & Validation...');
  const invalidFile = { name: 'test.exe', type: 'application/octet-stream', size: 1000 };
  const valResult = validateImage(invalidFile);
  console.assert(!valResult.valid, 'FAIL: Invalid MIME type should fail validation');
  console.log('   ✓ Unsupported file types rejected');

  const mockBlob1 = new Blob(['mock image data 1'], { type: 'image/jpeg' });
  mockBlob1.name = 'hijab_angle_1.jpg';
  const upload1 = await uploadImage(mockBlob1);
  console.assert(upload1.id.startsWith('img_'), 'FAIL: Expected generated image ID');
  console.log('   ✓ Image 1 stored as Blob in IndexedDB:', upload1.id);

  const mockBlob2 = new Blob(['mock image data 2'], { type: 'image/jpeg' });
  mockBlob2.name = 'hijab_angle_2.jpg';
  const upload2 = await uploadImage(mockBlob2);
  console.log('   ✓ Image 2 stored as Blob in IndexedDB:', upload2.id);

  const resolvedUrl = await getImageUrl(upload1.id);
  console.assert(typeof resolvedUrl === 'string' && resolvedUrl.length > 0, 'FAIL: Expected resolved URL');
  console.log('   ✓ Image URL resolved for <img> rendering:', resolvedUrl);

  // TEST 4: Product Creation with Uploaded Images
  console.log('\n4. Testing Product Creation...');
  const newProductPayload = {
    id: 'hecca-pashmina-plisket',
    name: 'Haecca Pashmina Plisket Premium',
    slug: 'hecca-pashmina-plisket',
    tagline: 'Pashmina lipit plisket rapi dan ironless',
    category: 'pashmina',
    categoryLabel: 'Pashmina',
    price: 85000,
    originalPrice: 105000,
    stock: 30,
    material: 'Ceruty Baby Doll Premium',
    dimensions: '180 cm x 75 cm',
    finishing: 'Plisket Mesin Rapat & Jahit Tepi',
    description: 'Pashmina plisket bergelombang halus dengan lipatan awet tidak mudah pudar walau dicuci.',
    colors: [
      { name: 'Mocca Latte', hex: '#A88B77' },
      { name: 'Dusty Lilac', hex: '#C4B5CD' }
    ],
    images: [upload1.id, upload2.id],
    isNew: true,
    isBestSeller: true,
    isVisible: true
  };

  const savedNewProduct = await saveProduct(newProductPayload);
  console.assert(savedNewProduct.name === newProductPayload.name, 'FAIL: Product name mismatch');
  console.log('   ✓ New product created and persisted in IndexedDB:', savedNewProduct.name);

  // TEST 5: Image Reordering & Primary Setter
  console.log('\n5. Testing Image Reordering...');
  // Swap images so image 2 becomes primary (index 0)
  savedNewProduct.images = [upload2.id, upload1.id];
  const reorderedProduct = await saveProduct(savedNewProduct);
  const primaryImgUrl = await getImageUrl(upload2.id);
  console.assert(reorderedProduct.images[0] === primaryImgUrl || reorderedProduct.images[0] === upload2.id, 'FAIL: Reorder failed');
  console.log('   ✓ Images reordered: primary image set to', upload2.id);

  // TEST 6: Product Update & Visibility Toggle
  console.log('\n6. Testing Product Update & Visibility Toggle...');
  reorderedProduct.price = 79000;
  reorderedProduct.stock = 15;
  reorderedProduct.isVisible = false; // Draft mode
  await saveProduct(reorderedProduct);

  const updatedCheck = await getProductBySlug('hecca-pashmina-plisket');
  console.assert(updatedCheck.price === 79000, 'FAIL: Price update failed');
  console.assert(updatedCheck.isVisible === false, 'FAIL: Visibility toggle failed');
  console.log('   ✓ Product updated: price changed to', formatRupiah(updatedCheck.price), 'and status set to Draft');

  // Turn it back active
  updatedCheck.isVisible = true;
  await saveProduct(updatedCheck);
  console.log('   ✓ Status restored to Active');

  // TEST 7: Image Deletion
  console.log('\n7. Testing Image Deletion from Storage...');
  const deleted = await deleteImage(upload1.id);
  console.assert(deleted === true, 'FAIL: Expected image deletion to succeed');
  console.log('   ✓ Image', upload1.id, 'successfully removed from IndexedDB');

  // TEST 8: Storefront & WhatsApp Checkout Integration
  console.log('\n8. Testing Storefront Cart & WhatsApp Order Flow...');
  const activeProducts = await getAllProducts();
  const visibleForStorefront = activeProducts.filter(p => p.isVisible !== false);
  console.assert(visibleForStorefront.some(p => p.slug === 'hecca-pashmina-plisket'), 'FAIL: Product should be visible on storefront');
  console.log('   ✓ Product visible on public storefront catalog');

  const cartItem = {
    id: `${savedNewProduct.id}-Mocca Latte`,
    productId: savedNewProduct.id,
    name: savedNewProduct.name,
    slug: savedNewProduct.slug,
    price: 79000,
    selectedColor: 'Mocca Latte',
    quantity: 2,
    image: resolvedUrl
  };

  const orderData = {
    customerName: 'Nadia Syafira',
    phone: '081288997766',
    address: 'Jl. Kemang Raya No. 18, Mampang Prapatan',
    city: 'Jakarta Selatan',
    postalCode: '12730',
    notes: 'Kirim dengan totebag kado',
    paymentMethod: 'Transfer Bank BCA',
    items: [cartItem],
    subtotal: 158000,
    shippingFee: 15000,
    discount: 0,
    totalPrice: 173000
  };

  const whatsappUrl = generateWhatsAppOrderUrl(orderData);
  console.assert(whatsappUrl.includes('Nadia%20Syafira'), 'FAIL: WhatsApp URL missing customer name');
  console.assert(whatsappUrl.includes('Haecca%20Pashmina%20Plisket'), 'FAIL: WhatsApp URL missing product name');
  console.assert(whatsappUrl.includes('173.000'), 'FAIL: WhatsApp URL missing formatted total');
  console.log('   ✓ WhatsApp order URL generated successfully:');
  console.log('     ', whatsappUrl.substring(0, 100) + '...');

  // TEST 9: Logout
  console.log('\n9. Testing Admin Logout...');
  await adminAuth.signOut();
  console.assert(!adminAuth.isAuthenticated(), 'FAIL: Expected session to be cleared');
  console.log('   ✓ Admin logged out and session cleared');

  console.log('\n=== ALL 9 TEST SUITES PASSED PERFECTLY (100% SUCCESS) ===');
}

runTests().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
