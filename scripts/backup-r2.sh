#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/postgres"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/ruru_db_${DATE}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "==> PostgreSQL yedeği alınıyor: ${BACKUP_FILE}..."
docker exec -t ruru_db pg_dump -U ruru_user -d ruru_db | gzip > "${BACKUP_FILE}"

echo "==> Yedek başarıyla alındı: $(du -h "${BACKUP_FILE}" | cut -f1)"

# Sunucu diskinde sadece son 7 günün yedeğini tut, eskileri sil
find "${BACKUP_DIR}" -type f -name "ruru_db_*.sql.gz" -mtime +7 -delete

echo "==> Yerel temizlik tamamlandı (son 7 gün korundu)."

# Cloudflare R2'ya yükleme (Eğer R2 ortam değişkenleri tanımlıysa)
if [ -f /app/.env.production ] || [ -f /app/.env ]; then
  echo "==> Cloudflare R2 yedekleme tetikleniyor..."
  docker exec -i ruru_app node -e "
    const fs = require('fs');
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    const client = new S3Client({
      region: 'auto',
      endpoint: 'https://' + process.env.R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      }
    });
    const stream = fs.createReadStream(process.argv[1]);
    client.send(new PutObjectCommand({
      Bucket: process.env.R2_BACKUP_BUCKET || 'ruru-backups',
      Key: 'db-backups/' + process.argv[2],
      Body: stream,
    })).then(() => console.log('R2 yedekleme başarılı.')).catch(err => console.error('R2 yedekleme hatası:', err));
  " "${BACKUP_FILE}" "ruru_db_${DATE}.sql.gz" || true
fi

echo "==> Yedekleme süreci tamamlandı."
