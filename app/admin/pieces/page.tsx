import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPieces } from '@/lib/supabase/queries';
import { togglePieceArchiveAction, deletePieceAction } from '@/app/admin/actions';

export default async function AdminPiecesListPage() {
  const pieces = await getPublishedPieces();

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
              Parçalar & Giysi Koleksiyonu
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
              Atölyede dikilen giysileri, tasarımları ve serbest çalışmaları buradan yönetebilirsiniz.
            </p>
          </div>

          <Link
            href="/admin/pieces/new"
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
            + Yeni Parça Ekle
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {pieces.map((piece, index) => (
            <div
              key={piece.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 24px',
                borderBottom: index < pieces.length - 1 ? '1px solid var(--border-warm)' : 'none',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={piece.main_image_url} alt={piece.title} fill style={{ objectFit: 'cover' }} />
                </div>

                <div>
                  <h3 className="font-editorial" style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>
                    {piece.title}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Kategori: {piece.category} • {piece.is_shopier_product ? `Shopier (${piece.price} ₺)` : 'Atölye Sergisi'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: piece.is_archived ? 'var(--bg-linen-tag)' : 'rgba(122, 138, 116, 0.15)',
                    color: piece.is_archived ? 'var(--text-muted)' : 'var(--accent-sage)',
                  }}
                >
                  {piece.is_archived ? 'Arşivde' : 'Yayında'}
                </span>

                {piece.is_shopier_product && (
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: 'rgba(196, 98, 67, 0.12)',
                      color: 'var(--accent-terracotta)',
                    }}
                  >
                    Shopier Satışı
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  href={`/parca/${piece.slug}`}
                  target="_blank"
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-soft)',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-warm)',
                    background: 'var(--bg-surface)',
                  }}
                >
                  Görüntüle ↗
                </Link>

                <form action={togglePieceArchiveAction.bind(null, piece.id, piece.is_archived)}>
                  <button
                    type="submit"
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-warm)',
                      background: 'var(--bg-card-alt)',
                    }}
                  >
                    {piece.is_archived ? 'Vitrini Aç' : 'Arşive Al'}
                  </button>
                </form>

                <Link
                  href={`/admin/pieces/${piece.id}`}
                  style={{
                    fontSize: '12px',
                    color: 'var(--accent-sage)',
                    textDecoration: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-warm)',
                    background: 'var(--bg-surface)',
                    fontWeight: 600,
                  }}
                >
                  Düzenle
                </Link>

                <form action={deletePieceAction.bind(null, piece.id)}>
                  <button
                    type="submit"
                    style={{
                      fontSize: '12px',
                      color: '#E53E3E',
                      cursor: 'pointer',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(229, 62, 62, 0.3)',
                      background: 'rgba(229, 62, 62, 0.05)',
                    }}
                  >
                    Sil
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
