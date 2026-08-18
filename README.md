# rürü whimsical

rürü whimsical, el yapımı giysi tasarımları, atölye günlüğü ve zanaat portfolyosu için geliştirilmiş özel web uygulamasıdır.

## Teknoloji Yığını

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Kütüphane:** React 19, TypeScript
- **Veritabanı & Depolama:** Supabase (PostgreSQL, Storage, Auth, RLS)
- **E-Ticaret Katmanı:** Shopier REST API (Live / Mock Adaptör Mimarisi)
- **Tasarım:** CSS Değişkenleri (Custom Design Tokens), Dark/Light Tema Motoru

## Mimari Yapı

- **Hibrit Veri Modeli:** Portfolyo içeriği ve atölye günlüğü Supabase PostgreSQL üzerinde saklanır. Satıştaki parçaların fiyat ve stok durumları Shopier REST API üzerinden dinamik olarak eşitlenir.
- **Hata Savunması:** Ortam değişkenleri veya harici API erişimi bulunmadığında yerel geliştirme modunda mock veri katmanı devreye girer; canlı ortamda ise sahte veri basılması engellenir.
- **Görsel Dağıtımı:** Next.js Image bileşeni ile CDN üzerinden otomatik WebP dönüşümü ve duyarlı (responsive) boyutlandırma.
- **Erişim Güvenliği:** PostgreSQL RLS (Row Level Security) ile genel okuma ve yetkili yönetim ayrımı.

## Dizin Mimarisi

```text
├── app/                  # Next.js App Router sayfaları, rotalar ve layout
│   ├── globals.css       # Tasarım sistemi token'ları ve tema değişkenleri
│   ├── layout.tsx        # Kök layout ve tema yükleme motoru
│   ├── page.tsx          # Ana sayfa vitrini
│   ├── parca/[slug]/     # Dinamik kıyafet ve çalışma detay sayfaları
│   └── gunluk/           # Müstakil atölye günlüğü sayfaları
├── components/           # UI bileşenleri
│   ├── journal/          # Atölye günlüğü bileşenleri
│   ├── showcase/         # Vitrin, arşiv ve serbest sanat bileşenleri
│   └── theme/            # Tema değiştirici
├── lib/                  # Veri istemcileri ve servis katmanı
│   ├── portfolio.ts      # Birleşik portfolyo ve stok eşleştirme servisi
│   ├── shopier.ts        # Shopier REST API istemcisi
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
