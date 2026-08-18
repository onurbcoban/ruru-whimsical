'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveJournalNoteAction } from '@/app/admin/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';

export function JournalForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [quote, setQuote] = useState('');
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('quote', quote);
    formData.append('content', content);
    formData.append('photo_urls', JSON.stringify(photos));

    try {
      await saveJournalNoteAction(formData);
      router.push('/admin/journal');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Günlük kaydedilirken bir hata oluştu.');
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
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
          padding: '32px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Günlük Başlığı
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Keten Kumaşın Hafızası"
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
            Öne Çıkan Alıntı (Quote - Opsiyonel)
          </label>
          <input
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Örn: Keten kumaş ütü sevmez; kırışıklıkları günün kanıtıdır."
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
            Günlük Yazısı (Tam Metin - Opsiyonel)
          </label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dikiş masasında bu hafta neler oldu, kumaşlar nasıl dökülüyor..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              lineHeight: 1.65,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <ImageUploader
          label="Atölye Fotoğrafları (Cihazınızdan Birden Fazla Seçebilirsiniz)"
          value={photos}
          multiple={true}
          bucketName="journal"
          onChange={(urls) => setPhotos(urls as string[])}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin/journal" style={{ fontSize: '13.5px', color: 'var(--text-soft)', textDecoration: 'none' }}>
          ← Günlüğe Dön
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
            boxShadow: '0 4px 12px rgba(196, 98, 67, 0.25)',
          }}
        >
          {submitting ? 'Yayınlanıyor...' : 'Günlüğü Yayınla'}
        </button>
      </div>
    </form>
  );
}
