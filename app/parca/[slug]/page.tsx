import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPieceBySlug } from '@/lib/supabase/queries';
import { getShopierProducts } from '@/lib/shopier';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { PieceGallery } from '@/components/showcase/PieceGallery';
import { JsonLd } from '@/components/seo/JsonLd';

interface PieceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PieceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const piece = await getPieceBySlug(slug);

  if (!piece) {
    return {
      title: 'Parça Bulunamadı',
    };
  }

  const title = `${piece.title} | rürü whimsical`;
  const description = piece.story
    ? piece.story.slice(0, 160)
    : `${piece.title} — Tasarımcı Rümeysa'nın el emeği dikiş atölyesinden.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [
        {
          url: piece.main_image_url,
          width: 1200,
          height: 630,
          alt: piece.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [piece.main_image_url],
    },
  };
}

export default async function PieceDetailPage({ params }: PieceDetailPageProps) {
  const { slug } = await params;
  const piece = await getPieceBySlug(slug);

  if (!piece) {
    notFound();
  }

  // Shopier anlık fiyat/stok eşleştirmesi (Yalnızca satıştaki giysiler için)
  let livePrice = piece.price;
  let liveStock = 1;
  let inStock = true;
  let liveUrl = piece.shopier_url;

  if (piece.is_shopier_product && piece.shopier_sku) {
    const shopierProducts = await getShopierProducts();
    const matched = shopierProducts.find(
      (sp) => sp.sku.toLowerCase() === piece.shopier_sku?.toLowerCase()
    );
    if (matched) {
      livePrice = matched.price || piece.price;
      liveStock = matched.stockQuantity;
      inStock = matched.inStock;
      liveUrl = matched.productUrl || piece.shopier_url;
    }
  }

  const isFreeWork = piece.category === 'serbest-calisma' || piece.category === 'Serbest Çalışma';
  const isArchive = piece.is_archived || piece.category === 'arsiv' || piece.category === 'Arşiv';
  const hasCraftDetails = piece.craft_details && piece.craft_details.length > 0;
  const hasSizeInfo = !!(piece.size_info || piece.measurements);

  const badgeText = isArchive
    ? 'Arşiv / Tükendi'
    : isFreeWork
    ? 'Serbest Çalışma'
    : piece.is_shopier_product
    ? 'Shopier Satışında'
    : 'Atölye Tasarımı';

  const badgeColor = isArchive
    ? 'var(--text-muted)'
    : isFreeWork
    ? 'var(--accent-terracotta)'
    : piece.is_shopier_product
    ? 'var(--accent-terracotta)'
    : 'var(--accent-sage)';

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: piece.title,
    image: piece.gallery_urls && piece.gallery_urls.length > 0 ? [piece.main_image_url, ...piece.gallery_urls] : [piece.main_image_url],
    description: piece.story || piece.title,
    brand: {
      '@type': 'Brand',
      name: 'rürü whimsical',
    },
    offers: {
      '@type': 'Offer',
      url: piece.shopier_url || `https://ruruwhimsical.com/parca/${piece.slug}`,
      priceCurrency: 'TRY',
      price: livePrice,
      availability: inStock && !isArchive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'rürü whimsical',
      },
    },
  };

  return (
    <main className="container-custom" style={{ padding: '24px 24px 100px' }}>
      <JsonLd data={productJsonLd} />
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '1.5px dashed var(--border-stitch)',
          marginBottom: '48px',
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            color: 'var(--text-main)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          &larr; atölyeye dön
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <Link
            href="/"
            className="font-editorial"
            style={{
              fontSize: '20px',
              fontStyle: 'italic',
              fontWeight: 600,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            rürü whimsical
          </Link>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '56px',
          alignItems: 'start',
        }}
      >
        {/* SOL: Büyüteçli Galeri */}
        <div>
          <PieceGallery
            mainImage={piece.main_image_url}
            galleryUrls={piece.gallery_urls}
            title={piece.title}
            badgeText={badgeText}
            badgeColor={badgeColor}
          />
        </div>

        {/* SAĞ: Bilgi ve Detaylar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <span
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--accent-sage)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '8px',
              }}
            >
              {isFreeWork ? 'serbest çalışma • atölye portfolyosu' : `${piece.category} • rümeysa atölye seçkisi`}
            </span>

            <h1
              className="font-editorial"
              style={{
                fontSize: '40px',
                fontWeight: 400,
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              {piece.title}
            </h1>

            {/* Fiyat & Satın Al */}
            {piece.is_shopier_product && !isArchive && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px 0',
                  borderTop: '1px dashed var(--border-warm)',
                  borderBottom: '1px dashed var(--border-warm)',
                }}
              >
                <span className="font-editorial" style={{ fontSize: '32px', fontWeight: 600 }}>
                  {livePrice ? `${livePrice} ₺` : 'Fiyat Belirtilmedi'}
                </span>

                {liveUrl && inStock ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'var(--accent-terracotta)',
                      color: '#FFFFFF',
                      padding: '12px 28px',
                      borderRadius: '30px',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 6px 18px rgba(196, 98, 67, 0.28)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Shopier Üzerinden Al ↗
                  </a>
                ) : (
                  <span
                    style={{
                      background: 'var(--bg-linen-tag)',
                      color: 'var(--text-muted)',
                      padding: '8px 18px',
                      borderRadius: '30px',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    Şu an stokta yok
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Beden & Kalıp Ölçü Rehberi */}
          {hasSizeInfo && (
            <div
              style={{
                background: 'var(--bg-card-alt)',
                border: '1px solid var(--border-warm)',
                borderRadius: 'var(--radius-card)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Beden & Kalıp:
                  </span>
                  {piece.size_info && (
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
                      {piece.size_info}
                    </span>
                  )}
                </div>
              </div>

              {piece.measurements && (
                <div style={{ fontSize: '12.5px', color: 'var(--text-soft)', lineHeight: 1.5, marginTop: '2px' }}>
                  {piece.measurements}
                </div>
              )}
            </div>
          )}

          {/* Hikaye */}
          <div>
            <span className="font-hand" style={{ fontSize: '22px', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '8px' }}>
              {isFreeWork ? 'çalışmanın ardındaki ilham' : 'kumaşın ve dikişin hikayesi'}
            </span>
            <p style={{ fontSize: '16.5px', color: 'var(--text-soft)', lineHeight: 1.85, margin: 0 }}>
              {piece.story}
            </p>
          </div>

          {/* Zanaat Özellikleri */}
          {hasCraftDetails && (
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-warm)',
                borderRadius: 'var(--radius-card)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 className="font-editorial" style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>
                Zanaat & Detay Özellikleri
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {piece.craft_details!.map((detail, idx) => (
                  <div key={idx}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '3px' }}>
                      {detail.label}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* İmza */}
          <div style={{ borderTop: '1.5px dashed var(--border-warm)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-hand" style={{ fontSize: '20px', color: 'var(--accent-terracotta)' }}>
              {isFreeWork ? 'rümeysa • atölye serbest denemesi' : 'rümeysa • atölyede elde dikildi'}
            </span>

            <Link
              href="/"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--accent-sage)',
                textDecoration: 'none',
              }}
            >
              Vitrine Dön &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
