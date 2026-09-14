# STAGE 4B.1 SUPABASE DATA LAYER READ-ONLY AUDIT
**Project:** Haecca Hijab E-Commerce & CMS  
**Date:** 2026-09-14  
**Audit Scope:** Full Data Layer, Abstraction Architecture, Schema Mappings, Security, and Supabase Readiness  
**Target Provider:** `VITE_DATA_PROVIDER=supabase`  
**Current Active Provider:** `VITE_DATA_PROVIDER=indexeddb` (Unchanged)  

---

## Executive Summary

Stage 4A database migration successfully populated the live Supabase PostgreSQL instance:
- `public.categories`: **4 rows** (`voal`, `pashmina`, `hijab`, `accessories`)
- `public.products`: **8 rows**
- `public.site_settings`: **8 rows**
- Product slug duplicates: **0 rows**

This read-only audit evaluated whether the application codebase is prepared to switch from `VITE_DATA_PROVIDER=indexeddb` to `VITE_DATA_PROVIDER=supabase`. 

The audit reveals that while the low-level Supabase data access modules (`supabaseProductStorage.js` and `supabaseSiteSettingsStorage.js`) map data accurately with 100% field fidelity, **the application as a whole is NOT READY** for the switch. Two **BLOCKER** architectural defects and two **HIGH** severity media storage gaps prevent production cutover.

---

## A. Current Architecture

The codebase currently contains three distinct architectural layers:

```
[ Storefront & Admin UI Pages ]
               │
               ▼
[ Context Layer ]
  ├── ProductContext.jsx        (Hardcoded to src/services/productStorage.js)
  └── SiteSettingsContext.jsx   (Hardcoded to src/services/siteSettingsStorage.js)
               │
               ▼
[ Storage Services Layer ]
  ├── productStorage.js         (IndexedDB direct access via db.js)
  ├── siteSettingsStorage.js    (IndexedDB direct access via db.js)
  └── imageStorage.js           (IndexedDB direct Blob store 'images')

[ UNUSED / ISOLATED ABSTRACTION LAYER ]
  └── dataProvider.js           (Switches between IndexedDB & Supabase modules)
        ├── supabaseProductStorage.js
        └── supabaseSiteSettingsStorage.js
              └── supabaseClient.js (Supabase JS SDK v2.116.0)
```

1. **Customer Storefront (`/`, `/shop`, `/product/:slug`, `/cart`, `/checkout`, `/about`)**:
   Consumes `useProducts()` and `useSiteSettings()` / `useCMS()`.
2. **Admin CMS (`/admin/*`)**:
   Consumes `useProducts()`, `useCMS()`, and `adminAuth.js`.
3. **Data Provider Abstraction (`src/lib/storage/dataProvider.js`)**:
   Built to conditionally switch providers based on `VITE_DATA_PROVIDER`, but currently **orphaned** (not imported anywhere in the UI or Context tree).

---

## B. Files Inspected

