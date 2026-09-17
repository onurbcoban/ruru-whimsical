# ruru whimsical

ruru whimsical; el yapimi giysi tasarimlari, atolye gunlugu ve zanaat portfolyosu icin gelistirilmis editoryal web uygulamasi ve self-hosted altyapi projesidir.

---

## Canli Ortamlar ve Dagitim

- Canli Prod (Vercel): https://ruruwhimsical.com (Vercel Serverless + Supabase)
- Canli Prod (Self-Hosted VPS): https://vps.ruruwhimsical.com (AWS EC2 + Docker Compose + PostgreSQL 16 + Nginx SSL)
- Sistem Mimarisi Dokumani: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Infra ve DevOps Yol Haritasi: [learning/infra-learning-roadmap.md](./learning/infra-learning-roadmap.md)

---

## Teknoloji Yigini

- Web Framework: Next.js 16 (App Router, Turbopack, Standalone Output)
- Kutuphaneler: React 19, TypeScript
- Sunucu: AWS EC2 (Ubuntu 24.04 LTS, Elastic IP: 16.170.2.243)
- Ters Vekil ve SSL: Nginx 1.27 Alpine, Let's Encrypt TLS 1.3 (Certbot)
- Konteyner Orkestrasyonu: Docker, Docker Compose (docker-compose.prod.yml)
- Veritabani Katmani: Self-Hosted PostgreSQL 16 Alpine (postgres_data kalici volume + postgres.js singleton)
- Nesne Depolama (S3): Cloudflare R2 (S3 API Presigned Direct PUT URLs)
- CI/CD ve Registry: GitHub Actions (Buildx, GHA Cache), GitHub Container Registry (ghcr.io)
- Sistem Sertlestirme: UFW Guvenlik Duvari (22, 80, 443 acik; 5432 disari kapali), 2GB Swap Memory
- Gozlemlenebilirlik ve Analiz: Portainer CE (Port 9000), Madge AST Dependency Graph (0 circular dependency)
- E-Ticaret Katmani: Shopier REST API (Dinamik stok/fiyat zenginlestirme)
- Tasarim Sistemi: Cercevesiz Editoryal Lookbook, Botanik Kok Boya Paleti, CSS Degiskenleri, Puantiye Tuval Dokusu

---

## Mimari Ozet ve Ozellikler

1. Dual-Stack Hibrit Veri Modeli:
   - Kod tabani ortam degiskenine (DATABASE_URL) gore davranir.
   - VPS uzerinde calisirken (vps.ruruwhimsical.com) tum mutasyonlar ve okumalar yerel PostgreSQL konteynerine izoledir; Vercel'deki canli siteye dokunmaz.
   - Vercel uzerinde calisirken standart Supabase istemcisine guvenle geri duser.
2. Konteyner Boyutu ve Guvenlik:
   - Multi-stage derleme ile yaklasik 1 GB'lik Node bagimliliklari elenir, yaklasik 83 MB'lik standalone imaj uretilir.
   - Konteyner yetkisiz nextjs:nodejs (UID 1001) kullanicisiyla calisir.
3. Dogrudan Cloudflare R2 Yuklemesi:
   - Sunucu disk ve RAM'i gorsellerle sismez. Next.js API'si (/api/upload/presigned) 60 saniyelik imzali URL uretir; tarayici dogrudan R2 bucket'ina yukler.
4. Felaket Kurtarma (Disaster Recovery):
   - scripts/backup-r2.sh betigi pg_dump ile kilitlenmesiz .sql.gz yedegi alir; sunucuda son 7 gunu tutup harici R2 backup bucket'ina yukler.
5. Yonetim Masasi ve Dinamik Icerik:
   - /admin uzerinden kiyafet ekleme/duzenleme/silme, arsivleme, atolye gunlugu (blog) yazilari, Instagram/TikTok vitrinleri ve ana sayfa karsilama (hero) metinleri anlik guncellenir.

---

## Dizin Mimarisi

