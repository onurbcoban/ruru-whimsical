import { createServerClient } from './server';
import type { Piece, JournalNote, SocialEmbed } from '@/types/database';

const MOCK_PIECES: Piece[] = [
  {
    id: 'mock-1',
    title: 'Tirşe Keten Gömlek Elbise',
    slug: 'tirse-keten-gomlek-elbise',
    category: 'keten',
    story: 'Bu keteni bulduğumda solgun yeşiline vurulmuştum. Geniş cepleri ve sedef düğmeleriyle tam bir bahar yürüyüşü elbisesi oldu.',
    main_image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    gallery_urls: [],
    is_shopier_product: true,
    shopier_sku: 'RURU-KTS-01',
    shopier_url: 'https://shopier.com',
    price: 2850,
    is_archived: false,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Gece Mavisi Yün Kaşe Pelerin',
    slug: 'gece-mavisi-yun-kase-pelerin',
    category: 'yun',
    story: 'Saf yün dokuma, vintage pirinç agraflar ve ipek astar. Kış günlerine neşe ve sıcaklık katması için elde dikildi.',
    main_image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    gallery_urls: [],
    is_shopier_product: true,
    shopier_sku: 'RURU-YUN-02',
    shopier_url: 'https://shopier.com',
    price: 4200,
    is_archived: false,
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Düş Bahçesi İpek Roba Elbise',
    slug: 'dus-bahcesi-ipek-roba-elbise',
    category: 'ipek',
    story: 'Elde büzgü detayları ve antika Fransız danteli aplikeleriyle tek adet olarak hazırlanan arşiv parçası.',
    main_image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    gallery_urls: [],
    is_shopier_product: false,
    shopier_sku: null,
    shopier_url: null,
    price: null,
    is_archived: false,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    title: 'Kır Çiçekleri El Nakışı Pano',
    slug: 'kir-cicekleri-el-nakisi-pano',
    category: 'serbest-calisma',
    story: 'Eski keten kumaş artıkları üzerine ham ipek ipliklerle serbest teknikle işlenmiş duvar panosu. Dikişten arta kalan her parçanın bir hafızası var.',
    main_image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    gallery_urls: [],
    is_shopier_product: false,
    shopier_sku: null,
    shopier_url: null,
    price: null,
    is_archived: false,
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    title: 'Vintage Gelinlik Dönüşüm Projesi (Arşiv)',
    slug: 'vintage-gelinlik-donusum-projesi-arsiv',
    category: 'arsiv',
    story: '1970\'lerden kalma bir aile gelinliğinin kumaşları ve dantelleri korunarak modern ve zamansız bir mezuniyet elbisesine dönüştürülmesi çalışması.',
    main_image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
    gallery_urls: [],
    is_shopier_product: false,
    shopier_sku: null,
    shopier_url: null,
    price: null,
    is_archived: true,
    order_index: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_JOURNAL: JournalNote = {
  id: 'mock-journal-1',
  title: 'Keten Kumaşın Hafızası',
  quote: 'Keten kumaş ütü sevmez; kırışıklıkları onun gün boyunca sizinle yaşadığının kanıtıdır.',
  content: 'Atölyede yeni ruloları açtığımda ilk hissettiğim şey serinlik ve topraksı koku oluyor. Her makas darbesinde kumaşın nasıl döküleceğini dinlemek, dikişin en büyüleyici kısmı.',
  photo_urls: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'],
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

export async function getPieces(): Promise<Piece[]> {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return isProduction ? [] : MOCK_PIECES;
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('pieces')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data) {
      return isProduction ? [] : MOCK_PIECES;
    }

    return data as Piece[];
  } catch {
    return isProduction ? [] : MOCK_PIECES;
  }
}

export async function getPieceBySlug(slug: string): Promise<Piece | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return MOCK_PIECES.find((p) => p.slug === slug) || null;
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('pieces')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return MOCK_PIECES.find((p) => p.slug === slug) || null;
    }

    return data as Piece;
  } catch {
    return MOCK_PIECES.find((p) => p.slug === slug) || null;
  }
}

export async function getLatestJournalNote(): Promise<JournalNote | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return MOCK_JOURNAL;
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('journal_notes')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return MOCK_JOURNAL;
    }

    return data as JournalNote;
  } catch {
    return MOCK_JOURNAL;
  }
}

export async function getSocialEmbeds(): Promise<SocialEmbed[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return [];
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('social_embeds')
      .select('*')
      .order('order_index', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data as SocialEmbed[];
  } catch {
    return [];
  }
}
