import type { Piece, JournalNote, SocialEmbed } from '@/types/database';
import sql from '@/lib/db';

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
    craft_details: [
      { label: 'Kumaş Dokusu', value: '%100 Ham Saf İpek' },
      { label: 'Dantel Detayı', value: '1940\'lar Fransız El Danteli' },
      { label: 'Kalıp', value: 'Vintage Robadan Geniş Kesim' },
    ],
    is_shopier_product: true,
    shopier_sku: 'RURU-IPK-03',
    shopier_url: 'https://shopier.com',
    price: 5600,
    is_archived: false,
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    title: 'Toprak Tonlu Keten Yelek',
    slug: 'toprak-tonlu-keten-yelek',
    category: 'keten',
    story: 'Kat kat giyinmeyi sevenler için tasarlandı. Sırtındaki bağcık detayı ile bedene göre ayarlanabilir.',
    main_image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    gallery_urls: [],
    craft_details: [
      { label: 'Kumaş Türü', value: 'Ağır Gramajlı Taşlanmış Keten' },
      { label: 'Astar', value: 'Pamuklu İnce Poplin' },
      { label: 'Bağcık', value: 'Kendi Kumaşından El Dikimi Biyeler' },
    ],
    is_shopier_product: true,
    shopier_sku: 'RURU-KTY-04',
    shopier_url: 'https://shopier.com',
    price: 1950,
    is_archived: false,
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    title: 'Gül Kurusu Kat Kat Etek',
    slug: 'gul-kurusu-kat-kat-etek',
    category: 'pamuk',
    story: 'Adım attıkça hışırdayan, bol dökümlü ve derin cepli masalsı bir etek. Yaz akşamları ve serin sonbahar günleri için.',
    main_image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=80',
    gallery_urls: [],
    craft_details: [
      { label: 'Kumaş', value: '%100 Organik Pamuk Müslin' },
      { label: 'Bel Detayı', value: 'Geniş Lastikli Rahat Bel' },
      { label: 'Etek Ucu', value: 'El Kıvırma İnce Dikiş' },
    ],
    is_shopier_product: true,
    shopier_sku: 'RURU-PMK-05',
    shopier_url: 'https://shopier.com',
    price: 2400,
    is_archived: false,
    order_index: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_JOURNAL: JournalNote = {
  id: 'mock-j-1',
  title: 'Atölyede Yağmurlu Bir Salı ve Keten Kokusu',
  quote: 'Dikiş makinesinin ritmik sesi, dışarıdaki yağmurla birleştiğinde zaman burada yavaşlıyor...',
  content: `Sabah erken saatlerde atölyenin pencerelerine vuran yağmur damlalarıyla uyandım. Çayımı demleyip kesim masasının başına geçtiğimde, dün akşam açtığım yeni rulo ketenin kokusu tüm odayı sarmıştı.

Doğal ketenle çalışmayı bu yüzden çok seviyorum; kumaş adeta yaşayan, nefes alan bir varlık gibi. Her lifi, her dokusu elde başka bir hikaye anlatıyor. Bugün üzerinde çalıştığım pelerin modeli için vintage pirinç agrafları seçerken, bu parçanın yıllar boyu birilerinin kış günlerine sıcaklık katacağını bilmek içimi ısıtıyor.

Kalıp üzerinde yaptığım küçük bir pens değişikliği, elbisenin yürürken verdiği salınımı tamamen değiştirdi. Zanaat tam olarak bu küçük detaylarda gizli; aceleye gelmeyen, sabırla işlenen anlar.`,
  photo_urls: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
  ],
  is_published: true,
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
};

function formatPieceRow(row: any): Piece {
  return {
    ...row,
    gallery_urls: Array.isArray(row.gallery_urls) ? row.gallery_urls : [],
    craft_details: typeof row.craft_details === 'string' ? JSON.parse(row.craft_details) : (row.craft_details || []),
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || ''),
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at || ''),
  };
}

function formatJournalRow(row: any): JournalNote {
  return {
    ...row,
    photo_urls: Array.isArray(row.photo_urls) ? row.photo_urls : [],
    published_at: row.published_at instanceof Date ? row.published_at.toISOString() : String(row.published_at || ''),
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || ''),
  };
}

function formatSocialRow(row: any): SocialEmbed {
  return {
    ...row,
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || ''),
  };
}

