import Image from 'next/image';
import Link from 'next/link';
import type { UnifiedPiece } from '@/lib/portfolio';

interface CustomShowcaseProps {
  pieces: UnifiedPiece[];
}

export function CustomShowcase({ pieces }: CustomShowcaseProps) {
  const customPieces = pieces.filter(
    (p) =>
      p.showcase_section === 'custom' ||
      (!p.showcase_section && !p.is_shopier_product && !p.is_archived && p.category !== 'serbest-calisma' && p.category !== 'arsiv')
  );

  if (customPieces.length === 0) {
    return null;
  }

  return (
    <section id="atolye" style={{ marginBottom: '120px', scrollMarginTop: '60px' }}>
      {/* Sola Bitişik Başlık */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-sage)', display: 'block' }}>
            atölyeden çıkanlar
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-sage)',
              letterSpacing: '0.5px',
            }}
          >
            • {customPieces.length} özel tasarım
          </span>
        </div>
        <h3 className="font-editorial" style={{ fontSize: '38px', fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
          Atölye Seçkisi & Tasarım Modelleri
        </h3>
      </div>

      {/* Asimetrik Editoryal Alternatif Düzen (Kutusuz, Akıcı) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
        {customPieces.map((piece, index) => {
          const isImageLeft = index % 2 === 0;

          return (
            <article
              key={piece.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '48px',
                alignItems: 'center',
              }}
            >
              {/* Görsel Alanı */}
              <div
                style={{
                  height: '460px',
                  position: 'relative',
                  order: isImageLeft ? 1 : 2,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 32px rgba(45, 37, 34, 0.09)',
                }}
              >
                <Link href={`/parca/${piece.slug}`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
                  <Image
                    src={piece.main_image_url}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
              </div>

              {/* Hikaye & Zanaat Detay Alanı */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  order: isImageLeft ? 2 : 1,
                  padding: '12px 0',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'var(--accent-sage)',
                    fontWeight: 600,
                  }}
                >
                  {piece.category}
                </span>

                <h4 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0, lineHeight: 1.2 }}>
                  <Link href={`/parca/${piece.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {piece.title}
                  </Link>
                </h4>

                <p style={{ fontSize: '15.5px', color: 'var(--text-soft)', lineHeight: 1.8, margin: 0 }}>
                  {piece.story}
                </p>

                {piece.craft_details && piece.craft_details.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px' }}>
                    {piece.craft_details.slice(0, 3).map((detail, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '6px', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{detail.label}:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '8px' }}>
                  <Link
                    href={`/parca/${piece.slug}`}
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: 'var(--accent-sage)',
                      textDecoration: 'none',
                    }}
                  >
                    Tasarım Hikayesi & Detaylar &rarr;
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
