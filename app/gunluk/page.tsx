import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestJournalNote } from '@/lib/supabase/queries';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Atölye Günlüğü • Kumaşın Dili',
  description: 'Dikiş masası notları, kumaş felsefesi ve atölye kamera arkası. Tasarımcı Rümeysa.',
  alternates: {
    canonical: '/gunluk',
  },
  openGraph: {
    title: 'Atölye Günlüğü • Kumaşın Dili | rürü whimsical',
    description: 'Dikiş masası notları, kumaş felsefesi ve atölye kamera arkası.',
  },
};

export default async function JournalPage() {
  const latestJournal = await getLatestJournalNote();

  const blogJsonLd = latestJournal
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: latestJournal.title,
        description: latestJournal.quote || latestJournal.title,
        articleBody: latestJournal.content,
        author: {
          '@type': 'Person',
          name: 'Rümeysa',
        },
        publisher: {
          '@type': 'Organization',
          name: 'rürü whimsical',
        },
        datePublished: latestJournal.published_at,
        image: latestJournal.photo_urls && latestJournal.photo_urls.length > 0 ? latestJournal.photo_urls : undefined,
      }
    : null;

  return (
    <main
      className="container-custom"
      style={{
        padding: '12px 24px 0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {blogJsonLd && <JsonLd data={blogJsonLd} />}
      <Navbar />

      <div style={{ maxWidth: '820px', margin: '0 auto 64px', textAlign: 'center' }}>
        <span className="font-hand" style={{ fontSize: '26px', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '8px' }}>
          rümeysa&apos;nın dikiş notları
        </span>
        <h1 className="font-editorial" style={{ fontSize: '48px', fontWeight: 400, lineHeight: 1.15, marginBottom: '16px' }}>
          Atölye Günlüğü & Kumaşın Dili
        </h1>
        <p style={{ fontSize: '16.5px', color: 'var(--text-soft)', lineHeight: 1.8 }}>
          Dikiş makinesinin ritmi, yeni açılan keten rulolarının serinliği, kumaş boyama denemeleri ve atölyedeki küçük neşeler üzerine tutulmuş serbest kayıtlar.
        </p>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        {latestJournal && (
          <article
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-warm)',
              borderRadius: 'var(--radius-card)',
              padding: '48px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <span
                style={{
                  background: 'var(--bg-linen-tag)',
                  color: 'var(--accent-sage)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '4px 14px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Atölye Kaydı
              </span>

              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {new Date(latestJournal.published_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <h2 className="font-editorial" style={{ fontSize: '34px', fontWeight: 400, marginBottom: '20px' }}>
              {latestJournal.title}
            </h2>

            {latestJournal.quote && (
              <blockquote
                className="font-editorial"
                style={{
                  fontSize: '24px',
                  fontStyle: 'italic',
                  lineHeight: 1.45,
                  color: 'var(--accent-terracotta)',
                  borderLeft: '3px solid var(--accent-terracotta)',
                  paddingLeft: '20px',
                  margin: '28px 0',
                }}
              >
                &ldquo;{latestJournal.quote}&rdquo;
              </blockquote>
            )}

            {latestJournal.content && (
              <p style={{ fontSize: '16.5px', color: 'var(--text-soft)', lineHeight: 1.9, marginBottom: '32px' }}>
                {latestJournal.content}
              </p>
            )}

            {latestJournal.photo_urls && latestJournal.photo_urls.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
                {latestJournal.photo_urls.map((photoUrl, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      height: '380px',
                      borderRadius: 'var(--radius-card)',
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={photoUrl}
                      alt={`${latestJournal.title} atölye görseli ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px dashed var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="font-hand" style={{ fontSize: '22px', color: 'var(--accent-terracotta)' }}>
                sevgilerle, rümeysa
              </span>

              <Link
                href="/#aski"
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--accent-sage)',
                  textDecoration: 'none',
                }}
              >
                Vitrine Dön &rarr;
              </Link>
            </div>
          </article>
        )}
      </div>

      <Footer />
    </main>
  );
}
