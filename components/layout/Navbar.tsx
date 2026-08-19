'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const getHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: '16px',
        zIndex: 50,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-warm)',
        borderRadius: '40px',
        padding: '12px 24px',
        boxShadow: 'var(--shadow-card)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '48px',
      }}
    >
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span
          className="font-editorial"
          style={{
            fontSize: '24px',
            fontStyle: 'italic',
            fontWeight: 600,
            letterSpacing: '-0.3px',
            lineHeight: 1,
            display: 'block',
          }}
        >
          rürü whimsical
        </span>
        <span
          className="font-hand"
          style={{
            fontSize: '14px',
            color: 'var(--accent-sage)',
            display: 'block',
            marginTop: '2px',
          }}
        >
          dikiş atölyesi
        </span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <a
          href={getHref('#aski')}
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--text-soft)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          askıdakiler
        </a>
        <a
          href={getHref('#arsiv')}
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          arşiv
        </a>
        <a
          href={getHref('#atolye')}
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--text-soft)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          atölye seçkisi
        </a>
        <Link
          href="/gunluk"
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: pathname === '/gunluk' ? 'var(--accent-terracotta)' : 'var(--text-soft)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          günlük
        </Link>
        <a
          href={getHref('#serbest')}
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--text-soft)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          serbest işler
        </a>
        <a
          href={getHref('#sosyal')}
          style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--text-soft)',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
          }}
        >
          canlı anlar
        </a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <ThemeToggle />
        <a
          href="https://shopier.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'var(--accent-terracotta)',
            color: '#FFFFFF',
            padding: '8px 18px',
            borderRadius: '30px',
            fontSize: '12.5px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(196, 98, 67, 0.25)',
          }}
        >
          Shopier Vitrini ↗
        </a>
      </div>
    </header>
  );
}
