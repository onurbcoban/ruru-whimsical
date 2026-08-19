'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSocialEmbedAction } from '@/app/admin/actions';

export function SocialForm() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('url', url);
    formData.append('caption', caption);

    try {
      await createSocialEmbedAction(formData);
      setUrl('');
      setCaption('');
      router.refresh();
      setSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Paylaşım kaydedilirken bir hata oluştu.');
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          + Yeni Sosyal Paylaşım Ekle
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
          Sadece Instagram veya TikTok linkini yapıştırın. Paylaşım sitede canlı ve orijinal haliyle sergilenir.
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            background: 'rgba(196, 98, 67, 0.1)',
            border: '1px solid var(--accent-terracotta)',
            color: 'var(--accent-terracotta)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
          }}
        >
          {errorMsg}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
          Instagram veya TikTok Gönderi / Video Linki *
        </label>
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.instagram.com/p/... veya https://www.tiktok.com/@ruru_whimsical/video/..."
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
          Açıklama / Not (Opsiyonel)
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Örn: Keten elbisenin rüzgardaki dökümü ve dikiş masası provası"
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
        <button
          type="submit"
          disabled={submitting}
          style={{
            background: 'var(--accent-terracotta)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            padding: '11px 28px',
            fontSize: '13.5px',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(196, 98, 67, 0.25)',
          }}
        >
          {submitting ? 'Ekleniyor...' : 'Paylaşımı Vitrine Ekle'}
        </button>
      </div>
    </form>
  );
}
