'use client';

import { useEffect } from 'react';

interface InstagramEmbedProps {
  url: string;
  caption?: string;
}

export function InstagramEmbed({ url, caption }: InstagramEmbedProps) {
  const match = url.match(/\/(?:p|reel|reels)\/([A-Za-z0-9_-]+)/);
  const shortcode = match ? match[1] : null;
  const permalink = shortcode ? `https://www.instagram.com/p/${shortcode}/` : url;

  useEffect(() => {
    // 1. Instagram script'i yüklü mü kontrol et, değilse ekle
    if (!document.getElementById('instagram-embed-script')) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };
    } else if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
  }, [permalink]);

  if (!shortcode) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: '16px',
          textDecoration: 'none',
          color: 'inherit',
          gap: '12px',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rose)" strokeWidth="2">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
          {caption || 'Instagram Gönderisini Görüntüle ↗'}
        </span>
      </a>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: '400px', display: 'flex', justifyContent: 'center' }}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{
          background: '#FFFFFF',
          border: '0',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(45, 37, 34, 0.08)',
          margin: '0 auto',
          maxWidth: '540px',
          minWidth: '280px',
          padding: '0',
          width: '100%',
        }}
      >
        <div style={{ padding: '16px' }}>
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#FFFFFF',
              lineHeight: '0',
              padding: '0 0',
              textAlign: 'center',
              textDecoration: 'none',
              width: '100%',
              fontSize: '12px',
              color: 'var(--text-soft)',
            }}
          >
            Instagram Gönderisi Yükleniyor...
          </a>
        </div>
      </blockquote>
    </div>
  );
}