| Category | File Path | Status / Role |
| :--- | :--- | :--- |
| **Client** | `src/lib/supabaseClient.js` | Uses publishable key; correctly configured for client-side queries |
| **Provider** | `src/lib/storage/dataProvider.js` | Dual-mode proxy; currently disconnected from Contexts |
| **Supabase Data Layer** | `src/lib/storage/supabaseProductStorage.js` | Bi-directional mapper (`fromSupabaseProduct`, `toSupabaseProduct`) |
| **Supabase Data Layer** | `src/lib/storage/supabaseSiteSettingsStorage.js` | Site settings loader & upsert mapper with legacy alias support |
| **IndexedDB Data Layer** | `src/services/productStorage.js` | Local IndexedDB products store (`products`) |
| **IndexedDB Data Layer** | `src/services/siteSettingsStorage.js` | Local IndexedDB site settings store (`siteSettings` & `cms`) |
| **IndexedDB Data Layer** | `src/services/cmsStorage.js` | Legacy wrapper over `siteSettingsStorage.js` |
| **IndexedDB Core** | `src/services/db.js` | IndexedDB initialization (`hecca_db` v3) |
| **Image Storage** | `src/services/imageStorage.js` | Client-side compression & IndexedDB Blob storage (`images` store) |
| **React Context** | `src/context/ProductContext.jsx` | Product state provider; hardcoded to `productStorage.js` |
| **React Context** | `src/context/SiteSettingsContext.jsx` | CMS state provider; hardcoded to `siteSettingsStorage.js` |
| **React Context** | `src/context/CMSContext.jsx` | Compatibility wrapper around `SiteSettingsContext` |
| **Hooks** | `src/hooks/useProducts.js` | Re-exports `useProducts` from `ProductContext` |
| **Hooks** | `src/hooks/useSiteSettings.js` | Hook for `SiteSettingsContext` |
| **Admin Auth** | `src/admin/services/adminAuth.js` | Client-side demo mock session (`sessionStorage`); disconnected from Supabase Auth |
| **Admin UI** | `src/admin/components/ProductFormModal.jsx` | Product create/edit modal |
| **Admin UI** | `src/admin/components/ImageManager.jsx` | Multi-image manager; hardcoded to `imageStorage.js` |
| **Admin UI** | `src/admin/components/CMSImageUploader.jsx` | Single-image banner uploader; hardcoded to `imageStorage.js` |
| **Admin UI** | `src/admin/pages/AdminCategoriesPage.jsx` | Reads hardcoded `src/data/categories.js` |
| **Config** | `package.json` | Includes `@supabase/supabase-js: ^2.116.0` |
| **Config** | `.env.example` | Template with `VITE_DATA_PROVIDER=indexeddb` |
| **Config** | `.gitignore` | Ignores `.env.local` and `*.local` |

---

## C. Provider Selection Mechanism

- **Implementation**: Defined in `src/lib/storage/dataProvider.js`:
  ```javascript
  const getProviderConfig = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_DATA_PROVIDER) {
      return import.meta.env.VITE_DATA_PROVIDER.toLowerCase().trim();
    }
    if (typeof process !== 'undefined' && process.env && process.env.VITE_DATA_PROVIDER) {
      return process.env.VITE_DATA_PROVIDER.toLowerCase().trim();
    }
    return 'indexeddb';
  };
  export const ACTIVE_DATA_PROVIDER = rawProvider === 'supabase' ? 'supabase' : 'indexeddb';
  export const isSupabaseActive = ACTIVE_DATA_PROVIDER === 'supabase';
  export const isIndexedDBActive = ACTIVE_DATA_PROVIDER === 'indexeddb';
  ```
- **Evaluation**:
  - The detection logic is safe, case-insensitive, trimmed, and correctly falls back to `'indexeddb'` when undefined or invalid.
  - **Defect**: The mechanism is currently **dormant** because `ProductContext.jsx` and `SiteSettingsContext.jsx` never invoke `dataProvider.js`.

---

## D. Product Mapping Audit

Audit of `fromSupabaseProduct()` and `toSupabaseProduct()` against the 8 remote Supabase rows:

