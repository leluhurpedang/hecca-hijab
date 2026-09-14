# Haecca Hijab — Stage 3B Supabase Migration Dry Run Report

> **Dry Run Execution Timestamp**: 2026-09-13T18:29:53.639Z  
> **Verdict**: **DRY RUN COMPLETE — ZERO SUPABASE WRITES**

---

## Executive Summary
A full migration dry run was executed against the local IndexedDB source and remote Supabase destination. All 8 products and 8 canonical site settings modules were read, mapped to their exact PostgreSQL target representations, validated against the schema constraints, and fingerprinted with SHA-256 integrity checksums.

**CRITICAL SAFEGUARD CONFIRMATION**:  
**ZERO network write requests** (no `INSERT`, `UPDATE`, `UPSERT`, or `DELETE`) were dispatched to Supabase.  
**ZERO data** was modified in local IndexedDB.  
**Active provider** remains strictly `VITE_DATA_PROVIDER=indexeddb`.

---

## A. Source Inventory (IndexedDB)
* **Database Name**: `hecca_db` (v3)
* **Products in Store**: **8** records
* **Images in Store**: **0** records
* **Site Settings Persisted in Store**: **0** records
* **Effective Settings (Fallback Baseline)**: **8** modules (`DEFAULT_SITE_SETTINGS`)

---

## B. Destination Inventory (Supabase)
* **Project URL**: `https://imxtgcuzfjpwwsbmkxyl.supabase.co`
* **Existing Products Rows**: **0**
* **Existing Site Settings Rows**: **0**
* **Existing Storage Objects Required**: **0**

---

## C. Product Migration Preview

The following 8 products would be migrated:

| # | ID | Slug | Name | Category | Price (IDR) | Stock | Images | SHA-256 Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | `hecca-daily-voal-waterproof` | `hecca-daily-voal-waterproof` | Haecca Daily Voal Water-Repellent | `voal` | Rp 95.000 | 35 | 3 imgs | `8d578d0e48...` |
| 2 | `hecca-inner-ciput-rajut` | `hecca-inner-ciput-rajut` | Haecca Inner Hijab Ciput Rajut 4-Way Stretch | `accessories` | Rp 35.000 | 90 | 2 imgs | `911e1f7cd0...` |
| 3 | `hecca-monogram-silk-square` | `hecca-monogram-silk-square` | Haecca Exclusive Monogram Silk Square | `hijab` | Rp 149.000 | 20 | 3 imgs | `651f6c93ba...` |
| 4 | `hecca-paris-square` | `hecca-paris-square` | Haecca Paris Square Classic | `hijab` | Rp 65.000 | 60 | 3 imgs | `2ad6bededd...` |
| 5 | `hecca-pashmina-ceruty` | `hecca-pashmina-ceruty` | Haecca Pashmina Ceruty Baby Doll | `pashmina` | Rp 75.000 | 52 | 3 imgs | `6064f589cf...` |
| 6 | `hecca-pashmina-silk` | `hecca-pashmina-silk` | Haecca Pashmina Silk Cradenza | `pashmina` | Rp 115.000 | 28 | 3 imgs | `e3b395828c...` |
| 7 | `hecca-silk-scrunchie` | `hecca-silk-scrunchie` | Haecca Mulberry Silk Scrunchie Anti Rontok | `accessories` | Rp 29.000 | 80 | 2 imgs | `28ba8c2b2c...` |
| 8 | `hecca-voal-premium` | `hecca-voal-premium` | Haecca Voal Premium Ultrafine | `voal` | Rp 89.000 | 45 | 3 imgs | `1593629803...` |

---

## D. Site Settings Migration Preview

The following 8 canonical modules would be migrated to the `site_settings` table:

