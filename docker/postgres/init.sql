CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.pieces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    story TEXT,
    main_image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    craft_details JSONB DEFAULT '[]'::jsonb,
    size_info TEXT,
    measurements TEXT,
    showcase_section TEXT DEFAULT 'shopier',
    is_shopier_product BOOLEAN DEFAULT true,
    shopier_sku TEXT,
    shopier_url TEXT,
    price NUMERIC,
    is_archived BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.journal_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    quote TEXT,
    content TEXT,
    photo_urls TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_embeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    caption TEXT NOT NULL,
    thumbnail_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.pieces (
    id, title, slug, category, story, main_image_url, gallery_urls, craft_details,
    size_info, measurements, showcase_section, is_shopier_product, shopier_sku,
    shopier_url, price, is_archived, order_index, created_at, updated_at
) VALUES (
    'c0755f79-3889-4978-a39c-352920b30279',
    'Dantel Şeritli Şortolon',
    'dantel-seritli-sortolon',
    'Şortolon',
    'Likralı dokuma kumaşla üretilmiştir.
Yanlarda dantel şerit detayları ile günlük hayatınızdaki neşenize eşlik etmeye hazır.',
    'https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787098702440-cmdoobd.jpg',
    ARRAY['https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787098730824-xyq8mmb.jpg'],
    '[{"label":"Kumaş Türü","value":"Likralı Dokuma Kumaş"},{"label":"Şerit Detayı","value":"Dantel Şeritli"}]'::jsonb,
    'xs-xl bedene kadar kuşağı ile genişletilebilmekte',
    '51cm uzunluk',
    'shopier',
    true,
    NULL,
    'https://www.shopier.com/ruruwhimsical/49788238',
    1250,
    false,
    1,
    '2026-08-19T00:19:28.753081+00:00',
    '2026-08-19T00:20:42.635+00:00'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pieces (
    id, title, slug, category, story, main_image_url, gallery_urls, craft_details,
    size_info, measurements, showcase_section, is_shopier_product, shopier_sku,
    shopier_url, price, is_archived, order_index, created_at, updated_at
) VALUES (
    '5889766e-4e0c-494f-b054-4506dddaca65',
    'Böcük stickerlar',
    'bocuk-stickerlar',
    'Sticker',
    'İlk pazar standım için hazırladığım stickerların çizim halleri',
    'https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787099985249-gu2nafb.jpg',
    ARRAY['https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787099991040-e9sfffz.jpg', 'https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787099992478-sugi0tc.jpg', 'https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787099994051-fdjssuv.jpg', 'https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787099995621-8jwagwf.jpg', 'https://uciwtmxydhmwpvlyxcag.supabase.co/storage/v1/object/public/portfolio/1787099997465-zob727s.jpg'],
    '[{"label":"Boyama yöntemi","value":"Kurşun kalem"}]'::jsonb,
    NULL,
    NULL,
    'creative',
    false,
    NULL,
    NULL,
    NULL,
    false,
    1,
    '2026-08-19T00:40:55.001272+00:00',
    '2026-08-19T00:40:55.001272+00:00'
) ON CONFLICT (id) DO NOTHING;


INSERT INTO public.journal_notes (
    id, title, quote, content, photo_urls, is_published, published_at, created_at
) VALUES (
    '92810c23-78c0-4f8c-8878-b4725817b496',
    'Avize planları',
    'Üretmeden yaşayamam.',
    'Fotoğraf makinesi filmlerinden lamba kaplaması',
    '{}'::text[],
    true,
    '2026-08-19T01:12:09.228+00:00',
    '2026-08-19T01:12:09.616868+00:00'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.journal_notes (
    id, title, quote, content, photo_urls, is_published, published_at, created_at
) VALUES (
    '9433e488-cbcc-4683-8b8d-6b4d8114b80c',
    'ben ve sen',
    'nedensiz geceler',
    'Buraya upuzun yazılar yazmak gerekmese de yazmak isterim belki sessiz ama puantiyeli heceler ve sonrasında gelen ufuk çizgisine yakınlığıyla bilinen güneş parçası',
    '{}'::text[],
    true,
    '2026-08-19T01:39:00.258+00:00',
    '2026-08-19T01:39:00.631578+00:00'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.journal_notes (
    id, title, quote, content, photo_urls, is_published, published_at, created_at
) VALUES (
    'f37f912b-7dd0-4580-97dd-34dd2cea0562',
    'Deniyor gözükmek',
    'Denemek ya da denememek işte bütün mesele bu',
    'İşte bu da benim denemem xoxo',
    '{}'::text[],
    true,
    '2026-08-19T02:39:50.258+00:00',
    '2026-08-19T02:39:50.485209+00:00'
) ON CONFLICT (id) DO NOTHING;


INSERT INTO public.social_embeds (
    id, platform, url, caption, thumbnail_url, order_index, created_at
) VALUES (
    'c27dc737-6298-43dc-80ba-bb26254ed452',
    'tiktok',
    'https://www.tiktok.com/@ruru_whimsical/video/7674904582182489365',
    'güvenle yeni evine git şortolon bebek 🍀💕',
    'https://p16-common-sign.tiktokcdn.com/tos-alisg-p-0037/ocRrEViWAyKKi0HCAABAI6Q9I31wvBCCAVixfi~tplv-tiktokx-origin.image?dr=14575&x-expires=1787274000&x-signature=PeSAqP633DhIvDpnElw92KqeA9A%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=43f4a2f9&idc=my2',
    1,
    '2026-08-19T01:28:17.060332+00:00'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.social_embeds (
    id, platform, url, caption, thumbnail_url, order_index, created_at
) VALUES (
    '117b15dd-0720-4acd-b9ae-bae874feb890',
    'instagram-post',
    'https://www.instagram.com/p/DbVr1cbM0JL/',
    'Instagram Gönderisi',
    NULL,
    1,
    '2026-08-19T02:31:01.930981+00:00'
) ON CONFLICT (id) DO NOTHING;

