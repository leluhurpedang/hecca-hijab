import { supabase, isSupabaseConfigured } from '../supabaseClient.js';
import { resolvePersistentId } from '../../services/imageStorage.js';

/**
 * Supabase Product Storage Module for Haecca Hijab
 * 
 * 🔒 ARCHITECTURE & SECURITY:
 * - Maps the existing Haecca ProductRecord structure to/from PostgreSQL columns.
 * - Respects JSONB columns for features, care_instructions, colors, and images.
 * - Returns clean, descriptive errors on failure without touching IndexedDB.
 */

/**
 * Convert a PostgreSQL row from Supabase into the standard Haecca ProductRecord format
 * @param {object} row 
 * @returns {object|null}
 */
export function fromSupabaseProduct(row) {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || '',
    category: row.category,
    categoryLabel: row.category_label || row.categoryLabel || '',
    price: Number(row.price || 0),
    originalPrice: row.original_price != null ? Number(row.original_price) : null,
    stock: Number(row.stock ?? 0),
    rating: Number(row.rating ?? 5.0),
    reviewCount: Number(row.review_count ?? 0),
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
    isVisible: Boolean(row.is_visible ?? true),
    material: row.material || '',
    dimensions: row.dimensions || '',
    finishing: row.finishing || '',
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : [],
    careInstructions: Array.isArray(row.care_instructions)
      ? row.care_instructions
      : (Array.isArray(row.careInstructions) ? row.careInstructions : []),
    colors: Array.isArray(row.colors) ? row.colors : [],
    images: Array.isArray(row.images) ? row.images : [],
    order: row.sort_order ?? row.order ?? 1,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
  };
}

/**
 * Convert a Haecca ProductRecord into the PostgreSQL column format for Supabase
 * @param {object} product 
 * @returns {object|null}
 */
export function toSupabaseProduct(product) {
  if (!product) return null;

  const nowIso = new Date().toISOString();
  const createdIso = product.createdAt ? new Date(product.createdAt).toISOString() : nowIso;
  const updatedIso = product.updatedAt ? new Date(product.updatedAt).toISOString() : nowIso;

  const rating =
    product.rating !== undefined && product.rating !== ''
      ? Math.min(5, Math.max(0, Math.round(Number(product.rating) * 10) / 10))
      : 5.0;

  const reviewCount =
    product.reviewCount !== undefined && product.reviewCount !== ''
      ? Math.max(0, Math.floor(Number(product.reviewCount)))
      : 0;

  const slug =
    product.slug ||
    (product.name
      ? product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      : '');

  return {
    id: product.id,
    slug,
    name: product.name,
    tagline: product.tagline || '',
    category: product.category,
    category_label: product.categoryLabel || product.category || '',
    price: Number(product.price || 0),
    original_price: product.originalPrice != null && product.originalPrice !== '' ? Number(product.originalPrice) : null,
    stock: Number(product.stock ?? 0),
    rating,
    review_count: reviewCount,
    is_new: Boolean(product.isNew),
    is_best_seller: Boolean(product.isBestSeller),
    is_visible: product.isVisible !== undefined ? Boolean(product.isVisible) : true,
    material: product.material || '',
    dimensions: product.dimensions || '',
    finishing: product.finishing || '',
    description: product.description || '',
    features: Array.isArray(product.features) ? product.features : [],
    care_instructions: Array.isArray(product.careInstructions)
      ? product.careInstructions
      : (Array.isArray(product.care_instructions) ? product.care_instructions : []),
    colors: Array.isArray(product.colors) ? product.colors : [],
    images: (Array.isArray(product.images) ? product.images : [])
      .map((img) => (typeof img === 'string' ? resolvePersistentId(img) : img))
      .filter((img) => typeof img === 'string' && !img.startsWith('blob:')),
    sort_order: product.order ?? 1,
    created_at: createdIso,
    updated_at: updatedIso,
  };
}

/**
 * Fetch all products from Supabase
 * @returns {Promise<Array<object>>}
 */
export async function getProducts() {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseProductStorage] Supabase is not configured. Missing valid publishable key or URL.');
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[SupabaseProductStorage] Error fetching products:', error);
    throw new Error(`[SupabaseProductStorage] Failed to fetch products: ${error.message} (${error.code || 'UNKNOWN'})`);
  }

  return (data || []).map(fromSupabaseProduct);
}

/**
 * Fetch a single product by primary ID
 * @param {string} id 
 * @returns {Promise<object|null>}
 */
export async function getProductById(id) {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseProductStorage] Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`[SupabaseProductStorage] Error fetching product id=${id}:`, error);
    throw new Error(`[SupabaseProductStorage] Failed to fetch product ${id}: ${error.message}`);
  }

  return data ? fromSupabaseProduct(data) : null;
}

/**
 * Fetch a single product by unique slug
 * @param {string} slug 
 * @returns {Promise<object|null>}
 */
export async function getProductBySlug(slug) {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseProductStorage] Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`[SupabaseProductStorage] Error fetching product slug=${slug}:`, error);
    throw new Error(`[SupabaseProductStorage] Failed to fetch product with slug ${slug}: ${error.message}`);
  }

  return data ? fromSupabaseProduct(data) : null;
}

/**
 * Create a new product in Supabase
 * @param {object} product 
 * @returns {Promise<object>}
 */
export async function createProduct(product) {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseProductStorage] Supabase is not configured.');
  }

  const payload = toSupabaseProduct(product);

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[SupabaseProductStorage] Error creating product:', error);
    throw new Error(`[SupabaseProductStorage] Failed to create product: ${error.message}`);
  }

  return fromSupabaseProduct(data);
}

/**
 * Update an existing product in Supabase
 * @param {string} id 
 * @param {object} product 
 * @returns {Promise<object>}
 */
export async function updateProduct(id, product) {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseProductStorage] Supabase is not configured.');
  }

  const payload = toSupabaseProduct({
    ...product,
    id,
    updatedAt: Date.now(),
  });

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[SupabaseProductStorage] Error updating product ${id}:`, error);
    throw new Error(`[SupabaseProductStorage] Failed to update product ${id}: ${error.message}`);
  }

  return fromSupabaseProduct(data);
}

/**
 * Delete a product by ID from Supabase
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export async function deleteProduct(id) {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseProductStorage] Supabase is not configured.');
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[SupabaseProductStorage] Error deleting product ${id}:`, error);
    throw new Error(`[SupabaseProductStorage] Failed to delete product ${id}: ${error.message}`);
  }

  return true;
}
