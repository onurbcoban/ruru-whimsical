import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1.5px dashed var(--border-stitch)',
        paddingTop: '40px',
        marginTop: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} rürü whimsical • Tüm hakları saklıdır.
        </span>
        <Link
          href="/admin"
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            opacity: 0.6,
            transition: 'opacity 0.2s ease',
          }}
        >
          Atölye Girişi
        </Link>
      </div>

      <span className="font-hand" style={{ fontSize: '18px', color: 'var(--accent-sage)' }}>
        neşe dokulu üretimler
      </span>
    </footer>
  );
}
