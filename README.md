# rürü whimsical

rürü whimsical, el yapımı giysi tasarımları, atölye günlüğü ve zanaat portfolyosu için geliştirilmiş editoryal web uygulamasıdır.

## Teknoloji Yığını

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Kütüphane:** React 19, TypeScript
- **Veritabanı & Depolama:** Supabase (PostgreSQL, Storage, Auth, RLS)
- **E-Ticaret Katmanı:** Shopier REST API (Live / Mock Adaptör Mimarisi)
- **Tasarım Sistemi:** CSS Değişkenleri (Custom Botanical Earth Pigments), Çerçevesiz Dark/Light Tema Motoru, Puantiye Doku Tuvali

## Mimari Yapı & Öne Çıkan Özellikler

- **Bütüncül & Kutusuz Editoryal Görünüm:** Kaba kartlar ve yapay çerçeveler yerine, saf keten dokusu üzerinde nefes alan lookbook düzeni ve her bölüme özel kök boya imza vurgusu (Kiremit, Adaçayı, Bal Sarısı, İndigo, Gül Kurusu).
- **Yönetilebilir Karşılama (Hero) Metni:** Tasarımcı, ana sayfa tepe karşılama başlığını, hikaye paragrafını ve imzasını `/admin` yönetim masası üzerinden tek tıkla canlı güncelleyebilir (`site_settings` tablosu).
- **İki Kademeli Editoryal Günlük (Blog):**
  - Ana sayfada en son 2 yazının özet alıntıları,
  - `/gunluk` altında tüm atölye yazılarının kronolojik arşivi,
  - `/gunluk/[id]` altında zengin tipografili ve fotoğraflı müstakil okuma deneyimi.
- **Instagram & TikTok Atölye Kapısı:** Yan yana iki sütunlu sosyal vitrin üzerinden resmi istemci embed ve canlı link entegrasyonu.
- **Dinamik Üst Bar (Navbar):** Sayfada içeriği bulunmayan vitrin linklerini otomatik gizleyen, durağan ve mikro puantiyeli keten tavanla bütünleşik başlık.
- **Hibrit Veri Modeli:** Portfolyo içeriği ve atölye günlüğü Supabase PostgreSQL üzerinde saklanır. Satıştaki parçaların fiyat ve stok durumları Shopier REST API üzerinden dinamik olarak eşitlenir.
- **Erişim Güvenliği & SEO:** PostgreSQL RLS kuralları, dinamik `sitemap.xml`, `robots.txt`, OpenGraph ve Schema.org JSON-LD yapılandırılmış veri işaretlemeleri.

## Dizin Mimarisi

```text
├── app/                  # Next.js App Router sayfaları, rotalar ve layout
│   ├── admin/            # Yönetim masası, kıyafet/portfolyo/günlük/hero formları
│   ├── globals.css       # Tasarım sistemi token'ları, kök boya paleti ve doku
│   ├── layout.tsx        # Kök layout ve tema yükleme motoru
│   ├── page.tsx          # Dinamik ana sayfa vitrini
│   ├── parca/[slug]/     # Dinamik kıyafet ve çalışma detay sayfaları
│   ├── gunluk/           # Tüm atölye günlüğü arşivi
│   │   └── [id]/         # Tekil günlük yazısı okuma sayfası
│   ├── sitemap.ts        # Dinamik sitemap.xml üreticisi
│   └── robots.ts         # Arama motoru robot direktifleri
├── components/           # UI bileşenleri
│   ├── admin/            # Admin formları ve görsel yükleyici bileşenleri
│   ├── journal/          # Atölye günlüğü bileşenleri
│   ├── layout/           # Navbar ve Footer bileşenleri
│   ├── seo/              # JSON-LD Schema bileşeni
│   ├── showcase/         # Vitrin, arşiv, serbest sanat ve sosyal medya bileşenleri
│   └── theme/            # Çerçevesiz minimalist tema değiştirici
├── lib/                  # Veri istemcileri ve servis katmanı
│   ├── auth.ts           # Admin oturum doğrulama
│   ├── portfolio.ts      # Birleşik portfolyo ve stok eşleştirme servisi
│   ├── shopier.ts        # Shopier REST API istemcisi
│   ├── social-oembed.ts  # Sosyal medya link analiz katmanı
│   └── supabase/         # Supabase istemcileri ve sorgu fonksiyonları
├── supabase/             # Veritabanı şemaları
│   └── schema.sql        # Tablo tanımları, RLS kuralları ve seed verileri
└── types/                # TypeScript veri modelleri
```

## Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Tip kontrolü ve linter
npm run lint

# Canlı derleme (Production build)
npm run build
```

## Mülkiyet

Bu proje rürü whimsical markasına ait özel bir çalışmadır. Tüm hakları saklıdır.
