# ruru whimsical - Sistem Mimarisi ve Altyapi Referansi

Bu dokuman, ruru whimsical projesinin yazilim, veri, ag, guvenlik ve dagitim (DevOps) mimarisini ve tamamlanmasi gereken teknik iyilestirmeleri belgeler.

---

## Icerik
1. [Butuncul Mimari Semasi](#1-butuncul-mimari-semasi)
2. [Uygulama ve Sunum Katmani (Next.js 16 + React 19)](#2-uygulama-ve-sunum-katmani-nextjs-16--react-19)
3. [Ters Vekil ve Ag Guvenligi Katmani (Nginx + UFW + SSL)](#3-ters-vekil-ve-ag-guvenligi-katmani-nginx--ufw--ssl)
4. [Veri Katmani ve Hibrit Veritabani Mimarisi](#4-veri-katmani-ve-hibrit-veritabani-mimarisi)
5. [Nesne Depolama ve Medya Akisi (Cloudflare R2 Presigned URLs)](#5-nesne-depolama-ve-medya-akisi-cloudflare-r2-presigned-urls)
6. [CI/CD Dagitim Hatti ve Konteyner Yasam Dongusu](#6-cicd-dagitim-hatti-ve-konteyner-yasam-dongusu)
7. [Yedekleme ve Felaket Kurtarma (Disaster Recovery)](#7-yedekleme-ve-felaket-kurtarma-disaster-recovery)
8. [Modul Bagimlilik ve Gozlemlenebilirlik Durumu](#8-modul-bagimlilik-ve-gozlemlenebilirlik-durumu)
9. [Eksikler ve Gelecek Iyilestirmeler (Production Readiness)](#9-eksikler-ve-gelecek-iyilestirmeler-production-readiness)

---

## 1. Butuncul Mimari Semasi

```
                              [ Istemci / Tarayici ]
                                        │
                         HTTP/2 (443)   │ HTTPS / TLS 1.3
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│ AWS EC2 Sunucusu (Ubuntu 24.04 LTS — Elastic IP: 16.170.2.243)                │
│ Sistem: 2 GB Swap Bellek (OOM Korumasi) | UFW Guvenlik Duvari                 │
│ Acik Portlar: 22 (SSH), 80 (HTTP -> 443 301 Redirect), 443 (HTTPS)           │
│                                                                               │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ Docker Host Sanal Bridge Agi (default bridge)                             │ │
│ │                                                                           │ │
│ │  ┌─────────────────────────┐     (Proxy Pass)    ┌──────────────────────┐ │ │
│ │  │       ruru_nginx        │ ──────────────────> │       ruru_app       │ │ │
│ │  │ (Nginx 1.27 / Alpine)   │     Port 3000       │ (Next.js Standalone) │ │ │
│ │  └────────────┬────────────┘                     └──────────┬───────────┘ │ │
│ │               │                                             │             │ │
│ │         SSL Volume Mount:                                   │ Port 5432   │ │
│ │         /etc/letsencrypt                                    │ (Ic Ag)     │ │
│ │                                                             ▼             │ │
│ │                                                  ┌──────────────────────┐ │ │
│ │                                                  │       ruru_db        │ │ │
│ │                                                  │(Postgres 16 Alpine)  │ │ │
│ │                                                  └──────────┬───────────┘ │ │
│ └─────────────────────────────────────────────────────────────┼─────────────┘ │
│                                                               ▼               │
│                                                       postgres_data           │
│                                                       (Kalici Volume)         │
└───────────────────────────────────────────────────────────────────────────────┘
                     │                                      │
          Gorsel Yukleme (PUT)                       Yedekleme (.sql.gz)
                     ▼                                      ▼
     ┌───────────────────────────────┐      ┌───────────────────────────────┐
     │ Cloudflare R2 (S3 Uyumlu)     │      │ Cloudflare R2 Backup Bucket   │
     │ Bucket: ruru-media            │      │ Bucket: ruru-backups          │
     │ CDN: pub-*.r2.dev             │      │ Retention: 7 gun yerel + cold │
     └───────────────────────────────┘      └───────────────────────────────┘
```

---

## 2. Uygulama ve Sunum Katmani (Next.js 16 + React 19)

### 2.1. Standalone Cikti ve Multi-Stage Dockerfile
Uygulama sunucuya tasinirken agır node_modules klasoru kullanilmaz. `next.config.mjs` icerisinde `output: 'standalone'` aktiftir.

`Dockerfile` 3 asamali (multi-stage) insa edilir:
1. `deps`: `node:22-alpine` uzerinde `package.json` ve `package-lock.json` kopyalanip `npm ci` ile bagimliliklar kurulur.
2. `builder`: Kaynak kod derlenir. Yalnizca calisan kodun ihtiyac duydugu dosyalar `.next/standalone` altina izole edilir.
3. `runner`: Minimal Alpine Linux imajina yalnizca standalone ciktisi ve public statik dosyalar kopyalanir. Root yetkisi kaldirilarak `nextjs:nodejs` (UID 1001) kullanicisi atanir. Imaj boyutu: yaklasik 83 MB.

### 2.2. Sayfa ve Rota Mimarisi
- RSC (React Server Components): Ana sayfa (`app/page.tsx`), parca detay (`app/parca/[slug]/page.tsx`) ve gunluk (`app/gunluk/page.tsx`) sunucuda derlenir. Istemciye sifir veritabani istemcisi kodu gonderilir.
- Server Actions: Yonetim islemleri (`app/admin/actions.ts`) dogrudan sunucu aksiyonlariyla yapilir. Islemler sonrasi `revalidatePath` ile onbellek tazelenir.
- Admin Oturumu: `lib/auth.ts` icinde Web Crypto API tabanli SHA-256 imzali HTTP-only cerez kontrolu yapilir. Yanlis sifre girislerinde bot saldirilarina karsi yapay gecikme calistirilir.

---

## 3. Ters Vekil ve Ag Guvenligi Katmani (Nginx + UFW + SSL)

### 3.1. UFW Guvenlik Duvari
Host isletim sisteminde (Ubuntu 24.04):
- Gelen tum paketler varsayilan olarak engellenir (`ufw default deny incoming`).
- Yalnizca 22 (SSH), 80 (HTTP) ve 443 (HTTPS) portlari aciktir.
- PostgreSQL portu (5432) dis internete tamamen kapalidir. Yalnizca Docker ic agindaki `ruru_app` konteyneri erisebilir.

### 3.2. Nginx Konfigurasyonu (`nginx/production.conf`)
- Port 80: ACME challenge dizini (`/.well-known/acme-challenge/`) disindaki tum istekleri HTTPS'e yonlendirir (301 redirect).
- Port 443: HTTP/2 ve TLS 1.2/1.3 protokolleriyle calisir.
- Gzip Sikistirma: CSS, JS, JSON, XML, SVG dosyalari Nginx seviyesinde sikistirilir.
- Proxy Basliklari: `X-Real-IP` ve `X-Forwarded-For` basliklari Next.js uygulamasina aktarilir.

### 3.3. Let's Encrypt SSL
Certbot ile uretilen sertifikalar host uzerinde `/etc/letsencrypt` altinda tutulur ve `ruru_nginx` konteynerine `:ro` (read-only) baglanir.

---

## 4. Veri Katmani ve Hibrit Veritabani Mimarisi

Sistem Dual-Stack (Cift Katmanli) calisir:

```
                                 [ actions.ts / queries.ts ]
                                              │
                         ┌────────────────────┴────────────────────┐
                         │ process.env.DATABASE_URL tanimli mi?    │
                         ▼                                         ▼
                     [ EVET ]                                  [ HAYIR ]
              Dogrudan PostgreSQL 16                     Supabase Istemcisi
              (lib/db.ts - postgres.js)                 (lib/supabase/client.ts)
                         │                                         │
                         ▼                                         ▼
                 AWS EC2 / Docker                         Vercel Canli Ortami
              (vps.ruruwhimsical.com)                     (ruruwhimsical.com)
```

### 4.1. Veritabani Izolasyonu
- VPS `.env` dosyasinda `NEXT_PUBLIC_SUPABASE_*` anahtarlari bostur. VPS panelinden yapilan ekleme/guncellemeler yalnizca yerel PostgreSQL'e yazilir; Vercel canli sitesine sizmaz.
- Baglanti Havuzu (`lib/db.ts`): `postgres.js` surucusu global singleton ile calisir, gereksiz baglanti tikanmalarini onler.
- Kalicilik: Veriler host uzerindeki `postgres_data` Docker volume'unde saklanir.

### 4.2. Tablo Semasi (`docker/postgres/init.sql`)
- `public.pieces`: Parcalar ve kiyafetler (UUID, slug, JSONB zanaat detaylari, galeri URL dizisi, Shopier SKU, arsiv durumu).
- `public.journal_notes`: Atolye gunluk notlari (UUID, baslik, alinti, markdown icerik, gorseller, yayin tarihi).
- `public.social_embeds`: Instagram ve TikTok paylasimlari (URL, platform, caption, thumbnail).
- `public.site_settings`: Site ayarlari (Hero basligi, aciklama, el yazisi notu - JSONB).

---

## 5. Nesne Depolama ve Medya Akisi (Cloudflare R2 Presigned URLs)

Uygulama sunucusunun disk ve RAM tuketimini sifira indirmek icin Direct-to-S3 yapisi kullanilir:

```
[ Tarayici ] ──── 1. POST /api/upload/presigned (dosya bilgisi) ────> [ Next.js API ]
     │                                                                      │
     │ <─── 2. JSON: { uploadUrl: "https://r2.../put?X-Amz-Signature...",   │
     │                 publicUrl: "https://pub-*.r2.dev/..." } <────────────┘
     │
     └───── 3. Dogrudan PUT (Binary Stream) ────────────────────────> [ Cloudflare R2 ]
```

- Istemci: `components/admin/ImageUploader.tsx`
- Sunucu API: `app/api/upload/presigned/route.ts`
- URL'ler `@aws-sdk/s3-request-presigner` ile 60 saniye gecerli olacak sekilde imzalanir.

---

## 6. CI/CD Dagitim Hatti ve Konteyner Yasam Dongusu

GitHub Actions (`.github/workflows/deploy.yml`):
1. `main` veya `infra/vps-docker` dalina push yapildiginda tetiklenir.
2. Docker Buildx ve GHA onbellegi ile katmanlar saklanir.
3. Imajlar GitHub Container Registry (`ghcr.io`) uzerine etiketlenir.
4. `main` dali icin SSH eylemi ile sunucuda container guncellemesi yapilir:
   ```bash
   docker compose -f docker-compose.prod.yml pull app
   docker compose -f docker-compose.prod.yml up -d --remove-orphans app
   ```

---

## 7. Yedekleme ve Felaket Kurtarma (Disaster Recovery)

`scripts/backup-r2.sh` betigi:
1. `docker exec -t ruru_db pg_dump -U ruru_user -d ruru_db | gzip` komutuyla calisir.
2. `/var/backups/postgres` dizininde 7 gunluk yerel arsiv tutar.
3. `@aws-sdk/client-s3` ile Cloudflare R2 `ruru-backups` bucket'ina soguk yedek yukler.

---

## 8. Modul Bagimlilik ve Gozlemlenebilirlik Durumu

- Madge AST Analizi: 53 TypeScript kaynak dosyasi tarandi, 0 circular dependency (dongusel bagimlilik) tespit edildi.
- Portainer CE: Konteyner CPU/RAM kullanimlari ve sanal ag yapisi Port 9000 uzerinden incelenebilir.
- Saglik Kontrolu: `/api/health/db` uzerinden Next.js ve PostgreSQL durumu JSON olarak izlenebilir.

---

## 9. Eksikler ve Gelecek Iyilestirmeler (Production Readiness)

Sistemin uzun vadeli bakimi ve tam otonom hale gelmesi icin yapilmasi gereken teknik iyilestirmeler:

### 9.1. Veritabani Migrasyon Motoru (Database Migrations)
- Mevcut durum: Tablolar `docker/postgres/init.sql` uzerinden olusturuldu. Yeni kolon ihtiyaclarinda manuel SQL calistirilmasi gerekir.
- Iyilestirme: Prisma veya Drizzle ORM entegrasyonu ile versiyonlanmis migrasyon dosyalarinin CI/CD hattinda otomatik calistirilmasi (`drizzle-kit migrate` veya `prisma migrate deploy`).

### 9.2. Otomatik SSL Yenileme Hook'u (Certbot Cron & Nginx Reload)
- Mevcut durum: Ilk sertifika `certbot certonly --standalone` ile alindi.
- Iyilestirme: Host crontab uzerine webroot tabanli otomatik yenileme ve Nginx konteynerine reload sinyali gonderen gorev tanimlanmali:
  ```bash
  0 3 * * * certbot renew --webroot -w /var/www/certbot --quiet && docker exec ruru_nginx nginx -s reload
  ```

### 9.3. Sifir Kesintili Dagitim (Zero-Downtime Deployment)
- Mevcut durum: `docker compose up -d app` calistirildiginda konteyner yeniden olusurken 1-2 saniyelik HTTP kesinti olasiligi vardir.
- Iyilestirme: Traefik veya Nginx upstream yuk dengeleyici ile cift konteyner (blue/green) rolling update yapisi kurulmali.

### 9.4. Onbellek ve Hiz Siniri Katmani (Redis / Valkey)
- Mevcut durum: Admin brute-force gecikmesi ve Hero ayarlari process belleginde tutulur. Shopier istekleri dogrudan API'ye gider.
- Iyilestirme: Redis konteyneri eklenerek Shopier stok verilerinin onbelleklenmesi ve admin girislerine katı IP tabanli Rate Limiting uygulanmasi.

### 9.5. Merkezi Izleme ve Bildirim (Logging & Alerting)
- Mevcut durum: Loglar sunucu icinde tutulur.
- Iyilestirme: Uptime Kuma veya harici servis (BetterStack/Cronitor) ile `/api/health/db` rotasina dakikalik ping atilmasi ve kesintide Telegram/Discord uyarisi uretilmesi.

### 9.6. Otomatik Yedek Kurtarma Testi (Restore Testing)
- Mevcut durum: Yedek R2'ya yuklenir ancak periyodik olarak otomatik geri yukleme testi yapilmaz.
- Iyilestirme: Haftalik test is akisi ile yedeğin gecici bir PostgreSQL konteynerinde acilip saglik denetiminden gecirilmesi.
