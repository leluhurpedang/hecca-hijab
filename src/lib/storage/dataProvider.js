/**
 * Data Provider Abstraction Layer for Haecca Hijab
 * 
 * 🔒 ARCHITECTURE RULE:
 * - Default provider is strictly IndexedDB (`indexeddb`).
 * - Supabase is only activated when explicitly requested via `VITE_DATA_PROVIDER=supabase`.
 * - If VITE_DATA_PROVIDER is undefined or anything other than 'supabase', it defaults to 'indexeddb'.
 * - Existing IndexedDB and CMS functionality is preserved 100% without modification.
 */

import * as indexedDbProducts from '../../services/productStorage.js';
import * as indexedDbSettings from '../../services/siteSettingsStorage.js';
import * as supabaseProducts from './supabaseProductStorage.js';
import * as supabaseSettings from './supabaseSiteSettingsStorage.js';
import { CATEGORIES as INITIAL_CATEGORIES } from '../../data/categories.js';
import { supabase, isSupabaseConfigured } from '../supabaseClient.js';

export { DEFAULT_SITE_SETTINGS, KEY_ALIASES } from '../../services/siteSettingsStorage.js';

// Detect configured provider safely across browser/Vite and Node runtime
const getProviderConfig = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DATA_PROVIDER) {
    return import.meta.env.VITE_DATA_PROVIDER.toLowerCase().trim();
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_DATA_PROVIDER) {
    return process.env.VITE_DATA_PROVIDER.toLowerCase().trim();
  }
  return 'indexeddb';
};

const rawProvider = getProviderConfig();

/**
 * Currently active data provider: 'indexeddb' | 'supabase'
 * Defaults strictly to 'indexeddb'.
 */
export const ACTIVE_DATA_PROVIDER = rawProvider === 'supabase' ? 'supabase' : 'indexeddb';
export const isSupabaseActive = ACTIVE_DATA_PROVIDER === 'supabase';
export const isIndexedDBActive = ACTIVE_DATA_PROVIDER === 'indexeddb';

/**
 * Return provider status information for UI presentation across the Admin CMS.
 * Centralized here to avoid duplicate logic across components.
 * @returns {{ name: string, badge: string, description: string, storage: string, isSupabase: boolean, isIndexedDB: boolean }}
 */
export function getProviderStatus() {
  if (isSupabaseActive) {
    return {
      name: 'Supabase',
      badge: 'Mode Produksi',
      description: 'Data & autentikasi menggunakan Supabase',
      storage: 'Supabase Storage',
      isSupabase: true,
      isIndexedDB: false,
    };
  }
  return {
    name: 'IndexedDB',
    badge: 'Mode Fallback (IndexedDB)',
    description: 'Data & autentikasi disimpan secara lokal menggunakan IndexedDB',
    storage: 'IndexedDB (Blob)',
    isSupabase: false,
    isIndexedDB: true,
  };
}

// Log provider status once on startup for debugging visibility
if (typeof window !== 'undefined') {
  console.info(`[Haecca DataProvider] Active data provider: ${ACTIVE_DATA_PROVIDER.toUpperCase()}`);
}

/* ==========================================================================
   PRODUCT OPERATIONS PROXY
   ========================================================================== */

/**
 * Retrieve all products from the active provider
 * @returns {Promise<Array<object>>}
 */
export async function getAllProducts() {
  if (isSupabaseActive) {
    return supabaseProducts.getProducts();
  }
  return indexedDbProducts.getAllProducts();
}

/**
 * Retrieve a single product by primary ID
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
export async function getProductById(id) {
  if (isSupabaseActive) {
    return supabaseProducts.getProductById(id);
  }
  const products = await indexedDbProducts.getAllProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * Retrieve a single product by unique slug
 * @param {string} slug 
 * @returns {Promise<object|null>}
 */
export async function getProductBySlug(slug) {
  if (isSupabaseActive) {
    return supabaseProducts.getProductBySlug(slug);
  }
  return indexedDbProducts.getProductBySlug(slug);
}

/**
 * Save or update a product in the active provider
 * @param {object} product 
 * @returns {Promise<object>}
 */
export async function saveProduct(product) {
  if (isSupabaseActive) {
    if (product.id) {
      // Check if product exists in Supabase
      const existing = await supabaseProducts.getProductById(product.id).catch(() => null);
      if (existing) {
        return supabaseProducts.updateProduct(product.id, product);
      }
    }
    return supabaseProducts.createProduct(product);
  }
  return indexedDbProducts.saveProduct(product);
}

/**
 * Delete a product by ID from the active provider
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export async function deleteProduct(id) {
  if (isSupabaseActive) {
    return supabaseProducts.deleteProduct(id);
  }
  return indexedDbProducts.deleteProduct(id);
}

/* ==========================================================================
   CATEGORY OPERATIONS PROXY
   ========================================================================== */

/**
 * Retrieve all categories from the active provider.
 * In Supabase mode: reads public.categories ordered by sort_order.
 * In IndexedDB mode: returns categories from src/data/categories.js.
 * Guaranteed: category values (slugs) remain 'voal', 'pashmina', 'hijab', 'accessories'.
 * @returns {Promise<Array<object>>}
 */
export async function getCategories() {
  if (isSupabaseActive && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('[Haecca DataProvider] Error reading categories from Supabase, falling back to static:', error.message);
        return INITIAL_CATEGORIES;
      }

      if (Array.isArray(data) && data.length > 0) {
        return data.map((row) => ({
          id: row.id, // UUID in Supabase
          slug: row.slug, // TEXT slug ('voal', 'pashmina', ...)
          name: row.name,
          description: row.description || '',
          image: row.image_url || '',
          imageUrl: row.image_url || '',
          sortOrder: row.sort_order ?? 1,
          isVisible: Boolean(row.is_visible ?? true),
        }));
      }
    } catch (err) {
      console.warn('[Haecca DataProvider] Unexpected error fetching categories:', err);
      return INITIAL_CATEGORIES;
    }
  }

  return INITIAL_CATEGORIES;
}

/* ==========================================================================
   SITE SETTINGS / CMS OPERATIONS PROXY
   ========================================================================== */

/**
 * Retrieve a single site setting module by key from the active provider
 * @param {string} key 
 * @returns {Promise<any>}
 */
export async function getSiteSetting(key) {
  if (isSupabaseActive) {
    return supabaseSettings.getSiteSetting(key);
  }
  return indexedDbSettings.getSiteSetting(key);
}

/**
 * Retrieve all 8 site setting modules from the active provider
 * @returns {Promise<Record<string, any>>}
 */
export async function getAllSiteSettings() {
  if (isSupabaseActive) {
    return supabaseSettings.getAllSiteSettings();
  }
  return indexedDbSettings.getAllSiteSettings();
}

/**
 * Save a site setting module to the active provider
 * @param {string} key 
 * @param {any} data 
 * @returns {Promise<any>}
 */
export async function saveSiteSetting(key, data) {
  if (isSupabaseActive) {
    return supabaseSettings.setSiteSetting(key, data);
  }
  return indexedDbSettings.saveSiteSetting(key, data);
}

/**
 * Delete a site setting module from the active provider
 * @param {string} key 
 * @returns {Promise<boolean>}
 */
export async function deleteSiteSetting(key) {
  if (isSupabaseActive) {
    return supabaseSettings.deleteSiteSetting(key);
  }
  return indexedDbSettings.deleteSiteSetting(key);
}

