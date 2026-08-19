'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  if (typeof document === 'undefined') return 'light';
  return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
}

function getServerSnapshot() {
  return 'light';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('ruru_theme', nextTheme);
    window.dispatchEvent(new Event('storage'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Gündüz moduna geç' : 'Gece moduna geç'}
      aria-label={isDark ? 'Gündüz moduna geç' : 'Gece moduna geç'}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-warm)',
        color: 'var(--text-soft)',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 0,
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
        e.currentTarget.style.color = 'var(--accent-terracotta)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-warm)';
        e.currentTarget.style.color = 'var(--text-soft)';
      }}
    >
      {isDark ? (
        // Güneş İkonu (Açık moda geçiş için)
        <svg
          style={{ width: '16px', height: '16px', transition: 'transform 0.3s ease' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        // Zarif Hilal Ay İkonu (Koyu moda geçiş için)
        <svg
          style={{ width: '15px', height: '15px', transition: 'transform 0.3s ease' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
