import { openDB } from './db.js';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products.js';
import { getImageUrl, resolvePersistentId } from './imageStorage.js';

export async function ensureProductsSeeded() {
  const db = await openDB();

  const count = await new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  if (count === 0) {
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');

    for (const [index, p] of INITIAL_PRODUCTS.entries()) {
      const seededProduct = {
        ...p,
        rating: typeof p.rating === 'number' ? p.rating : 5.0,
        reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 0,
        isVisible: true,
        order: index + 1,
        createdAt: Date.now() - (INITIAL_PRODUCTS.length - index) * 10000,
        updatedAt: Date.now(),
      };
      store.put(seededProduct);
    }

    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    console.log('IndexedDB seeded with initial products catalog.');
  }
}

export async function hydrateProduct(product) {
  if (!product) return null;

  const rawImages = (product.images || []).map(resolvePersistentId);
  const resolvedImages = await Promise.all(rawImages.map((img) => getImageUrl(img)));

  return {
    ...product,
    rating: typeof product.rating === 'number' ? product.rating : 5.0,
    reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : 0,
    rawImages,
    images: resolvedImages,
  };
}

export async function getAllProducts() {
  await ensureProductsSeeded();
  const db = await openDB();

  const rawProducts = await new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });

  rawProducts.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));

  const hydrated = await Promise.all(rawProducts.map(hydrateProduct));
  return hydrated;
}

export async function getProductBySlug(slug) {
  await ensureProductsSeeded();
  const db = await openDB();

  const product = await new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const index = store.index('slug');
    const req = index.get(slug);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });

  return hydrateProduct(product);
}

export async function saveProduct(product) {
  const db = await openDB();

  // Convert any active blob URLs back to persistent image IDs (img_...) or static paths
  const persistentImages = (product.images || []).map((img) => resolvePersistentId(img));

  const rating =
    product.rating !== undefined && product.rating !== ''
      ? Math.min(5, Math.max(0, Math.round(Number(product.rating) * 10) / 10))
      : 5.0;

  const reviewCount =
    product.reviewCount !== undefined && product.reviewCount !== ''
      ? Math.max(0, Math.floor(Number(product.reviewCount)))
      : 0;

  const toSave = {
    ...product,
    rating,
    reviewCount,
    images: persistentImages,
    isVisible: product.isVisible !== undefined ? product.isVisible : true,
    updatedAt: Date.now(),
  };

  delete toSave.rawImages;

  if (!toSave.createdAt) {
    toSave.createdAt = Date.now();
  }

  if (!toSave.slug && toSave.name) {
    toSave.slug = toSave.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  await new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const req = store.put(toSave);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return hydrateProduct(toSave);
}

export async function deleteProduct(id) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