| Product Field | Domain Type | PostgreSQL Column | Supabase Type | Roundtrip Fidelity | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | `id` | `text PRIMARY KEY` | 100% match (`hecca-voal-premium`) | **READY** |
| `slug` | `string` | `slug` | `text UNIQUE` | 100% match (`hecca-voal-premium`) | **READY** |
| `name` | `string` | `name` | `text NOT NULL` | 100% match | **READY** |
| `tagline` | `string` | `tagline` | `text` | Defaults to `''` if null | **READY** |
| `category` | `string` | `category` | `text REFERENCES categories(slug)` | Matches valid category slug | **READY** |
| `categoryLabel` | `string` | `category_label` | `text` | Restored accurately | **READY** |
| `price` | `number` | `price` | `numeric(12,2)` | Cast to `Number()` without NaN | **READY** |
| `originalPrice` | `number \| null` | `original_price` | `numeric(12,2)` | Preserves `null` when no discount | **READY** |
| `stock` | `number` | `stock` | `integer` | Restored accurately (`45`, `28`, etc.) | **READY** |
| `rating` | `number` | `rating` | `numeric(3,1)` | Bounded [0.0, 5.0] | **READY** |
| `reviewCount` | `number` | `review_count` | `integer` | Restored accurately (`184`, etc.) | **READY** |
| `isNew` | `boolean` | `is_new` | `boolean` | Boolean cast verified | **READY** |
| `isBestSeller` | `boolean` | `is_best_seller` | `boolean` | Boolean cast verified | **READY** |
| `isVisible` | `boolean` | `is_visible` | `boolean` | Defaults to `true` if null | **READY** |
| `material` | `string` | `material` | `text` | Restored accurately | **READY** |
| `dimensions` | `string` | `dimensions` | `text` | Restored accurately | **READY** |
| `finishing` | `string` | `finishing` | `text` | Restored accurately | **READY** |
| `description` | `string` | `description` | `text` | Restored accurately | **READY** |
| `features` | `string[]` | `features` | `jsonb` | Parsed natively as JS array | **READY** |
| `careInstructions` | `string[]` | `care_instructions` | `jsonb` | Parsed natively as JS array | **READY** |
| `colors` | `object[]` | `colors` | `jsonb` | Parsed natively as `[{ name, hex }]` | **READY** |
| `images` | `string[]` | `images` | `jsonb` | Parsed natively as array of URLs | **READY** |
| `order` | `number` | `sort_order` | `integer` | Maps `order` <-> `sort_order` | **READY** |
| `createdAt` | `number (ms)` | `created_at` | `timestamptz` | Converted to Unix ms timestamp | **READY** |
| `updatedAt` | `number (ms)` | `updated_at` | `timestamptz` | Converted to Unix ms timestamp | **READY** |

**Audit Result**: 0 field mismatches across all 8 live products. Bi-directional serialization is 100% intact.

---

## E. Site Settings Mapping Audit

Audit of `supabaseSiteSettingsStorage.js` against the 8 remote Supabase rows:

- **Target Table**: `public.site_settings` (`key text PRIMARY KEY`, `data jsonb`, `updated_at timestamptz`)
- **Canonical Modules Tested (8/8 Present)**:
  1. `brand`: `{ brandName, tagline, shortDescription, logoText, ... }`
  2. `navigation`: `{ items: [...] }` (7 items)
  3. `announcementBar`: `{ isEnabled, announcementText, voucherCode, discountPercentage, link }`
  4. `homepage`: `{ hero, spotlight, sections, sectionTitles, valueProps, testimonials }`
  5. `about`: `{ eyebrow, heading, intro, storyP1, storyP2, studioAddress, ... }`
  6. `footer`: `{ brandName, socials, collectionLinks, helpLinks, paymentMethods, copyright }`
  7. `store`: `{ storeName, legalEntity, whatsappNumber, freeShippingThreshold, ... }`
  8. `whatsapp`: `{ recipientNumber, greetingTemplate, showFloatingButton }`
- **Legacy Aliases Synchronization**:
  - `bannerPromo` <-> `announcementBar` (Synchronized)
  - `storeSettings` <-> `store` (Synchronized)
  - `whatsappSettings` <-> `whatsapp` (Synchronized)
- **Fallback Resilience**:
  - If a key or network read fails, `supabaseSiteSettingsStorage` logs a warning and gracefully returns `DEFAULT_SITE_SETTINGS` without throwing or crashing the React tree.

---

## F. Category & Foreign Key Mapping Audit

1. **Relationship Definitive Check**:
   - `public.categories`: `id` is `uuid` (`PRIMARY KEY DEFAULT gen_random_uuid()`), `slug` is `text UNIQUE`.
   - `public.products`: `category` is `text`.
   - Foreign key constraint: `products_category_fkey` connects `products.category -> categories.slug`.
