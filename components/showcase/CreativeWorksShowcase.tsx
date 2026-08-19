import Image from 'next/image';
import Link from 'next/link';
import type { UnifiedPiece } from '@/lib/portfolio';

interface CreativeWorksShowcaseProps {
  pieces: UnifiedPiece[];
}

export function CreativeWorksShowcase({ pieces }: CreativeWorksShowcaseProps) {
  const creativePieces = pieces.filter(
    (p) =>
      p.showcase_section === 'creative' ||
      (!p.showcase_section && (p.category === 'serbest-calisma' || p.category === 'Serbest Çalışma'))
  );

  if (creativePieces.length === 0) {
    return null;
  }

  return (
    <section id="serbest" style={{ marginBottom: '120px', scrollMarginTop: '60px' }}>
      {/* Sola Bitişik Başlık (İndigo / Zanaat Mavisi Aksanı) */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-indigo)', display: 'block' }}>
            serbest çalışmalar & küçük denemeler
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-indigo)',
              letterSpacing: '0.5px',
            }}
          >
            • {creativePieces.length} zanaat eseri
          </span>
        </div>
        <h3 className="font-editorial" style={{ fontSize: '38px', fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
          Nakış, Kumaş Panoları ve Zanaat İşleri
        </h3>
      </div>

      {/* Sanat Galerisi Izgarası */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '48px 36px',
        }}
      >
        {creativePieces.map((piece) => (
          <article
            key={piece.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Sanat Eseri Görseli */}
            <Link
              href={`/parca/${piece.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                height: '360px',
                borderRadius: '18px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 8px 24px rgba(45, 37, 34, 0.08)',
              }}
            >
              <Image
                src={piece.main_image_url}
                alt={piece.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </Link>

            {/* Bilgiler & Tipografi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--accent-indigo)',
                  fontWeight: 600,
                }}
              >
                {piece.category === 'serbest-calisma' ? 'Atölye Denemesi' : piece.category}
              </span>

              <h4 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, margin: 0, lineHeight: 1.25 }}>
                <Link href={`/parca/${piece.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {piece.title}
                </Link>
              </h4>

              {piece.story && (
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-soft)',
                    lineHeight: 1.65,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {piece.story}
                </p>
              )}

              <div style={{ marginTop: '6px' }}>
                <Link
                  href={`/parca/${piece.slug}`}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--accent-indigo)',
                    textDecoration: 'none',
                  }}
                >
                  İlhamı & Hikayesi &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
