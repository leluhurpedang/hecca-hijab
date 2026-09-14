import { supabase, isSupabaseConfigured } from '../supabaseClient.js';
import { DEFAULT_SITE_SETTINGS, KEY_ALIASES } from '../../services/siteSettingsStorage.js';

/**
 * Supabase Site Settings Storage Module for Haecca Hijab
 * 
 * 🔒 ARCHITECTURE & SECURITY:
 * - Reads and writes all 8 Haecca business modules directly to Supabase table `site_settings`.
 * - Seamlessly preserves legacy aliases (bannerPromo, storeSettings, whatsappSettings).
 * - Falls back to DEFAULT_SITE_SETTINGS if rows are not yet present in Supabase.
 * - Read-safe error handling: network or DB errors return fallback defaults without crashing.
 */

/**
 * Normalize any key to its canonical siteSettings key
 * @param {string} key 
 * @returns {string}
 */
export function normalizeSettingKey(key) {
  if (DEFAULT_SITE_SETTINGS[key]) return key;
  if (KEY_ALIASES[key] && DEFAULT_SITE_SETTINGS[KEY_ALIASES[key]]) return KEY_ALIASES[key];
  return key;
}

/**
 * Retrieve a single site setting by key from Supabase
 * @param {string} key 
 * @returns {Promise<any>}
 */
export async function getSiteSetting(key) {
  const canonicalKey = normalizeSettingKey(key);
  const fallback = DEFAULT_SITE_SETTINGS[canonicalKey] || DEFAULT_SITE_SETTINGS[key] || null;

  if (!isSupabaseConfigured) {
    return fallback;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, data, updated_at')
      .eq('key', canonicalKey)
      .maybeSingle();

    if (error) {
      console.warn(`[SupabaseSiteSettings] Could not load key "${key}":`, error.message);
      return fallback;
    }

    if (data && data.data) {
      if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
        return { ...fallback, ...data.data, key: canonicalKey };
      }
      return data.data;
    }

    return fallback;
  } catch (err) {
    console.error(`[SupabaseSiteSettings] Unexpected error reading key "${key}":`, err);
    return fallback;
  }
}

/**
 * Retrieve all 8 site setting modules from Supabase in a single query
 * Merges loaded data with DEFAULT_SITE_SETTINGS and attaches legacy aliases.
 * @returns {Promise<Record<string, any>>}
 */
export async function getAllSiteSettings() {
  const results = {};
  const defaultKeys = Object.keys(DEFAULT_SITE_SETTINGS);

  // Initialize with complete defaults
  for (const k of defaultKeys) {
    results[k] = { ...DEFAULT_SITE_SETTINGS[k] };
  }

  if (!isSupabaseConfigured) {
    // Attach aliases
    results.bannerPromo = results.announcementBar;
    results.storeSettings = results.store;
    results.whatsappSettings = results.whatsapp;
    return results;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, data, updated_at');

    if (error) {
      console.warn('[SupabaseSiteSettings] Error fetching all site settings:', error.message);
    } else if (Array.isArray(data)) {
      for (const row of data) {
        if (row && row.key && row.data) {
          const fallback = DEFAULT_SITE_SETTINGS[row.key] || {};
          if (typeof fallback === 'object' && !Array.isArray(fallback)) {
            results[row.key] = { ...fallback, ...row.data, key: row.key };
          } else {
            results[row.key] = row.data;
          }
        }
      }
    }
  } catch (err) {
    console.error('[SupabaseSiteSettings] Unexpected error in getAllSiteSettings:', err);
  }

  // Synchronize legacy aliases for full backward compatibility
  results.bannerPromo = results.announcementBar;
  results.storeSettings = results.store;
  results.whatsappSettings = results.whatsapp;

  return results;
}

/**
 * Set or update a site setting in Supabase
 * @param {string} key 
 * @param {any} data 
 * @returns {Promise<any>}
 */
export async function setSiteSetting(key, data) {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseSiteSettings] Supabase is not configured. Cannot write setting.');
  }

  const canonicalKey = normalizeSettingKey(key);

  const payload = {
    key: canonicalKey,
    data: data,
    updated_at: new Date().toISOString(),
  };

  const { data: record, error } = await supabase
    .from('site_settings')
    .upsert(payload, { onConflict: 'key' })
    .select('key, data, updated_at')
    .single();

  if (error) {
    console.error(`[SupabaseSiteSettings] Error saving key "${canonicalKey}":`, error);
    throw new Error(`[SupabaseSiteSettings] Failed to save setting "${key}": ${error.message}`);
  }

  return record?.data || data;
}

/**
 * Delete a site setting by key from Supabase
 * @param {string} key 
 * @returns {Promise<boolean>}
 */
export async function deleteSiteSetting(key) {
  if (!isSupabaseConfigured) {
    throw new Error('[SupabaseSiteSettings] Supabase is not configured.');
  }

  const canonicalKey = normalizeSettingKey(key);

  const { error } = await supabase
    .from('site_settings')
    .delete()
    .eq('key', canonicalKey);

  if (error) {
    console.error(`[SupabaseSiteSettings] Error deleting key "${canonicalKey}":`, error);
    throw new Error(`[SupabaseSiteSettings] Failed to delete setting "${key}": ${error.message}`);
  }

  return true;
}
