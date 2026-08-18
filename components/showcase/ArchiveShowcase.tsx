'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { UnifiedPiece } from '@/lib/portfolio';

interface ArchiveShowcaseProps {
  pieces: UnifiedPiece[];
}

export function ArchiveShowcase({ pieces }: ArchiveShowcaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const archivePieces = pieces.filter((p) => p.is_archived || p.category === 'arsiv');

  if (archivePieces.length === 0) {
    return null;
  }

  return (
    <div
      id="arsiv"
      style={{
        marginBottom: '80px',
        scrollMarginTop: '100px',
        borderTop: '1.5px dashed var(--border-stitch)',
        borderBottom: isOpen ? '1.5px dashed var(--border-stitch)' : 'none',
        paddingTop: '20px',
        paddingBottom: isOpen ? '40px' : '0',
      }}
    >
      {/* Doğal, Sıralı Keten Satırı */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '6px 0',
          flexWrap: 'wrap',
        }}
      >
        <span className="font-hand" style={{ fontSize: '22px', color: 'var(--accent-terracotta)' }}>
          geçmişten dikimler
        </span>

        <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
          &bull; sahiplerine ulaşan parçalar
        </span>

        {/* Cümlenin En Sağında Duran Keten Etiket Rozeti */}
        <div
          style={{
            background: isOpen ? 'var(--bg-card-alt)' : 'var(--bg-linen-tag)',
            border: '1px solid var(--border-warm)',
            color: 'var(--text-main)',
            padding: '4px 12px',
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
            marginTop: '28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '28px',
          }}
        >
          {archivePieces.map((piece) => (
            <article
              key={piece.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-warm)',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                opacity: 0.92,
              }}
            >
              <div style={{ height: '300px', background: 'var(--bg-card-alt)', position: 'relative' }}>
                <Image
                  src={piece.main_image_url}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', filter: 'grayscale(15%)' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-warm)',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                  }}
                >
                  Arşiv / Tükendi
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                  {piece.category}
                </span>
                <h4 className="font-editorial" style={{ fontSize: '22px', fontWeight: 400, marginBottom: '8px' }}>
                  {piece.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-soft)', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                  {piece.story}
                </p>

                <div style={{ paddingTop: '12px', borderTop: '1px dashed var(--border-warm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-editorial" style={{ fontSize: '14.5px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    Sahibine Ulaştı
                  </span>
                  <span className="font-hand" style={{ fontSize: '16px', color: 'var(--accent-sage)' }}>
                    hatıra arşivi
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
