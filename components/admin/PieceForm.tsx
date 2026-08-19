'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Piece } from '@/types/database';
import { createPieceAction, updatePieceAction } from '@/app/admin/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface PieceFormProps {
  piece?: Piece;
}

export function PieceForm({ piece }: PieceFormProps) {
  const router = useRouter();
  const isEditing = !!piece;

  const [title, setTitle] = useState(piece?.title || '');
  const [category, setCategory] = useState(piece?.category || 'Şortolon');
  const [price, setPrice] = useState(piece?.price?.toString() || '');
  const [shopierUrl, setShopierUrl] = useState(piece?.shopier_url || '');
  const [shopierSku, setShopierSku] = useState(piece?.shopier_sku || '');
  const [story, setStory] = useState(piece?.story || '');
  const [imageUrl, setImageUrl] = useState(piece?.main_image_url || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(piece?.gallery_urls || []);
  const [sizeInfo, setSizeInfo] = useState(piece?.size_info || '');
  const [measurements, setMeasurements] = useState(piece?.measurements || '');
  const [isArchived, setIsArchived] = useState(piece?.is_archived || false);

  const [craftDetails, setCraftDetails] = useState<Array<{ label: string; value: string }>>(
    piece?.craft_details || [
      { label: 'Kumaş Türü', value: '%100 Doğal Keten' },
      { label: 'Düğme Detayı', value: 'Sedef Düğmeler' },
    ]
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addDetailRow = () => {
    setCraftDetails([...craftDetails, { label: '', value: '' }]);
  };

  const updateDetailRow = (index: number, field: 'label' | 'value', text: string) => {
    const next = [...craftDetails];
    next[index][field] = text;
    setCraftDetails(next);
  };

  const removeDetailRow = (index: number) => {
    setCraftDetails(craftDetails.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setErrorMsg('Lütfen cihazınızdan en az bir ana fotoğraf seçin.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('story', story);
    formData.append('main_image_url', imageUrl);
    formData.append('gallery_urls', JSON.stringify(galleryUrls));
    formData.append('showcase_section', isArchived ? 'archive' : 'shopier');
    formData.append('is_shopier_product', 'true');
    formData.append('shopier_sku', shopierSku);
    formData.append('shopier_url', shopierUrl);
    if (price) formData.append('price', price);
    if (sizeInfo) formData.append('size_info', sizeInfo);
    if (measurements) formData.append('measurements', measurements);
    if (isEditing) formData.append('is_archived', isArchived ? 'true' : 'false');
    formData.append('craft_details', JSON.stringify(craftDetails.filter((d) => d.label.trim() && d.value.trim())));

    try {
      if (isEditing && piece) {
        await updatePieceAction(piece.id, formData);
      } else {
        await createPieceAction(formData);
      }
      router.push('/admin/pieces');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Satış parçası kaydedilirken bir hata oluştu.');
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '800px',
      }}
    >
      {errorMsg && (
        <div
          style={{
            background: 'rgba(196, 98, 67, 0.1)',
            border: '1px solid var(--accent-terracotta)',
            color: 'var(--accent-terracotta)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13.5px',
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* 1. Temel Giysi Bilgileri & Fotoğraflar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
          Elbise Bilgileri & Fotoğraflar
        </h3>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Giysi / Elbise Adı *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Tirşe Keten Gömlek Elbise"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Kategori *
          </label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Örn: Şortolon, Elbise, Üst Giyim, Pelerin..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            {['Şortolon', 'Elbise', 'Üst Giyim', 'Pelerin & Dış Giyim', 'Etek & Pantolon', 'Aksesuar'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setCategory(tag)}
                style={{
                  background: category.toLowerCase() === tag.toLowerCase() ? 'var(--accent-terracotta)' : 'var(--bg-card-alt)',
                  color: category.toLowerCase() === tag.toLowerCase() ? '#FFFFFF' : 'var(--text-soft)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <ImageUploader
          label="Ana Fotoğraf (Cihazınızdan Seçin)"
          value={imageUrl}
          bucketName="portfolio"
          onChange={(url) => setImageUrl(url as string)}
        />

        <ImageUploader
          label="Galeri & Detay Fotoğrafları (Birden Fazla Eklenebilir)"
          value={galleryUrls}
          multiple={true}
          bucketName="portfolio"
          onChange={(urls) => setGalleryUrls(urls as string[])}
        />

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Kumaş & Giysi Hikayesi
          </label>
          <textarea
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Bu elbisenin dikiş süreci, ketenin dokusu veya giyene hissettirdikleri..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              lineHeight: 1.6,
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* 2. Shopier Satış & Fiyat Bilgileri */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
            Satış & Fiyat Detayları
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
            Shopier üzerindeki satış fiyatı ve direkt satın alma bağlantısı.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Satış Fiyatı (₺) *
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Örn: 2850"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Shopier Satın Alma Linki (URL)
            </label>
            <input
              type="url"
              value={shopierUrl}
              onChange={(e) => setShopierUrl(e.target.value)}
              placeholder="https://shopier.com/..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Beden & Kalıp Ölçüleri */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div>
          <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
            Beden & Kalıp Ölçü Rehberi
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
            Alıcıların doğru bedeni seçmesi için kalıp bilgisi ve santimetre ölçüleri.
          </p>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Beden / Kalıp Uyumu
          </label>
          <input
            type="text"
            value={sizeInfo}
            onChange={(e) => setSizeInfo(e.target.value)}
            placeholder="Örn: 36 - 40 Rahat Kalıp, Standart Beden..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
            {['36 - 38 Standart', '36 - 40 Rahat Kalıp', 'Oversize / Salaş', 'Tek Beden (Standart)'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSizeInfo(tag)}
                style={{
                  background: sizeInfo === tag ? 'var(--accent-sage)' : 'var(--bg-card-alt)',
                  color: sizeInfo === tag ? '#FFFFFF' : 'var(--text-soft)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Detaylı Santimetre Ölçüleri
          </label>
          <textarea
            rows={2}
            value={measurements}
            onChange={(e) => setMeasurements(e.target.value)}
            placeholder="Örn: Göğüs Çevresi: 104 cm, Etek Boyu: 125 cm, Omuz: 42 cm"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              lineHeight: 1.6,
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* 4. Kumaş & Zanaat Özellikleri */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
              Kumaş & Zanaat Özellikleri
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
              Kumaş cinsi, düğme materyali, dikiş stili gibi ayırt edici özellikler.
            </p>
          </div>

          <button
            type="button"
            onClick={addDetailRow}
            style={{
              background: 'var(--bg-card-alt)',
              border: '1px solid var(--border-warm)',
              color: 'var(--accent-sage)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Özellik Ekle
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {craftDetails.map((detail, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={detail.label}
                onChange={(e) => updateDetailRow(index, 'label', e.target.value)}
                placeholder="Özellik (Örn: Kumaş)"
                style={{
                  flex: '1',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-warm)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '13.5px',
                }}
              />
              <input
                type="text"
                value={detail.value}
                onChange={(e) => updateDetailRow(index, 'value', e.target.value)}
                placeholder="Değer (Örn: %100 Ham Keten)"
                style={{
                  flex: '2',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-warm)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '13.5px',
                }}
              />
              <button
                type="button"
                onClick={() => removeDetailRow(index)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E53E3E',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0 8px',
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kaydet & İptal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <Link
          href="/admin/pieces"
          style={{
            fontSize: '13.5px',
            color: 'var(--text-soft)',
            textDecoration: 'none',
          }}
        >
          &larr; İptal Et ve Satış Listesine Dön
        </Link>

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: 'var(--accent-terracotta)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 32px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(196, 98, 67, 0.25)',
          }}
        >
          {submitting ? 'Kaydediliyor...' : isEditing ? 'Değişiklikleri Kaydet' : 'Satış Parçasını Yayınla'}
        </button>
      </div>
    </form>
  );
}
