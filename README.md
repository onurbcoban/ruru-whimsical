# rürü whimsical

rürü whimsical, el yapımı giysi tasarımları, atölye günlüğü ve zanaat portfolyosu için geliştirilmiş editoryal web uygulamasıdır.

## Teknoloji Yığını

- **Framework:** Next.js 16 (App Router, Turbopack, Standalone Output)
- **Kütüphane:** React 19, TypeScript
- **Altyapı & Orkestrasyon:** Docker, Docker Compose, Nginx Reverse Proxy
- **Veritabanı:** Self-Hosted PostgreSQL 16 (Docker, Kalıcı Named Volume)
- **Nesne Depolama:** Cloudflare R2 (S3 Uyumlu Object Storage, Presigned URL Mimarisi)
- **CI/CD & Registry:** GitHub Actions, GitHub Container Registry (GHCR)
- **E-Ticaret Katmanı:** Shopier REST API (Live / Mock Adaptör Mimarisi)
- **Tasarım Sistemi:** CSS Değişkenleri (Custom Botanical Earth Pigments), Çerçevesiz Dark/Light Tema Motoru, Puantiye Doku Tuvali

## Mimari Yapı & Öne Çıkan Özellikler

- **Bütüncül & Kutusuz Editoryal Görünüm:** Kaba kartlar ve yapay çerçeveler yerine, saf keten dokusu üzerinde nefes alan lookbook düzeni ve her bölüme özel kök boya imza vurgusu (Kiremit, Adaçayı, Bal Sarısı, İndigo, Gül Kurusu).
- **Self-Hosted Konteyner Mimarisi:** Next.js uygulaması multi-stage Docker build ile optimize edilerek (~83 MB) Nginx reverse proxy arkasında çalışır. Host üzerinde sadece 80 (HTTP) portu açıktır, Next.js ve PostgreSQL iç ağda izoledir.
- **Doğrudan PostgreSQL 16 & Veri Kalıcılığı:** Baas bağımlılığı olmadan, kalıcı Docker volume (`postgres_data`) üzerinde çalışan ve `postgres.js` singleton bağlantı havuzuyla sorgulanan ilişkisel veritabanı.
- **Cloudflare R2 ile Doğrudan Nesne Depolama:** Medya dosyaları sunucu diskini doldurmaz; API rotasından üretilen 60 saniyelik imzalı presigned URL'ler ile doğrudan tarayıcıdan Cloudflare R2 bucket'ına yüklenir.
- **Otomatik CI/CD & GHCR Entegrasyonu:** Kod VPS'te derlenmez; GitHub Actions üzerinde Buildx ve katman önbelleğiyle derlenip GitHub Container Registry (`ghcr.io`) üzerine versiyonlanmış imajlar olarak basılır.
- **Yönetilebilir Karşılama (Hero) Metni:** Tasarımcı, ana sayfa tepe karşılama başlığını, hikaye paragrafını ve imzasını `/admin` yönetim masası üzerinden tek tıkla canlı güncelleyebilir (`site_settings` tablosu).
- **İki Kademeli Editoryal Günlük (Blog):**
  - Ana sayfada en son 2 yazının özet alıntıları,
  - `/gunluk` altında tüm atölye yazılarının kronolojik arşivi,
  - `/gunluk/[id]` altında zengin tipografili ve fotoğraflı müstakil okuma deneyimi.
- **Instagram & TikTok Atölye Kapısı:** Yan yana iki sütunlu sosyal vitrin üzerinden resmi istemci embed ve canlı link entegrasyonu.
- **Dinamik Üst Bar (Navbar):** Sayfada içeriği bulunmayan vitrin linklerini otomatik gizleyen, durağan ve mikro puantiyeli keten tavanla bütünleşik başlık.
- **Hibrit Veri Modeli:** Portfolyo içeriği ve atölye günlüğü yerel PostgreSQL üzerinde saklanır. Satıştaki parçaların fiyat ve stok durumları Shopier REST API üzerinden dinamik olarak eşitlenir.
- **Erişim Güvenliği & SEO:** Dinamik `sitemap.xml`, `robots.txt`, OpenGraph ve Schema.org JSON-LD yapılandırılmış veri işaretlemeleri.

## Dizin Mimarisi

```text
├── .github/workflows/    # GitHub Actions CI/CD pipeline (deploy.yml)
├── app/                  # Next.js App Router sayfaları, rotalar ve layout
│   ├── admin/            # Yönetim masası, kıyafet/portfolyo/günlük/hero formları
│   ├── api/
│   │   ├── health/db/    # PostgreSQL bağlantı sağlık rotası
│   │   └── upload/       # Cloudflare R2 presigned URL oluşturma rotası
│   ├── globals.css       # Tasarım sistemi token'ları, kök boya paleti ve doku
│   ├── layout.tsx        # Kök layout ve tema yükleme motoru
│   ├── page.tsx          # Dinamik ana sayfa vitrini
│   ├── parca/[slug]/     # Dinamik kıyafet ve çalışma detay sayfaları
│   ├── gunluk/           # Tüm atölye günlüğü arşivi
│   │   └── [id]/         # Tekil günlük yazısı okuma sayfası
│   ├── sitemap.ts        # Dinamik sitemap.xml üreticisi
│   └── robots.ts         # Arama motoru robot direktifleri
├── components/           # UI bileşenleri
│   ├── admin/            # Admin formları ve R2 görsel yükleyici bileşenleri
│   ├── journal/          # Atölye günlüğü bileşenleri
│   ├── layout/           # Navbar ve Footer bileşenleri
│   ├── seo/              # JSON-LD Schema bileşeni
│   ├── showcase/         # Vitrin, arşiv, serbest sanat ve sosyal medya bileşenleri
│   └── theme/            # Çerçevesiz minimalist tema değiştirici
├── docker/               # Konteyner yapılandırmaları
│   └── postgres/init.sql # PostgreSQL tablo şemaları ve seed verileri
├── learning/             # Self-hosted ve infra öğrenme yol haritası
├── lib/                  # Veri istemcileri ve servis katmanı
│   ├── auth.ts           # Admin oturum doğrulama
│   ├── db.ts             # PostgreSQL singleton client (postgres.js)
│   ├── portfolio.ts      # Birleşik portfolyo ve stok eşleştirme servisi
│   ├── s3.ts             # Cloudflare R2 S3 SDK istemcisi
│   ├── shopier.ts        # Shopier REST API istemcisi
│   └── social-oembed.ts  # Sosyal medya link analiz katmanı
├── nginx/                # Nginx reverse proxy yapılandırması (default.conf)
├── types/                # TypeScript veri modelleri
├── Dockerfile            # Multi-stage standalone Next.js derleme tarifi
└── docker-compose.yml    # Nginx + Next.js App + PostgreSQL orkestrasyonu
```

## Çalıştırma ve Geliştirme Komutları

### 1. Docker ile Canlı Simülasyonu (Nginx + Next.js + PostgreSQL)
```bash
# Tüm servisleri arka planda derle ve başlat
docker compose up -d --build

# Servis loglarını takip et
docker compose logs -f app

# Servisleri durdur (Veriler postgres_data volume'ünde saklanır)
docker compose down
```

### 2. Yerel Geliştirme (Local Development)
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
