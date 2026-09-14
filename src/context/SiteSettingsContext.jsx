import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_SITE_SETTINGS,
  getAllSiteSettings,
  saveSiteSetting,
} from '../lib/storage/dataProvider.js';
import { useToast } from './ToastContext.jsx';

export const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    ...DEFAULT_SITE_SETTINGS,
    bannerPromo: DEFAULT_SITE_SETTINGS.announcementBar,
    storeSettings: DEFAULT_SITE_SETTINGS.store,
    whatsappSettings: DEFAULT_SITE_SETTINGS.whatsapp,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load all site settings on startup
  const refreshSiteSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const loaded = await getAllSiteSettings();
      setSettings((prev) => ({
        ...prev,
        ...loaded,
      }));
    } catch (err) {
      console.error('[SiteSettingsContext] Error loading settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSiteSettings();
  }, [refreshSiteSettings]);

  // Update a specific site settings module
  const updateSiteSetting = useCallback(
    async (moduleKey, data, successMessage) => {
      try {
        const saved = await saveSiteSetting(moduleKey, data);
        setSettings((prev) => {
          const updated = {
            ...prev,
            [moduleKey]: saved,
          };
          // Keep legacy aliases in sync
          if (moduleKey === 'announcementBar' || moduleKey === 'bannerPromo') {
            updated.announcementBar = saved;
            updated.bannerPromo = saved;
          }
          if (moduleKey === 'store' || moduleKey === 'storeSettings') {
            updated.store = saved;
            updated.storeSettings = saved;
          }
          if (moduleKey === 'whatsapp' || moduleKey === 'whatsappSettings') {
            updated.whatsapp = saved;
            updated.whatsappSettings = saved;
          }
          return updated;
        });

        if (showToast) {
          showToast(successMessage || 'Pengaturan berhasil disimpan! ✨', 'success');
        }
        return saved;
      } catch (err) {
        console.error(`[SiteSettingsContext] Error saving module "${moduleKey}":`, err);
        if (showToast) {
          showToast('Gagal menyimpan pengaturan: ' + err.message, 'error');
        }
        throw err;
      }
    },
    [showToast]
  );

  const value = {
    settings,
    siteSettings: settings,
    cms: settings, // Complete backward compatibility
    updateSiteSetting,
    updateCMS: updateSiteSetting, // Alias for backward compatibility
    refreshSiteSettings,
    refreshCMS: refreshSiteSettings, // Alias for backward compatibility
    isLoading,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
