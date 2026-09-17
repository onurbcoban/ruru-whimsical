# 🛠️ Self-Hosted Infrastructure & DevOps Öğrenme Yol Haritası

Bu doküman, bir web uygulamasının (Next.js + PostgreSQL + Nginx + S3) sıfırdan bir VPS (Virtual Private Server) üzerinde nasıl kurulacağını, nasıl maintain edileceğini ve arkasındaki sistem mekaniklerini **uygulayarak öğrenmen** için hazırlanmıştır.

---

## 🧭 Genel Pedagojik Strateji

1. **Önce Yerelde (Localhost) İnşa Et:**
   - Kredi kartı yok, sunucu faturası riski yok.
   - Her şeyi bozup baştan kurabileceğin güvenli kum havuzu (sandbox).
2. **Kavramı Anla → Kendi Elinle Yap → Boz & Düzelt:**
   - Sadece komut kopyalamak yok; "Neden bu port?", "Nginx neden gerekli?", "Volume silinirse ne olur?" sorularının cevabını yaşayarak görmek esas.
3. **VPS'e ve Canlıya Taşı:**
   - Yerelde hazır olan yapıyı Linux sunucuya deploy et, SSL ve domain bağla, production operasyonlarını (backup, loglar, güncelleme) yönet.

---

## 🗺️ Fazlar ve Müfredat

```
[ Faz 1: Docker & Compose ] ──► [ Faz 2: PostgreSQL & SQL ] ──► [ Faz 3: Nginx Reverse Proxy ]
                                                                             │
[ Faz 7: Production VPS & Ops ] ◄── [ Faz 6: Portainer & Madge ] ◄── [ Faz 5: CI/CD & GHCR ] ◄─── [ Faz 4: Cloudflare R2 / S3 ]
```

---

### 📦 Faz 1: Docker ve Docker Compose Temelleri

> **Amaç:** Kodun "benim makinemde çalışıyordu, sunucuda çalışmıyor" sorununu çözmeyi ve servisleri izole çalıştırmayı öğrenmek.

#### 1. Temel Kavramlar (Neyi Anlamalısın?)
- **Image vs Container:** Sınıf (Class) ile Nesne (Instance) farkı gibidir. Image tariftir, Container çalışan halidir.
- **Dockerfile:** İşletim sisteminden başlayıp kodu çalıştıran adım adım tarif. Multi-stage build nedir ve neden Next.js için önemlidir? (Gereksiz 1 GB'lık `node_modules` yerine 100 MB'lık standalone imaj).
- **Docker Compose:** Birden fazla container'ı (Next.js + Postgres + Nginx) tek bir sanal ağda birbirine bağlayan orkestrasyon aracı.
- **Port Mapping (`ports`):** Host (senin bilgisayarın) portu ile container iç portunun eşlenmesi (`8080:80`).
- **Volumes:** Container silindiğinde içindeki verilerin (örneğin veritabanı) kaybolmaması için diske bağlama yöntemi.

#### 2. Pratik Görevler (Hands-on)
1. Next.js için `output: 'standalone'` ayarını açmak ve çok aşamalı (multi-stage) `Dockerfile` yazmak.
2. `docker-compose.yml` içinde `app` servisini tanımlayıp ayağa kaldırmak (`docker compose up --build`).
3. Container içine girip terminal çalıştırmak (`docker exec -it ... sh`).

