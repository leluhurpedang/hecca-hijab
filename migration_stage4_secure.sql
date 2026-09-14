-- ================================================================
-- HAECCA HIJAB — STAGE 4A.1 SECURE INITIAL MIGRATION SCRIPT
-- Generated At: 2026-09-13T18:36:38.060Z
-- Target: Supabase Dashboard SQL Editor
-- Security Model: Executed with postgres/service_role privileges
-- Safety Guarantee: Idempotent UPSERT, NON-DESTRUCTIVE, NO DDL, NO RLS CHANGES
-- ================================================================

BEGIN;

-- ----------------------------------------------------------------
-- SECTION 1: PRODUCTS TABLE UPSERT (8 ITEMS)
-- ----------------------------------------------------------------

-- Product: Haecca Daily Voal Water-Repellent (ID: hecca-daily-voal-waterproof)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-daily-voal-waterproof',
    'hecca-daily-voal-waterproof',
    'Haecca Daily Voal Water-Repellent',
    'Inovasi hijab voal tahan percikan air wudhu tanpa khawatir noda basah',
    'voal',
    'Voal',
    95000,
    125000,
    35,
    4.8,
    74,
    TRUE,
    FALSE,
    TRUE,
    'Ultrafine Voal with Hydrophobic Eco-Nano Coating',
    '115 cm x 115 cm',
    'Laser Cut Wave Pattern dengan Plat Emas Haecca',
    'Solusi terbaik untuk muslimah modern. Diformulasikan dengan teknologi eco-coating water-repellent yang menolak tetesan air saat wudhu atau hujan gerimis, namun serat kain tetap bernapas sejuk dan nyaman dipakai sepanjang hari.',
    '["Hydrophobic Nano Coating: Tetesan air langsung bergulir tanpa meresap","Cepat kering hanya dalam hitungan detik setelah diusap","Tetap lembut dan fleksibel seperti voal premium biasa","Aman untuk pencucian hingga 30+ kali tanpa mengurangi performa"]'::jsonb,
    '["Cuci perlahan tanpa digosok terlalu keras di permukaan coating","Cukup dibilas air bersih dan dikeringkan di tempat sejuk","Setrika suhu rendah di sisi dalam hijab"]'::jsonb,
    '[{"name":"Stone Grey","hex":"#B5B8B6"},{"name":"Nude Blush","hex":"#DEC4B8"},{"name":"Cocoa Latte","hex":"#8B705D"},{"name":"Forest Green","hex":"#4B584E"}]'::jsonb,
    '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    5,
    '2026-09-13T18:35:58.036Z'::timestamptz,
    '2026-09-13T18:36:38.036Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- Product: Haecca Inner Hijab Ciput Rajut 4-Way Stretch (ID: hecca-inner-ciput-rajut)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-inner-ciput-rajut',
    'hecca-inner-ciput-rajut',
    'Haecca Inner Hijab Ciput Rajut 4-Way Stretch',
    'Ciput rajut anti pusing dengan pori sirkulasi udara bebas gerah',
    'accessories',
    'Accessories',
    35000,
    NULL,
    90,
    5,
    420,
    FALSE,
    TRUE,
    TRUE,
    'Premium Spun Poly-Cotton Knit with Spandex Core',
    'All Size Elastis (One Size Fits All)',
    'Seamless Edge & Anti-Slip Band',
    'Pondasi utama kenyamanan berhijab Anda. Inner rajut Haecca dibuat dengan kerapatan rajut berpola ergonomis yang tidak menekan tulang kepala, tidak menjepit daun telinga, dan memastikan rambut tetap rapi sepanjang hari.',
    '["Teknologi rajut 4-Way Stretch: Menyesuaikan bentuk kepala tanpa rasa tertekan","Pori-pori rajut mikro untuk sirkulasi udara maksimal anti keringat","Tidak mudah melar kendur meski dicuci berulang kali","Pilihan warna netral menyatu dengan warna kulit dan hijab"]'::jsonb,
    '["Cuci dengan tangan menggunakan air biasa","Jangan diperas dengan memutar kain secara kasar","Jemur datar (flat dry) agar elastisitas tetap terjaga"]'::jsonb,
    '[{"name":"Jet Black","hex":"#1C1917"},{"name":"Nude Skin","hex":"#DEBAA3"},{"name":"Cream Latte","hex":"#EBE2D5"},{"name":"Dark Grey","hex":"#524F4C"}]'::jsonb,
    '["https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    6,
    '2026-09-13T18:36:08.036Z'::timestamptz,
    '2026-09-13T18:36:38.036Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- Product: Haecca Exclusive Monogram Silk Square (ID: hecca-monogram-silk-square)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-monogram-silk-square',
    'hecca-monogram-silk-square',
    'Haecca Exclusive Monogram Silk Square',
    'Signature monogram hijab bercorak floral artistik dengan kemasan kado mewah',
    'hijab',
    'Hijab',
    149000,
    189000,
    20,
    5,
    88,
    TRUE,
    TRUE,
    TRUE,
    'Premium Silk Twill with Delicate Satin Luster',
    '115 cm x 115 cm',
    'Hand-Rolled Hem Edge & 18K Gold Plated Haecca Monogram Charm',
    'Mahakarya koleksi Haecca Hijab. Menghadirkan motif monogram eksklusif berpadu ilustrasi botani klasik dengan detail warna soft dan menenangkan. Dilengkapi box packaging hard cover berpita satin emas.',
    '["Motif monogram orisinil karya desainer in-house Haecca","Tekstur silk twill lembut dengan kilau satin mewah yang tidak licin","Finishing kelim tangan (hand-rolled hem) berkualitas haute couture","Packaging eksklusif: Sliding rigid box dengan kartu ucapan kado"]'::jsonb,
    '["Dry clean atau cuci tangan secara lembut dengan cairan pencuci sutra","Hindari memeras kain, cukup tiriskan perlahan","Setrika suhu rendah dari sisi belakang"]'::jsonb,
    '[{"name":"Earthy Taupe","hex":"#A8998C"},{"name":"Royal Emerald","hex":"#3E5C4E"},{"name":"Rose Quartz","hex":"#D8AEA4"}]'::jsonb,
    '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    8,
    '2026-09-13T18:36:28.036Z'::timestamptz,
    '2026-09-13T18:36:38.036Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- Product: Haecca Paris Square Classic (ID: hecca-paris-square)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-paris-square',
    'hecca-paris-square',
    'Haecca Paris Square Classic',
    'Hijab paris legendaris dengan jahitan neci butik dan serat katun alami',
    'hijab',
    'Hijab',
    65000,
    NULL,
    60,
    4.8,
    230,
    FALSE,
    TRUE,
    TRUE,
    '100% Paris Cotton Premium Grade A',
    '110 cm x 110 cm',
    'Jahit Neci Halus Rapat Khas Butik (High Density Overlock)',
    'Koleksi hijab paris klasik yang disempurnakan. Menggunakan serat katun alami premium yang adem, tidak membuat telinga berdengung, dan memberikan look santai namun tetap rapi untuk keseharian.',
    '["100% serat katun murni alami yang sejuk dan menyerap keringat","Jahitan neci rapi khas pengrajin berpengalaman","Tegak alami tanpa perlu bantuan jarum pentul berlebih","Pilihan warna earthy pastel yang mudah dipadupadankan"]'::jsonb,
    '["Bisa dicuci mesin dengan laundry net atau cuci tangan","Jemur membentang agar bentuk persegi tetap presisi","Setrika suhu katun/katun sedang"]'::jsonb,
    '[{"name":"Oat Milk","hex":"#EAE3D5"},{"name":"Denim Ash","hex":"#8B9BAE"},{"name":"Warm Terracotta","hex":"#B57463"},{"name":"Cocoa Brown","hex":"#6A5344"},{"name":"Dark Charcoal","hex":"#333130"},{"name":"Soft Olive","hex":"#949984"}]'::jsonb,
    '["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    3,
    '2026-09-13T18:35:38.036Z'::timestamptz,
    '2026-09-13T18:36:38.036Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- Product: Haecca Pashmina Ceruty Baby Doll (ID: hecca-pashmina-ceruty)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-pashmina-ceruty',
    'hecca-pashmina-ceruty',
    'Haecca Pashmina Ceruty Baby Doll',
    'Pashmina tekstur butir pasir halus dengan flowy drape yang effortless',
    'pashmina',
    'Pashmina',
    75000,
    95000,
    52,
    4.9,
    312,
    FALSE,
    TRUE,
    TRUE,
    'Ceruty Baby Doll Premium Import (Heavy Weight)',
    '180 cm x 75 cm',
    'Jahit Tepi Rapi Standar Ekspor',
    'Pashmina ceruty baby doll terfavorit dengan gramasi kain yang pas, memberikan efek layer yang jatuh bervolume tanpa terasa berat. Tekstur butir pasir lembut memberi cengkeraman halus sehingga tidak mudah melorot.',
    '["Gramasi kain jatuh mantap (tidak tipis melayang)","Tekstur pasir lembut yang breathable dan tidak gatal","Panjang ideal 180 cm untuk lilitan clean look ala selebgram","Jahitan tepi lurus presisi"]'::jsonb,
    '["Cuci dengan tangan untuk menjaga kelembutan serat ceruty","Hindari penggunaan pemutih pakaian","Setrika suhu sedang saat kain masih agak lembap"]'::jsonb,
    '[{"name":"Almond Beige","hex":"#D8C3AE"},{"name":"Sage Mist","hex":"#A8B3A0"},{"name":"Dusty Pink","hex":"#DCAEB0"},{"name":"Caramel","hex":"#9E7457"},{"name":"Hitam Jet Black","hex":"#1E1B19"},{"name":"Broken White","hex":"#FAF7F0"}]'::jsonb,
    '["https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    4,
    '2026-09-13T18:35:48.036Z'::timestamptz,
    '2026-09-13T18:36:38.036Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- Product: Haecca Pashmina Silk Cradenza (ID: hecca-pashmina-silk)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-pashmina-silk',
    'hecca-pashmina-silk',
    'Haecca Pashmina Silk Cradenza',
    'Kilau mewah pashmina silk dengan drape lembut yang anggun',
    'pashmina',
    'Pashmina',
    115000,
    145000,
    28,
    5,
    96,
    TRUE,
    TRUE,
    TRUE,
    'High-Grade Cradenza Silk with Subtle Shimmer Finish',
    '180 cm x 75 cm',
    'Jahit Tepi Butik Halus & Rapat (Double Stitched Edge)',
    'Pashmina silk cradenza premium dengan efek shimmer yang elegan dan tidak berlebihan. Memberikan efek flattering dan mewah seketika, sangat cocok untuk momen pesta, pernikahan, wisuda, maupun dinner formal.',
    '["Sentuhan shimmer mewah yang berkilau lembut di bawah pencahayaan","Drape jatuh sangat anggun mengikuti lekuk pundak","Tidak mudah kusut dan tidak licin saat dikenakan dengan ciput","Ukuran leluasa 180x75 cm untuk kreasi styling variatif","Kemasan hardbox kado mewah berpita pita satin Haecca"]'::jsonb,
    '["Cuci tangan secara lembut, jangan diperas terlalu kencang","Gunakan detergen cair khusus kain sutra / bahan halus","Setrika bagian dalam dengan suhu rendah (silk setting)"]'::jsonb,
    '[{"name":"Champagne Gold","hex":"#E8D8B8"},{"name":"Rose Gold","hex":"#D9ABA0"},{"name":"Soft Taupe","hex":"#C2B4A7"},{"name":"Pearl Cream","hex":"#F6F2EA"},{"name":"Midnight Charcoal","hex":"#2B2623"}]'::jsonb,
    '["https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    2,
    '2026-09-13T18:35:28.035Z'::timestamptz,
    '2026-09-13T18:36:38.035Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- Product: Haecca Mulberry Silk Scrunchie Anti Rontok (ID: hecca-silk-scrunchie)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-silk-scrunchie',
    'hecca-silk-scrunchie',
    'Haecca Mulberry Silk Scrunchie Anti Rontok',
    'Kuncir rambut sutra murni pencegah gesekan dan rambut patah',
    'accessories',
    'Accessories',
    29000,
    39000,
    80,
    4.9,
    265,
    FALSE,
    TRUE,
    TRUE,
    '100% Grade 6A Pure Mulberry Silk 22 Momme',
    'Diameter 10 cm (Medium Full Puff)',
    'Elastic Inner Core High Retention',
    'Kunciran rambut sutra yang dirancang khusus untuk pengguna hijab. Permukaan serat sutra halus meminimalkan gesekan pada batang rambut sehingga mencegah rambut kusut, rontok, dan meninggalkan bekas ikatan.',
    '["100% Pure Mulberry Silk yang kaya asam amino alami pelindung rambut","Karet elastis berkualitas tinggi yang tidak mudah kendor","Volume cepol ideal tanpa membuat kepala terasa berat di balik hijab","Bahan lembut ekstra aman untuk rambut sensitif dan mudah rontok"]'::jsonb,
    '["Rendam sebentar dalam air suam-kuku dengan sedikit shampo bayi","Bilas dan tekan pelan dengan handuk kering, jemur di tempat teduh"]'::jsonb,
    '[{"name":"Rose Gold","hex":"#DCA59B"},{"name":"Champagne Silk","hex":"#ECD7BA"},{"name":"Mocha Soft","hex":"#9E8573"},{"name":"Ivory White","hex":"#FDF9F2"}]'::jsonb,
    '["https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    7,
    '2026-09-13T18:36:18.036Z'::timestamptz,
    '2026-09-13T18:36:38.036Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- Product: Haecca Voal Premium Ultrafine (ID: hecca-voal-premium)
