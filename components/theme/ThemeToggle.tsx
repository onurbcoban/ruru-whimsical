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
        border: 'none',
        color: 'var(--text-soft)',
        cursor: 'pointer',
        padding: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition: 'color 0.2s ease, transform 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--accent-terracotta)';
        e.currentTarget.style.transform = 'scale(1.15) rotate(12deg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-soft)';
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
      }}
    >
      {isDark ? (
        // Güneş İkonu (Açık moda geçmek için)
        <svg
          style={{ width: '20px', height: '20px' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
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
        // Hilal Ay İkonu (Koyu moda geçmek için)
        <svg
          style={{ width: '19px', height: '19px' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
