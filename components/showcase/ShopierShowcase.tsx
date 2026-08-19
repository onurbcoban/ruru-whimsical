import Image from 'next/image';
import Link from 'next/link';
import type { UnifiedPiece } from '@/lib/portfolio';

interface ShopierShowcaseProps {
  pieces: UnifiedPiece[];
}

export function ShopierShowcase({ pieces }: ShopierShowcaseProps) {
  const shopierPieces = pieces.filter(
    (p) =>
      p.showcase_section === 'shopier' ||
      (!p.showcase_section && p.is_shopier_product && !p.is_archived && p.category !== 'serbest-calisma' && p.category !== 'arsiv')
  );

  if (shopierPieces.length === 0) {
    return null;
  }

  return (
    <section id="aski" style={{ marginBottom: '110px', scrollMarginTop: '60px' }}>
      {/* Sola Bitişik Başlık ve Parça Sayısı Rozeti */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)' }}>
            dikilip askıya asılanlar
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-sage)',
              letterSpacing: '0.5px',
            }}
          >
            • {shopierPieces.length} hazır parça
          </span>
        </div>
        <h3 className="font-editorial" style={{ fontSize: '38px', fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
          Hemen Ulaşılabilecek Parçalar
        </h3>
      </div>

      {/* Editorial Lookbook Grid (Kutusuz, Saf Tuval Akışı) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '48px 36px' }}>
        {shopierPieces.map((piece) => (
          <article
            key={piece.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Fotoğraf Çerçevesi */}
            <Link
              href={`/parca/${piece.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                height: '420px',
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
                priority={piece.order_index === 1}
              />
            </Link>

            {/* Bilgiler & Tipografi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-sage)', fontWeight: 600 }}>
                  {piece.category}
                </span>
                {piece.price && (
                  <span className="font-editorial" style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {piece.price} ₺
                  </span>
                )}
              </div>

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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <Link
                  href={`/parca/${piece.slug}`}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-soft)',
                    textDecoration: 'none',
                  }}
                >
                  İncele & Ölçüler &rarr;
                </Link>

                {piece.shopier_url && (
                  <a
                    href={piece.shopier_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'var(--accent-terracotta)',
                      color: '#FFFFFF',
                      padding: '7px 16px',
                      borderRadius: '30px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(196, 98, 67, 0.2)',
                    }}
                  >
                    Satın Al ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
