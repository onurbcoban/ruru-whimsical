#!/usr/bin/env bash
set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "Hata: Bu betik root yetkisiyle çalıştırılmalıdır (sudo ./setup-vps.sh)"
  exit 1
fi

echo "==> 1. Sistem paketleri güncelleniyor..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
apt-get install -y curl git ufw ca-certificates gnupg certbot

echo "==> 2. UFW Güvenlik Duvarı yapılandırılıyor..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
# Port 5432 (PostgreSQL) bilerek açılmaz, dış dünyaya kapalıdır!
ufw --force enable
ufw status verbose

echo "==> 3. 2GB Swap (Sanal Bellek) tahsis ediliyor..."
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl vm.swappiness=10
  echo 'vm.swappiness=10' >> /etc/sysctl.conf
  echo "Swap başarıyla oluşturuldu."
else
  echo "Swap zaten mevcut, atlanıyor."
fi

echo "==> 4. Docker ve Docker Compose kuruluyor..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo "Docker kuruldu."
else
  echo "Docker zaten kurulu."
fi

echo "=========================================================="
echo " VPS Kurulumu ve Güvenlik Sıkılaştırması Tamamlandı!"
echo " - Portlar: 22 (SSH), 80 (HTTP), 443 (HTTPS) açık"
echo " - PostgreSQL (5432): Dış dünyaya tamamen KAPALI"
echo " - Swap: 2 GB aktif (OOM Killer koruması)"
echo " - Docker & Compose: Hazır"
echo "=========================================================="
