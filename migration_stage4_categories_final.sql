-- ================================================================
-- HAECCA HIJAB — STAGE 4A.1 CATEGORIES SEED (FINAL)
-- Generated At: 2026-09-14T02:02:20.000Z
-- Target: Supabase Dashboard SQL Editor
-- Purpose: Resolve products_category_fkey foreign key constraint
-- Safety Guarantee: Idempotent UPSERT, NON-DESTRUCTIVE, NO DDL, NO RLS CHANGES
-- Note: categories.id defaults to gen_random_uuid(); conflict target is (slug)
-- ================================================================

BEGIN;

-- ----------------------------------------------------------------
-- INSERT 4 PREREQUISITE CATEGORIES (voal, pashmina, hijab, accessories)
-- ----------------------------------------------------------------

-- Category: Voal (Slug: voal)
INSERT INTO public.categories (
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
    'Voal',
    'Voal ultrafine premium dengan tepian laser cut presisi. Tidak licin, tegak paripurna di dahi.',
    'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    1,
    TRUE,
    '2026-09-14T02:02:20.000Z'::timestamptz,
    '2026-09-14T02:02:20.000Z'::timestamptz
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

-- Category: Pashmina (Slug: pashmina)
INSERT INTO public.categories (
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
    'Pashmina',
    'Pashmina silk cradenza, ceruty baby doll, dan crinkle dengan drape anggun dan mudah dibentuk.',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    2,
    TRUE,
    '2026-09-14T02:02:20.000Z'::timestamptz,
    '2026-09-14T02:02:20.000Z'::timestamptz
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

-- Category: Hijab (Slug: hijab)
INSERT INTO public.categories (
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
    'Hijab',
    'Koleksi hijab square, paris premium, dan daily hijab dengan jahitan tepi rapi dan bahan adem.',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    3,
    TRUE,
    '2026-09-14T02:02:20.000Z'::timestamptz,
    '2026-09-14T02:02:20.000Z'::timestamptz
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    sort_order = EXCLUDED.sort_order,
    is_visible = EXCLUDED.is_visible,
    updated_at = EXCLUDED.updated_at;

-- Category: Accessories (Slug: accessories)
INSERT INTO public.categories (
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
    'Accessories',
    'Aksesoris pelengkap seperti ciput rajut 4-way anti pusing dan silk scrunchie anti rambut rontok.',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    4,
    TRUE,
    '2026-09-14T02:02:20.000Z'::timestamptz,
    '2026-09-14T02:02:20.000Z'::timestamptz
)
ON CONFLICT (slug) DO UPDATE SET
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
SELECT COUNT(*) AS total_categories
FROM public.categories;

-- Query 2: Verify all 4 required slugs exist (expected: 4)
SELECT COUNT(*) AS required_categories_present
FROM public.categories
WHERE slug IN ('voal', 'pashmina', 'hijab', 'accessories');

-- Query 3: Inspect category rows ordered by sort_order (expected: 4 rows)
SELECT id, slug, name, sort_order, is_visible
FROM public.categories
WHERE slug IN ('voal', 'pashmina', 'hijab', 'accessories')
ORDER BY sort_order;

-- Query 4: Verify that all 4 IDs are valid UUIDs (expected: 4)
SELECT COUNT(*) AS valid_uuid_count
FROM public.categories
WHERE slug IN ('voal', 'pashmina', 'hijab', 'accessories')
  AND id::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
