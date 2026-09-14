import { openDB } from './db.js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

// Provider mode detection
function isSupabaseMode() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DATA_PROVIDER) {
    return import.meta.env.VITE_DATA_PROVIDER.toLowerCase().trim() === 'supabase';
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_DATA_PROVIDER) {
    return process.env.VITE_DATA_PROVIDER.toLowerCase().trim() === 'supabase';
  }
  return false;
}

// Cache for Object URLs created from Blobs: Image ID -> Object URL
const urlCache = new Map();
// Reverse mapping: Object URL -> Image ID
const urlToIdMap = new Map();

// Supported MIME types
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const HAECCA_FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="%23FAF7F2"><rect width="600" height="800" fill="%23F4EFEB"/><text x="50%" y="48%" font-family="sans-serif" font-size="28" font-weight="600" fill="%238C6D58" text-anchor="middle">HAECCA HIJAB</text><text x="50%" y="54%" font-family="sans-serif" font-size="14" fill="%23A88B77" text-anchor="middle">Premium Modest Fashion</text></svg>';

/**
 * Validate an image file before upload
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImage(file) {
  if (!file) {
    return { valid: false, error: 'File tidak ditemukan.' };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes((file.type || '').toLowerCase())) {
    return {
      valid: false,
      error: `Format file "${file.type || 'unknown'}" tidak didukung. Harap unggah format JPG, PNG, atau WebP.`
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Ukuran file terlalu besar (${sizeMb} MB). Batas maksimum adalah 5 MB.`
    };
  }

  return { valid: true };
}

/**
 * Client-side image compression/resizing before storage
 * Resizes images exceeding maxDimension (e.g. 1600px) and compresses to WebP or JPEG Blob
 * @param {File} file 
 * @param {number} maxDimension 
 * @param {number} quality 
 * @returns {Promise<Blob>}
 */
