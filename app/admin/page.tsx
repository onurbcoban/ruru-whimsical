import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPieces, getLatestJournalNote, getSocialEmbeds } from '@/lib/supabase/queries';

export default async function AdminDashboardPage() {
  const [pieces, latestJournal, socialEmbeds] = await Promise.all([
    getPublishedPieces(),
    getLatestJournalNote(),
    getSocialEmbeds(),
  ]);

  const shopierCount = pieces.filter((p) => p.is_shopier_product && !p.is_archived).length;
  const customCount = pieces.filter((p) => !p.is_shopier_product && !p.is_archived && p.category !== 'serbest-calisma').length;
  const freeWorkCount = pieces.filter((p) => p.category === 'serbest-calisma' && !p.is_archived).length;
  const archiveCount = pieces.filter((p) => p.is_archived || p.category === 'arsiv').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '4px' }}>
            hoş geldin rümeysa
          </span>
          <h1 className="font-editorial" style={{ fontSize: '36px', fontWeight: 400, margin: 0 }}>
            Atölye Yönetim Masası
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-soft)', marginTop: '6px' }}>
            Vitrindeki parçaları, stokları, hikayeleri ve günlüğü buradan güncelleyebilirsin.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
              boxShadow: '0 4px 14px rgba(196, 98, 67, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            + Yeni Parça Ekle
          </Link>

          <Link
            href="/admin/journal/new"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-warm)',
              color: 'var(--text-main)',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            + Günlük Notu Yaz
          </Link>

          <Link
            href="/admin/social"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-warm)',
              color: 'var(--text-main)',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            + Sosyal Medya Yönetimi
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-warm)',
            borderRadius: 'var(--radius-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Satışta Hazır (Askı)
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="font-editorial" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
              {shopierCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>elbise</span>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-warm)',
            borderRadius: 'var(--radius-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Atölye Seçkisi (Modeller)
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="font-editorial" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--accent-sage)' }}>
              {customCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>tasarım</span>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-warm)',
            borderRadius: 'var(--radius-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Serbest Sanat & Zanaat
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="font-editorial" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--text-main)' }}>
              {freeWorkCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>çalışma</span>
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-warm)',
            borderRadius: 'var(--radius-card)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Sahiplerine Ulaşan Arşiv
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="font-editorial" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--text-muted)' }}>
              {archiveCount}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>hatıra</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, margin: 0 }}>
              Atölyedeki Son Parçalar
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>
              Toplam {pieces.length} parça kayıtlı
            </span>
          </div>

          <Link
            href="/admin/pieces"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-sage)', textDecoration: 'none' }}
          >
            Tümünü Gör & Yönet &rarr;
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pieces.slice(0, 5).map((piece) => (
            <div
              key={piece.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border-warm)',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <Image src={piece.main_image_url} alt={piece.title} fill style={{ objectFit: 'cover' }} />
                </div>

                <div>
                  <h4 className="font-editorial" style={{ fontSize: '17px', fontWeight: 500, margin: 0 }}>
                    {piece.title}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {piece.category} • {piece.is_shopier_product ? `${piece.price} ₺ (Shopier)` : 'Atölye Seçkisi'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: piece.is_archived ? 'var(--bg-linen-tag)' : 'rgba(122, 138, 116, 0.15)',
                    color: piece.is_archived ? 'var(--text-muted)' : 'var(--accent-sage)',
                  }}
                >
                  {piece.is_archived ? 'Arşivde' : 'Yayında'}
                </span>

                <Link
                  href={`/admin/pieces/${piece.id}`}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--accent-terracotta)',
                    textDecoration: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-warm)',
                    background: 'var(--bg-surface)',
                  }}
                >
                  Düzenle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {latestJournal && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-warm)',
            borderRadius: 'var(--radius-card)',
            padding: '24px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-terracotta)', fontWeight: 600 }}>
              Son Günlük Notu
            </span>
            <h3 className="font-editorial" style={{ fontSize: '20px', fontWeight: 400, marginTop: '4px', marginBottom: '2px' }}>
              &ldquo;{latestJournal.title}&rdquo;
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: 0 }}>
              &ldquo;{latestJournal.quote}&rdquo;
            </p>
          </div>

          <Link
            href="/admin/journal"
            style={{
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--accent-sage)',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border-warm)',
              background: 'var(--bg-main)',
            }}
          >
            Günlüğü Düzenle &rarr;
          </Link>
        </div>
      )}

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, margin: 0 }}>
              Sosyal Medya Vitrini (Instagram & TikTok)
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>
              Ana sayfada sergilenen toplam {socialEmbeds.length} video ve paylaşım
            </span>
          </div>

          <Link
            href="/admin/social"
            style={{
              background: 'var(--accent-terracotta)',
              color: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(196, 98, 67, 0.2)',
            }}
          >
            + Paylaşımları Yönet & Ekle
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {socialEmbeds.map((item) => (
            <div
              key={item.id}
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                overflow: 'hidden',
                background: 'var(--bg-main)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '140px', background: 'var(--bg-card-alt)' }}>
                {item.thumbnail_url && (
                  <Image
                    src={item.thumbnail_url}
                    alt={item.caption || 'Sosyal paylaşım'}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    background: 'rgba(0,0,0,0.65)',
                    color: '#FFF',
                    fontSize: '9.5px',
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.platform}
                </span>
              </div>

              <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '6px' }}>
                <p
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--text-soft)',
                    margin: 0,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.caption}
                </p>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-terracotta)', textDecoration: 'none', alignSelf: 'flex-start' }}
                >
                  Gönderiyi Aç ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
