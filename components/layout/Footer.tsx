export function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        paddingTop: '40px',
        paddingBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} rürü whimsical • Tüm hakları saklıdır.
      </span>

      <span className="font-hand" style={{ fontSize: '18px', color: 'var(--accent-sage)' }}>
        neşe dokulu üretimler
      </span>
    </footer>
  );
}