2. **Current Foreign Key Integrity**:
   - Categories seeded in Supabase:
     - `voal` (UUID: `3e1428e4-36d6-4ee0-8490-fdbbb4095774`)
     - `pashmina` (UUID: `631f13ef-e224-47db-b56b-fcc547f9c944`)
     - `hijab` (UUID: `6d040f79-0681-4a43-aa7b-20467f54dbec`)
     - `accessories` (UUID: `3c0ec19d-2226-474f-96d3-57ef5826c0c7`)
   - Product categories in Supabase:
     - All 8 products reference one of these 4 slugs.
     - Orphan rows: **0**.
3. **Data Layer Mapper Verification**:
   - `toSupabaseProduct` maps `category: product.category` (which contains the slug string).
   - `fromSupabaseProduct` reads `category: row.category`.
   - No attempt is made to write the slug to `categories.id`.

---

## G. Image & Media Mapping Audit

1. **External CDN Images (Migrated Catalog)**:
   - All 8 products currently have Unsplash CDN URLs (`https://images.unsplash.com/...`).
   - `getImageUrl(url)` returns URLs starting with `https://` immediately as-is without touching IndexedDB.
   - External CDN images render correctly in both IndexedDB and Supabase modes.
2. **Newly Uploaded Admin Images**:
   - `CMSImageUploader.jsx` and `ImageManager.jsx` call `uploadImage(file)` in `src/services/imageStorage.js`.
   - `imageStorage.js` writes the file as a Blob to IndexedDB (`hecca_db` -> `images` store) and assigns an ID `img_<timestamp>_<random>`.
   - There is **no Supabase Storage implementation**.
   - If an admin uploads an image while `provider=supabase`, the image ID `img_...` will be saved to Supabase, but the binary Blob exists **only** in that specific browser's IndexedDB. Customers and other devices will see broken images (`HAECCA_FALLBACK_IMAGE`).
3. **Ephemeral Blob URL Leak Risk**:
   - `productStorage.saveProduct` explicitly calls `resolvePersistentId()` on each image.
   - `supabaseProductStorage.toSupabaseProduct` **does not** call `resolvePersistentId()`. If a raw `blob:http://...` URL reaches the mapper, it will be written directly to PostgreSQL and permanently break upon tab closure.

---

## H. Authentication and RLS Compatibility Audit

1. **Remote RLS Policy State**:
   - `public.products`: RLS enabled. Read: `true`. Write: `public.is_admin()`.
   - `public.site_settings`: RLS enabled. Read: `true`. Write: `public.is_admin()`.
   - `public.categories`: RLS enabled. Read: `true`. Write: `public.is_admin()`.
   - Function `public.is_admin()` verifies `auth.uid()` against `public.admin_users`.
2. **Current Client Auth State**:
   - `src/admin/services/adminAuth.js` is a mock simulation storing credentials in `sessionStorage` (`hecca_admin_demo_session`).
   - The Supabase client `src/lib/supabaseClient.js` is initialized with the anonymous publishable key and has **no active Supabase session** (`supabase.auth.getUser()` returns null).
3. **Impact**:
   - **Storefront Public Browsing**: **READY**. Public SELECT queries succeed with HTTP 200.
   - **Admin CMS Writes**: **BLOCKED**. Any client-side `INSERT`, `UPDATE`, or `DELETE` executed against Supabase will be rejected with PostgreSQL error `42501 (violates row-level security policy)`.
   - Admin features cannot modify remote data until `adminAuth.js` is connected to Supabase Auth and a valid admin user exists in `public.admin_users`.

---

## I. IndexedDB Isolation Audit

