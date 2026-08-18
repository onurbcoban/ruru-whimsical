import Image from 'next/image';
import type { UnifiedPiece } from '@/lib/portfolio';

interface CreativeWorksShowcaseProps {
  pieces: UnifiedPiece[];
}

export function CreativeWorksShowcase({ pieces }: CreativeWorksShowcaseProps) {
  const creativePieces = pieces.filter((p) => p.category === 'serbest-calisma' && !p.is_archived);

  if (creativePieces.length === 0) {
    return null;
  }

  return (
    <section id="serbest" style={{ marginBottom: '90px', scrollMarginTop: '100px' }}>
      {/* Sola Bitişik Başlık ve Parça Sayısı Rozeti */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
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
          Nakış, Kumaş Panoları ve Sanat
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
        {creativePieces.map((piece) => (
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
            }}
          >
            <div style={{ height: '360px', background: 'var(--bg-card-alt)', position: 'relative' }}>
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
                  top: '14px',
                  left: '14px',
                  background: 'var(--bg-linen-tag)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: '30px',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--accent-terracotta)',
                }}
              >
                Serbest Zanaat
              </span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-sage)', fontWeight: 600, marginBottom: '6px' }}>
                Tekstil & El Emeği
              </span>
              <h4 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, marginBottom: '10px' }}>
                {piece.title}
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', lineHeight: 1.65, marginBottom: '20px', flex: 1 }}>
                {piece.story}
              </p>

              <div style={{ paddingTop: '16px', borderTop: '1px dashed var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-editorial" style={{ fontSize: '16px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  Özgün Tasarım
                </span>
                <span className="font-hand" style={{ fontSize: '18px', color: 'var(--accent-terracotta)' }}>
                  tek adet
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
