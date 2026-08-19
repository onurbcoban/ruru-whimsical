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
    craft_details: [
      { label: 'Kumaş Türü', value: '%100 Yıkanmış Doğal Keten' },
      { label: 'Düğme Detayı', value: 'Doğal Sedef Düğmeler' },
      { label: 'Dikiş Tekniği', value: 'Fransız Temiz Dikiş' },
      { label: 'Yıkama & Bakım', value: '30°C Hassas Yıkama' },
    ],
    size_info: '36 - 40 Rahat Salaş Kalıp',
    measurements: 'Göğüs: 98 cm • Elbise Boyu: 120 cm • Kol Boyu: 58 cm • Basen: 112 cm',
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
    craft_details: [
      { label: 'Kumaş Dokusu', value: '%100 Saf Yün Kaşe & İpek Astar' },
      { label: 'Toka & Agraf', value: 'Vintage Pirinç Agraflar' },
      { label: 'Bakım', value: 'Yalnızca Kuru Temizleme' },
    ],
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

    const supabase = await createServerClient();
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

export const getPublishedPieces = getPieces;

export async function getPieceBySlug(slug: string): Promise<Piece | null> {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const found = MOCK_PIECES.find((p) => p.slug === slug);
      return found || (isProduction ? null : MOCK_PIECES[0]);
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('pieces')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const found = MOCK_PIECES.find((p) => p.slug === slug);
      return found || (isProduction ? null : MOCK_PIECES[0]);
    }

    return data as Piece;
  } catch (err) {
    const found = MOCK_PIECES.find((p) => p.slug === slug);
    return found || (isProduction ? null : MOCK_PIECES[0]);
  }
}

export async function getPieceById(id: string): Promise<Piece | null> {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const found = MOCK_PIECES.find((p) => p.id === id);
      return found || (isProduction ? null : MOCK_PIECES[0]);
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('pieces')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const found = MOCK_PIECES.find((p) => p.id === id);
      return found || (isProduction ? null : MOCK_PIECES[0]);
    }

    return data as Piece;
  } catch (err) {
    const found = MOCK_PIECES.find((p) => p.id === id);
    return found || (isProduction ? null : MOCK_PIECES[0]);
  }
}

export async function getLatestJournalNote(): Promise<JournalNote | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return MOCK_JOURNAL;
    }

    const supabase = await createServerClient();
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

export async function getAllJournalNotes(): Promise<JournalNote[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return [MOCK_JOURNAL];
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('journal_notes')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data) {
      return [MOCK_JOURNAL];
    }

    return data as JournalNote[];
  } catch {
    return [MOCK_JOURNAL];
  }
}

export async function getJournalNoteById(id: string): Promise<JournalNote | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return MOCK_JOURNAL.id === id ? MOCK_JOURNAL : null;
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('journal_notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return MOCK_JOURNAL.id === id ? MOCK_JOURNAL : null;
    }

    return data as JournalNote;
  } catch {
    return MOCK_JOURNAL.id === id ? MOCK_JOURNAL : null;
  }
}

const MOCK_SOCIAL_EMBEDS: SocialEmbed[] = [
  // 4 Instagram Paylaşımı
  {
    id: 'mock-insta-1',
    platform: 'instagram-reels',
    url: 'https://instagram.com/ruru_whimsical',
    caption: 'Keten kumaş büzgüsü ve el dikişi detayları atölye masasında.',
    thumbnail_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-insta-2',
    platform: 'instagram-post',
    url: 'https://instagram.com/ruru_whimsical',
    caption: 'Doğal sedef düğmeler ve keten kumaşın dokusu yakın çekim.',
    thumbnail_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-insta-3',
    platform: 'instagram-reels',
    url: 'https://instagram.com/ruru_whimsical',
    caption: 'Gece mavisi yün pelerin astar birleştirme provası ve agraf dikişleri.',
    thumbnail_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-insta-4',
    platform: 'instagram-post',
    url: 'https://instagram.com/ruru_whimsical',
    caption: 'Yeni sezon tirşe yeşili yıkanmış keten kumaş ruloları atölyeye ulaştı.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    order_index: 4,
    created_at: new Date().toISOString(),
  },

  // 4 TikTok Videosu
  {
    id: 'mock-tiktok-1',
    platform: 'tiktok',
    url: 'https://tiktok.com/@ruru_whimsical',
    caption: 'Keten gömlek elbisenin rüzgardaki dökümü ve kalıp provası.',
    thumbnail_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    order_index: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-tiktok-2',
    platform: 'tiktok',
    url: 'https://tiktok.com/@ruru_whimsical',
    caption: 'Atölyede bir gün: Kumaş seçimi, kesim masası ve sabah kahvesi.',
    thumbnail_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    order_index: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-tiktok-3',
    platform: 'tiktok',
    url: 'https://tiktok.com/@ruru_whimsical',
    caption: 'Özel dikim pelerin kalıbı çıkarma ve teyelleme süreci.',
    thumbnail_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    order_index: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-tiktok-4',
    platform: 'tiktok',
    url: 'https://tiktok.com/@ruru_whimsical',
    caption: 'Bitmiş elbisenin paketlenmesi ve sahibine uğurlanma anı.',
    thumbnail_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
    order_index: 8,
    created_at: new Date().toISOString(),
  },
];

export async function getSocialEmbeds(): Promise<SocialEmbed[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return MOCK_SOCIAL_EMBEDS;
    }

    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('social_embeds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return MOCK_SOCIAL_EMBEDS;
    }

    return (data || []) as SocialEmbed[];
  } catch {
    return MOCK_SOCIAL_EMBEDS;
  }
}
