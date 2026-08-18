import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';

// 1. Google Fontları next/font ile optimize yükleme (Zero Layout Shift)
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'rürü whimsical — rümeysa\'nın atölyesi',
  description: 'Masalsı kesimler, el emeği dikişler ve atölye günlüğü. Tasarımcı Rümeysa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      data-theme="light"
      suppressHydrationWarning
      className={`${newsreader.variable} ${plusJakartaSans.variable} ${caveat.variable}`}
    >
      <head>
        {/* Sayfa ilk yüklenirken flash of unstyled theme olmaması için minik inline script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('ruru_theme');
                if (savedTheme) {
                  document.documentElement.setAttribute('data-theme', savedTheme);
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