#### 3. Önerilen Kaynaklar (Okuma & İzleme)
- **Video:** [Docker in 100 Seconds - Fireship](https://www.youtube.com/watch?v=Gjnup-PuquQ) (Hızlı özet)
- **Video:** [Docker & Docker Compose Full Course - TechWorld with Nana](https://www.youtube.com/watch?v=3c-iBn73dDE) (Kapsamlı ve tane tane anlatan en iyi rehber)
- **Yazı:** [Next.js Official Docker Example & Standalone Output Guide](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- **Arama Terimleri:** `docker multi-stage build nextjs`, `docker compose networking explained`

---

### 🐘 Faz 2: PostgreSQL, SQL ve Veritabanı Yönetimi

> **Amaç:** Supabase gibi hazır BaaS platformlarının arkasında gerçekte ne çalıştığını, SQL dilini ve veritabanı operasyonlarını öğrenmek.

#### 1. Temel Kavramlar (Neyi Anlamalısın?)
- **İlişkisel Veritabanı (RDBMS):** Tablolar, birincil anahtarlar (`PRIMARY KEY`), yabancı anahtarlar (`FOREIGN KEY`), indeksler (`INDEX`).
- **Data Persistence (Kalıcılık):** PostgreSQL container'ı çökerse veya güncellenirse veriler nerede saklanır? (`named volume` mantığı).
- **Connection String:** `postgresql://kullanici:sifre@host:5432/veritabani` anatomisi.
- **psql CLI:** Terminalden veritabanına bağlanıp SQL sorgusu çalıştırma.
- **Backup & Restore:** `pg_dump` ile SQL yedeği alma ve `psql` ile geri yükleme.

#### 2. Pratik Görevler (Hands-on)
1. `docker-compose.yml` içine `postgres:16-alpine` servisi eklemek ve kalıcı volume tanımlamak.
2. Container içindeki Postgres'e bağlanıp `supabase/schema.sql` dosyasındaki tabloları oluşturmak.
3. Node.js tarafından Postgres'e bağlanmak için hafif `postgres.js` sürücüsünü entegre etmek.
4. Terminalden test verisi ekleyip çekmek; ardından container'ı silip tekrar açarak verinin korunduğunu test etmek.
5. Bir komutla veritabanı yedeği (`backup.sql`) almak.

#### 3. Önerilen Kaynaklar (Okuma & İzleme)
- **Video:** [PostgreSQL in 100 Seconds - Fireship](https://www.youtube.com/watch?v=n2Fluyr3lbc)
- **Video:** [Learn PostgreSQL Tutorial - Full Course for Beginners - freeCodeCamp](https://www.youtube.com/watch?v=qw--VYLpxG4) (Temel SQL komutları)
- **Yazı:** [PostgreSQL Official Documentation: Backup and Restore](https://www.postgresql.org/docs/current/backup.html)
- **Arama Terimleri:** `docker compose postgres volume persistence`, `postgres pg_dump restore tutorial`

---

### 🌐 Faz 3: Nginx Reverse Proxy ve Trafik Yönetimi

> **Amaç:** Web uygulamalarının önüne neden bir web sunucusu konulduğunu, ters vekil (reverse proxy) mantığını ve istek yönlendirmeyi kavramak.

#### 1. Temel Kavramlar (Neyi Anlamalısın?)
- **Reverse Proxy nedir?:** İstemci ile backend arasına girerek gelen istekleri karşılayan, yönlendiren ve filtreleyen sunucu.
- **Neden Next.js doğrudan dışarı açılmaz?:**
  - Güvenlik (Node.js process'ini gizlemek, header temizliği).
  - Statik dosya performansı (Nginx C diliyle yazılmıştır, statik dosyaları Node.js'ten 10x hızlı sunar).
  - SSL sertifikası terminasyonu.
  - Rate limiting ve DDoS önleme.
- **Nginx Konfigürasyonu Anatomisi:** `events`, `http`, `server`, `location`, `proxy_pass`, `proxy_set_header`.

#### 2. Pratik Görevler (Hands-on)
1. Projede `nginx/default.conf` dosyası oluşturmak.
2. `docker-compose.yml` içine `nginx` container'ı eklemek; 80 portunu açmak.
3. Tarayıcıdan `http://localhost` yazdığında isteğin Nginx'e gitmesini, Nginx'in de bunu içerideki `http://app:3000` servisine iletmesini sağlamak.
4. Next.js loglarında istemcinin gerçek IP adresinin göründüğünü (`X-Forwarded-For`) doğrulamak.

#### 3. Önerilen Kaynaklar (Okuma & İzleme)
- **Video:** [Nginx in 100 Seconds - Fireship](https://www.youtube.com/watch?v=JKxlsvZXG7c)
- **Video:** [Nginx Tutorial for Beginners - Hussein Nasser](https://www.youtube.com/watch?v=7VAI73roXaY) (Yazılım mühendisleri için Nginx mimarisini en derin ve net anlatan kanal)
- **Yazı:** [DigitalOcean Community: Understanding Nginx HTTP Proxying and Reverse Proxy Concepts](https://www.digitalocean.com/community/tutorials/understanding-nginx-http-proxying-load-balancing-buffering-and-caching)
- **Arama Terimleri:** `nginx reverse proxy docker compose nextjs`, `nginx proxy_set_header explanation`

---

### ☁️ Faz 4: AWS S3 ve Nesne Depolama (Object Storage)

> **Amaç:** Medya dosyalarını (resim/video) sunucu diskinde değil, bulut nesne depolama servislerinde tutmayı ve S3 SDK'sını öğrenmek.

#### 1. Temel Kavramlar (Neyi Anlamalısın?)
- **Blok / Dosya Depolama vs Nesne Depolama (Object Storage):** Klasör hiyerarşisi yerine key-value (anahtar-değer) mantığıyla sınırsız ölçeklenebilir depolama.
- **Bucket & Object:** Kova ve dosya.
- **IAM (Identity and Access Management):** Root hesap yerine sadece S3'e erişimi olan kısıtlı servis kullanıcısı ve Access Key / Secret Key üretimi.
- **Bucket Policy & CORS:** Resimlerin web sitesinden doğrudan görüntülenebilmesi için gerekli izinler.
- **S3 API Standardı:** Neden S3 öğrenince Cloudflare R2, MinIO veya DigitalOcean Spaces'ı da öğrenmiş olursun?

#### 2. Pratik Görevler (Hands-on)
1. AWS Console'da bir IAM kullanıcısı oluşturup `AmazonS3FullAccess` (veya kısıtlı policy) vermek.
2. Bir S3 bucket açıp genel okuma (public read) ve CORS ayarlarını yapmak.
3. `@aws-sdk/client-s3` kütüphanesini projeye eklemek.
4. Admin panelindeki resim yükleme bileşenini doğrudan S3'e yükleyecek API rotasına bağlamak.

#### 3. Önerilen Kaynaklar (Okuma & İzleme)
- **Video:** [AWS S3 in 100 Seconds - Fireship](https://www.youtube.com/watch?v=v33UblSkLCE)
- **Video:** [Upload Files to AWS S3 in Next.js 14/15 - ByteGrad / Dave Gray](https://www.youtube.com/results?search_query=nextjs+s3+upload+app+router)
- **Yazı:** [AWS SDK for JavaScript v3 S3 Client Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-s3/)
- **Arama Terimleri:** `nextjs app router s3 upload api route`, `aws s3 bucket policy public read`

---

### 🚀 Faz 5: CI/CD Pipeline, Otomasyon & Container Registry (GHCR)

> **Amaç:** Kod VPS'te değil, GitHub Actions üzerinde güvenli ve hızlı şekilde derlenir. Üretilen Docker imajı GitHub Container Registry'ye (`ghcr.io`) yüklenir.

#### 1. Temel Kavramlar (Neyi Anlamalısın?)
- **GitHub Actions Runner:** Ubuntu sanal makinede otomatik çalışan iş akışı (`.github/workflows/deploy.yml`).
- **BuildKit & Docker Buildx:** Multi-stage derlemeyi hızlandıran ve katman önbelleği oluşturan motor.
- **GitHub Container Registry (GHCR):** `ghcr.io` üzerinde özel Docker paket barındırma.
- **Dala Duyarlı Etiketleme (Branch-aware Tagging):** 
  - `main` dalı -> `:latest` ve `:sha`
  - Yan dallar (`infra/vps-docker`) -> `:branch-name` ve `:sha` (Canlıdaki `:latest` asla kaza ile ezilmez).
- **GitHub Actions Cache (`type=gha`):** `node_modules` ve Next.js build katmanlarını önbelleğe alıp build süresini dakikalardan saniyelere düşürme.

#### 2. Pratik Görevler (Hands-on)
1. `.github/workflows/deploy.yml` pipeline dosyasını oluşturmak.
2. `main` ve feature branch'leri için dala duyarlı etiketleme kurallarını yapılandırmak.
3. GitHub Packages yetkilerini (`read:packages`, `write:packages`) tanımlamak.
4. GitHub Actions ile derlenen imajı GHCR'a push'lamak.
5. İmajı yerel makineye `docker pull` ile çekerek doğrulamak.

#### 3. Önerilen Kaynaklar (Okuma & İzleme)
- **Video:** [GitHub Actions CI/CD to VPS with Docker - TechWorld with Nana](https://www.youtube.com/watch?v=R8_veQiYBjI)
- **Yazı:** [Publishing and managing Docker images with GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

### 📊 Faz 6: Mimari Görselleştirme, Bağımlılık Analizi & Gözlemlenebilirlik (Portainer & Madge)

> **Amaç:** Kurulan altyapıyı ve yazılım bağımlılıklarını soyut komut satırından çıkarıp görselleştirmek; Docker ağını, konteyner kaynaklarını ve TypeScript modül ağacını canlı araçlarla inceleyerek tam mimari hakimiyet kazanmak.

#### 1. Temel Kavramlar (Neyi Anlamalısın?)
- **Docker Socket (`/var/run/docker.sock`):** Docker istemcisi ile Docker Daemon arasındaki iletişim kanalı. Portainer'ın çalışan konteynerleri okumak ve yönetmek için neden bu sokete erişim istediği.
- **Konteyner Gözlemlenebilirliği (Observability):** Konteynerlerin anlık CPU, RAM, ağ (I/O) tüketimi, canlı logları ve restart politikaları.
- **Sanal Ağ Köprüleri (Docker Bridge Networks):** `ruru_nginx`, `ruru_app` ve `ruru_db` servislerinin iç IP'lerinin (`172.x.x.x`) ve birbirleriyle kurduğu sanal köprünün görsel haritası.
- **Modül Bağımlılık Grafiği (AST / Import Graph):** TypeScript kodunda hangi dosyanın kimi çağırdığı, bileşenlerin katman sınırları.
- **Döngüsel Bağımlılık (Circular Dependency):** A modülünün B'yi, B modülünün de doğrudan veya dolaylı olarak A'yı import etmesi durumu; Next.js SSR ve derleme anında bellek sızıntısına veya "undefined import" hatalarına yol açan bu zincirlerin tespiti.

#### 2. Pratik Görevler (Hands-on)
1. **Portainer Kurulumu:** Docker üzerinde `portainer/portainer-ce` konteynerini 9000 portu ile ayağa kaldırmak.
2. **Konteyner ve Ağ Analizi:** Portainer arayüzünden (`http://localhost:9000`) projemizin konteynerlerini, dahili bridge ağını ve `postgres_data` volume'ünü incelemek.
3. **Madge Kurulumu ve Analizi:** `npx madge` ile Next.js projemizin modül bağımlılıklarını taramak.
4. **Döngüsel Bağımlılık Taraması:** Projede circular dependency olup olmadığını komutla denetlemek (`npx madge --circular`).
5. **Görsel Harita Çıkarımı:** Madge veya Graphviz kullanarak bağımlılık haritasını görsel bir çıktıya dönüştürmek.

#### 3. Önerilen Kaynaklar (Okuma & İzleme)
- **Video:** [Portainer Explained in 5 Minutes - TechWorld with Nana](https://www.youtube.com/watch?v=l_8_J5g336E)
- **Yazı:** [Madge GitHub Documentation: Visualizing Module Dependencies](https://github.com/pahen/madge)
- **Arama Terimleri:** `portainer docker compose visualization`, `madge circular dependency nextjs`

---

### 🛡️ Faz 7: Production VPS, Linux Güvenlik Sıkılaştırma, SSL & Otomatik Operasyonlar

> **Amaç:** Yerelde çalışan sistemi gerçek bir Linux sunucusuna (VPS) taşımak, domain ve Let's Encrypt SSL sertifikası bağlamak, GitHub Actions'tan sunucuya tam otomatik Continuous Deployment (CD) kurmak ve otomatik yedekleme (Disaster Recovery) ile sistemi canlıda tutmak.

#### 1. Temel Kavramlar (Neyi Anlamalısın?)
- **Linux Temelleri & SSH Hardening:**
  - Ubuntu 24.04 LTS sunucuya SSH anahtarıyla şifresiz giriş (`~/.ssh/id_ed25519`).
  - Root şifreli girişi kapatmak (`PasswordAuthentication no`), brute-force saldırılarını engellemek.
- **Güvenlik Duvarı (UFW):**
  - Sadece 22 (SSH), 80 (HTTP) ve 443 (HTTPS) portlarını açmak.
  - Veritabanı portunu (5432) dış dünyaya tamamen kapatmak; PostgreSQL sadece Docker dahili ağı üzerinden erişilebilir kalmalı.
- **Swap Memory (Sanal Bellek):**
  - 1-2 GB RAM'li ekonomik VPS'lerde bellek taşmasında Linux OOM (Out-Of-Memory) killer'ın servisleri durdurmasını engellemek için diskten 2 GB sanal RAM oluşturmak.
- **DNS Yönetimi:**
  - Alan adının Apex (`@`) ve `www` A kayıtlarını VPS'in statik IP adresine yönlendirmek.
- **Let's Encrypt & Certbot (Otomatik SSL/TLS):**
  - Nginx'in 443 portunda HTTPS dinlemesi ve 80 portundaki trafiği otomatik 301 ile HTTPS'e yönlendirmesi.
  - Certbot ACME challenge protokolü ile ücretsiz 90 günlük SSL üretimi ve otomatik yenileme (auto-renew cron).
- **Otomatik Dağıtım (Continuous Deployment - CD):**
  - `git push origin main` yapıldığında GitHub Actions'ın VPS'e SSH atarak `docker compose pull && docker compose up -d` komutunu tetiklemesi.
- **Felaket Kurtarma & Yedekleme (Disaster Recovery):**
  - `backup.sh` betiği: Her gece `pg_dump` ile SQL dökümü alıp sıkıştırmak (`.sql.gz`).
  - Yedeği Cloudflare R2'da `ruru-backups` bucket'ına yüklemek.
  - Linux `cron` servisi ile tam otomatik çalıştırmak.

#### 2. Pratik Görevler (Hands-on)
1. Hetzner / DigitalOcean üzerinden Ubuntu Linux VPS açmak ve SSH anahtarı tanımlamak.
2. UFW güvenlik duvarını yapılandırmak ve Swap belleği aktifleştirmek.
3. Sunucuya Docker & Docker Compose kurmak.
4. Alan adı DNS kayıtlarını VPS IP'sine yönlendirmek.
5. Certbot ile Let's Encrypt SSL sertifikasını alıp `nginx/ssl.conf` ile HTTPS'e geçmek.
6. GitHub Actions'a `VPS_SSH_KEY`, `VPS_IP`, `VPS_USER` secret'larını ekleyip otomatik CD adımını bağlamak.
7. `backup.sh` yazıp crontab'a günlük otomatik yedek eklemek.

#### 3. Önerilen Kaynaklar (Okuma & İzleme)
- **Video:** [Linux for Beginners - freeCodeCamp](https://www.youtube.com/watch?v=sWbGOqEcRqI)
- **Yazı:** [DigitalOcean Community: Initial Server Setup with Ubuntu 22.04 / 24.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04)
- **Yazı:** [DigitalOcean Community: How to Secure Nginx with Let's Encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04)

---

## 🎯 Adım Adım İlerleme Kuralımız

Her faza geçtiğimizde:
1. İlgili konunun mimarisini ve "neden"ini kısaca konuşacağız.
2. Gerekli dosyaları adım adım oluşturup kodlayacağız.
3. Test edip çıktıyı terminalde göreceğiz.
4. O adımda takıldığın veya arkasını merak ettiğin her şeyi soracaksın; pekişmeden bir sonraki adıma geçmeyeceğiz.
