import { isSupabaseActive } from '../../lib/storage/dataProvider.js';
import { supabase } from '../../lib/supabaseClient.js';

/**
 * AUTHENTICATION SERVICE FOR HAECCA HIJAB ADMIN CMS
 * 
 * 🔒 ARCHITECTURE & SECURITY:
 * - When VITE_DATA_PROVIDER=indexeddb (default):
 *   Uses the client-side demo authentication service with sessionStorage for local development.
 * - When VITE_DATA_PROVIDER=supabase:
 *   Uses live Supabase Auth (supabase.auth.signInWithPassword) to establish a real session.
 *   auth.uid() is populated so public.is_admin() authorizes admin writes via RLS.
 */

const STORAGE_KEY = 'hecca_admin_demo_session';
const listeners = new Set();

const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'hecca123',
};

// Cached active session for synchronous route guard checks in Supabase mode
let activeSupabaseSession = null;
let isRecoverySessionActive = false;

// Initialize Supabase session listener if running in browser
if (typeof window !== 'undefined' && supabase?.auth) {
  supabase.auth.getSession().then(({ data }) => {
    activeSupabaseSession = data?.session || null;
  }).catch((err) => {
    console.warn('[AdminAuth] Could not restore Supabase session on init:', err);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    activeSupabaseSession = session;
    if (event === 'PASSWORD_RECOVERY') {
      isRecoverySessionActive = true;
    } else if (event === 'SIGNED_OUT') {
      isRecoverySessionActive = false;
    }
    if (isSupabaseActive) {
      notify(event, session);
    }
  });
}

function notify(event, session) {
  listeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (err) {
      console.error('Auth state change listener error:', err);
    }
  });
}

export const adminAuth = {
  /**
   * Log in with username/email and password
   * @param {{ username?: string, email?: string, password: string }} credentials 
   * @returns {Promise<{ data: { user: object, session: object } | null, error: Error | null }>}
   */
  async signInWithPassword({ username, email, password }) {
    // -------------------------------------------------------------
    // SUPABASE MODE: Live Supabase Auth
    // -------------------------------------------------------------
    if (isSupabaseActive) {
      try {
        const rawIdentifier = (email || username || '').trim();
        const targetEmail = rawIdentifier.includes('@')
          ? rawIdentifier
          : (rawIdentifier.toLowerCase() === 'admin' ? 'admin@haeccahijab.com' : `${rawIdentifier}@haeccahijab.com`);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: targetEmail,
          password: password || '',
        });

        if (error) {
          return {
            data: null,
            error: new Error(error.message || 'Login admin gagal. Periksa kembali email dan kata sandi.'),
          };
        }

        activeSupabaseSession = data.session;
        notify('SIGNED_IN', data.session);

        return {
          data: {
            user: data.user,
            session: data.session,
          },
          error: null,
        };
      } catch (err) {
        return {
          data: null,
          error: new Error('Terjadi kendala saat autentikasi ke Supabase: ' + err.message),
        };
      }
    }

    // -------------------------------------------------------------
    // INDEXEDDB MODE: Demo in-memory / sessionStorage Auth
    // -------------------------------------------------------------
    await new Promise((res) => setTimeout(res, 200));

    if (
      (username || email || '').trim().toLowerCase() === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password
    ) {
      const user = {
        id: 'usr_hecca_admin_01',
        username: 'admin',
        email: 'admin@haeccahijab.com',
        role: 'store_owner',
        name: 'Admin Haecca Hijab',
      };

      const session = {
        access_token: 'demo_token_' + Date.now(),
        token_type: 'bearer',
        expires_at: Date.now() + 24 * 60 * 60 * 1000,
        user,
      };

      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        }
      } catch (e) {
        console.error('Failed to write auth session to sessionStorage', e);
      }

      notify('SIGNED_IN', session);
      return { data: { user, session }, error: null };
    }

    return {
      data: null,
      error: new Error('Username atau password salah. Silakan gunakan kredensial demo: admin / hecca123'),
    };
  },

  /**
   * Sign out current admin
   * @returns {Promise<{ error: Error | null }>}
   */
  async signOut() {
    isRecoverySessionActive = false;
    if (isSupabaseActive) {
      try {
        const { error } = await supabase.auth.signOut();
        activeSupabaseSession = null;
        notify('SIGNED_OUT', null);
        return { error: error ? new Error(error.message) : null };
      } catch (err) {
        return { error: new Error(err.message) };
      }
    }

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to clear session', e);
    }

    notify('SIGNED_OUT', null);
    return { error: null };
  },

  /**
   * Request password recovery email
   * @param {string} email 
   * @returns {Promise<{ data: object | null, error: Error | null }>}
   */
  async resetPasswordForEmail(email) {
    if (isSupabaseActive) {
      try {
        const targetEmail = (email || '').trim() || 'admin@haeccahijab.com';
        const redirectTo = typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined;

        const { data, error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
          redirectTo,
        });

        if (error) {
          return { data: null, error: new Error(error.message) };
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: new Error(err.message) };
      }
    }

    // IndexedDB fallback mode:
    return {
      data: { message: 'Demo mode active. Demo password is: hecca123' },
      error: null,
    };
  },

  /**
   * Update password for user with active recovery session
   * @param {string} newPassword 
   * @returns {Promise<{ data: object | null, error: Error | null }>}
   */
  async updateUserPassword(newPassword) {
    if (isSupabaseActive) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          return { data: null, error: new Error(error.message) };
        }
        isRecoverySessionActive = false;
        return { data, error: null };
      } catch (err) {
        return { data: null, error: new Error(err.message) };
      }
    }

    // IndexedDB fallback mode:
    return { data: { success: true }, error: null };
  },

  /**
   * Check whether active session is in password recovery mode
   * @returns {boolean}
   */
  isRecoveryMode() {
    return isRecoverySessionActive;
  },

  /**
   * Get active session
   * @returns {{ access_token: string, user: object } | null}
   */
  getSession() {
    if (isSupabaseActive) {
      return activeSupabaseSession;
    }

    try {
      if (typeof sessionStorage === 'undefined') return null;
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed && parsed.expires_at && parsed.expires_at > Date.now()) {
        return parsed;
      }
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Get active user profile
   * @returns {object | null}
   */
  getUser() {
    const session = this.getSession();
    return session ? session.user : null;
  },

  /**
   * Synchronous check if admin is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getSession() !== null;
  },

  /**
   * Listen for login / logout state changes
   * @param {(event: 'SIGNED_IN' | 'SIGNED_OUT', session: object | null) => void} callback 
   * @returns {{ unsubscribe: () => void }}
   */
  onAuthStateChange(callback) {
    listeners.add(callback);
    return {
      unsubscribe: () => {
        listeners.delete(callback);
      },
    };
  },
};

