'use client';

import { useState, useTransition } from 'react';
import type { HeroSettings } from '@/types/database';
import { updateHeroSettingsAction } from '@/app/admin/actions';

interface HeroSettingsFormProps {
  initialHero: HeroSettings;
}

export function HeroSettingsForm({ initialHero }: HeroSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateHeroSettingsAction(formData);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3500);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>
            Giriş Cümlesi (1. Satır)
          </label>
          <input
            type="text"
            name="title"
            defaultValue={initialHero.title}
            placeholder="merhaba, ben rümeysa."
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              fontSize: '13.5px',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
            Vurgulu / İtalik Kısım
          </label>
          <input
            type="text"
            name="highlight"
            defaultValue={initialHero.highlight}
            placeholder="neşenizi ön plana çıkaran"
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              fontSize: '13.5px',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>
            Cümlenin Devamı
          </label>
          <input
            type="text"
            name="title_suffix"
            defaultValue={initialHero.title_suffix}
            placeholder="giysiler dikiyorum."
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              fontSize: '13.5px',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>
            Hikaye & Açıklama Paragrafı
          </label>
          <textarea
            name="description"
            rows={2}
            defaultValue={initialHero.description}
            placeholder="rürü whimsical; çocukluk düşlerinin, dokunmaya kıyılamayan ketenlerin ve atölyemdeki küçük neşelerin bir toplamı."
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              fontSize: '13.5px',
              color: 'var(--text-main)',
              outline: 'none',
              lineHeight: 1.5,
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
            El Yazısı İmza / Not
          </label>
          <input
            type="text"
            name="handwritten_note"
            defaultValue={initialHero.handwritten_note}
            placeholder="sevgilerle, rümeysa"
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
              fontSize: '13.5px',
              color: 'var(--text-main)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px dashed var(--border-warm)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          {savedSuccess && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#2E7D32',
                background: 'rgba(46, 125, 50, 0.1)',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12.5px',
                fontWeight: 600,
              }}
            >
              ✓ Karşılama metni başarıyla güncellendi!
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            background: isPending ? 'var(--text-muted)' : 'var(--accent-terracotta)',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '24px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(196, 98, 67, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          {isPending ? 'Kaydediliyor...' : 'Karşılama Metnini Kaydet'}
        </button>
      </div>
    </form>
  );
}
