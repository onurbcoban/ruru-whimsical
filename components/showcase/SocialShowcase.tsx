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
    <div id="sosyal" style={{ scrollMarginTop: '60px', display: 'flex', flexDirection: 'column', gap: '72px', marginBottom: '120px' }}>
      {/* 1. INSTAGRAM BÖLÜMÜ */}
      {instagramEmbeds.length > 0 && (
        <section id="instagram">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)' }}>
                  atölyeden canlı anlar
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  • @ruru_whimsical
                </span>
              </div>
              <h3 className="font-editorial" style={{ fontSize: '36px', fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
                Instagram Paylaşımları
              </h3>
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
                background: 'var(--bg-linen-tag)',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '28px',
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
                  gap: '10px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 5',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(45, 37, 34, 0.08)',
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

                  {item.platform === 'instagram-reels' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  )}
                </div>

                {item.caption && (
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-soft)',
                      lineHeight: 1.5,
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
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 2. TIKTOK BÖLÜMÜ */}
      {tiktokEmbeds.length > 0 && (
        <section id="tiktok">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)' }}>
                  atölye videoları
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  • @ruru_whimsical
                </span>
              </div>
              <h3 className="font-editorial" style={{ fontSize: '36px', fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
                TikTok Videoları
              </h3>
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
                background: 'var(--bg-linen-tag)',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
            >
              TikTok&apos;ta Takip Et ↗
            </a>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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
                  gap: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9 / 16',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(45, 37, 34, 0.08)',
                  }}
                >
                  {item.thumbnail_url && (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.caption || 'TikTok videosu'}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                {item.caption && (
                  <p
                    style={{
                      fontSize: '13px',
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
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
