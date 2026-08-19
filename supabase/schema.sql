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

        ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.journal_notes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.social_embeds ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Public Read Pieces" ON public.pieces FOR SELECT USING (true);
        CREATE POLICY "Public Read Journal" ON public.journal_notes FOR SELECT USING (true);
        CREATE POLICY "Public Read Social" ON public.social_embeds FOR SELECT USING (true);

        CREATE POLICY "Allow All Pieces" ON public.pieces FOR ALL USING (true) WITH CHECK (true);
        CREATE POLICY "Allow All Journal" ON public.journal_notes FOR ALL USING (true) WITH CHECK (true);
        CREATE POLICY "Allow All Social" ON public.social_embeds FOR ALL USING (true) WITH CHECK (true);

        INSERT INTO storage.buckets (id, name, public)
        VALUES ('portfolio', 'portfolio', true),
            ('journal', 'journal', true)
        ON CONFLICT (id) DO NOTHING;

        CREATE POLICY "Public Read Storage" ON storage.objects
            FOR SELECT USING (bucket_id IN ('portfolio', 'journal'));

        CREATE POLICY "Public Upload Storage" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id IN ('portfolio', 'journal'));

        CREATE POLICY "Public Update Storage" ON storage.objects
            FOR UPDATE WITH CHECK (bucket_id IN ('portfolio', 'journal'));

        CREATE POLICY "Public Delete Storage" ON storage.objects
            FOR DELETE USING (bucket_id IN ('portfolio', 'journal'));

        INSERT INTO public.pieces (title, slug, category, story, main_image_url, is_shopier_product, price, shopier_url, order_index)
        VALUES 
        (
            'Tirşe Keten Gömlek Elbise',
            'tirse-keten-gomlek-elbise',
            'keten',
            'Bu keteni bulduğumda solgun yeşiline vurulmuştum. Geniş cepleri ve sedef düğmeleriyle tam bir bahar yürüyüşü elbisesi oldu.',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
            true,
            2850,
            'https://shopier.com',
            1
        ),
        (
            'Gece Mavisi Yün Kaşe Pelerin',
            'gece-mavisi-yun-kase-pelerin',
            'yun',
            'Saf yün dokuma, vintage pirinç agraflar ve ipek astar. Kış günlerine neşe ve sıcaklık katması için elde dikildi.',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
            true,
            4200,
            'https://shopier.com',
            2
        ),
        (
            'Düş Bahçesi İpek Roba Elbise',
            'dus-bahcesi-ipek-roba-elbise',
            'ipek',
            'Elde büzgü detayları ve antika Fransız danteli aplikeleriyle tek adet olarak hazırlanan arşiv parçası.',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
            false,
            NULL,
            NULL,
            3
        )
        ON CONFLICT (slug) DO NOTHING;

        INSERT INTO public.journal_notes (title, quote, content, photo_urls)
        VALUES (
            'Keten Kumaşın Hafızası',
            'Keten kumaş ütü sevmez; kırışıklıkları onun gün boyunca sizinle yaşadığının kanıtıdır.',
            'Atölyede yeni ruloları açtığımda ilk hissettiğim şey serinlik ve topraksı koku oluyor. Her makas darbesinde kumaşın nasıl döküleceğini dinlemek, dikişin en büyüleyici kısmı.',
            ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80']
        )
        ON CONFLICT DO NOTHING;
