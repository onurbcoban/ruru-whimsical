'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Piece } from '@/types/database';
import { createPieceAction, updatePieceAction } from '@/app/admin/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface PortfolioFormProps {
  piece?: Piece;
}

export function PortfolioForm({ piece }: PortfolioFormProps) {
  const router = useRouter();
  const isEditing = !!piece;

  const [portfolioType, setPortfolioType] = useState<'custom' | 'creative'>(
    piece?.category === 'serbest-calisma' || piece?.showcase_section === 'creative' ? 'creative' : 'custom'
  );

  const [title, setTitle] = useState(piece?.title || '');
  const [category, setCategory] = useState(
    piece?.category || (portfolioType === 'creative' ? 'Serbest Çalışma' : 'Özel Dikim')
  );
  const [story, setStory] = useState(piece?.story || '');
  const [imageUrl, setImageUrl] = useState(piece?.main_image_url || '');
  const [galleryUrls, setGalleryUrls] = useState<string[]>(piece?.gallery_urls || []);
  const [sizeInfo, setSizeInfo] = useState(piece?.size_info || '');
  const [measurements, setMeasurements] = useState(piece?.measurements || '');

  const [craftDetails, setCraftDetails] = useState<Array<{ label: string; value: string }>>(
    piece?.craft_details || [
      { label: 'Kumaş / Malzeme', value: '%100 Ham Keten' },
      { label: 'Teknik', value: 'Elde Dikiş & Doğal Kök Boya' },
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

  const handleTypeChange = (type: 'custom' | 'creative') => {
    setPortfolioType(type);
    if (type === 'creative') {
      setCategory('Serbest Çalışma');
    } else if (category === 'Serbest Çalışma') {
      setCategory('Özel Dikim');
    }
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
    formData.append('showcase_section', portfolioType);
    formData.append('is_shopier_product', 'false');
    formData.append('shopier_sku', '');
    formData.append('shopier_url', '');
    if (sizeInfo) formData.append('size_info', sizeInfo);
    if (measurements) formData.append('measurements', measurements);
    formData.append('craft_details', JSON.stringify(craftDetails.filter((d) => d.label.trim() && d.value.trim())));

    try {
      if (isEditing && piece) {
        await updatePieceAction(piece.id, formData);
      } else {
        await createPieceAction(formData);
      }
      router.push('/admin/portfolio');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Portfolyo eseri kaydedilirken bir hata oluştu.');
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

      {/* 1. Portfolyo Türü Seçimi */}
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
        <h2 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
          Eser Türü
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <button
            type="button"
            onClick={() => handleTypeChange('custom')}
            style={{
              background: portfolioType === 'custom' ? 'var(--bg-linen-tag)' : 'var(--bg-main)',
              border: portfolioType === 'custom' ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-warm)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
              Özel Atölye Tasarımı (Giysi)
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-soft)', lineHeight: 1.4 }}>
              Kumaş denemeleri, özel dikim elbiseler, pelerinler veya portfolyo giysileri.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('creative')}
            style={{
              background: portfolioType === 'creative' ? 'var(--bg-linen-tag)' : 'var(--bg-main)',
              border: portfolioType === 'creative' ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-warm)',
              borderRadius: 'var(--radius-sm)',
              padding: '18px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
              Serbest Zanaat & Sanat
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-soft)', lineHeight: 1.4 }}>
              Keten avize, bez çanta, figür, seramik, el nakışı gibi dikiş dışı sanat çalışmaları.
            </span>
          </button>
        </div>
      </div>

      {/* 2. Temel Eser Bilgileri */}
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
          Eser Detayları & Fotoğraflar
        </h3>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Eser Başlığı *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={portfolioType === 'creative' ? 'Örn: Doğal Boyalı Keten Avize' : 'Örn: Miras Keten Pelerin'}
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
            Kategori / Alan *
          </label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Örn: Pelerin, Elbise, Avize, Nakış, Çanta..."
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
            {(portfolioType === 'creative'
              ? ['Serbest Çalışma', 'Avize & Aydınlatma', 'El Nakışı', 'Bez Çanta', 'Figür & Heykel']
              : ['Özel Dikim', 'Pelerin & Dış Giyim', 'Keten Elbise', 'Şortolon', 'Aksesuar']
            ).map((tag) => (
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
          label="Detay & Kamera Arkası Fotoğrafları (Birden Fazla Eklenebilir)"
          value={galleryUrls}
          multiple={true}
          bucketName="portfolio"
          onChange={(urls) => setGalleryUrls(urls as string[])}
        />

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Eserin Hikayesi, İlhamı & Dikiş Süreci
          </label>
          <textarea
            rows={5}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Bu çalışmanın ardındaki duygu, seçilen kumaşın veya malzemenin hissettirdikleri..."
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

      {/* 3. Beden & Kalıp Ölçüleri (Sadece Giysi İçin) */}
      {portfolioType === 'custom' && (
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
              Kalıp / Beden Bilgisi (İsteğe Bağlı)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
              Parçanın kalıp kesimi veya ölçü notları (boş bırakılırsa görünmez).
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Kalıp Uyumu
            </label>
            <input
              type="text"
              value={sizeInfo}
              onChange={(e) => setSizeInfo(e.target.value)}
              placeholder="Örn: 36-40 Rahat Salaş Kalıp, Standart Beden..."
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
              Detaylı Ölçü Notu
            </label>
            <textarea
              rows={2}
              value={measurements}
              onChange={(e) => setMeasurements(e.target.value)}
              placeholder="Örn: Göğüs: 110 cm, Boy: 120 cm, Kol Boyu: 58 cm"
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
      )}

      {/* 4. Malzeme & Zanaat Özellikleri */}
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
              Malzeme & Zanaat Detayları
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '2px' }}>
              Kumaş cinsi, boyama tekniği, el dikişi gibi karakteristik özellikleri ekleyin.
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
                placeholder="Özellik (Örn: Malzeme)"
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
          href="/admin/portfolio"
          style={{
            fontSize: '13.5px',
            color: 'var(--text-soft)',
            textDecoration: 'none',
          }}
        >
          &larr; İptal Et ve Portfolyoya Dön
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
          {submitting ? 'Kaydediliyor...' : isEditing ? 'Değişiklikleri Kaydet' : 'Portfolyoya Yayınla'}
        </button>
      </div>
    </form>
  );
}
