# Haecca Hijab — Stage 4A.1 Secure Migration Guide

> **Generated At**: 2026-09-13T18:36:38.062Z  
> **Status**: **SECURE MIGRATION SCRIPT READY — NOT EXECUTED**  
> **Script Path**: `migration_stage4_secure.sql`

---

## 1. Security Architecture & Decision Rationale

### A. Why Client-Side Migration was Blocked
In Stage 4A, client-side `UPSERT` operations were attempted using the modern Supabase Publishable Key (`VITE_SUPABASE_PUBLISHABLE_KEY`). PostgreSQL correctly rejected these operations with error:
`code: '42501', message: 'new row violates row-level security policy for table ...'`

This occurred because Row Level Security (RLS) is active on `public.products` and `public.site_settings`, and no public write policies exist.

### B. Why Public Write Policies Must NOT Be Created
Granting public write access via policies such as:
```sql
-- NEVER DO THIS IN PRODUCTION:
CREATE POLICY "Allow anon insert" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update" ON public.products FOR UPDATE USING (true);
```
would allow any anonymous visitor with a browser inspection tool to overwrite, corrupt, or vandalize the catalog and store settings. 

The existing admin security architecture must remain completely intact:
- **Public Read Access**: Available for storefront visitors.
- **Admin-Only Writes**: Authorized strictly via `public.is_admin()` and `admin_users`.

### C. Why Supabase SQL Editor is the Chosen Initial Migration Path
The **Supabase Dashboard SQL Editor** runs queries in the backend with administrative (`postgres` / `service_role`) privileges. This means:
1. **Zero Client Vulnerability**: No temporary or permanent `anon` write policies need to be created.
2. **Atomic Transaction**: The migration runs within a single `BEGIN ... COMMIT` block.
3. **Audit Trail**: The execution is recorded in the Supabase audit logs.
4. **Zero Impact on Local App**: Local IndexedDB and the storefront remain untouched and completely stable.

---

## 2. Migration Scope & Expected Counts

| Target Table | Action Type | Rows to Upsert | Conflict Key | Pre-Migration Count | Expected Post-Migration Count |
|---|---|---|---|---|---|
| `public.products` | `INSERT ... ON CONFLICT (id) DO UPDATE` | **8** | `id` (text) | **0** | **8** |
| `public.site_settings` | `INSERT ... ON CONFLICT (key) DO UPDATE` | **8** | `key` (text) | **0** | **8** |
| **Total** | | **16** | | **0** | **16** |

### Product Catalog Breakdown (8 Items):
1. `hecca-daily-voal-waterproof` (Voal Series) — Rp 95.000 (Stock: 35)
2. `hecca-inner-ciput-rajut` (Accessories) — Rp 35.000 (Stock: 90)
3. `hecca-monogram-silk-square` (Hijab) — Rp 149.000 (Stock: 20)
4. `hecca-paris-square` (Hijab) — Rp 65.000 (Stock: 60)
5. `hecca-pashmina-ceruty` (Pashmina) — Rp 75.000 (Stock: 52)
6. `hecca-pashmina-silk` (Pashmina) — Rp 115.000 (Stock: 28)
7. `hecca-silk-scrunchie` (Accessories) — Rp 29.000 (Stock: 80)
8. `hecca-voal-premium` (Voal Series) — Rp 89.000 (Stock: 45)

### Site Settings Modules Breakdown (8 Modules):
1. `brand` (7 fields)
2. `navigation` (2 fields)
3. `announcementBar` (6 fields)
4. `homepage` (7 fields)
5. `about` (16 fields)
6. `footer` (11 fields)
7. `store` (12 fields)
8. `whatsapp` (5 fields)

---

## 3. Storage & Images Confirmation

- **IndexedDB Blob Records**: **0**
- **Supabase Storage Objects Needed**: **0**
- **Image URLs Referenced**: All 8 products reference existing high-resolution Unsplash CDN URLs. They are stored directly as PostgreSQL JSONB arrays (`images` column). No asset uploads or bucket permissions are involved.

---

## 4. Rollback & Idempotency Considerations

- **Idempotent**: The script uses `ON CONFLICT (id) DO UPDATE` and `ON CONFLICT (key) DO UPDATE`. It can be run multiple times with zero duplicate keys or unique constraint violations.
- **Non-Destructive**: The script contains zero `DELETE`, zero `TRUNCATE`, and zero `DROP` commands.
- **Rollback Procedure**: If desired, running:
  ```sql
  -- Rollback statement (manual only, if ever required):
  -- DELETE FROM public.products WHERE id IN ('hecca-daily-voal-waterproof', 'hecca-inner-ciput-rajut', 'hecca-monogram-silk-square', 'hecca-paris-square', 'hecca-pashmina-ceruty', 'hecca-pashmina-silk', 'hecca-silk-scrunchie', 'hecca-voal-premium');
  -- DELETE FROM public.site_settings WHERE key IN ('brand', 'navigation', 'announcementBar', 'homepage', 'about', 'footer', 'store', 'whatsapp');
  ```
  restores the tables to their initial empty state.
- **Active Data Provider**: Storefront continues serving from IndexedDB (`VITE_DATA_PROVIDER=indexeddb`).

---

## 5. Execution & Verification Procedure

1. Open your **Supabase Dashboard**: [https://supabase.com/dashboard/project/imxtgcuzfjpwwsbmkxyl](https://supabase.com/dashboard/project/imxtgcuzfjpwwsbmkxyl)
2. Navigate to the **SQL Editor** tab on the left sidebar.
3. Open or paste the contents of `migration_stage4_secure.sql`.
4. Click **Run** (or press `Ctrl+Enter`).
5. Review the verification query results returned in the dashboard results pane:
   - `total_products` must be `8`
   - `migrated_catalog_count` must be `8`
   - `total_site_settings` must be `8`
   - `duplicate_slug_check` must return `0` rows
6. Report back to the assistant once executed so Stage 4B verification can proceed.

---

## 6. Final Status

```text
================================================================
          SECURE MIGRATION SCRIPT READY — NOT EXECUTED
================================================================
```