export async function getPieces(): Promise<Piece[]> {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT * FROM public.pieces
        ORDER BY order_index ASC, created_at DESC
      `;
      return rows.map(formatPieceRow);
    }
    return isProduction ? [] : MOCK_PIECES;
  } catch {
    return isProduction ? [] : MOCK_PIECES;
  }
}

export const getPublishedPieces = getPieces;

export async function getPieceBySlug(slug: string): Promise<Piece | null> {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT * FROM public.pieces
        WHERE slug = ${slug}
        LIMIT 1
      `;
      if (rows.length > 0) {
        return formatPieceRow(rows[0]);
      }
      return null;
    }
    const found = MOCK_PIECES.find((p) => p.slug === slug);
    return found || (isProduction ? null : MOCK_PIECES[0]);
  } catch {
    const found = MOCK_PIECES.find((p) => p.slug === slug);
    return found || (isProduction ? null : MOCK_PIECES[0]);
  }
}

export async function getPieceById(id: string): Promise<Piece | null> {
  const isProduction = process.env.NODE_ENV === 'production';

  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT * FROM public.pieces
        WHERE id = ${id}
        LIMIT 1
      `;
      if (rows.length > 0) {
        return formatPieceRow(rows[0]);
      }
      return null;
    }
    const found = MOCK_PIECES.find((p) => p.id === id);
    return found || (isProduction ? null : MOCK_PIECES[0]);
  } catch {
    const found = MOCK_PIECES.find((p) => p.id === id);
    return found || (isProduction ? null : MOCK_PIECES[0]);
  }
}

export async function getLatestJournalNote(): Promise<JournalNote | null> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT * FROM public.journal_notes
        ORDER BY published_at DESC
        LIMIT 1
      `;
      if (rows.length > 0) {
        return formatJournalRow(rows[0]);
      }
      return null;
    }
    return MOCK_JOURNAL;
  } catch {
    return MOCK_JOURNAL;
  }
}

export async function getAllJournalNotes(): Promise<JournalNote[]> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT * FROM public.journal_notes
        ORDER BY published_at DESC
      `;
      return rows.map(formatJournalRow);
    }
    return [MOCK_JOURNAL];
  } catch {
    return [MOCK_JOURNAL];
  }
}

export async function getJournalNoteById(id: string): Promise<JournalNote | null> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT * FROM public.journal_notes
        WHERE id = ${id}
        LIMIT 1
      `;
      if (rows.length > 0) {
        return formatJournalRow(rows[0]);
      }
      return null;
    }
    return MOCK_JOURNAL.id === id ? MOCK_JOURNAL : null;
  } catch {
    return MOCK_JOURNAL.id === id ? MOCK_JOURNAL : null;
  }
}

const MOCK_SOCIAL_EMBEDS: SocialEmbed[] = [
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
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT * FROM public.social_embeds
        ORDER BY created_at DESC
      `;
      return rows.map(formatSocialRow);
    }
    return MOCK_SOCIAL_EMBEDS;
  } catch {
    return MOCK_SOCIAL_EMBEDS;
  }
}

export const DEFAULT_HERO_SETTINGS = {
  title: 'merhaba, ben rümeysa.',
  highlight: 'neşenizi ön plana çıkaran',
  title_suffix: 'giysiler dikiyorum.',
  description: 'rürü whimsical; çocukluk düşlerinin, dokunmaya kıyılamayan ketenlerin ve atölyemdeki küçük neşelerin bir toplamı.',
  handwritten_note: 'her dikişte bir hikaye saklı...',
};

let inMemoryHeroSettings = { ...DEFAULT_HERO_SETTINGS };

export function setInMemoryHeroSettings(data: typeof DEFAULT_HERO_SETTINGS) {
  inMemoryHeroSettings = {
    ...DEFAULT_HERO_SETTINGS,
    ...data,
  };
}

export async function getHeroSettings() {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await sql`
        SELECT value FROM public.site_settings
        WHERE key = 'hero'
        LIMIT 1
      `;
      if (rows.length > 0 && rows[0].value) {
        const val = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
        return {
          ...DEFAULT_HERO_SETTINGS,
          ...val,
        };
      }
      return inMemoryHeroSettings;
    }
    return inMemoryHeroSettings;
  } catch {
    return inMemoryHeroSettings;
  }
}
