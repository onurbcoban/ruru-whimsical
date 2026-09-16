import type { Metadata, Viewport } from 'next';
import { Newsreader, Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import { JsonLd } from '@/components/seo/JsonLd';
import './globals.css';

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

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#181614' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ruruwhimsical.com'),
  title: {
    default: 'rürü whimsical • rümeysa\'nın dikiş atölyesi',
    template: '%s | rürü whimsical',
  },
  description:
    'Masalsı kalıplar, el emeği keten elbiseler, saf yün pelerinler ve dikiş günlüğü. Tasarımcı Rümeysa.',
  keywords: [
    'rürü whimsical',
    'rümeysa',
    'dikiş atölyesi',
    'keten elbise',
    'pelerin',
    'özel dikim',
    'el emeği giyim',
    'whimsical giyim',
    'tasarım elbise',
    'shopier elbise',
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Rümeysa', url: 'https://instagram.com/ruru_whimsical' }],
  creator: 'rürü whimsical',
  publisher: 'rürü whimsical',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://ruruwhimsical.com',
    siteName: 'rürü whimsical',
    title: 'rürü whimsical • rümeysa\'nın dikiş atölyesi',
    description:
      'Masalsı kalıplar, el emeği keten elbiseler, saf yün pelerinler ve dikiş günlüğü.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&h=630&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'rürü whimsical atölye koleksiyonu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rürü whimsical • rümeysa\'nın dikiş atölyesi',
    description:
      'Masalsı kalıplar, el emeği keten elbiseler ve atölye günlüğü.',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&h=630&auto=format&fit=crop&q=80'],
  },
  manifest: '/manifest.json',
};

const storeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'rürü whimsical',
  description: 'Masalsı kalıplar, el emeği keten elbiseler, saf yün pelerinler ve dikiş günlüğü.',
  url: 'https://ruruwhimsical.com',
  founder: {
    '@type': 'Person',
    name: 'Rümeysa',
  },
  sameAs: [
    'https://instagram.com/ruru_whimsical',
    'https://tiktok.com/@ruru_whimsical',
    'https://shopier.com',
  ],
  priceRange: '₺₺',
  currenciesAccepted: 'TRY',
  paymentAccepted: 'Credit Card, Shopier',
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
        <JsonLd data={storeJsonLd} />
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
