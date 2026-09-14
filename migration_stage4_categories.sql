-- ================================================================
-- HAECCA HIJAB — STAGE 4A.1 CATEGORIES PREREQUISITE SEED
-- Generated At: 2026-09-13T18:46:05.285Z
-- Target: Supabase Dashboard SQL Editor
-- Purpose: Resolve products_category_fkey foreign key constraint
-- Safety Guarantee: Idempotent UPSERT, NON-DESTRUCTIVE, NO DDL, NO RLS CHANGES
-- ================================================================

BEGIN;

-- ----------------------------------------------------------------
-- INSERT 4 PREREQUISITE CATEGORIES (voal, pashmina, hijab, accessories)
-- ----------------------------------------------------------------

-- Category: Voal (Key: voal)
INSERT INTO public.categories (
    id,
    slug,
    name,
    description,
    image_url,
    sort_order,
    is_visible,
    created_at,
    updated_at
)
VALUES (
    'voal',
    'voal',
    'Voal',
    'Voal ultrafine premium dengan tepian laser cut presisi. Tidak licin, tegak paripurna di dahi.',
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    1,
    TRUE,
    '2026-09-13T18:46:05.285Z'::timestamptz,
    '2026-09-13T18:46:05.285Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

-- Category: Pashmina (Key: pashmina)
INSERT INTO public.categories (
    id,
    slug,
    name,
    description,
    image_url,
    sort_order,
    is_visible,
    created_at,
    updated_at
)
VALUES (
    'pashmina',
    'pashmina',
    'Pashmina',
    'Pashmina silk cradenza, ceruty baby doll, dan crinkle dengan drape anggun dan mudah dibentuk.',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    2,
    TRUE,
    '2026-09-13T18:46:05.285Z'::timestamptz,
    '2026-09-13T18:46:05.285Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

-- Category: Hijab (Key: hijab)
INSERT INTO public.categories (
    id,
    slug,
    name,
    description,
    image_url,
    sort_order,
    is_visible,
    created_at,
    updated_at
)
VALUES (
    'hijab',
    'hijab',
    'Hijab',
    'Koleksi hijab square, paris premium, dan daily hijab dengan jahitan tepi rapi dan bahan adem.',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    3,
    TRUE,
    '2026-09-13T18:46:05.285Z'::timestamptz,
    '2026-09-13T18:46:05.285Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

-- Category: Accessories (Key: accessories)
INSERT INTO public.categories (
    id,
    slug,
    name,
    description,
    image_url,
    sort_order,
    is_visible,
    created_at,
    updated_at
)
VALUES (
    'accessories',
    'accessories',
    'Accessories',
    'Aksesoris pelengkap seperti ciput rajut 4-way anti pusing dan silk scrunchie anti rambut rontok.',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    4,
    TRUE,
    '2026-09-13T18:46:05.285Z'::timestamptz,
    '2026-09-13T18:46:05.285Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

COMMIT;

-- ================================================================
-- POST-SEED VERIFICATION QUERIES
-- ================================================================

-- Query 1: Total categories count (expected: 4)
SELECT COUNT(*) AS total_categories FROM public.categories;

-- Query 2: Verify all 4 required keys exist (expected: 4)
SELECT COUNT(*) AS required_categories_present FROM public.categories WHERE id IN ('voal', 'pashmina', 'hijab', 'accessories');

-- Query 3: Inspect category rows
SELECT id, slug, name, sort_order, is_visible, updated_at FROM public.categories ORDER BY sort_order ASC;
