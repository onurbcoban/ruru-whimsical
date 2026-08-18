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
    <section id="aski" style={{ marginBottom: '100px', scrollMarginTop: '100px' }}>
      {/* Sola Bitişik Başlık ve Parça Sayısı Rozeti */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span className="font-hand" style={{ fontSize: '22px', color: 'var(--accent-terracotta)' }}>
            dikilip askıya asılanlar
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
            {shopierPieces.length} parça
          </span>
        </div>
        <h3 className="font-editorial" style={{ fontSize: '36px', fontWeight: 400, margin: 0 }}>
          Hemen Alınabilecek Hazır Parçalar
        </h3>
      </div>

      {/* Editorial Lookbook Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '36px' }}>
        {shopierPieces.map((piece) => (
          <article
            key={piece.id}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-warm)',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
          >
            <Link
              href={`/parca/${piece.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '380px', background: 'var(--bg-card-alt)', position: 'relative' }}
            >
              <Image
                src={piece.main_image_url}
                alt={piece.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
                priority={piece.order_index === 1}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: '30px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-terracotta)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                Shopier Satışında
              </span>
            </Link>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-sage)', fontWeight: 600 }}>
                  {piece.category}
                </span>
                <span className="font-editorial" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {piece.price ? `${piece.price} ₺` : ''}
                </span>
              </div>

              <h4 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, marginBottom: '10px' }}>
                <Link href={`/parca/${piece.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {piece.title}
                </Link>
              </h4>

              <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', lineHeight: 1.65, marginBottom: '20px', flex: 1 }}>
                {piece.story}
              </p>

              <div style={{ paddingTop: '16px', borderTop: '1px dashed var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                <Link
                  href={`/parca/${piece.slug}`}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--text-soft)',
                    textDecoration: 'none',
                  }}
                >
                  Hikayesi & Detaylar &rarr;
                </Link>

                {piece.shopier_url && (
                  <a
                    href={piece.shopier_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'var(--accent-terracotta)',
                      color: '#FFFFFF',
                      padding: '8px 18px',
                      borderRadius: '30px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(196, 98, 67, 0.25)',
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
