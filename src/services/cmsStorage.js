import { DEFAULT_SITE_SETTINGS, getSiteSetting, saveSiteSetting } from './siteSettingsStorage.js';

export const DEFAULT_CMS_DATA = {
  ...DEFAULT_SITE_SETTINGS,
  bannerPromo: DEFAULT_SITE_SETTINGS.announcementBar,
  storeSettings: DEFAULT_SITE_SETTINGS.store,
  whatsappSettings: DEFAULT_SITE_SETTINGS.whatsapp,
};

/**
 * Legacy wrapper: Get CMS content by key, backed by siteSettingsStorage
 */
export async function getCMSContent(key) {
  return getSiteSetting(key);
}

/**
 * Legacy wrapper: Save CMS content by key, backed by siteSettingsStorage
 */
export async function saveCMSContent(key, data) {
  return saveSiteSetting(key, data);
}
