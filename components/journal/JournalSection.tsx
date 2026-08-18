import Image from 'next/image';
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
        background: 'var(--bg-card-alt)',
        border: '1px solid var(--border-warm)',
        borderRadius: 'var(--radius-card)',
        padding: '48px',
        marginBottom: '90px',
        scrollMarginTop: '100px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '12px' }}>
          atölyeden notlar & kumaşın dili
        </span>

        <blockquote
          className="font-editorial"
          style={{
            fontSize: '28px',
            fontStyle: 'italic',
            lineHeight: 1.4,
            marginBottom: '24px',
            color: 'var(--text-main)',
          }}
        >
          &ldquo;{journal.quote}&rdquo;
        </blockquote>

        <p style={{ fontSize: '15.5px', color: 'var(--text-soft)', lineHeight: 1.85, marginBottom: '32px' }}>
          {journal.content}
        </p>

        {journal.photo_urls && journal.photo_urls.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '32px' }}>
            {journal.photo_urls.map((photoUrl, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-warm)',
                }}
              >
                <Image
                  src={photoUrl}
                  alt={`${journal.title} atölye fotoğrafı ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '28px', textAlign: 'right' }}>
          <span className="font-hand" style={{ fontSize: '22px', color: 'var(--accent-terracotta)' }}>
            rümeysa &bull; atölye günlüğü
          </span>
        </div>
      </div>
    </section>
  );
}