| # | Setting Key | Module Description | Top-Level Keys | Action in Dry Run | SHA-256 Checksum |
|---|---|---|---|---|---|
| 1 | `brand` | Store branding, logo monogram, tagline, copyright | 7 | Simulated row | `8fe7655220...` |
| 2 | `navigation` | 7 header navigation items with active toggles | 2 | Simulated row | `2cff715cdc...` |
| 3 | `announcementBar` | Top promotional announcement bar & voucher | 6 | Simulated row | `6a177e316c...` |
| 4 | `homepage` | Hero section, spotlight banner, section toggles | 7 | Simulated row | `154372a394...` |
| 5 | `about` | Brand origin story, 3 metrics, studio & fabric | 18 | Simulated row | `0231223a58...` |
| 6 | `footer` | Footer bio, social links, collection & help links | 8 | Simulated row | `a2516bb579...` |
| 7 | `store` | Legal entity, address, WhatsApp, shipping threshold | 11 | Simulated row | `7ef48c94d7...` |
| 8 | `whatsapp` | Order dispatch recipient phone, greeting, notes | 4 | Simulated row | `3ca9924374...` |

> [!NOTE]
> **Legacy Aliases Handling**: The virtual legacy aliases (`bannerPromo`, `storeSettings`, `whatsappSettings`) are intentionally **not written as duplicate rows** in Supabase. The client data-access layer (`supabaseSiteSettingsStorage.js`) exposes them dynamically in memory, preventing data desynchronization.

---

## E. Image Migration Preview
* **Local Blobs to Upload**: **0**
* **External CDN Image URLs Referenced**: **4** unique high-resolution URLs across Unsplash CDN.
* **Storage Upload Overhead**: **0 MB** (No asset uploading required for baseline migration).

---

## F. Field Mappings Summary

| JavaScript CamelCase | PostgreSQL Column | PostgreSQL Type | Notes |
|---|---|---|---|
| `id` | `id` | `text PRIMARY KEY` | Preserves exact ID format |
| `slug` | `slug` | `text UNIQUE` | URL route slug |
| `name` | `name` | `text NOT NULL` | Product display title |
| `tagline` | `tagline` | `text` | Subtitle |
| `category` | `category` | `text NOT NULL` | Foreign key / slug |
| `categoryLabel` | `category_label` | `text NOT NULL` | Formatted label |
| `price` | `price` | `numeric(12,2)` | IDR value |
| `originalPrice` | `original_price` | `numeric(12,2)` | Strikethrough price |
| `stock` | `stock` | `integer NOT NULL` | Inventory |
| `rating` | `rating` | `numeric(2,1)` | Range 0.0 - 5.0 |
| `reviewCount` | `review_count` | `integer NOT NULL` | Non-negative integer |
| `isNew` | `is_new` | `boolean NOT NULL` | Flag |
| `isBestSeller` | `is_best_seller` | `boolean NOT NULL` | Flag |
| `isVisible` | `is_visible` | `boolean NOT NULL` | Catalog visibility toggle |
| `material` | `material` | `text` | Fabric description |
| `dimensions` | `dimensions` | `text` | Dimensions spec |
| `finishing` | `finishing` | `text` | Edge cut/stitch |
| `description` | `description` | `text` | Multi-line copy |
| `features[]` | `features` | `jsonb NOT NULL` | Array of string bullets |
| `careInstructions[]` | `care_instructions` | `jsonb NOT NULL` | Array of care steps |
| `colors[]` | `colors` | `jsonb NOT NULL` | Array of `{ name, hex }` swatches |
| `images[]` | `images` | `jsonb NOT NULL` | Array of image URLs; index 0 is primary |
| `order` | `sort_order` | `integer NOT NULL` | Catalog sorting index |
| `createdAt` | `created_at` | `timestamptz NOT NULL` | ISO-8601 string |
| `updatedAt` | `updated_at` | `timestamptz NOT NULL` | ISO-8601 string |

---

## G. Collision Analysis
* **Product ID Collisions**: All 8 IDs are mutually unique. No intra-batch collisions.
* **Product Slug Collisions**: All 8 slugs are mutually unique. No intra-batch collisions.
* **Site Settings Key Collisions**: All 8 keys are mutually unique.

---

## H. Idempotency Analysis
* **Why Plain INSERT is Risky**: If `insert()` is used and executed a second time (e.g. following a transient network timeout or retry), PostgreSQL will abort with `23505: duplicate key value violates unique constraint "products_pkey"`.
* **The UPSERT Strategy**:
  - For products: `supabase.from('products').upsert(row, { onConflict: 'id' })`.
  - For site settings: `supabase.from('site_settings').upsert(row, { onConflict: 'key' })`.
