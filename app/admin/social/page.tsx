import Image from 'next/image';
import { getSocialEmbeds } from '@/lib/supabase/queries';
import { deleteSocialEmbedAction } from '@/app/admin/actions';
import { SocialForm } from '@/components/admin/SocialForm';

export default async function AdminSocialPage() {
  const embeds = await getSocialEmbeds();

  const instagramEmbeds = embeds.filter(
    (e) => e.platform === 'instagram-post' || e.platform === 'instagram-reels'
  );
  const tiktokEmbeds = embeds.filter((e) => e.platform === 'tiktok');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '900px' }}>
      <div>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
          Instagram & TikTok Vitrin Yönetimi
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
          Ana sayfada sergilenecek Instagram gönderilerini ve TikTok videolarını buradan ekleyebilir ve silebilirsiniz.
        </p>
      </div>

      <SocialForm />

      {/* 1. INSTAGRAM PAYLAŞIMLARI */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
            Yayındaki Instagram Paylaşımları ({instagramEmbeds.length})
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@ruru_whimsical</span>
        </div>

        {instagramEmbeds.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: 0 }}>
            Henüz yayında Instagram paylaşımı yok. Yukarıdaki formdan ekleyebilirsiniz.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {instagramEmbeds.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid var(--border-warm)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--bg-main)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '180px', background: 'var(--bg-card-alt)' }}>
                  {item.thumbnail_url && (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.caption || 'Instagram paylaşımı'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#FFF',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.platform === 'instagram-reels' ? 'Reels' : 'Post'}
                  </span>
                </div>

                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                  <p
                    style={{
                      fontSize: '12px',
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed var(--border-warm)' }}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '11.5px', color: 'var(--accent-terracotta)', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Gönderiyi Aç ↗
                    </a>

                    <form action={deleteSocialEmbedAction.bind(null, item.id)}>
                      <button
                        type="submit"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#E53E3E',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          padding: '2px 6px',
                        }}
                      >
                        Sil
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. TIKTOK VİDEOLARI */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, margin: 0 }}>
            Yayındaki TikTok Videoları ({tiktokEmbeds.length})
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>@ruru_whimsical</span>
        </div>

        {tiktokEmbeds.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-soft)', margin: 0 }}>
            Henüz yayında TikTok videosu yok. Yukarıdaki formdan ekleyebilirsiniz.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {tiktokEmbeds.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid var(--border-warm)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--bg-main)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '180px', background: 'var(--bg-card-alt)' }}>
                  {item.thumbnail_url && (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.caption || 'TikTok videosu'}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#FFF',
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    TikTok
                  </span>
                </div>

                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                  <p
                    style={{
                      fontSize: '12px',
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed var(--border-warm)' }}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '11.5px', color: 'var(--accent-terracotta)', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Videoyu Aç ↗
                    </a>

                    <form action={deleteSocialEmbedAction.bind(null, item.id)}>
                      <button
                        type="submit"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#E53E3E',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          padding: '2px 6px',
                        }}
                      >
                        Sil
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
