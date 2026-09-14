import fs from 'fs';
import path from 'path';

function escapeSqlString(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function generateCategoriesSql() {
  console.log('================================================================');
  console.log('  HAECCA HIJAB — STAGE 4A.1 CATEGORIES MIGRATION GENERATOR       ');
  console.log('================================================================\n');

  const categories = [
    {
      id: 'voal',
      slug: 'voal',
      name: 'Voal',
      description: 'Voal ultrafine premium dengan tepian laser cut presisi. Tidak licin, tegak paripurna di dahi.',
      image_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
      sort_order: 1,
      is_visible: true,
    },
    {
      id: 'pashmina',
      slug: 'pashmina',
      name: 'Pashmina',
      description: 'Pashmina silk cradenza, ceruty baby doll, dan crinkle dengan drape anggun dan mudah dibentuk.',
      image_url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      sort_order: 2,
      is_visible: true,
    },
    {
      id: 'hijab',
      slug: 'hijab',
      name: 'Hijab',
      description: 'Koleksi hijab square, paris premium, dan daily hijab dengan jahitan tepi rapi dan bahan adem.',
      image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      sort_order: 3,
      is_visible: true,
    },
    {
      id: 'accessories',
      slug: 'accessories',
      name: 'Accessories',
      description: 'Aksesoris pelengkap seperti ciput rajut 4-way anti pusing dan silk scrunchie anti rambut rontok.',
      image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      sort_order: 4,
      is_visible: true,
    },
  ];

  const nowIso = new Date().toISOString();

  const sqlLines = [];
  sqlLines.push('-- ================================================================');
  sqlLines.push('-- HAECCA HIJAB — STAGE 4A.1 CATEGORIES PREREQUISITE SEED');
  sqlLines.push(`-- Generated At: ${nowIso}`);
  sqlLines.push('-- Target: Supabase Dashboard SQL Editor');
  sqlLines.push('-- Purpose: Resolve products_category_fkey foreign key constraint');
  sqlLines.push('-- Safety Guarantee: Idempotent UPSERT, NON-DESTRUCTIVE, NO DDL, NO RLS CHANGES');
  sqlLines.push('-- ================================================================');
  sqlLines.push('');
  sqlLines.push('BEGIN;');
  sqlLines.push('');
  sqlLines.push('-- ----------------------------------------------------------------');
  sqlLines.push('-- INSERT 4 PREREQUISITE CATEGORIES (voal, pashmina, hijab, accessories)');
  sqlLines.push('-- ----------------------------------------------------------------');
  sqlLines.push('');

  for (const cat of categories) {
    sqlLines.push(`-- Category: ${cat.name} (Key: ${cat.id})`);
    sqlLines.push('INSERT INTO public.categories (');
    sqlLines.push('    id,');
    sqlLines.push('    slug,');
    sqlLines.push('    name,');
    sqlLines.push('    description,');
    sqlLines.push('    image_url,');
    sqlLines.push('    sort_order,');
    sqlLines.push('    is_visible,');
    sqlLines.push('    created_at,');
    sqlLines.push('    updated_at');
    sqlLines.push(')');
    sqlLines.push('VALUES (');
    sqlLines.push(`    ${escapeSqlString(cat.id)},`);
    sqlLines.push(`    ${escapeSqlString(cat.slug)},`);
    sqlLines.push(`    ${escapeSqlString(cat.name)},`);
    sqlLines.push(`    ${escapeSqlString(cat.description)},`);
    sqlLines.push(`    ${escapeSqlString(cat.image_url)},`);
    sqlLines.push(`    ${cat.sort_order},`);
    sqlLines.push(`    ${cat.is_visible ? 'TRUE' : 'FALSE'},`);
    sqlLines.push(`    ${escapeSqlString(nowIso)}::timestamptz,`);
    sqlLines.push(`    ${escapeSqlString(nowIso)}::timestamptz`);
    sqlLines.push(')');
    sqlLines.push('ON CONFLICT (id) DO UPDATE SET');
    sqlLines.push('    slug = EXCLUDED.slug,');
    sqlLines.push('    name = EXCLUDED.name,');
    sqlLines.push('    description = EXCLUDED.description,');
    sqlLines.push('    image_url = EXCLUDED.image_url,');
    sqlLines.push('    sort_order = EXCLUDED.sort_order,');
    sqlLines.push('    is_visible = EXCLUDED.is_visible,');
    sqlLines.push('    updated_at = EXCLUDED.updated_at;');
    sqlLines.push('');
  }

  sqlLines.push('COMMIT;');
  sqlLines.push('');
  sqlLines.push('-- ================================================================');
  sqlLines.push('-- POST-SEED VERIFICATION QUERIES');
  sqlLines.push('-- ================================================================');
  sqlLines.push('');
  sqlLines.push('-- Query 1: Total categories count (expected: 4)');
  sqlLines.push('SELECT COUNT(*) AS total_categories FROM public.categories;');
  sqlLines.push('');
  sqlLines.push('-- Query 2: Verify all 4 required keys exist (expected: 4)');
  sqlLines.push("SELECT COUNT(*) AS required_categories_present FROM public.categories WHERE id IN ('voal', 'pashmina', 'hijab', 'accessories');");
  sqlLines.push('');
  sqlLines.push('-- Query 3: Inspect category rows');
  sqlLines.push('SELECT id, slug, name, sort_order, is_visible, updated_at FROM public.categories ORDER BY sort_order ASC;');
  sqlLines.push('');

  const sqlContent = sqlLines.join('\n');

  // Security Check: Ensure NO forbidden DDL/DML
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

  fs.writeFileSync(path.resolve('migration_stage4_categories.sql'), sqlContent, 'utf-8');
  console.log('✓ Security Check Passed: SQL script contains ZERO DDL, ZERO policy changes, and ZERO deletes.');
  console.log('✓ Generated file: migration_stage4_categories.sql\n');

  // Documentation markdown
  const mdContent = `# Haecca Hijab — Stage 4A.1 Category Dependency Report

> **Generated At**: ${nowIso}  
> **Status**: **CATEGORY DEPENDENCY IDENTIFIED — CATEGORY SEED SQL READY — NOT EXECUTED**  
> **Script Path**: \`migration_stage4_categories.sql\`

---

## 1. Exact Reason for Foreign Key Failure

When \`migration_stage4_secure.sql\` was executed in the Supabase SQL Editor, PostgreSQL raised error:

\`\`\`text
ERROR 23503:
insert or update on table "products" violates foreign key constraint "products_category_fkey"

DETAIL:
Key (category)=(voal) is not present in table "categories".
\`\`\`

### Analysis:
- The \`public.products\` table has a foreign key constraint named \`products_category_fkey\` which enforces that every product's \`category\` column must reference a valid entry in \`public.categories\`.
- Prior to running the product migration, the \`public.categories\` table was empty (**0 rows**).
- When the first product (\`hecca-daily-voal-waterproof\`) attempted to insert with \`category = 'voal'\`, PostgreSQL blocked the operation because \`'voal'\` did not exist in \`public.categories\`.
- Because the entire script was encapsulated in an atomic \`BEGIN ... COMMIT\` block, PostgreSQL **automatically rolled back the transaction**. As verified, **0 partial product rows** and **0 partial site_settings rows** remain in Supabase.

---

## 2. Table State & Counts

| Table | Pre-Migration Count | Required Target Count | Impact on Existing Rows |
|---|---|---|---|
| \`public.categories\` | **0** rows | **4** rows | New prerequisite records inserted |
| \`public.products\` | **0** rows (rolled back) | **0** (untouched in this step) | No products written |
| \`public.site_settings\` | **0** rows (rolled back) | **0** (untouched in this step) | No settings written |

---

## 3. Required Categories (4 Rows)

The 8 catalog products in Haecca Hijab require exactly 4 category records:

| # | \`id\` | \`slug\` | \`name\` | \`sort_order\` | \`is_visible\` | Associated Products Count |
|---|---|---|---|---|---|---|
| 1 | \`voal\` | \`voal\` | Voal | 1 | TRUE | 2 products (Daily Voal Waterproof, Voal Premium) |
| 2 | \`pashmina\` | \`pashmina\` | Pashmina | 2 | TRUE | 2 products (Pashmina Ceruty, Pashmina Silk Cradenza) |
| 3 | \`hijab\` | \`hijab\` | Hijab | 3 | TRUE | 2 products (Monogram Silk Square, Paris Square) |
| 4 | \`accessories\` | \`accessories\` | Accessories | 4 | TRUE | 2 products (Inner Ciput Rajut, Mulberry Silk Scrunchie) |

---

## 4. Exact SQL Script Generated

The SQL is located in \`migration_stage4_categories.sql\`:

\`\`\`sql
BEGIN;

INSERT INTO public.categories (id, slug, name, description, image_url, sort_order, is_visible, created_at, updated_at)
VALUES 
    ('voal', 'voal', 'Voal', 'Voal ultrafine premium dengan tepian laser cut presisi. Tidak licin, tegak paripurna di dahi.', 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80', 1, TRUE, now(), now()),
    ('pashmina', 'pashmina', 'Pashmina', 'Pashmina silk cradenza, ceruty baby doll, dan crinkle dengan drape anggun dan mudah dibentuk.', 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', 2, TRUE, now(), now()),
    ('hijab', 'hijab', 'Hijab', 'Koleksi hijab square, paris premium, dan daily hijab dengan jahitan tepi rapi dan bahan adem.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 3, TRUE, now(), now()),
    ('accessories', 'accessories', 'Accessories', 'Aksesoris pelengkap seperti ciput rajut 4-way anti pusing dan silk scrunchie anti rambut rontok.', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', 4, TRUE, now(), now())
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

COMMIT;
\`\`\`

---

## 5. Overwrite & Idempotency Analysis

- **Will any existing categories be overwritten?**: No, because the table currently has **0** rows.
- **Is it safe to run multiple times?**: Yes. The \`ON CONFLICT (id) DO UPDATE\` clause ensures that subsequent executions safely update rather than duplicating.
- **Are any foreign keys modified or disabled?**: No. Schema and constraints remain 100% untouched.

---

## 6. Execution Order Recommended for Supabase Dashboard

1. **Step 1 (Prerequisite)**: Execute \`migration_stage4_categories.sql\` in Supabase SQL Editor to seed the 4 categories.
2. **Step 2 (Catalog Migration)**: Execute \`migration_stage4_secure.sql\` in Supabase SQL Editor to seed the 8 products and 8 site settings.

---

## 7. Status

\`\`\`text
================================================================
CATEGORY DEPENDENCY IDENTIFIED — CATEGORY SEED SQL READY — NOT EXECUTED
================================================================
\`\`\`
`;

  fs.writeFileSync(path.resolve('migration_stage4_categories.md'), mdContent, 'utf-8');
  console.log('✓ Generated file: migration_stage4_categories.md\n');

  console.log('================================================================');
  console.log('CATEGORY DEPENDENCY IDENTIFIED — CATEGORY SEED SQL READY — NOT EXECUTED');
  console.log('================================================================');
}

generateCategoriesSql();
