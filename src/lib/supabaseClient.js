import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration for Haecca Hijab
 * 
 * 🔒 SECURITY NOTICE:
 * This client strictly uses the modern Supabase Publishable Key (client-side anonymous key).
 * Secret keys (service_role, sb_secret_...) are NEVER used or imported into frontend code.
 */

// Safely retrieve environment variables across Vite (import.meta.env) and test runners (process.env)
const getEnvVar = (name) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return import.meta.env[name];
  }
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name];
  }
  return '';
};

export const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://imxtgcuzfjpwwsbmkxyl.supabase.co';
export const rawPublishableKey =
  getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  '';

// Check if a real publishable key has been configured (not empty or template placeholder)
const isKeyPlaceholder =
  !rawPublishableKey ||
  rawPublishableKey.includes('<THE_USER_WILL_PASTE_THE_PUBLISHABLE_KEY_LOCALLY>') ||
  rawPublishableKey.includes('your-supabase-publishable-key-here');

export const isSupabaseConfigured = Boolean(supabaseUrl && !isKeyPlaceholder);
export const supabasePublishableKey = isKeyPlaceholder ? '' : rawPublishableKey;

/**
 * Initialized Supabase Client instance
 */
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey || 'dummy-publishable-key-for-init',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: typeof window !== 'undefined',
    },
  }
);
