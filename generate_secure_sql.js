import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import 'fake-indexeddb/auto';

// Import IndexedDB and Supabase storage abstractions
import { openDB } from './src/services/db.js';
import { ensureProductsSeeded } from './src/services/productStorage.js';
import { getAllSiteSettings, DEFAULT_SITE_SETTINGS } from './src/services/siteSettingsStorage.js';
import { toSupabaseProduct } from './src/lib/storage/supabaseProductStorage.js';

function computeHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

function escapeSqlString(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function escapeJsonb(val) {
  if (val === null || val === undefined) return "'null'::jsonb";
  const jsonStr = JSON.stringify(val).replace(/'/g, "''");
  return `'${jsonStr}'::jsonb`;
}

async function generateSecureSql() {
  console.log('================================================================');
  console.log(' HAECCA HIJAB — STAGE 4A.1 SECURE SQL MIGRATION GENERATOR        ');
  console.log('================================================================\n');

  // 1. Read IndexedDB Source Data
  await ensureProductsSeeded();
  const db = await openDB();

  const sourceProducts = await new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const canonicalModuleKeys = [
    'brand',
    'navigation',
    'announcementBar',
    'homepage',
    'about',
    'footer',
    'store',
    'whatsapp',
  ];
  const effectiveSettings = await getAllSiteSettings();

  console.log(`1. Read ${sourceProducts.length} source products from IndexedDB.`);
  console.log(`2. Read ${canonicalModuleKeys.length} canonical site settings modules.`);

  // 2. Validate against migration_manifest.json
  const manifestRaw = fs.readFileSync(path.resolve('migration_manifest.json'), 'utf-8');
  const manifest = JSON.parse(manifestRaw);

  console.log('\n3. Validating against Stage 3B Migration Manifest:');
  const mappedProducts = sourceProducts.map((p) => toSupabaseProduct(p));

  for (const p of mappedProducts) {
    const manifestItem = manifest.products.find((mp) => mp.id === p.id);
    if (!manifestItem) {
      throw new Error(`Product ${p.id} missing from migration manifest!`);
    }
    if (manifestItem.slug !== p.slug) {
      throw new Error(`Product ${p.id} slug mismatch: ${p.slug} vs ${manifestItem.slug}`);
    }
    if (manifestItem.price !== p.price) {
      throw new Error(`Product ${p.id} price mismatch: ${p.price} vs ${manifestItem.price}`);
    }
    if (manifestItem.stock !== p.stock) {
      throw new Error(`Product ${p.id} stock mismatch: ${p.stock} vs ${manifestItem.stock}`);
    }
    console.log(`   ✓ [Verified Match] ${p.id} (${p.slug}) -> Rp ${p.price.toLocaleString('id-ID')}`);
  }

  for (const k of canonicalModuleKeys) {
    const manifestItem = manifest.siteSettings.find((ms) => ms.key === k);
    if (!manifestItem) {
      throw new Error(`Site setting ${k} missing from migration manifest!`);
    }
    console.log(`   ✓ [Verified Match] Setting Module: ${k}`);
  }
  console.log();

  // 3. Build migration_stage4_secure.sql
  const sqlLines = [];

  sqlLines.push('-- ================================================================');
  sqlLines.push('-- HAECCA HIJAB — STAGE 4A.1 SECURE INITIAL MIGRATION SCRIPT');
  sqlLines.push(`-- Generated At: ${new Date().toISOString()}`);
  sqlLines.push('-- Target: Supabase Dashboard SQL Editor');
  sqlLines.push('-- Security Model: Executed with postgres/service_role privileges');
  sqlLines.push('-- Safety Guarantee: Idempotent UPSERT, NON-DESTRUCTIVE, NO DDL, NO RLS CHANGES');
  sqlLines.push('-- ================================================================');
  sqlLines.push('');
  sqlLines.push('BEGIN;');
  sqlLines.push('');
  sqlLines.push('-- ----------------------------------------------------------------');
  sqlLines.push('-- SECTION 1: PRODUCTS TABLE UPSERT (8 ITEMS)');
  sqlLines.push('-- ----------------------------------------------------------------');
  sqlLines.push('');

  for (const p of mappedProducts) {
    sqlLines.push(`-- Product: ${p.name} (ID: ${p.id})`);
    sqlLines.push('INSERT INTO public.products (');
    sqlLines.push('    id,');
    sqlLines.push('    slug,');
    sqlLines.push('    name,');
    sqlLines.push('    tagline,');
    sqlLines.push('    category,');
    sqlLines.push('    category_label,');
    sqlLines.push('    price,');
    sqlLines.push('    original_price,');
    sqlLines.push('    stock,');
    sqlLines.push('    rating,');
    sqlLines.push('    review_count,');
    sqlLines.push('    is_new,');
    sqlLines.push('    is_best_seller,');
    sqlLines.push('    is_visible,');
    sqlLines.push('    material,');
    sqlLines.push('    dimensions,');
    sqlLines.push('    finishing,');
    sqlLines.push('    description,');
    sqlLines.push('    features,');
    sqlLines.push('    care_instructions,');
    sqlLines.push('    colors,');
    sqlLines.push('    images,');
    sqlLines.push('    sort_order,');
    sqlLines.push('    created_at,');
    sqlLines.push('    updated_at');
    sqlLines.push(')');
    sqlLines.push('VALUES (');
    sqlLines.push(`    ${escapeSqlString(p.id)},`);
    sqlLines.push(`    ${escapeSqlString(p.slug)},`);
    sqlLines.push(`    ${escapeSqlString(p.name)},`);
    sqlLines.push(`    ${escapeSqlString(p.tagline)},`);
    sqlLines.push(`    ${escapeSqlString(p.category)},`);
    sqlLines.push(`    ${escapeSqlString(p.category_label)},`);
    sqlLines.push(`    ${p.price},`);
    sqlLines.push(`    ${p.original_price != null ? p.original_price : 'NULL'},`);
    sqlLines.push(`    ${p.stock},`);
    sqlLines.push(`    ${p.rating},`);
    sqlLines.push(`    ${p.review_count},`);
    sqlLines.push(`    ${p.is_new ? 'TRUE' : 'FALSE'},`);
    sqlLines.push(`    ${p.is_best_seller ? 'TRUE' : 'FALSE'},`);
    sqlLines.push(`    ${p.is_visible ? 'TRUE' : 'FALSE'},`);
    sqlLines.push(`    ${escapeSqlString(p.material)},`);
    sqlLines.push(`    ${escapeSqlString(p.dimensions)},`);
    sqlLines.push(`    ${escapeSqlString(p.finishing)},`);
    sqlLines.push(`    ${escapeSqlString(p.description)},`);
    sqlLines.push(`    ${escapeJsonb(p.features)},`);
    sqlLines.push(`    ${escapeJsonb(p.care_instructions)},`);
    sqlLines.push(`    ${escapeJsonb(p.colors)},`);
    sqlLines.push(`    ${escapeJsonb(p.images)},`);
    sqlLines.push(`    ${p.sort_order},`);
    sqlLines.push(`    ${escapeSqlString(p.created_at)}::timestamptz,`);
    sqlLines.push(`    ${escapeSqlString(p.updated_at)}::timestamptz`);
    sqlLines.push(')');
    sqlLines.push('ON CONFLICT (id) DO UPDATE SET');
    sqlLines.push('    slug = EXCLUDED.slug,');
    sqlLines.push('    name = EXCLUDED.name,');
    sqlLines.push('    tagline = EXCLUDED.tagline,');
    sqlLines.push('    category = EXCLUDED.category,');
    sqlLines.push('    category_label = EXCLUDED.category_label,');
    sqlLines.push('    price = EXCLUDED.price,');
    sqlLines.push('    original_price = EXCLUDED.original_price,');
    sqlLines.push('    stock = EXCLUDED.stock,');
    sqlLines.push('    rating = EXCLUDED.rating,');
    sqlLines.push('    review_count = EXCLUDED.review_count,');
    sqlLines.push('    is_new = EXCLUDED.is_new,');
    sqlLines.push('    is_best_seller = EXCLUDED.is_best_seller,');
    sqlLines.push('    is_visible = EXCLUDED.is_visible,');
    sqlLines.push('    material = EXCLUDED.material,');
    sqlLines.push('    dimensions = EXCLUDED.dimensions,');
    sqlLines.push('    finishing = EXCLUDED.finishing,');
    sqlLines.push('    description = EXCLUDED.description,');
    sqlLines.push('    features = EXCLUDED.features,');
    sqlLines.push('    care_instructions = EXCLUDED.care_instructions,');
    sqlLines.push('    colors = EXCLUDED.colors,');
    sqlLines.push('    images = EXCLUDED.images,');
    sqlLines.push('    sort_order = EXCLUDED.sort_order,');
    sqlLines.push('    updated_at = EXCLUDED.updated_at;');
    sqlLines.push('');
  }

  sqlLines.push('-- ----------------------------------------------------------------');
  sqlLines.push('-- SECTION 2: SITE SETTINGS TABLE UPSERT (8 MODULES)');
  sqlLines.push('-- ----------------------------------------------------------------');
  sqlLines.push('');

  const nowIso = new Date().toISOString();

  for (const k of canonicalModuleKeys) {
    const data = effectiveSettings[k];
    sqlLines.push(`-- Setting Module: ${k}`);
    sqlLines.push('INSERT INTO public.site_settings (key, data, updated_at)');
    sqlLines.push('VALUES (');
    sqlLines.push(`    ${escapeSqlString(k)},`);
    sqlLines.push(`    ${escapeJsonb(data)},`);
    sqlLines.push(`    ${escapeSqlString(nowIso)}::timestamptz`);
    sqlLines.push(')');
    sqlLines.push('ON CONFLICT (key) DO UPDATE SET');
    sqlLines.push('    data = EXCLUDED.data,');
    sqlLines.push('    updated_at = EXCLUDED.updated_at;');
    sqlLines.push('');
  }

  sqlLines.push('COMMIT;');
  sqlLines.push('');
  sqlLines.push('-- ================================================================');
  sqlLines.push('-- SECTION 3: POST-MIGRATION VERIFICATION QUERIES');
  sqlLines.push('-- ================================================================');
  sqlLines.push('');
  sqlLines.push('-- Query 1: Total products count (expected: 8)');
  sqlLines.push('SELECT COUNT(*) AS total_products FROM public.products;');
  sqlLines.push('');
  sqlLines.push('-- Query 2: Total migrated product IDs matching expected catalog (expected: 8)');
  sqlLines.push(`SELECT COUNT(*) AS migrated_catalog_count FROM public.products WHERE id IN (${mappedProducts.map((p) => escapeSqlString(p.id)).join(', ')});`);
  sqlLines.push('');
  sqlLines.push('-- Query 3: Total site settings count (expected: 8)');
  sqlLines.push('SELECT COUNT(*) AS total_site_settings FROM public.site_settings;');
  sqlLines.push('');
  sqlLines.push('-- Query 4: Each migrated site setting key (expected: brand, navigation, announcementBar, homepage, about, footer, store, whatsapp)');
  sqlLines.push('SELECT key, updated_at FROM public.site_settings ORDER BY key;');
  sqlLines.push('');
  sqlLines.push('-- Query 5: Duplicate slug check (expected: 0 duplicate rows)');
  sqlLines.push('SELECT slug, COUNT(*) AS count FROM public.products GROUP BY slug HAVING COUNT(*) > 1;');
  sqlLines.push('');
  sqlLines.push('-- Query 6: Migrated product IDs and names');
  sqlLines.push('SELECT id, slug, name, category, price, stock, jsonb_array_length(images) AS image_count FROM public.products ORDER BY sort_order ASC, name ASC;');
  sqlLines.push('');

  const sqlContent = sqlLines.join('\n');

  // 4. Strict Security Verification on SQL Content
  const executableSql = sqlLines
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  const forbiddenPatterns = [
    /\bCREATE\s+POLICY\b/i,
    /\bALTER\s+POLICY\b/i,
    /\bDROP\s+POLICY\b/i,
    /\bALTER\s+TABLE\b/i,
    /\bCREATE\s+TABLE\b/i,
    /\bDROP\s+TABLE\b/i,
    /\bTRUNCATE\b/i,
    /\bDELETE\s+FROM\b/i,
    /\bDELETE\b/i,
  ];

  for (const pat of forbiddenPatterns) {
    if (pat.test(executableSql)) {
      throw new Error(`SECURITY VIOLATION: Forbidden SQL pattern found in migration script: ${pat}`);
    }
  }
  console.log('✓ Security Check Passed: SQL script contains ZERO DDL, ZERO policy changes, and ZERO deletes.');

  fs.writeFileSync(path.resolve('migration_stage4_secure.sql'), sqlContent, 'utf-8');
  console.log('✓ Generated file: migration_stage4_secure.sql');

  // 5. Generate migration_stage4_secure.md
  const mdContent = `# Haecca Hijab — Stage 4A.1 Secure Migration Guide

> **Generated At**: ${new Date().toISOString()}  
> **Status**: **SECURE MIGRATION SCRIPT READY — NOT EXECUTED**  
> **Script Path**: \`migration_stage4_secure.sql\`

---

## 1. Security Architecture & Decision Rationale

### A. Why Client-Side Migration was Blocked
In Stage 4A, client-side \`UPSERT\` operations were attempted using the modern Supabase Publishable Key (\`VITE_SUPABASE_PUBLISHABLE_KEY\`). PostgreSQL correctly rejected these operations with error:
\`code: '42501', message: 'new row violates row-level security policy for table ...'\`

This occurred because Row Level Security (RLS) is active on \`public.products\` and \`public.site_settings\`, and no public write policies exist.

### B. Why Public Write Policies Must NOT Be Created
Granting public write access via policies such as:
\`\`\`sql
-- NEVER DO THIS IN PRODUCTION:
CREATE POLICY "Allow anon insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.products FOR UPDATE USING (true);
\`\`\`
would allow any anonymous visitor with a browser inspection tool to overwrite, corrupt, or vandalize the catalog and store settings. 

The existing admin security architecture must remain completely intact:
- **Public Read Access**: Available for storefront visitors.
- **Admin-Only Writes**: Authorized strictly via \`public.is_admin()\` and \`admin_users\`.

### C. Why Supabase SQL Editor is the Chosen Initial Migration Path
The **Supabase Dashboard SQL Editor** runs queries in the backend with administrative (\`postgres\` / \`service_role\`) privileges. This means:
1. **Zero Client Vulnerability**: No temporary or permanent \`anon\` write policies need to be created.
2. **Atomic Transaction**: The migration runs within a single \`BEGIN ... COMMIT\` block.
3. **Audit Trail**: The execution is recorded in the Supabase audit logs.
4. **Zero Impact on Local App**: Local IndexedDB and the storefront remain untouched and completely stable.

---

## 2. Migration Scope & Expected Counts

| Target Table | Action Type | Rows to Upsert | Conflict Key | Pre-Migration Count | Expected Post-Migration Count |
|---|---|---|---|---|---|
| \`public.products\` | \`INSERT ... ON CONFLICT (id) DO UPDATE\` | **8** | \`id\` (text) | **0** | **8** |
| \`public.site_settings\` | \`INSERT ... ON CONFLICT (key) DO UPDATE\` | **8** | \`key\` (text) | **0** | **8** |
| **Total** | | **16** | | **0** | **16** |

### Product Catalog Breakdown (8 Items):
1. \`hecca-daily-voal-waterproof\` (Voal Series) — Rp 95.000 (Stock: 35)
2. \`hecca-inner-ciput-rajut\` (Accessories) — Rp 35.000 (Stock: 90)
3. \`hecca-monogram-silk-square\` (Hijab) — Rp 149.000 (Stock: 20)
4. \`hecca-paris-square\` (Hijab) — Rp 65.000 (Stock: 60)
5. \`hecca-pashmina-ceruty\` (Pashmina) — Rp 75.000 (Stock: 52)
6. \`hecca-pashmina-silk\` (Pashmina) — Rp 115.000 (Stock: 28)
7. \`hecca-silk-scrunchie\` (Accessories) — Rp 29.000 (Stock: 80)
8. \`hecca-voal-premium\` (Voal Series) — Rp 89.000 (Stock: 45)

### Site Settings Modules Breakdown (8 Modules):
1. \`brand\` (7 fields)
2. \`navigation\` (2 fields)
3. \`announcementBar\` (6 fields)
4. \`homepage\` (7 fields)
5. \`about\` (16 fields)
6. \`footer\` (11 fields)
7. \`store\` (12 fields)
8. \`whatsapp\` (5 fields)

---

## 3. Storage & Images Confirmation

- **IndexedDB Blob Records**: **0**
- **Supabase Storage Objects Needed**: **0**
- **Image URLs Referenced**: All 8 products reference existing high-resolution Unsplash CDN URLs. They are stored directly as PostgreSQL JSONB arrays (\`images\` column). No asset uploads or bucket permissions are involved.

---

## 4. Rollback & Idempotency Considerations

- **Idempotent**: The script uses \`ON CONFLICT (id) DO UPDATE\` and \`ON CONFLICT (key) DO UPDATE\`. It can be run multiple times with zero duplicate keys or unique constraint violations.
- **Non-Destructive**: The script contains zero \`DELETE\`, zero \`TRUNCATE\`, and zero \`DROP\` commands.
- **Rollback Procedure**: If desired, running:
  \`\`\`sql
  -- Rollback statement (manual only, if ever required):
  -- DELETE FROM public.products WHERE id IN ('hecca-daily-voal-waterproof', 'hecca-inner-ciput-rajut', 'hecca-monogram-silk-square', 'hecca-paris-square', 'hecca-pashmina-ceruty', 'hecca-pashmina-silk', 'hecca-silk-scrunchie', 'hecca-voal-premium');
  -- DELETE FROM public.site_settings WHERE key IN ('brand', 'navigation', 'announcementBar', 'homepage', 'about', 'footer', 'store', 'whatsapp');
  \`\`\`
  restores the tables to their initial empty state.
- **Active Data Provider**: Storefront continues serving from IndexedDB (\`VITE_DATA_PROVIDER=indexeddb\`).

---

## 5. Execution & Verification Procedure

1. Open your **Supabase Dashboard**: [https://supabase.com/dashboard/project/imxtgcuzfjpwwsbmkxyl](https://supabase.com/dashboard/project/imxtgcuzfjpwwsbmkxyl)
2. Navigate to the **SQL Editor** tab on the left sidebar.
3. Open or paste the contents of \`migration_stage4_secure.sql\`.
4. Click **Run** (or press \`Ctrl+Enter\`).
5. Review the verification query results returned in the dashboard results pane:
   - \`total_products\` must be \`8\`
   - \`migrated_catalog_count\` must be \`8\`
   - \`total_site_settings\` must be \`8\`
   - \`duplicate_slug_check\` must return \`0\` rows
6. Report back to the assistant once executed so Stage 4B verification can proceed.

---

## 6. Final Status

\`\`\`text
================================================================
          SECURE MIGRATION SCRIPT READY — NOT EXECUTED
================================================================
\`\`\`
`;

  fs.writeFileSync(path.resolve('migration_stage4_secure.md'), mdContent, 'utf-8');
  console.log('✓ Generated file: migration_stage4_secure.md\n');

  console.log('================================================================');
  console.log('          SECURE MIGRATION SCRIPT READY — NOT EXECUTED          ');
  console.log('================================================================');
}

generateSecureSql().catch((err) => {
  console.error('ERROR GENERATING SECURE SQL:', err);
  process.exit(1);
});
