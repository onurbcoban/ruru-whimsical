import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllJournalNotes } from '@/lib/supabase/queries';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Atölye Günlüğü • Kumaşın Dili | rürü whimsical',
  description: 'Dikiş masası notları, kumaş felsefesi ve atölye kamera arkası. Tasarımcı Rümeysa.',
  alternates: {
    canonical: '/gunluk',
  },
};

export default async function JournalIndexPage() {
  const journals = await getAllJournalNotes();

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
      <Navbar />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          marginBottom: '28px',
          color: 'var(--text-muted)',
        }}
      >
        <Link
          href="/"
          style={{
            color: 'var(--text-soft)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          rürü whimsical
        </Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>→</span>
        <span style={{ color: 'var(--accent-honey)', fontWeight: 600 }}>
          atölye günlüğü
        </span>
      </nav>

      {/* Başlık & Açıklama */}
      <div style={{ maxWidth: '820px', margin: '0 auto 64px', textAlign: 'center' }}>
        <span className="font-hand" style={{ fontSize: '26px', color: 'var(--accent-honey)', display: 'block', marginBottom: '8px' }}>
          dikiş masasından notlar
        </span>
        <h1 className="font-editorial" style={{ fontSize: '48px', fontWeight: 400, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.5px' }}>
          Atölye Günlüğü & Kumaşın Dili
        </h1>
        <p style={{ fontSize: '16.5px', color: 'var(--text-soft)', lineHeight: 1.8, maxWidth: '680px', margin: '0 auto' }}>
          Dikiş makinesinin ritmi, yeni açılan keten rulolarının serinliği, kumaş boyama denemeleri ve atölyedeki küçük neşeler üzerine tutulmuş kayıtlar.
        </p>
      </div>

      {/* Yazılar Akışı (Kutusuz, Çift Sütunlu Editoryal Blog Izgarası) */}
      <div
        style={{
          maxWidth: '1040px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: journals.length > 1 ? 'repeat(auto-fill, minmax(440px, 1fr))' : '1fr',
          gap: '64px 48px',
          flex: 1,
          width: '100%',
        }}
      >
        {journals.map((note) => (
          <article
            key={note.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Fotoğraf */}
            {note.photo_urls && note.photo_urls[0] && (
              <Link
                href={`/gunluk/${note.id}`}
                style={{
                  display: 'block',
                  position: 'relative',
                  width: '100%',
                  height: '320px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(45, 37, 34, 0.08)',
                }}
              >
                <Image
                  src={note.photo_urls[0]}
                  alt={note.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </Link>
            )}

            {/* İçerik */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: 'var(--accent-honey)',
                    fontWeight: 600,
                  }}
                >
                  {new Date(note.published_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>• Atölye Notu</span>
              </div>

              <h2 className="font-editorial" style={{ fontSize: '30px', fontWeight: 400, margin: 0, lineHeight: 1.25 }}>
                <Link href={`/gunluk/${note.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {note.title}
                </Link>
              </h2>

              {note.quote && (
                <blockquote
                  className="font-editorial"
                  style={{
                    fontSize: '19px',
                    fontStyle: 'italic',
                    color: 'var(--accent-honey)',
                    lineHeight: 1.5,
                    margin: '6px 0 0',
                  }}
                >
                  &ldquo;{note.quote}&rdquo;
                </blockquote>
              )}

              {note.content && (
                <p
                  style={{
                    fontSize: '15px',
                    color: 'var(--text-soft)',
                    lineHeight: 1.75,
                    margin: '4px 0 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {note.content}
                </p>
              )}

              <div style={{ marginTop: '10px' }}>
                <Link
                  href={`/gunluk/${note.id}`}
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: 'var(--accent-honey)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Yazının Tamamını Oku &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Footer />
    </main>
  );
}