1. **Isolation in `dataProvider.js`**:
   - When `isSupabaseActive` is true, calls route strictly to `supabaseProductStorage` and `supabaseSiteSettingsStorage`. No IndexedDB methods are called.
   - When `isIndexedDBActive` is true, calls route strictly to `productStorage.js` and `siteSettingsStorage.js`. No Supabase methods are called.
   - The provider module maintains clean mutual exclusivity.
2. **Isolation in Contexts**:
   - Currently **broken** because Contexts bypass `dataProvider.js` entirely.
   - Even if `VITE_DATA_PROVIDER=supabase` is set in `.env.local`, the Contexts continue reading and writing to IndexedDB.

---

## J. Supabase Write/Read Safety Audit

- **Read Operations (SELECT)**:
  - Completely non-destructive and idempotent.
  - Safe fallback mechanisms prevent UI white-screen crashes on network timeout or schema error.
- **Write Operations (INSERT / UPDATE / DELETE)**:
  - Direct writes via the public client are safely prevented by Supabase RLS policies.
  - Zero accidental writes occurred during this audit.
  - No DDL, table drops, truncates, or policy changes were executed.

---

## K. Tests Executed and Results

All tests were executed locally using read-only operations and static code analysis:

| Test ID | Test Description | Command / Method | Result |
| :--- | :--- | :--- | :--- |
| **T1** | Supabase Reachability & Auth Handshake | `supabase.from('products').select('count')` | **PASSED** (HTTP 200, 8 rows) |
| **T2** | Remote Product Count & Schema Validation | `supabaseProductStorage.getProducts()` | **PASSED** (8/8 products loaded) |
| **T3** | Product Field Completeness (25 fields) | Iterated all 8 products against required field list | **PASSED** (0 missing fields, 0 NaN) |
| **T4** | Category Foreign Key Verification | Verified `products.category` vs `categories.slug` | **PASSED** (0 orphan categories) |
| **T5** | Category UUID Structure Check | Tested `id::text ~* UUID regex` | **PASSED** (All 4 IDs are valid UUIDs) |
| **T6** | Site Settings Module Check (8 modules) | `supabaseSiteSettingsStorage.getAllSiteSettings()` | **PASSED** (8/8 modules + 3 aliases) |
| **T7** | In-Memory Bi-directional Serialization | `toSupabaseProduct(fromSupabaseProduct(row))` | **PASSED** (0 roundtrip discrepancies) |
| **T8** | Context Provider Wiring Static Audit | Grep `dataProvider` in `ProductContext` & `SiteSettingsContext` | **FAILED** (0 imports found; bypasses provider) |
| **T9** | Admin Auth Provider Static Audit | Inspected `adminAuth.js` for `supabase.auth` calls | **FAILED** (Uses mock `sessionStorage`) |
| **T10** | Image Storage Backend Static Audit | Inspected `imageStorage.js` for Supabase Storage | **FAILED** (Hardcoded to IndexedDB Blobs) |

---

## L. Problems Found & Severity Classification

### [BLOCKER] 1. Contexts Bypass `dataProvider.js`
- **Location**: `src/context/ProductContext.jsx` (lines 1-2), `src/context/SiteSettingsContext.jsx` (lines 2-6).
- **Issue**: Both contexts directly import from the legacy IndexedDB storage services (`productStorage.js`, `siteSettingsStorage.js`).
- **Consequence**: Switching `VITE_DATA_PROVIDER=supabase` in `.env.local` has no effect in the browser. The entire site remains bound to IndexedDB.

### [BLOCKER] 2. Admin Auth Disconnected from Supabase Auth (RLS Write Failures)
- **Location**: `src/admin/services/adminAuth.js`.
- **Issue**: Admin login uses mock credentials stored in browser `sessionStorage`. Supabase client remains unauthenticated (`auth.uid() IS NULL`).
- **Consequence**: When Supabase provider is active, any product creation, product edit, visibility toggle, product deletion, or CMS update from the Admin panel will be blocked by PostgreSQL RLS with error `42501`.

