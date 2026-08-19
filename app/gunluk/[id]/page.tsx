import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getJournalNoteById } from '@/lib/supabase/queries';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';

interface JournalDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: JournalDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getJournalNoteById(id);

  if (!note) {
    return {
      title: 'Yazı Bulunamadı | rürü whimsical',
    };
  }

  const title = `${note.title} • Atölye Günlüğü | rürü whimsical`;
  const description = note.quote || (note.content ? note.content.slice(0, 160) : note.title);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: note.published_at,
      images: note.photo_urls && note.photo_urls[0] ? [note.photo_urls[0]] : undefined,
    },
  };
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
  const { id } = await params;
  const note = await getJournalNoteById(id);

  if (!note) {
    notFound();
  }

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: note.title,
    description: note.quote || note.title,
    articleBody: note.content,
    author: {
      '@type': 'Person',
      name: 'Rümeysa',
    },
    publisher: {
      '@type': 'Organization',
      name: 'rürü whimsical',
    },
    datePublished: note.published_at,
    image: note.photo_urls && note.photo_urls.length > 0 ? note.photo_urls : undefined,
  };

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
      <JsonLd data={blogJsonLd} />
      <Navbar />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          marginBottom: '36px',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
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
        <Link
          href="/gunluk"
          style={{
            color: 'var(--text-soft)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          atölye günlüğü
        </Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>→</span>
        <span style={{ color: 'var(--accent-honey)', fontWeight: 600 }}>
          {note.title}
        </span>
      </nav>

      {/* Makale Gövdesi */}
      <article
        style={{
          maxWidth: '780px',
          margin: '0 auto 80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          flex: 1,
          width: '100%',
        }}
      >
        {/* Tarih & Kategori */}
        <div>
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
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '6px' }}>
            • Atölye Notu
          </span>

          <h1
            className="font-editorial"
            style={{
              fontSize: '44px',
              fontWeight: 400,
              lineHeight: 1.15,
              marginTop: '12px',
              marginBottom: 0,
              letterSpacing: '-0.5px',
            }}
          >
            {note.title}
          </h1>
        </div>

        {/* Vurgulu Alıntı */}
        {note.quote && (
          <blockquote
            className="font-editorial"
            style={{
              fontSize: '26px',
              fontStyle: 'italic',
              lineHeight: 1.4,
              color: 'var(--accent-honey)',
              borderLeft: '3px solid var(--accent-honey)',
              paddingLeft: '24px',
              margin: '8px 0',
            }}
          >
            &ldquo;{note.quote}&rdquo;
          </blockquote>
        )}

        {/* Ana Fotoğraf */}
        {note.photo_urls && note.photo_urls[0] && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '460px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(45, 37, 34, 0.09)',
              margin: '8px 0',
            }}
          >
            <Image
              src={note.photo_urls[0]}
              alt={note.title}
              fill
              sizes="(max-width: 768px) 100vw, 780px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Metin İçeriği */}
        {note.content && (
          <div
            style={{
              fontSize: '17.5px',
              color: 'var(--text-soft)',
              lineHeight: 1.95,
              whiteSpace: 'pre-line',
            }}
          >
            {note.content}
          </div>
        )}

        {/* Ek Fotoğraf Galerisi */}
        {note.photo_urls && note.photo_urls.length > 1 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginTop: '16px',
            }}
          >
            {note.photo_urls.slice(1).map((photoUrl, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  height: '320px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(45, 37, 34, 0.08)',
                }}
              >
                <Image
                  src={photoUrl}
                  alt={`${note.title} fotoğraf ${idx + 2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* İmza & Geri Dönüş */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            marginTop: '20px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-honey)' }}>
            sevgilerle, rümeysa • atölye masası
          </span>

          <Link
            href="/gunluk"
            style={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--text-main)',
              textDecoration: 'none',
            }}
          >
            &larr; Tüm Günlük Yazılarına Dön
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  );
}
