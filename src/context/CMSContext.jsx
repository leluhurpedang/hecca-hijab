import React from 'react';
import {
  SiteSettingsProvider,
  useSiteSettings,
  SiteSettingsContext,
} from './SiteSettingsContext.jsx';

/**
 * Backward compatibility wrapper for CMSProvider and useCMS
 */
export function CMSProvider({ children }) {
  return <SiteSettingsProvider>{children}</SiteSettingsProvider>;
}

export function useCMS() {
  return useSiteSettings();
}

export { SiteSettingsContext as CMSContext };
