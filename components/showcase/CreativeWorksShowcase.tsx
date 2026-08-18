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
    <section id="serbest" style={{ marginBottom: '110px', scrollMarginTop: '100px' }}>
      {/* Sola Bitişik Başlık ve Parça Sayısı Rozeti */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="font-hand" style={{ fontSize: '22px', color: 'var(--accent-terracotta)', display: 'block' }}>
            serbest çalışmalar & küçük denemeler
          </span>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              background: 'var(--bg-linen-tag)',
              color: 'var(--accent-terracotta)',
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid var(--border-warm)',
            }}
          >
            {creativePieces.length} çalışma
          </span>
        </div>
        <h3 className="font-editorial" style={{ fontSize: '36px', fontWeight: 400, margin: 0 }}>
          Nakış, Kumaş Panoları ve Çizimler
        </h3>
      </div>

      {/* Sanat Galerisi & Paspartu Çerçeve Düzeni */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '36px',
        }}
      >
        {creativePieces.map((piece) => (
          <article
            key={piece.id}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-warm)',
              borderRadius: 'var(--radius-card)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Sanat Eseri Paspartu Çerçevesi */}
            <Link
              href={`/parca/${piece.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                height: '320px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-surface)',
              }}
            >
              <Image
                src={piece.main_image_url}
                alt={piece.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'var(--bg-linen-tag)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: 'var(--accent-terracotta)',
                }}
              >
                Serbest Zanaat
              </span>
            </Link>

            <div style={{ padding: '20px 8px 8px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-sage)', fontWeight: 600, marginBottom: '6px' }}>
                Tekstil & El Emeği
              </span>

              <h4 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, marginBottom: '10px' }}>
                <Link href={`/parca/${piece.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {piece.title}
                </Link>
              </h4>

              <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', lineHeight: 1.65, marginBottom: '20px', flex: 1 }}>
                {piece.story}
              </p>

              <div style={{ paddingTop: '14px', borderTop: '1px dashed var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-hand" style={{ fontSize: '18px', color: 'var(--accent-terracotta)' }}>
                  tek adet • özgün sanat
                </span>

                <Link
                  href={`/parca/${piece.slug}`}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    textDecoration: 'none',
                  }}
                >
                  Eseri İncele &rarr;
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
