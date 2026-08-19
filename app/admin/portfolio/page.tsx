import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPieces } from '@/lib/supabase/queries';
import { togglePieceArchiveAction, deletePieceAction } from '@/app/admin/actions';

export default async function AdminPortfolioPage() {
  const allPieces = await getPublishedPieces();
  const portfolioPieces = allPieces.filter((p) => !p.is_shopier_product);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <Link
          href="/admin"
          style={{
            fontSize: '13px',
            color: 'var(--text-soft)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
            fontWeight: 500,
          }}
        >
          &larr; Ana Yönetim Masası
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
              Atölye Portfolyosu & Serbest Sanat
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
              Satış dışı özel tasarım dikimler, kumaş denemeleri ve serbest zanaat işlerinizi buradan yönetin.
            </p>
          </div>

          <Link
            href="/admin/portfolio/new"
            style={{
              background: 'var(--accent-terracotta)',
              color: '#FFFFFF',
              padding: '10px 22px',
              borderRadius: '30px',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(196, 98, 67, 0.25)',
            }}
          >
            + Yeni Portfolyo Eseri Ekle
          </Link>
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {portfolioPieces.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: 'var(--text-soft)', margin: '0 0 16px' }}>
              Henüz atölye portfolyosuna eklenmiş bir eser bulunmuyor.
            </p>
            <Link
              href="/admin/portfolio/new"
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: 'var(--accent-terracotta)',
                textDecoration: 'none',
              }}
            >
              + İlk Portfolyo Eserini Ekle &rarr;
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {portfolioPieces.map((piece, index) => (
              <div
                key={piece.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  borderBottom: index < portfolioPieces.length - 1 ? '1px solid var(--border-warm)' : 'none',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--bg-card-alt)',
                    }}
                  >
                    <Image src={piece.main_image_url} alt={piece.title} fill style={{ objectFit: 'cover' }} />
                  </div>

                  <div>
                    <h3 className="font-editorial" style={{ fontSize: '20px', fontWeight: 500, margin: 0 }}>
                      {piece.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          background: 'var(--bg-linen-tag)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          color: 'var(--text-soft)',
                          fontWeight: 500,
                        }}
                      >
                        {piece.category}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--accent-sage)', fontWeight: 500 }}>
                        {piece.category === 'serbest-calisma' ? 'Serbest Zanaat' : ' Özel Atölye Tasarımı'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: piece.is_archived ? 'var(--bg-linen-tag)' : 'rgba(122, 138, 116, 0.15)',
                      color: piece.is_archived ? 'var(--text-muted)' : 'var(--accent-sage)',
                    }}
                  >
                    {piece.is_archived ? 'Arşivde' : 'Yayında'}
                  </span>

                  <Link
                    href={`/admin/pieces/${piece.id}`}
                    style={{
                      fontSize: '13px',
                      color: 'var(--accent-terracotta)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: '1px solid var(--border-warm)',
                      background: 'var(--bg-main)',
                    }}
                  >
                    Düzenle
                  </Link>

                  <form action={togglePieceArchiveAction.bind(null, piece.id, piece.is_archived)}>
                    <button
                      type="submit"
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-warm)',
                        color: 'var(--text-soft)',
                        fontSize: '13px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      {piece.is_archived ? 'Yayına Al' : 'Arşive Kaldır'}
                    </button>
                  </form>

                  <form action={deletePieceAction.bind(null, piece.id)}>
                    <button
                      type="submit"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(229, 62, 62, 0.3)',
                        color: '#E53E3E',
                        fontSize: '13px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      Sil
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
