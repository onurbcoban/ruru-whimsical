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
    <section id="atolye" style={{ marginBottom: '110px', scrollMarginTop: '100px' }}>
      {/* Sola Bitişik Başlık ve Parça Sayısı Rozeti */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="font-hand" style={{ fontSize: '22px', color: 'var(--accent-sage)', display: 'block' }}>
            atölyeden çıkanlar
          </span>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              background: 'var(--bg-linen-tag)',
              color: 'var(--accent-sage)',
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid var(--border-warm)',
            }}
          >
            {customPieces.length} özgün model
          </span>
        </div>
        <h3 className="font-editorial" style={{ fontSize: '36px', fontWeight: 400, margin: 0 }}>
          Atölye Seçkisi & Tasarım Modelleri
        </h3>
      </div>

      {/* Asimetrik Geniş İkili Blok Düzeni (Haute-Craft Alternating Layout) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {customPieces.map((piece, index) => {
          const isImageLeft = index % 2 === 0;

          return (
            <article
              key={piece.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-warm)',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Görsel Alanı */}
              <div
                style={{
                  height: '420px',
                  background: 'var(--bg-card-alt)',
                  position: 'relative',
                  order: isImageLeft ? 1 : 2,
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
                  <span
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '18px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-warm)',
                      borderRadius: '30px',
                      padding: '4px 14px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--accent-sage)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    Atölye Tasarımı
                  </span>
                </Link>
              </div>

              {/* Hikaye & Zanaat Detay Alanı */}
              <div
                style={{
                  padding: '44px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  order: isImageLeft ? 2 : 1,
                  background: 'var(--bg-surface)',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'var(--accent-sage)',
                    fontWeight: 600,
                    marginBottom: '10px',
                  }}
                >
                  {piece.category} • Tek Parça Model
                </span>

                <h4 className="font-editorial" style={{ fontSize: '30px', fontWeight: 400, lineHeight: 1.25, marginBottom: '16px' }}>
                  <Link href={`/parca/${piece.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {piece.title}
                  </Link>
                </h4>

                <p style={{ fontSize: '15px', color: 'var(--text-soft)', lineHeight: 1.8, marginBottom: '28px' }}>
                  {piece.story}
                </p>

                <div style={{ paddingTop: '20px', borderTop: '1px dashed var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <span className="font-hand" style={{ fontSize: '20px', color: 'var(--accent-terracotta)' }}>
                    özgün dikiş • arşivlik parça
                  </span>

                  <Link
                    href={`/parca/${piece.slug}`}
                    style={{
                      background: 'var(--bg-card-alt)',
                      border: '1px solid var(--border-warm)',
                      color: 'var(--text-main)',
                      padding: '9px 20px',
                      borderRadius: '30px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    Dikiş Detaylarını İncele &rarr;
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
