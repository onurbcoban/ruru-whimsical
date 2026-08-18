import Image from 'next/image';
import Link from 'next/link';
import type { JournalNote } from '@/types/database';

interface JournalSectionProps {
  journal: JournalNote | null;
}

export function JournalSection({ journal }: JournalSectionProps) {
  if (!journal) {
    return null;
  }

  return (
    <section
      id="gunluk"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-warm)',
        borderRadius: 'var(--radius-card)',
        padding: '52px 48px',
        marginBottom: '110px',
        scrollMarginTop: '100px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)' }}>
            atölyeden notlar & kumaşın dili
          </span>
          <Link
            href="/gunluk"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent-sage)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Tüm Günlüğü Oku &rarr;
          </Link>
        </div>

        {journal.quote && (
          <blockquote
            className="font-editorial"
            style={{
              fontSize: '30px',
              fontStyle: 'italic',
              lineHeight: 1.38,
              marginBottom: '24px',
              color: 'var(--text-main)',
            }}
          >
            &ldquo;{journal.quote}&rdquo;
          </blockquote>
        )}

        {journal.content && (
          <p style={{ fontSize: '16px', color: 'var(--text-soft)', lineHeight: 1.85, marginBottom: '32px' }}>
            {journal.content}
          </p>
        )}

        {journal.photo_urls && journal.photo_urls.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '32px' }}>
            {journal.photo_urls.map((photoUrl, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  height: '320px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={photoUrl}
                  alt={`${journal.title} atölye fotoğrafı ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px dashed var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span className="font-hand" style={{ fontSize: '20px', color: 'var(--accent-terracotta)' }}>
            rümeysa • dikiş günlüğü
          </span>

          <Link
            href="/gunluk"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-warm)',
              color: 'var(--text-main)',
              padding: '8px 20px',
              borderRadius: '30px',
              fontSize: '12.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Günlük Yazılarını Keşfet &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
