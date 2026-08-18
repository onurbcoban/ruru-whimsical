'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface PieceGalleryProps {
  mainImage: string;
  galleryUrls?: string[];
  title: string;
  badgeText?: string;
  badgeColor?: string;
}

export function PieceGallery({
  mainImage,
  galleryUrls = [],
  title,
  badgeText,
  badgeColor = 'var(--accent-sage)',
}: PieceGalleryProps) {
  const allImages = [mainImage, ...galleryUrls.filter((url) => url && url !== mainImage)];
  const [activeImage, setActiveImage] = useState(mainImage);
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [lensPercent, setLensPercent] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const LENS_WIDTH = 150;
  const LENS_HEIGHT = 150;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let x = mouseX - LENS_WIDTH / 2;
    let y = mouseY - LENS_HEIGHT / 2;

    x = Math.max(0, Math.min(x, rect.width - LENS_WIDTH));
    y = Math.max(0, Math.min(y, rect.height - LENS_HEIGHT));

    setLensPos({ x, y });

    const px = (x / (rect.width - LENS_WIDTH)) * 100;
    const py = (y / (rect.height - LENS_HEIGHT)) * 100;
    setLensPercent({ x: px, y: py });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          height: '560px',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          background: 'var(--bg-card-alt)',
          border: '1px solid var(--border-warm)',
          boxShadow: 'var(--shadow-card)',
          cursor: 'crosshair',
          userSelect: 'none',
        }}
      >
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
          priority
        />

        {isHovered && (
          <div
            style={{
              position: 'absolute',
              top: `${lensPos.y}px`,
              left: `${lensPos.x}px`,
              width: `${LENS_WIDTH}px`,
              height: `${LENS_HEIGHT}px`,
              border: '2px solid var(--accent-terracotta)',
              background: 'rgba(196, 98, 67, 0.22)',
              borderRadius: '6px',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}

        {badgeText && !isHovered && (
          <span
            style={{
              position: 'absolute',
              top: '18px',
              left: '18px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-warm)',
              borderRadius: '30px',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: badgeColor,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              pointerEvents: 'none',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 'calc(100% + 28px)',
            width: '520px',
            height: '560px',
            borderRadius: 'var(--radius-card)',
            border: '2px solid var(--accent-terracotta)',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.28)',
            backgroundImage: `url(${activeImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '300%',
            backgroundPosition: `${lensPercent.x}% ${lensPercent.y}%`,
            zIndex: 9999,
            backgroundColor: 'var(--bg-surface)',
            pointerEvents: 'none',
          }}
        />
      )}

      {allImages.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' }}>
          {allImages.map((url, idx) => {
            const isActive = activeImage === url;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(url)}
                onMouseEnter={() => setActiveImage(url)}
                style={{
                  position: 'relative',
                  height: '90px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: isActive ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-warm)',
                  background: 'var(--bg-card-alt)',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: isActive ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(196, 98, 67, 0.2)' : 'none',
                }}
              >
                <Image
                  src={url}
                  alt={`${title} küçük görsel ${idx + 1}`}
                  fill
                  sizes="100px"
                  style={{ objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
