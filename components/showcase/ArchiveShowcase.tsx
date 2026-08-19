'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { UnifiedPiece } from '@/lib/portfolio';

interface ArchiveShowcaseProps {
  pieces: UnifiedPiece[];
}

export function ArchiveShowcase({ pieces }: ArchiveShowcaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const archivePieces = pieces.filter(
    (p) =>
      p.showcase_section === 'archive' ||
      (!p.showcase_section && (p.is_archived || p.category === 'arsiv' || p.category === 'Arşiv'))
  );

  if (archivePieces.length === 0) {
    return null;
  }

  return (
    <div
      id="arsiv"
      style={{
        marginBottom: '100px',
        scrollMarginTop: '60px',
        paddingTop: '16px',
      }}
    >
      {/* Doğal, Sıralı Keten Başlık Satırı */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '8px 0',
          flexWrap: 'wrap',
        }}
      >
        <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)' }}>
          geçmişten dikimler
        </span>

        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          • sahiplerine ulaşan parçalar
        </span>

        {/* Rozet */}
        <div
          style={{
            background: 'var(--bg-linen-tag)',
            color: 'var(--text-main)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          <span>{archivePieces.length} parça</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Tıklanınca Açılan Galeri */}
      {isOpen && (
        <div
          style={{
            marginTop: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '36px',
          }}
        >
          {archivePieces.map((piece) => (
            <article
              key={piece.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Link
                href={`/parca/${piece.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  height: '340px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  filter: 'grayscale(20%) contrast(95%)',
                  boxShadow: '0 6px 20px rgba(45, 37, 34, 0.06)',
                }}
              >
                <Image
                  src={piece.main_image_url}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-warm)',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                  }}
                >
                  Tükendi / Arşiv
                </span>
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                  {piece.category}
                </span>

                <h4 className="font-editorial" style={{ fontSize: '20px', fontWeight: 400, margin: 0 }}>
                  <Link href={`/parca/${piece.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {piece.title}
                  </Link>
                </h4>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
