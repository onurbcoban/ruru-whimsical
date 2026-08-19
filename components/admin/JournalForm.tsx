'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { saveJournalNoteAction, updateJournalNoteAction } from '@/app/admin/actions';
import { ImageUploader } from '@/components/admin/ImageUploader';
import type { JournalNote } from '@/types/database';

interface JournalFormProps {
  initialData?: JournalNote;
}

export function JournalForm({ initialData }: JournalFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [quote, setQuote] = useState(initialData?.quote || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [photos, setPhotos] = useState<string[]>(initialData?.photo_urls || []);
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
      if (isEditing && initialData) {
        await updateJournalNoteAction(initialData.id, formData);
      } else {
        await saveJournalNoteAction(formData);
      }
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
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <h2 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, margin: 0 }}>
          {isEditing ? 'Günlük Notunu Düzenle' : 'Yeni Not Detayları'}
        </h2>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Not Başlığı *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Keten Kumaşın Hafızası & Dikiş Masası Notları"
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
            Vurgulanan Alıntı Cümlesi (İsteğe Bağlı)
          </label>
          <input
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Örn: Keten kumaş ütü sevmez; kırışıklıkları onun gün boyunca sizinle yaşadığının kanıtıdır."
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
            Yazı İçeriği & Düşünceler (İsteğe Bağlı)
          </label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Kumaşın hikayesi, dikiş makinesi başındaki anlar, hisler..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontFamily: 'inherit',
              lineHeight: 1.6,
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        <ImageUploader
          label="Atölye Kamera Arkası Fotoğrafları (En fazla 3 adet)"
          value={photos}
          multiple
          bucketName="journal"
          onChange={(urls) => setPhotos(urls as string[])}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <Link
          href="/admin/journal"
          style={{
            fontSize: '13.5px',
            color: 'var(--text-soft)',
            textDecoration: 'none',
          }}
        >
          &larr; İptal Et ve Listeye Dön
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
          {submitting ? 'Kaydediliyor...' : isEditing ? 'Değişiklikleri Kaydet' : 'Günlük Notunu Yayınla'}
        </button>
      </div>
    </form>
  );
}
