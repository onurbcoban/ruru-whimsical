import Image from 'next/image';
import type { SocialEmbed } from '@/types/database';

interface SocialShowcaseProps {
  embeds: SocialEmbed[];
}

export function SocialShowcase({ embeds }: SocialShowcaseProps) {
  if (!embeds || embeds.length === 0) {
    return null;
  }

  const instagramEmbeds = embeds.filter(
    (e) => e.platform === 'instagram-post' || e.platform === 'instagram-reels'
  );
  const tiktokEmbeds = embeds.filter((e) => e.platform === 'tiktok');

  return (
    <div id="sosyal" style={{ scrollMarginTop: '100px', display: 'flex', flexDirection: 'column', gap: '80px', marginBottom: '110px' }}>
      {/* 1. INSTAGRAM BÖLÜMÜ */}
      {instagramEmbeds.length > 0 && (
        <section id="instagram">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h3 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
                Instagram Paylaşımları
              </h3>
              <span style={{ fontSize: '13px', color: 'var(--text-soft)', marginTop: '2px', display: 'block' }}>
                @ruru_whimsical
              </span>
            </div>

            <a
              href="https://instagram.com/ruru_whimsical"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--text-main)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-warm)',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              Instagram&apos;da Takip Et ↗
            </a>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {instagramEmbeds.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 5',
                    background: 'var(--bg-card-alt)',
                    overflow: 'hidden',
                  }}
                >
                  {item.thumbnail_url && (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.caption || 'Instagram paylaşımı'}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  )}

                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      padding: '3px 9px',
                      borderRadius: '14px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                    }}
                  >
                    {item.platform === 'instagram-reels' ? 'Reels' : 'Post'}
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                  {item.caption && (
                    <p
                      style={{
                        fontSize: '12.5px',
                        color: 'var(--text-soft)',
                        lineHeight: 1.45,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.caption}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed var(--border-warm)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@ruru_whimsical</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
                      Gönderiyi Aç ↗
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 2. TIKTOK BÖLÜMÜ */}
      {tiktokEmbeds.length > 0 && (
        <section id="tiktok">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h3 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
                TikTok Videoları
              </h3>
              <span style={{ fontSize: '13px', color: 'var(--text-soft)', marginTop: '2px', display: 'block' }}>
                @ruru_whimsical
              </span>
            </div>

            <a
              href="https://tiktok.com/@ruru_whimsical"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '24px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--text-main)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-warm)',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
              TikTok&apos;ta Keşfet ↗
            </a>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {tiktokEmbeds.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 5',
                    background: 'var(--bg-card-alt)',
                    overflow: 'hidden',
                  }}
                >
                  {item.thumbnail_url && (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.caption || 'TikTok videosu'}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  )}

                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      padding: '3px 9px',
                      borderRadius: '14px',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                    TikTok
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--accent-terracotta)', marginLeft: '1px' }}>▶</span>
                  </div>
                </div>

                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                  {item.caption && (
                    <p
                      style={{
                        fontSize: '12.5px',
                        color: 'var(--text-soft)',
                        lineHeight: 1.45,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.caption}
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px dashed var(--border-warm)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>@ruru_whimsical</span>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
                      Videoyu İzle ↗
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
