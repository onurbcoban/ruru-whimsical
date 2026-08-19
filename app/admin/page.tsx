import Link from 'next/link';
import Image from 'next/image';
import { getPublishedPieces, getLatestJournalNote, getSocialEmbeds, getHeroSettings } from '@/lib/supabase/queries';
import { HeroSettingsForm } from '@/components/admin/HeroSettingsForm';

export default async function AdminDashboardPage() {
  const [pieces, latestJournal, socialEmbeds, hero] = await Promise.all([
    getPublishedPieces(),
    getLatestJournalNote(),
    getSocialEmbeds(),
    getHeroSettings(),
  ]);

  const shopierPieces = pieces.filter((p) => p.is_shopier_product && !p.is_archived);
  const portfolioPieces = pieces.filter((p) => !p.is_shopier_product && !p.is_archived);
  const freeWorkPieces = pieces.filter((p) => p.category === 'serbest-calisma' && !p.is_archived);
  const archivePieces = pieces.filter((p) => p.is_archived || p.category === 'arsiv');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '4px' }}>
          hoş geldin rümeysa
        </span>
        <h1 className="font-editorial" style={{ fontSize: '36px', fontWeight: 400, margin: 0 }}>
          Atölye Yönetim Masası
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-soft)', marginTop: '6px' }}>
          Satıştaki elbiseleri, atölye portfolyosunu, hikayeleri, günlüğü ve karşılama metnini buradan yönetebilirsiniz.
        </p>
      </div>

      {/* 1. ANA SAYFA KARŞILAMA (HERO) METNİ DÜZENLEME KARTI */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 500, margin: 0 }}>
              Ana Sayfa Karşılama Metni
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: '4px 0 0' }}>
              Ziyaretçilerin siteye girdiğinde ilk gördüğü karşılama başlığını, hikaye paragrafını ve el yazısı notu düzenleyin.
            </p>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--accent-terracotta)', fontWeight: 600 }}>
            • Ana Sayfa Tepesi
          </span>
        </div>

        <HeroSettingsForm initialHero={hero} />
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
              {shopierPieces.length}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>giysi</span>
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
            Atölye Portfolyosu
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="font-editorial" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--accent-sage)' }}>
              {portfolioPieces.length}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>özel parça</span>
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
            Serbest Zanaat & Sanat
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' }}>
            <span className="font-editorial" style={{ fontSize: '36px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
              {freeWorkPieces.length}
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
              {archivePieces.length}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>hatıra</span>
          </div>
        </div>
      </div>

      {/* 1. BÖLÜM: SATIŞTAKİ ELBİSELER (SHOPIER) */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, margin: 0 }}>
              Satıştaki Elbiseler (Shopier Askı)
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>
              Satışta hazır toplam {shopierPieces.length} giysi
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/admin/pieces/new"
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
              + Satış Parçası Ekle
            </Link>
            <Link
              href="/admin/pieces"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-sage)', textDecoration: 'none' }}
            >
              Tümünü Gör &rarr;
            </Link>
          </div>
        </div>

        {shopierPieces.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              border: '1px dashed var(--border-warm)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-main)',
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--text-soft)', margin: '0 0 12px' }}>
              Henüz satışta olan bir elbise bulunmuyor.
            </p>
            <Link
              href="/admin/pieces/new"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent-terracotta)',
                textDecoration: 'none',
              }}
            >
              + İlk Satış Parçanı Ekle &rarr;
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {shopierPieces.slice(0, 4).map((piece) => (
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
                      {piece.category} • {piece.price ? `${piece.price} ₺` : 'Fiyat girilmedi'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        )}
      </div>

      {/* 2. BÖLÜM: ATÖLYE PORTFOLYOSU & SANAT */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, margin: 0 }}>
              Atölye Portfolyosu & Serbest Sanat
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>
              Özel tasarım dikimler ve serbest zanaat işleri ({portfolioPieces.length} eser)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/admin/portfolio/new"
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
              + Portfolyoya Eser Ekle
            </Link>
            <Link
              href="/admin/portfolio"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-sage)', textDecoration: 'none' }}
            >
              Tümünü Gör &rarr;
            </Link>
          </div>
        </div>

        {portfolioPieces.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              border: '1px dashed var(--border-warm)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-main)',
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--text-soft)', margin: '0 0 12px' }}>
              Henüz portfolyoya eklenmiş özel bir tasarım veya serbest sanat eseri bulunmuyor.
            </p>
            <Link
              href="/admin/portfolio/new"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent-terracotta)',
                textDecoration: 'none',
              }}
            >
              + İlk Portfolyo Eserini Ekle &rarr;
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {portfolioPieces.slice(0, 4).map((piece) => (
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
                      {piece.category} • {piece.category === 'serbest-calisma' ? '🎨 Serbest Zanaat' : '🧵 Özel Tasarım'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        )}
      </div>

      {/* 3. BÖLÜM: ATÖLYE GÜNLÜĞÜ */}
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
              Atölye Günlüğü
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-soft)' }}>
              Dikiş masası notları, kumaş felsefesi ve alıntılar
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/admin/journal/new"
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
              + Günlük Yaz
            </Link>
            <Link
              href="/admin/journal"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-sage)', textDecoration: 'none' }}
            >
              Tümünü Gör &rarr;
            </Link>
          </div>
        </div>

        {latestJournal ? (
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card-alt)',
              border: '1px solid var(--border-warm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-terracotta)', fontWeight: 600 }}>
                Son Günlük Yazısı
              </span>
              <h3 className="font-editorial" style={{ fontSize: '20px', fontWeight: 400, marginTop: '4px', marginBottom: '2px' }}>
                &ldquo;{latestJournal.title}&rdquo;
              </h3>
              {latestJournal.quote && (
                <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: 0 }}>
                  &ldquo;{latestJournal.quote}&rdquo;
                </p>
              )}
            </div>

            <Link
              href={`/admin/journal/${latestJournal.id}`}
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--accent-terracotta)',
                textDecoration: 'none',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-surface)',
              }}
            >
              Düzenle ✎
            </Link>
          </div>
        ) : (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              border: '1px dashed var(--border-warm)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-main)',
            }}
          >
            <p style={{ fontSize: '14px', color: 'var(--text-soft)', margin: '0 0 12px' }}>
              Henüz yayınlanmış bir günlük yazısı bulunmuyor.
            </p>
            <Link
              href="/admin/journal/new"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent-terracotta)',
                textDecoration: 'none',
              }}
            >
              + İlk Günlük Yazını Yaz &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* 4. BÖLÜM: SOSYAL MEDYA VİTRİNİ */}
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
