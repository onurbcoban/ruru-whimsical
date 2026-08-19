import Image from 'next/image';
import Link from 'next/link';
import type { JournalNote } from '@/types/database';

interface JournalSectionProps {
  journals?: JournalNote[];
  journal?: JournalNote | null;
}

export function JournalSection({ journals = [], journal }: JournalSectionProps) {
  const activeJournals = journals.length > 0 ? journals.slice(0, 2) : journal ? [journal] : [];

  if (activeJournals.length === 0) {
    return null;
  }

  return (
    <section id="gunluk" style={{ marginBottom: '120px', scrollMarginTop: '60px' }}>
      {/* Sola Hizalı Bölüm Başlığı (Ilık Bal / Amber Aksanı) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-honey)' }}>
              dikiş masasından notlar
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              • kumaşın hafızası & günce
            </span>
          </div>
          <h3 className="font-editorial" style={{ fontSize: '38px', fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
            Atölye Günlüğü
          </h3>
        </div>

        <Link
          href="/gunluk"
          style={{
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--accent-honey)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Tüm Günlük Yazıları ({journals.length || 1}) &rarr;
        </Link>
      </div>

      {/* İki Sütunlu Editoryal Blog Izgarası */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: activeJournals.length > 1 ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr',
          gap: '48px',
        }}
      >
        {activeJournals.map((item) => (
          <article
            key={item.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Fotoğraf (Varsa) */}
            {item.photo_urls && item.photo_urls[0] && (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '280px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(45, 37, 34, 0.08)',
                }}
              >
                <Image
                  src={item.photo_urls[0]}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Tarih & Başlık */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--accent-honey)',
                  fontWeight: 600,
                }}
              >
                {new Date(item.published_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>

              <h4 className="font-editorial" style={{ fontSize: '26px', fontWeight: 400, margin: 0, lineHeight: 1.25 }}>
                <Link href="/gunluk" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {item.title}
                </Link>
              </h4>

              {item.quote && (
                <blockquote
                  className="font-editorial"
                  style={{
                    fontSize: '19px',
                    fontStyle: 'italic',
                    color: 'var(--accent-honey)',
                    lineHeight: 1.5,
                    margin: '4px 0 0',
                  }}
                >
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              )}

              {item.content && (
                <p
                  style={{
                    fontSize: '14.5px',
                    color: 'var(--text-soft)',
                    lineHeight: 1.7,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.content}
                </p>
              )}

              <div style={{ marginTop: '8px' }}>
                <Link
                  href="/gunluk"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--accent-honey)',
                    textDecoration: 'none',
                  }}
                >
                  Okumaya Devam Et &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
