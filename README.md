# Haecca Hijab — Premium Modest Fashion E-Commerce & Full CMS

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Storage](https://img.shields.io/badge/Storage-IndexedDB_(Blob)-orange)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide_React-F56565)](https://lucide.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-mocha.svg)](LICENSE)

> **Haecca Hijab** is an editorial, production-ready e-commerce single-page application and lightweight Admin CMS built for a modern Indonesian hijab and modest fashion brand. Designed with a warm luxury neutral palette (cream, beige, soft mocha, deep espresso), mobile-first responsiveness (down to 360px), realistic Indonesian Rupiah (IDR) pricing, localized product specifications, persistent IndexedDB Blob image storage, dynamic store CMS management, and direct WhatsApp checkout integration.

---

## ✨ Features & User Experience

### 1. 🛍️ Public Storefront Experience
- **Editorial Design System**: Bespoke warm neutral color palette inspired by modest fashion boutiques, paired with clean, modern typography using **Plus Jakarta Sans** with refined weight hierarchy (400 body, 500 labels, 600 buttons/products, 700 headings) across all products, prices, tables, and transactional UI.
- **Interactive Product Catalog**:
  - Live search by product name, fabric material, and color.
  - Category filtering (*Hijab*, *Pashmina*, *Voal*, *Accessories*).
  - Price range filters (`< Rp 75.000`, `Rp 75.000 - Rp 100.000`, `> Rp 100.000`).
  - Sort by popularity, newest releases, price (low-to-high, high-to-low), and top customer ratings.
- **Rich Product Details & Mobile Swipe Gallery**:
  - Multi-angle gallery with touch swipe support on mobile, mouse drag on desktop, prev/next chevrons, floating image counter (`X / Y`), and thumbnail preview switcher.
  - Interactive color variant picker with real-time name indicators.
  - Validated stock stepper respecting inventory limits.
  - Editable star ratings (0.0 to 5.0) and review counters synced dynamically from CMS.
  - Accordions for fabric specifications, wash care, and warranty.
  - Refined CTAs: Primary *"Tambah ke Keranjang"* and secondary *"Beli Sekarang"*.
- **Cart & LocalStorage Persistence**:
  - Responsive vertical stack layout inside Cart Drawer preventing text clipping or item squishing.
  - Real-time free shipping progress bar.
  - Voucher coupons (`HAECCANEW`, `HAECCAFREESHIP`).
  - Slide-over quick cart drawer with optimistic updates.
- **Direct WhatsApp Checkout**:
  - Dynamic WhatsApp destination phone and greeting template linked directly to CMS settings.
  - Form validation for receiver name, phone, shipping address, and city.
  - Compiles itemized totals and order payload into a clean Indonesian message template.

---

### 2. ⚡ Admin Dashboard & Lightweight CMS (`/admin`)

An integrated management interface allowing store owners to manage products, photos, stock, and status without editing source code:

- **Demo Authentication**:
  - URL: `/admin/login`
  - Demo Username: `admin`
  - Demo Password: `hecca123`
  - *Clearly labeled as DEMO authentication for portfolio evaluation, architected to easily swap with Supabase Auth.*
- **Overview Dashboard**:
  - Key metrics: Total Products, Total Categories, Total In-Stock Units, and Low-Stock Alerts.
  - Low stock warning banner for products with inventory ≤ 10 pcs.
  - Recent products quick-edit table.
- **Product Management (CRUD)**:
  - Searchable, filterable table/grid view.
  - Add new products with full specifications, custom color swatches, pricing, rating, review count, and badges (*Best Seller*, *New Release*).
  - Edit existing product data with immediate storefront synchronization.
  - Visibility toggle (*Aktif / Draft*) to hide/show products on the public store.
  - Delete confirmation modal dialog.
- **Product Image Manager & Persistent Blob Storage**:
  - **Local Computer Upload**: Select from file picker or drag & drop.
  - **Client-Side Image Compression**: Automatic canvas-based optimization and resizing before saving.
  - **Blob Storage in IndexedDB**: Efficient binary storage using persistent image IDs (`img_...`) with automatic rehydration across page refreshes and browser restarts.
  - **Multi-Image Support**: Manage up to 8 high-resolution photos per product.
  - **Drag-and-Drop Reordering**: Rearrange thumbnails by dragging tiles or clicking arrow buttons.
  - **Primary Cover Selector**: One-click "Set as Primary" badge to designate the main storefront image.
  - **Replace & Lightbox**: Quick-replace individual images and inspect full-size photos in a modal lightbox.
  - **Confirmation Dialog**: Safe prompt before deleting individual images.
- **Content Management System (CMS)**:
  - **Homepage CMS**: Customise hero headline, subheading, badge, banner imagery, CTAs, and section visibility toggles.
  - **Banner & Promo CMS**: Manage announcement bar text, link, dismissibility, and promotional discounts.
  - **Navigation CMS**: Add, edit, reorder, and toggle navbar navigation items.
  - **Tentang Kami CMS**: Edit brand story, philosophy quotes, atelier studio address, and working hours.
  - **Footer CMS**: Update footer tagline, customer service contacts, social media URLs, copyright text, and admin link visibility.
  - **Store Settings CMS**: Manage store name, address, email, telephone, and free shipping minimum threshold.
  - **WhatsApp Checkout CMS**: Configure the destination WhatsApp number and order message greeting template.
  - **Kategori Toko**: Monitor product counts per category with quick-access links.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + Vite 6 | Lightning-fast reactive component UI |
| **Styling** | Tailwind CSS 3.4 | Custom luxury warm neutral palette & Plus Jakarta Sans typography |
| **Database & Images** | Native IndexedDB (`hecca_db` v2) | Offline-persistent storage for products, image Blobs & CMS settings |
| **Image Pipeline** | HTML Canvas API | Client-side compression, format conversion & resizing |
| **State Sync** | React Context (`ProductContext`, `CMSContext`) | Instant reactive data sync between Admin and Storefront |
| **Routing** | React Router DOM 7 | Isolated layouts for Storefront vs. Admin CMS |
| **Icons** | Lucide React | Clean, scalable SVG icon library |

---

## 📁 Project Directory Structure

```text
hecca-hijab/
├── public/
│   └── favicon.svg                 # Custom Haecca monogram SVG favicon
├── src/
│   ├── admin/                      # Admin CMS Module
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx     # Admin chrome with sidebar & demo header
│   │   │   ├── AdminRoute.jsx      # Authentication guard
│   │   │   ├── AdminSidebar.jsx    # Complete hierarchical CMS navigation menu
│   │   │   ├── AdminStatCard.jsx   # Metric card widget
│   │   │   ├── ImageManager.jsx    # Multi-upload, drag & drop, reorder, primary setter
│   │   │   └── ProductFormModal.jsx# Product creation & editing modal (with rating & reviews)
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.jsx     # Analytics overview & low stock alerts
│   │   │   ├── AdminLoginPage.jsx         # Demo login screen
│   │   │   ├── AdminProductsPage.jsx      # Filterable product management table
│   │   │   ├── AdminCategoriesPage.jsx    # Store categories overview
│   │   │   ├── AdminHomepageCMS.jsx       # Homepage hero & section visibility editor
│   │   │   ├── AdminAboutCMS.jsx          # About page story & studio editor
│   │   │   ├── AdminNavigationCMS.jsx     # Navbar items manager
│   │   │   ├── AdminBannerPromoCMS.jsx    # Announcement bar & promo editor
│   │   │   ├── AdminFooterCMS.jsx         # Footer branding & social links editor
│   │   │   ├── AdminStoreSettingsCMS.jsx  # Store profile & free shipping threshold
│   │   │   └── AdminWhatsAppCMS.jsx       # WhatsApp recipient & message template editor
│   │   └── services/
│   │       └── adminAuth.js        # Supabase-compatible demo auth provider
│   ├── components/
│   │   ├── common/                 # Reusable UI (Button, Badge, Input, Toast, RatingStars, etc.)
│   │   ├── layout/                 # Storefront layout (Navbar, Footer, AnnouncementBar, Drawer)
│   │   ├── product/                # ProductCard, ProductGrid, ProductFilter, ProductGallery
│   │   ├── cart/                   # CartDrawer, CartItemRow, CartSummary
│   │   └── checkout/               # CheckoutForm, OrderSummaryCard, WhatsAppOrderSuccessModal
│   ├── context/
│   │   ├── ProductContext.jsx      # Live reactive synchronization layer
│   │   ├── CMSContext.jsx          # Live CMS content synchronization layer
│   │   ├── CartContext.jsx         # Cart state & localStorage sync
│   │   ├── WishlistContext.jsx     # Wishlist state & localStorage sync
│   │   └── ToastContext.jsx        # App notification system
│   ├── services/
│   │   ├── db.js                   # IndexedDB initialization ('hecca_db' v2)
│   │   ├── cmsStorage.js           # CMS default configurations & IndexedDB CRUD
│   │   ├── imageStorage.js         # Blob upload, compression, caching & URL rehydration
│   │   └── productStorage.js       # Product CRUD & catalog auto-seeding
│   ├── hooks/
│   │   ├── useProducts.js
│   │   ├── useCart.js
│   │   └── useWishlist.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── utils/
│   │   ├── currency.js             # formatRupiah (IDR) formatter
│   │   ├── seo.js                  # Dynamic page title & meta descriptions
│   │   └── whatsapp.js             # WhatsApp message template builder & validator
│   ├── App.jsx                     # Layout routes & provider hierarchy
│   ├── index.css                   # Custom scrollbars & Plus Jakarta Sans typography
│   └── main.jsx                    # Application entry point
├── test_admin_cms.js               # Automated test suite for Admin CMS & Storage
├── test_cms_persistence.js         # Automated test suite for Blob rehydration & CMS
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm`

### Installation & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run automated test suites:**
   ```bash
   node test_admin_cms.js
   node test_cms_persistence.js
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Access the Admin CMS:**
   - Navigate to [http://localhost:5173/admin](http://localhost:5173/admin)
   - Log in with:
     - **Username**: `admin`
     - **Password**: `hecca123`

5. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🏷️ Test Data & Demo Vouchers

- **Admin Login**: `admin` / `hecca123`
- **Voucher Code: `HAECCANEW`** — 10% discount on entire order.
- **Voucher Code: `HAECCAFREESHIP`** — Free delivery on any order size.
- **Free Shipping Threshold**: Automatic free delivery on orders min. **Rp 250.000** (customizable in Admin CMS).
- **Official WhatsApp**: Configurable via Admin CMS (default: `6281234567890`).

---

## 📄 License

This project is created for portfolio presentation under the [MIT License](LICENSE).