```text
├── .github/workflows/       # GitHub Actions CI/CD hatti (deploy.yml)
├── app/                     # Next.js App Router sayfalari, layout ve API rotalari
│   ├── admin/               # Yonetim masasi (parcalar, gunluk, sosyal, hero ayarlari)
│   ├── api/
│   │   ├── health/db/       # PostgreSQL veritabani saglik kontrol uc noktasi
│   │   └── upload/          # Cloudflare R2 presigned URL uretim rotasi
│   ├── globals.css          # Tasarim sistemi degiskenleri ve kok boya paleti
│   ├── layout.tsx           # Kok layout ve tema motoru
│   ├── page.tsx             # Dinamik editoryal vitrin sayfasi
│   ├── parca/[slug]/        # Kiyafet detay sayfasi (zanaat/beden detaylari)
│   ├── gunluk/              # Atolye gunlugu (tum arsiv ve tekil [id] okuma sayfasi)
│   ├── sitemap.ts           # Dinamik sitemap.xml
│   └── robots.ts            # Arama motoru robot kurallari
├── components/              # Yeniden kullanilabilir UI bilesenleri
│   ├── admin/               # Admin formlari ve R2 gorsel yukleyici (ImageUploader)
│   ├── journal/             # Atolye gunlugu kartlari ve editoryal alintilar
│   ├── layout/              # Navbar ve Footer bilesenleri
│   ├── seo/                 # JSON-LD Schema.org bileseni
│   ├── showcase/            # Vitrin, arsiv ve sosyal medya bloklari
│   └── theme/               # Cercevesiz minimalist tema dugmesi
├── docker/
│   └── postgres/init.sql    # PostgreSQL tablo semalari, indeksler ve tohum verileri
├── learning/                # Self-hosted infra 7 fazli ogrenme dokumantasyonu
├── lib/                     # Servis ve veri katmani
│   ├── auth.ts              # HMAC-SHA256 admin oturum dogrulama
│   ├── db.ts                # PostgreSQL singleton client (postgres.js)
│   ├── portfolio.ts         # Birlesik vitrin ve Shopier stok esleyici
│   ├── s3.ts                # Cloudflare R2 S3 SDK istemcisi
│   ├── shopier.ts           # Shopier REST API istemcisi
│   └── social-oembed.ts     # Sosyal medya link analiz katmani
├── nginx/
│   ├── default.conf         # Yerel simulasyon Nginx konfigurasyonu (Port 80)
│   └── production.conf      # Canli sunucu Nginx konfigurasyonu (SSL + Gzip + HTTP/2)
├── scripts/
│   ├── setup-vps.sh         # VPS ilk kurulumu (UFW, 2GB Swap, Docker, Certbot)
│   └── backup-r2.sh         # Otomatik DB yedegi (pg_dump -> gzip -> Cloudflare R2)
├── types/                   # TypeScript veri modelleri
├── ARCHITECTURE.md          # Ayrintili sistem mimarisi ve gelecek iyilestirmeler
├── Dockerfile               # Multi-stage standalone Next.js derleme tarifi
├── docker-compose.yml       # Yerel Docker simulasyonu
└── docker-compose.prod.yml  # Canli VPS Docker orkestrasyonu (GHCR imaji + Nginx SSL)
```

---

## Calistirma ve Operasyon Rehberi

### 1. Yerel Docker Simulasyonu (Nginx + Next.js + PostgreSQL)
```bash
# Servisleri yerelde derle ve baslat
docker compose up -d --build

# DB saglik kontrolu
curl http://localhost/api/health/db

# Konteyner loglarini izle
docker compose logs -f app

# Durdur
docker compose down
```

### 2. Canli Sunucu (VPS) Operasyonlari
```bash
# Sunucuya SSH ile baglan
ssh -i /path/to/key.pem ubuntu@16.170.2.243

# Yeni surumu GHCR'dan cek ve konteyneri guncelle
sudo docker compose -f docker-compose.prod.yml pull app
sudo docker compose -f docker-compose.prod.yml up -d --remove-orphans app

# Veritabani yedegini manuel tetikle
sudo ./scripts/backup-r2.sh

# Canli SSL ve Nginx durumunu denetle
curl -I https://vps.ruruwhimsical.com
```

### 3. Gelistirici Ortami (Node.js)
```bash
npm run dev        # Gelistirme sunucusu (localhost:3000)
npm run lint       # ESLint kontrolu
npm run build      # Next.js uretim derlemesi testi
```

---

## Ortam Degiskenleri (.env)

```ini
# PostgreSQL (Docker ic aginda db:5432, yerelde localhost:5432)
DATABASE_URL=postgresql://ruru_user:ruru_pass123@db:5432/ruru_db

# Yonetici Girisi
ADMIN_PASSWORD=guclu_bir_sifre

# Cloudflare R2 (S3 API)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=ruru-media
R2_PUBLIC_URL=https://pub-your-id.r2.dev

# Shopier (Isteye bagli)
SHOPIER_PERSONAL_TOKEN=your_token
```

---

## Mulkiyet ve Lisans

Bu proje ruru whimsical markasina ait ozel bir calismadir. Tum haklari saklidir.
