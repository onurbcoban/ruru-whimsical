import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { SignOutButton } from '@/components/admin/SignOutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-warm)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '0 24px',
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/admin"
              className="font-editorial"
              style={{
                fontSize: '22px',
                fontStyle: 'italic',
                fontWeight: 600,
                textDecoration: 'none',
                color: 'var(--text-main)',
              }}
            >
              rürü whimsical
            </Link>
            <span
              style={{
                background: 'var(--bg-linen-tag)',
                color: 'var(--accent-terracotta)',
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '12px',
                border: '1px solid var(--border-warm)',
              }}
            >
              Yönetim
            </span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link
              href="/admin"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: 'var(--text-main)',
                textDecoration: 'none',
              }}
            >
              Genel Bakış
            </Link>
            <Link
              href="/admin/pieces"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: 'var(--text-soft)',
                textDecoration: 'none',
              }}
            >
              Parçalar & Giysiler
            </Link>
            <Link
              href="/admin/journal"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: 'var(--text-soft)',
                textDecoration: 'none',
              }}
            >
              Atölye Günlüğü
            </Link>
            <Link
              href="/admin/social"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: 'var(--text-soft)',
                textDecoration: 'none',
              }}
            >
              Sosyal Medya
            </Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--accent-sage)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-surface)',
              }}
            >
              Siteyi Aç ↗
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container-custom" style={{ flex: 1, padding: '36px 24px 80px' }}>
        {children}
      </main>
    </div>
  );
}