### [HIGH] 3. Image Uploads Remain Confined to Local Browser IndexedDB
- **Location**: `src/services/imageStorage.js`, `src/admin/components/CMSImageUploader.jsx`, `src/admin/components/ImageManager.jsx`.
- **Issue**: Uploaded images are stored as binary Blobs in local IndexedDB. There is no Supabase Storage bucket integration.
- **Consequence**: If an admin uploads a product photo in Supabase mode, the image will display only on that admin's browser. All other visitors will receive broken image fallbacks.

### [HIGH] 4. Missing Persistent ID Resolution in `toSupabaseProduct`
- **Location**: `src/lib/storage/supabaseProductStorage.js` (`toSupabaseProduct`).
- **Issue**: Does not sanitize images using `resolvePersistentId()`.
- **Consequence**: Ephemeral `blob:http://...` URLs could be written into PostgreSQL JSONB, resulting in permanent dead links once the session ends.

### [MEDIUM] 5. Categories Statically Hardcoded in Frontend
- **Location**: `src/data/categories.js`, `src/admin/pages/AdminCategoriesPage.jsx`, `src/admin/components/ProductFormModal.jsx`.
- **Issue**: Categories are read from a static JavaScript file rather than queried from `public.categories`.
- **Consequence**: Any category updates in the Supabase database will not reflect in category pages or modal dropdowns.

### [LOW] 6. Missing IndexedDB Site Setting Deletion in `dataProvider.js`
- **Location**: `src/lib/storage/dataProvider.js` (`deleteSiteSetting`).
- **Issue**: Returns `false` without delegating when `isIndexedDBActive` is true.
- **Consequence**: Minimal impact, as site setting modules are never deleted in production.

---

## M. Recommended Fixes (Do NOT Apply Yet)

1. **Wire Contexts to `dataProvider.js`**:
   - In `ProductContext.jsx`, replace `import { getAllProducts, saveProduct, deleteProduct as removeProductFromDB } from '../services/productStorage'` with imports from `../lib/storage/dataProvider.js`.
   - In `SiteSettingsContext.jsx`, replace `import { getAllSiteSettings, saveSiteSetting } from '../services/siteSettingsStorage.js'` with imports from `../lib/storage/dataProvider.js`.
2. **Implement Real Admin Authentication via Supabase Auth**:
   - Update `adminAuth.js` to call `supabase.auth.signInWithPassword({ email, password })`.
   - Ensure an admin user exists in Supabase `auth.users` with a corresponding row in `public.admin_users` to satisfy `public.is_admin()`.
   - Maintain the demo mock as a fallback only when `VITE_DATA_PROVIDER=indexeddb`.
3. **Address Media Storage Architecture**:
   - For complete cloud operation, configure a public Supabase Storage bucket (e.g. `product-images`) and implement a Supabase storage uploader in `imageStorage.js`.
   - Alternatively, document that in Stage 4, images are restricted to external CDN URLs (e.g., Unsplash).
   - In `toSupabaseProduct()`, ensure `images` are mapped through `resolvePersistentId()` to prevent ephemeral `blob:` URLs from being written.
4. **Create Category Data Provider**:
   - Implement `getCategories()` in `supabaseProductStorage.js` or a dedicated `supabaseCategoryStorage.js` querying `public.categories`.

---

## N. Final Readiness Verdict

# **SUPABASE PROVIDER NOT READY**

### Verdict Summary:
- **Public Storefront Read Operations**: **READY** (Can read all 8 products, 4 categories, and 8 site settings with 100% data fidelity).
- **Application Context Layer**: **NOT READY** (Blocked by hardcoded imports bypassing `dataProvider.js`).
- **Admin CMS Write Operations**: **NOT READY** (Blocked by Supabase RLS due to mock authentication).
- **Image / Media Uploads**: **NOT READY** (Blocked by local-only IndexedDB Blob storage).

`VITE_DATA_PROVIDER` must remain set to `"indexeddb"` until these issues are formally remediated in Stage 4B.2.
