# ruru whimsical

ruru whimsical; el yapimi giysi tasarimlari, atolye gunlugu ve zanaat portfolyosu icin gelistirilmis editoryal web platformudur.

---

## Teknoloji Yigini

- **Web Framework:** Next.js 16 (App Router, Standalone Output)
- **Arayuz & Dil:** React 19, TypeScript, Vanilla CSS Design System
- **Veritabani:** PostgreSQL 16
- **Depolama:** Cloudflare R2 (S3 API Presigned URLs)
- **Ters Vekil & Guvenlik:** Nginx, TLS 1.3
- **Konteyner & CI/CD:** Docker, Docker Compose, GitHub Actions, GHCR

---

## Gelistirici ve Yerel Calisma Rehberi

### 1. Gereksinimler
- Node.js 22+
- Docker ve Docker Compose (yerel veritabani ve konteyner testi icin)

### 2. Kurulum
```bash
# Bagimliliklari yukle
npm install

# Gelistirme sunucusunu baslat
npm run dev
```

Tarayicinizdan `http://localhost:3000` adresine ulasabilirsiniz.

### 3. Yerel Docker Ortami
```bash
# PostgreSQL ve Next.js servislerini yerelde baslat
docker compose up -d --build

# Konteyner loglarini izle
docker compose logs -f app

# Servisleri durdur
docker compose down
```

---

## Ortam Degiskenleri (.env.example)

Proje kok dizininde `.env.local` dosyasi olusturarak asagidaki sablonu kullanabilirsiniz:

```ini
# PostgreSQL Baglanti Dizesi
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ruru_db

# Yonetici Masasi Guvenlik Sifresi
ADMIN_PASSWORD=guclu_bir_sifre_belirleyin

# Cloudflare R2 (S3 Uyumlu Nesne Depolama)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-your-id.r2.dev
```

---

## Proje Komutlari

```bash
npm run dev     # Yerel gelistirme sunucusu
npm run build   # Uretim derlemesi testi
npm run start   # Derlenmis uygulamayi calistirma
npm run lint    # Kod stili ve statik analiz denetimi
```

---

## Mulkiyet ve Lisans

Bu proje ruru whimsical markasina ait ozel bir calismadir. Tum haklari saklidir.