INSERT INTO public.products (
    id,
    slug,
    name,
    tagline,
    category,
    category_label,
    price,
    original_price,
    stock,
    rating,
    review_count,
    is_new,
    is_best_seller,
    is_visible,
    material,
    dimensions,
    finishing,
    description,
    features,
    care_instructions,
    colors,
    images,
    sort_order,
    created_at,
    updated_at
)
VALUES (
    'hecca-voal-premium',
    'hecca-voal-premium',
    'Haecca Voal Premium Ultrafine',
    'Voal ultrafine lembut berstandar butik dengan tepian laser cut presisi',
    'voal',
    'Voal',
    89000,
    119000,
    45,
    4.9,
    184,
    FALSE,
    TRUE,
    TRUE,
    'Ultrafine Voal Voile Import Grade A',
    '115 cm x 115 cm',
    'Clean Laser Cut 4 Sisi dengan Signature Haecca Rose Gold Charm',
    'Haecca Voal Premium Ultrafine dirancang khusus untuk wanita aktif yang mendambakan kepraktisan tanpa mengorbankan keanggunan. Dibuat dari benang serat ultrafine berdensitas tinggi, hijab ini memiliki ketebalan yang pas, tidak menerawang, tidak pekak/berdengung di telinga, serta tegak sempurna di dahi sejak pemakaian pertama.',
    '["Tegak melengkung sempurna di dahi tanpa perlu disemprot pelicin","Material breathable, adem di kulit kepala seharian","Tepian laser cut modern yang rapi dan tahan cuci berulang kali","Ironless dan mudah diatur dalam berbagai gaya hijab harian maupun formal","Termasuk signature Haecca reusable pouch & box packaging eksklusif"]'::jsonb,
    '["Disarankan mencuci dengan tangan menggunakan detergen lembut","Hindari menyikat permukaan kain agar serat voal tetap halus","Keringkan di tempat teduh tanpa terkena sinar matahari langsung","Setrika dengan suhu rendah hingga sedang (medium heat)"]'::jsonb,
    '[{"name":"Soft Sand","hex":"#E3D7CC"},{"name":"Dusty Rose","hex":"#D6A69A"},{"name":"Mocca Nude","hex":"#B8977E"},{"name":"Broken White","hex":"#F7F5F0"},{"name":"Olive Sage","hex":"#9DA494"},{"name":"Deep Espresso","hex":"#3A2E26"}]'::jsonb,
    '["https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80","https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80"]'::jsonb,
    1,
    '2026-09-13T18:35:18.035Z'::timestamptz,
    '2026-09-13T18:36:38.035Z'::timestamptz
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    is_new = EXCLUDED.is_new,
    is_best_seller = EXCLUDED.is_best_seller,
    is_visible = EXCLUDED.is_visible,
    material = EXCLUDED.material,
    dimensions = EXCLUDED.dimensions,
    finishing = EXCLUDED.finishing,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    care_instructions = EXCLUDED.care_instructions,
    colors = EXCLUDED.colors,
    images = EXCLUDED.images,
    sort_order = EXCLUDED.sort_order,
    updated_at = EXCLUDED.updated_at;

-- ----------------------------------------------------------------
-- SECTION 2: SITE SETTINGS TABLE UPSERT (8 MODULES)
-- ----------------------------------------------------------------

-- Setting Module: brand
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'brand',
    '{"key":"brand","brandName":"Haecca Hijab","tagline":"Premium Modest Fashion","shortDescription":"Brand hijab & busana muslimah modern dengan sentuhan elegan, material berkualitas tinggi, dan harga yang bersahabat untuk setiap wanita Indonesia.","logoText":"HAECCA","logoImage":"","copyrightText":"© 2026 Haecca Hijab. Seluruh hak cipta dilindungi undang-undang."}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

-- Setting Module: navigation
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'navigation',
    '{"key":"navigation","items":[{"id":"nav-1","label":"Beranda","type":"page","path":"/","isEnabled":true},{"id":"nav-2","label":"Semua Produk","type":"page","path":"/shop","isEnabled":true},{"id":"nav-3","label":"Pashmina","type":"category","category":"pashmina","path":"/shop?category=pashmina","isEnabled":true},{"id":"nav-4","label":"Voal","type":"category","category":"voal","path":"/shop?category=voal","isEnabled":true},{"id":"nav-5","label":"Hijab","type":"category","category":"hijab","path":"/shop?category=hijab","isEnabled":true},{"id":"nav-6","label":"Aksesoris","type":"category","category":"accessories","path":"/shop?category=accessories","isEnabled":true},{"id":"nav-7","label":"Tentang Kami","type":"page","path":"/about","isEnabled":true}]}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

-- Setting Module: announcementBar
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'announcementBar',
    '{"key":"announcementBar","isEnabled":true,"announcementText":"Special Launch: Gratis Ongkir min. belanja Rp250.000 • Gunakan kode HAECCANEW diskon 10%","voucherCode":"HAECCANEW","discountPercentage":10,"link":"/shop"}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

-- Setting Module: homepage
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'homepage',
    '{"key":"homepage","hero":{"eyebrow":"Koleksi Signature 2026","heading":"Sentuhan Keanggunan dalam Setiap Helai Hijab","description":"Diciptakan dengan material voal ultrafine dan serat silk premium berstandar butik. Lembut, adem, tegak paripurna di dahi, serta memancarkan pesona anggun setiap muslimah modern.","primaryCtaText":"Belanja Sekarang","primaryCtaLink":"/shop","secondaryCtaText":"Lihat Voal Premium","secondaryCtaLink":"/shop?category=voal","heroImage":"https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80","materialLabel":"Bahan Eksklusif","materialTitle":"Ultrafine Voal Voile Import","startingPrice":"Mulai Rp 89.000"},"spotlight":{"isEnabled":true,"eyebrow":"Limited Edition Series","title":"The Silk Harmony: Kemewahan yang Nyaman Seharian","description":"Dibuat dari benang sutra cradenza grade 6A dengan kilau shimmer natural yang memikat. Setiap pembelian seri ini mendapatkan kemasan exclusive rigid giftbox berpita satin emas.","image":"https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85","ctaText":"Miliki Sekarang","ctaLink":"/shop?category=pashmina"},"sections":{"showCategories":true,"showNewArrivals":true,"showSpotlight":true,"showBestSellers":true,"showValueProps":true,"showTestimonials":true,"showNewsletter":true},"sectionTitles":{"categoriesTitle":"Pilihan Koleksi","categoriesSubtitle":"Temukan padanan hijab sempurna untuk setiap momen istimewa","newArrivalsTitle":"Koleksi Terbaru","newArrivalsSubtitle":"Sentuhan warna & siluet terkini yang dirancang untuk muslimah modern","bestSellersTitle":"Produk Terlaris","bestSellersSubtitle":"Favorit ribuan #HaeccaLadies untuk kenyamanan dan keanggunan sehari-hari"},"valueProps":[{"title":"Material Adem & Ringan","desc":"Serat alami breathable yang sejuk dan tidak mendengung di telinga.","icon":"Sparkles"},{"title":"Jahitan Standar Butik","desc":"Tepian clean laser cut & jahit tepi presisi tanpa benang terurai.","icon":"ShieldCheck"},{"title":"Packaging Mewah Siap Kado","desc":"Kemasan reusable pouch & hardbox eksklusif berlabel gold foil.","icon":"Truck"},{"title":"Tegak Paripurna di Dahi","desc":"Mudah dibentuk melengkung rapi tanpa perlu hairspray pelicin.","icon":"RefreshCw"}],"testimonials":[{"id":1,"name":"dr. Aisyah Ramadhani","role":"Dokter & Hijab Enthusiast","city":"Jakarta Selatan","rating":5,"review":"Voal ultrafine Haecca benar-benar penyelamat dinas jaga panjang. Tidak gerah sama sekali, tidak berdengung di telinga waktu pakai stetoskop, dan bentuk tegaknya konsisten seharian tanpa geser!"},{"id":2,"name":"Nadia Salsabila","role":"Fashion Content Creator","city":"Bandung","rating":5,"review":"Warna Sandstone dan Soft Mocca-nya pas banget di kulit sawo matang! Jatuhnya mewah berkelas seperti pashmina desainer jutaan rupiah. Unboxing package hardbox-nya wangi dan estetik banget."},{"id":3,"name":"Fitri Handayani","role":"Corporate Professional","city":"Surabaya","rating":5,"review":"Sudah order ketiga kalinya di Haecca. Bahan Silk Cradenza-nya jatuh anggun, shimmer-nya halus tidak lebay, cocok banget dipakai meeting formal maupun kondangan keluarga."}]}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

-- Setting Module: about
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'about',
    '{"key":"about","eyebrow":"Tentang Haecca","heading":"Merayakan Keanggunan Muslimah Melalui Kualitas Tanpa Kompromi","intro":"Haecca Hijab lahir dari sebuah keyakinan sederhana: bahwa setiap wanita berhak merasakan kenyamanan sejati dan keanggunan berkelas tanpa harus membayar harga yang tak masuk akal.","storyLabel":"Awal Mula Haecca","quote":"\"Hijab seharusnya tidak hanya indah dipandang, namun terasa seperti hembusan angin sejuk saat dikenakan.\"","storyP1":"Didirikan di Jakarta Selatan pada tahun 2024, Haecca berawal dari pencarian pribadi akan bahan voal yang benar-benar tidak mendengung di telinga, adem seharian di cuaca tropis, dan tegak rapi di dahi tanpa perlu disemprot pelicin kimia.","storyP2":"Kami bekerja sama langsung dengan pabrik tenun serat ultrafine terbaik untuk memproduksi kain berdensitas tinggi dengan finishing laser cut presisi. Setiap helai hijab melewati 3 tahap quality control ketat sebelum dikemas dalam signature packaging mewah siap hadiah.","aboutImage":"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80","fabricStoryTitle":"Boutique Studio & Layanan Pelanggan","fabricStoryText":"Ada pertanyaan mengenai panduan warna, ketersediaan stok, atau pesanan khusus untuk acara pernikahan/bridesmaid? Tim konsultan hijab Haecca siap membantu Anda dengan senang hati.","fabricImage":"https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80","studioAddress":"Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190","studioHours":"Senin - Sabtu: 09.00 - 20.00 WIB | Minggu: 10.00 - 18.00 WIB","email":"hello@haeccahijab.com","whatsapp":"6281234567890"}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

-- Setting Module: footer
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'footer',
    '{"key":"footer","brandName":"Haecca Hijab","tagline":"Premium Modest Fashion","description":"Brand hijab & busana muslimah modern dengan sentuhan elegan, material berkualitas tinggi, dan harga yang bersahabat untuk setiap wanita Indonesia.","footerLogoImage":"","socials":{"instagram":"https://instagram.com/haeccahijab","whatsapp":"https://wa.me/6281234567890","email":"hello@haeccahijab.com","tiktok":"https://tiktok.com/@haeccahijab","showInstagram":true,"showWhatsapp":true,"showEmail":true,"showTiktok":true},"collectionLinks":[{"label":"Pashmina Silk","to":"/shop?category=pashmina"},{"label":"Voal Premium","to":"/shop?category=voal"},{"label":"Hijab Segiempat","to":"/shop?category=hijab"},{"label":"Aksesoris Hijab","to":"/shop?category=accessories"},{"label":"Koleksi Terbaru","to":"/shop"}],"helpLinks":[{"label":"Tentang Kami","to":"/about"},{"label":"Panduan Ukuran & Perawatan","to":"/about"},{"label":"Kebijakan Pengembalian","to":"/about"},{"label":"Hubungi WhatsApp Care","to":"https://wa.me/6281234567890"}],"paymentMethods":["BCA","Mandiri","BSI","QRIS","COD / WhatsApp"],"copyright":"© 2026 Haecca Hijab. Seluruh hak cipta dilindungi undang-undang.","showAdminLink":true}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

-- Setting Module: store
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'store',
    '{"key":"store","storeName":"Haecca Hijab","legalEntity":"PT Haecca Busana Indonesia","tagline":"Sentuhan Keanggunan dalam Setiap Helai","whatsappNumber":"6281234567890","email":"hello@haeccahijab.com","address":"Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190","operatingHours":"Setiap Hari, 08:00 - 21:00 WIB","instagramUrl":"https://instagram.com/haeccahijab","tiktokUrl":"https://tiktok.com/@haeccahijab","freeShippingThreshold":250000,"currencySymbol":"Rp"}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

-- Setting Module: whatsapp
INSERT INTO public.site_settings (key, data, updated_at)
VALUES (
    'whatsapp',
    '{"key":"whatsapp","recipientNumber":"6281234567890","greetingTemplate":"Halo Admin Haecca Hijab, saya ingin memesan produk berikut:","defaultAdditionalNote":"Mohon info total pembayaran dan nomor rekening transfer resmi.","showFloatingButton":true}'::jsonb,
    '2026-09-13T18:36:38.060Z'::timestamptz
)
ON CONFLICT (key) DO UPDATE SET
    data = EXCLUDED.data,
    updated_at = EXCLUDED.updated_at;

COMMIT;

-- ================================================================
-- SECTION 3: POST-MIGRATION VERIFICATION QUERIES
-- ================================================================

-- Query 1: Total products count (expected: 8)
SELECT COUNT(*) AS total_products FROM public.products;

-- Query 2: Total migrated product IDs matching expected catalog (expected: 8)
SELECT COUNT(*) AS migrated_catalog_count FROM public.products WHERE id IN ('hecca-daily-voal-waterproof', 'hecca-inner-ciput-rajut', 'hecca-monogram-silk-square', 'hecca-paris-square', 'hecca-pashmina-ceruty', 'hecca-pashmina-silk', 'hecca-silk-scrunchie', 'hecca-voal-premium');

-- Query 3: Total site settings count (expected: 8)
SELECT COUNT(*) AS total_site_settings FROM public.site_settings;

-- Query 4: Each migrated site setting key (expected: brand, navigation, announcementBar, homepage, about, footer, store, whatsapp)
SELECT key, updated_at FROM public.site_settings ORDER BY key;

-- Query 5: Duplicate slug check (expected: 0 duplicate rows)
SELECT slug, COUNT(*) AS count FROM public.products GROUP BY slug HAVING COUNT(*) > 1;

-- Query 6: Migrated product IDs and names
SELECT id, slug, name, category, price, stock, jsonb_array_length(images) AS image_count FROM public.products ORDER BY sort_order ASC, name ASC;
