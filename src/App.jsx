import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { CMSProvider } from './context/CMSContext';

import { ScrollToTop } from './components/layout/ScrollToTop';
import { StorefrontLayout } from './components/layout/StorefrontLayout';
import { ToastContainer } from './components/common/Toast';
import { supabase } from './lib/supabaseClient';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

// Admin CMS Pages & Route Guard
import { AdminRoute } from './admin/components/AdminRoute';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminProductsPage } from './admin/pages/AdminProductsPage';
import { AdminCategoriesPage } from './admin/pages/AdminCategoriesPage';
import { AdminHomepageCMS } from './admin/pages/AdminHomepageCMS';
import { AdminAboutCMS } from './admin/pages/AdminAboutCMS';
import { AdminNavigationCMS } from './admin/pages/AdminNavigationCMS';
import { AdminBannerPromoCMS } from './admin/pages/AdminBannerPromoCMS';
import { AdminFooterCMS } from './admin/pages/AdminFooterCMS';
import { AdminStoreSettingsCMS } from './admin/pages/AdminStoreSettingsCMS';
import { AdminWhatsAppCMS } from './admin/pages/AdminWhatsAppCMS';

/**
 * Global Recovery Listener
 * Ensures that if a user clicks a recovery link landing on any page (e.g. root /),
 * they are seamlessly forwarded to /reset-password with token context preserved.
 */
function AuthRecoveryListener() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      if (hash.includes('type=recovery') || hash.includes('error_code=otp_expired')) {
        if (location.pathname !== '/reset-password') {
          navigate('/reset-password' + hash, { replace: true });
        }
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (window.location.pathname !== '/reset-password') {
          navigate('/reset-password', { replace: true });
        }
      }
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, [navigate, location]);

  return null;
}

export function App() {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <ProductProvider>
            <CMSProvider>
              <BrowserRouter>
                <ScrollToTop />
                <AuthRecoveryListener />

                <Routes>
                  {/* Public Storefront Layout (includes Navbar, AnnouncementBar, Footer, CartDrawer) */}
                  <Route element={<StorefrontLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Public Auth Routes */}
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminRoute>
                        <AdminProductsPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <AdminRoute>
                        <AdminCategoriesPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/homepage"
                    element={
                      <AdminRoute>
                        <AdminHomepageCMS />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/about"
                    element={
                      <AdminRoute>
                        <AdminAboutCMS />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/navigation"
                    element={
                      <AdminRoute>
                        <AdminNavigationCMS />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/banner-promo"
                    element={
                      <AdminRoute>
                        <AdminBannerPromoCMS />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/footer"
                    element={
                      <AdminRoute>
                        <AdminFooterCMS />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <AdminRoute>
                        <AdminStoreSettingsCMS />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/whatsapp"
                    element={
                      <AdminRoute>
                        <AdminWhatsAppCMS />
                      </AdminRoute>
                    }
                  />
                </Routes>

                <ToastContainer />
              </BrowserRouter>
            </CMSProvider>
          </ProductProvider>
        </CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}

export default App;