* **Idempotency Guarantee**: **100% Idempotent**. The migration can be run once, twice, or multiple times without creating duplicate rows, corrupting foreign keys, or throwing constraint errors.

---

## I. Potential Risks & Mitigations

| Identified Risk | Severity | Mitigation Strategy in Place |
|---|---|---|
| Accidental premature provider switch | High | `VITE_DATA_PROVIDER=indexeddb` is hardcoded in `.env.local` and defaults to IndexedDB in all code paths. |
| Duplicate alias rows in Supabase | Medium | Migration strictly inserts only the 8 canonical keys. Aliases are handled via memory proxies. |
| Timezone shifting in timestamps | Low | JavaScript ms integers are converted explicitly to UTC ISO-8601 strings (`toISOString()`). |

---

## J. Recommended Actual Migration Strategy (Stage 4)
1. Use `upsert()` with `onConflict: 'id'` for products in batches of 10.
2. Use `upsert()` with `onConflict: 'key'` for site settings.
3. Verify remote record counts match manifest (`products: 8`, `site_settings: 8`).
4. Perform read-back verification against SHA-256 checksums in `migration_manifest.json`.
5. Keep active provider on `indexeddb` until user explicitly requests provider flip.

---

## K. Exact Rows That WOULD Be Written

```json
// Sample Product Row (hecca-voal-premium)
{
  "id": "hecca-daily-voal-waterproof",
  "slug": "hecca-daily-voal-waterproof",
  "name": "Haecca Daily Voal Water-Repellent",
  "tagline": "Inovasi hijab voal tahan percikan air wudhu tanpa khawatir noda basah",
  "category": "voal",
  "category_label": "Voal",
  "price": 95000,
  "original_price": 125000,
  "stock": 35,
  "rating": 4.8,
  "review_count": 74,
  "is_new": true,
  "is_best_seller": false,
  "is_visible": true,
  "material": "Ultrafine Voal with Hydrophobic Eco-Nano Coating",
  "dimensions": "115 cm x 115 cm",
  "finishing": "Laser Cut Wave Pattern dengan Plat Emas Haecca",
  "description": "Solusi terbaik untuk muslimah modern. Diformulasikan dengan teknologi eco-coating water-repellent yang menolak tetesan air saat wudhu atau hujan gerimis, namun serat kain tetap bernapas sejuk dan nyaman dipakai sepanjang hari.",
  "features": [
    "Hydrophobic Nano Coating: Tetesan air langsung bergulir tanpa meresap",
    "Cepat kering hanya dalam hitungan detik setelah diusap",
    "Tetap lembut dan fleksibel seperti voal premium biasa",
    "Aman untuk pencucian hingga 30+ kali tanpa mengurangi performa"
  ],
  "care_instructions": [
    "Cuci perlahan tanpa digosok terlalu keras di permukaan coating",
    "Cukup dibilas air bersih dan dikeringkan di tempat sejuk",
    "Setrika suhu rendah di sisi dalam hijab"
  ],
  "colors": [
    {
      "name": "Stone Grey",
      "hex": "#B5B8B6"
    },
    {
      "name": "Nude Blush",
      "hex": "#DEC4B8"
    },
    {
      "name": "Cocoa Latte",
      "hex": "#8B705D"
    },
    {
      "name": "Forest Green",
      "hex": "#4B584E"
    }
  ],
  "images": [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80"
  ],
  "sort_order": 5,
  "created_at": "2026-09-13T18:29:13.634Z",
  "updated_at": "2026-09-13T18:29:53.634Z"
}
```

```json
// Sample Site Setting Row (brand)
{
  "key": "brand",
  "data": {
    "key": "brand",
    "brandName": "Haecca Hijab",
    "tagline": "Premium Modest Fashion",
    "shortDescription": "Brand hijab & busana muslimah modern dengan sentuhan elegan, material berkualitas tinggi, dan harga yang bersahabat untuk setiap wanita Indonesia.",
    "logoText": "HAECCA",
    "logoImage": "",
    "copyrightText": "© 2026 Haecca Hijab. Seluruh hak cipta dilindungi undang-undang."
  },
  "updated_at": "2026-09-13T18:29:53.638Z"
}
```

---

## L. Final Confirmation

```text
================================================================
           DRY RUN COMPLETE — ZERO SUPABASE WRITES
================================================================
```
