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
  const [story, setStory] = useState(piece?.story || '');
  const [imageUrl, setImageUrl] = useState(piece?.main_image_url || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(piece?.gallery_urls || []);
  const [showcaseSection, setShowcaseSection] = useState<'shopier' | 'custom' | 'creative' | 'archive'>(
    (piece?.showcase_section as any) || (piece?.is_archived ? 'archive' : piece?.is_shopier_product ? 'shopier' : 'custom')
  );
  const [isShopier, setIsShopier] = useState(piece?.is_shopier_product ?? true);
  const [shopierSku, setShopierSku] = useState(piece?.shopier_sku || '');
  const [shopierUrl, setShopierUrl] = useState(piece?.shopier_url || '');
  const [price, setPrice] = useState(piece?.price?.toString() || '');
  const [sizeInfo, setSizeInfo] = useState(piece?.size_info || '');
  const [measurements, setMeasurements] = useState(piece?.measurements || '');
  const [isArchived, setIsArchived] = useState(piece?.is_archived || false);

  // Dinamik Zanaat Özellikleri
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
    formData.append('showcase_section', showcaseSection);
    formData.append('is_shopier_product', showcaseSection === 'shopier' ? 'true' : 'false');
    formData.append('shopier_sku', shopierSku);
    formData.append('shopier_url', shopierUrl);
    if (price) formData.append('price', price);
    if (sizeInfo) formData.append('size_info', sizeInfo);
    if (measurements) formData.append('measurements', measurements);
    if (isEditing) formData.append('is_archived', showcaseSection === 'archive' ? 'true' : 'false');
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
      setErrorMsg(err?.message || 'Kayıt sırasında bir hata oluştu.');
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

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
          Temel Parça Bilgileri & Fotoğraflar
        </h3>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Parça Başlığı
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
            Kategori / Alan
          </label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Örn: Şortolon, Elbise, Üst Giyim, Pelerin, Serbest Çalışma..."
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
            {['Şortolon', 'Elbise', 'Üst Giyim', 'Pelerin & Dış Giyim', 'Etek & Pantolon', 'Serbest Çalışma', 'Aksesuar', 'Arşiv'].map((tag) => (
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
                  transition: 'all 0.15s ease',
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
            Kumaş / Eser Hikayesi & İlham Notu
          </label>
          <textarea
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Bu parçanın dikiş süreci, kumaşı veya hissettirdikleri..."
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
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
            Beden & Kalıp Ölçüleri (Opsiyonel)
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
            Giysinin kalıp bilgisi ve detaylı santimetre ölçüleri (boş bırakılırsa görünmez).
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
            placeholder="Örn: 36-38 Standart, 36-42 Rahat Salaş Kalıp, S/M..."
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
                  transition: 'all 0.15s ease',
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
          <input
            type="text"
            value={measurements}
            onChange={(e) => setMeasurements(e.target.value)}
            placeholder="Örn: Göğüs: 98 cm • Boy: 120 cm • Kol Boyu: 58 cm • Basen: 110 cm"
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

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
            Vitrindeki Yeri
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
            Parçanın ana sayfadaki sergileneceği bölümü seçin.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            {
              id: 'shopier',
              title: 'Askıdaki Hazır Parçalar',
              desc: 'Shopier satışında, anında satın alınabilir giysiler',
            },
            {
              id: 'custom',
              title: 'Atölye Giysi Koleksiyonu',
              desc: 'Kişiye özel dikim ve atölye kıyafet tasarımları',
            },
            {
              id: 'creative',
              title: 'Serbest Çalışmalar & Sanat',
              desc: 'Avize, figür, seramik, nakış vb. dikiş dışı portfolyo',
            },
            {
              id: 'archive',
              title: 'Hatıra Arşivi',
              desc: 'Sahiplerine ulaşmış, tükenmiş geçmiş tasarımlar',
            },
          ].map((item) => {
            const isSelected = showcaseSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setShowcaseSection(item.id as any)}
                style={{
                  background: isSelected ? 'var(--bg-linen-tag)' : 'var(--bg-main)',
                  border: isSelected ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-warm)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-soft)', lineHeight: 1.4 }}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>

        {showcaseSection === 'shopier' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px',
              marginTop: '10px',
              paddingTop: '20px',
              borderTop: '1px dashed var(--border-warm)',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Fiyat (₺)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2850"
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
        )}
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
              Zanaat & Kumaş Özellikleri (Opsiyonel)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
              İstediğiniz özellikleri dinamik olarak ekleyip çıkarabilirsiniz.
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {craftDetails.map((detail, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                value={detail.label}
                onChange={(e) => updateDetailRow(idx, 'label', e.target.value)}
                placeholder="Örn: Kumaş Türü"
                style={{
                  width: '40%',
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
                onChange={(e) => updateDetailRow(idx, 'value', e.target.value)}
                placeholder="Örn: %100 Yıkanmış Keten"
                style={{
                  flex: 1,
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
                onClick={() => removeDetailRow(idx)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E53E3E',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
        <Link
          href="/admin/pieces"
          style={{ fontSize: '13.5px', color: 'var(--text-soft)', textDecoration: 'none' }}
        >
          ← Listeye Dön
        </Link>

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: 'var(--accent-terracotta)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            padding: '13px 32px',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(196, 98, 67, 0.25)',
          }}
        >
          {submitting ? 'Kaydediliyor...' : isEditing ? 'Değişiklikleri Kaydet' : 'Parçayı Yayınla'}
        </button>
      </div>
    </form>
  );
}