export async function compressImage(file, maxDimension = 1600, quality = 0.85) {
  // If in environment without Image or window (e.g. Node tests), return original file
  if (typeof Image === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/webp';

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Resolves an active display URL or ID into its persistent database identifier.
 * This guarantees that ephemeral `blob:` URLs are NEVER persisted into the database.
 * @param {string} idOrUrl 
 * @returns {string}
 */
export function resolvePersistentId(idOrUrl) {
  if (!idOrUrl) return '';

  // If already an image ID, return it
  if (idOrUrl.startsWith('img_')) {
    return idOrUrl;
  }

  // If it's an active Blob URL in memory, translate back to its persistent image ID
  if (urlToIdMap.has(idOrUrl)) {
    return urlToIdMap.get(idOrUrl);
  }

  // If it's a stale blob URL not in memory, log warning
  if (idOrUrl.startsWith('blob:')) {
    console.warn(`[ImageStorage] Detected unmapped or stale blob URL: ${idOrUrl}`);
    return idOrUrl;
  }

  // Otherwise, it's a static path (/images/...) or external URL (https://...)
  return idOrUrl;
}

/**
 * Storage Abstraction: Upload image to storage
 * Compresses the image and stores the raw Blob into IndexedDB.
 * Registers active object URL in memory cache.
 * @param {File} file 
 * @returns {Promise<{ id: string, url: string, name: string, size: number, type: string }>}
 */
export async function uploadImage(file) {
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Compress image before saving
  const compressedBlob = await compressImage(file);

  // 1. SUPABASE MODE: Upload to Supabase Storage bucket 'hecca-media'
  if (isSupabaseMode() && isSupabaseConfigured) {
    const cleanFileName = (file.name || 'image')
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const storagePath = `products/${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${cleanFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hecca-media')
      .upload(storagePath, compressedBlob, {
        contentType: compressedBlob.type || file.type || 'image/webp',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[ImageStorage] Error uploading to Supabase Storage:', uploadError);
      throw new Error(`Gagal mengunggah foto ke Supabase Storage: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('hecca-media')
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData?.publicUrl || storagePath;

    return {
      id: publicUrl,
      url: publicUrl,
      name: file.name,
      size: compressedBlob.size,
      type: compressedBlob.type || file.type,
    };
  }

  // 2. INDEXEDDB MODE: Store compressed Blob in IndexedDB 'images' store
  const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const record = {
    id,
    name: file.name,
    type: compressedBlob.type || file.type,
    size: compressedBlob.size,
    blob: compressedBlob,
    createdAt: Date.now(),
  };

  const db = await openDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  // Generate active session Object URL and track bidirectionally
  let url = '';
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    url = URL.createObjectURL(compressedBlob);
    urlCache.set(id, url);
    urlToIdMap.set(url, id);
  } else {
    url = id;
  }

  return {
    id,
    url,
    name: file.name,
    size: compressedBlob.size,
    type: compressedBlob.type,
  };
}


/**
 * Retrieve the display URL for an image identifier, persistent ID, or external URL.
 * Automatically rehydrates Blobs from IndexedDB into active Object URLs on app reload.
 * @param {string} idOrUrl 
 * @returns {Promise<string>}
 */
export async function getImageUrl(idOrUrl) {
  if (!idOrUrl) return '';

  // 1. Static web assets or external HTTP URLs
  if (
    idOrUrl.startsWith('http://') ||
    idOrUrl.startsWith('https://') ||
    idOrUrl.startsWith('data:') ||
    idOrUrl.startsWith('/images/') ||
    idOrUrl.startsWith('/')
  ) {
    return idOrUrl;
  }

  // 2. Already active Blob URL currently tracked in memory
  if (idOrUrl.startsWith('blob:') && urlToIdMap.has(idOrUrl)) {
    return idOrUrl;
  }

  // 3. In-memory cache hit for this ID
  if (urlCache.has(idOrUrl)) {
    return urlCache.get(idOrUrl);
  }

  // 4. If ID starts with 'img_', load raw Blob from IndexedDB and rehydrate URL
  if (idOrUrl.startsWith('img_')) {
    try {
      const db = await openDB();
      const record = await new Promise((resolve, reject) => {
        const tx = db.transaction('images', 'readonly');
        const store = tx.objectStore('images');
        const req = store.get(idOrUrl);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (record && record.blob) {
        if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
          const freshUrl = URL.createObjectURL(record.blob);
          urlCache.set(idOrUrl, freshUrl);
          urlToIdMap.set(freshUrl, idOrUrl);
          return freshUrl;
        }
        return idOrUrl;
      } else {
        console.warn(`[ImageStorage] Image record not found in IndexedDB for ID: ${idOrUrl}`);
        return HAECCA_FALLBACK_IMAGE;
      }
    } catch (err) {
      console.error('[ImageStorage] Error fetching image from IndexedDB:', err);
      return HAECCA_FALLBACK_IMAGE;
    }
  }

  // 5. If an unmapped `blob:` URL is encountered, it was revoked when previous tab closed
  if (idOrUrl.startsWith('blob:')) {
    console.warn(`[ImageStorage] Stale revoked blob URL encountered: ${idOrUrl}`);
    return HAECCA_FALLBACK_IMAGE;
  }

  return idOrUrl;
}

/**
 * Delete an image by ID or URL (from Supabase Storage or IndexedDB)
 * @param {string} idOrUrl 
 * @returns {Promise<boolean>}
 */
export async function deleteImage(idOrUrl) {
  if (!idOrUrl) return false;

  // Supabase Storage URL deletion check
  if (isSupabaseMode() && isSupabaseConfigured && typeof idOrUrl === 'string' && idOrUrl.includes('/hecca-media/')) {
    try {
      const parts = idOrUrl.split('/hecca-media/');
      if (parts[1]) {
        const storagePath = decodeURIComponent(parts[1].split('?')[0]);
        const { error } = await supabase.storage.from('hecca-media').remove([storagePath]);
        if (error) {
          console.warn('[ImageStorage] Supabase Storage delete warning:', error.message);
        }
        return true;
      }
    } catch (err) {
      console.error('[ImageStorage] Supabase Storage delete error:', err);
      return false;
    }
  }

  const id = resolvePersistentId(idOrUrl);
  if (!id || !id.startsWith('img_')) return false;

  // Revoke active Object URL to prevent memory leaks
  if (urlCache.has(id)) {
    const activeUrl = urlCache.get(id);
    if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(activeUrl);
    }
    urlToIdMap.delete(activeUrl);
    urlCache.delete(id);
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}


/**
 * Clear in-memory URL caches (useful for testing session restarts)
 */
export function clearUrlCache() {
  urlCache.forEach((url) => {
    if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(url);
    }
  });
  urlCache.clear();
  urlToIdMap.clear();
}

