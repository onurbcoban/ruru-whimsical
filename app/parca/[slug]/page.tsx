import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPieceBySlug } from '@/lib/supabase/queries';
import { getShopierProducts } from '@/lib/shopier';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
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

  const isFreeWork =
    piece.category === 'serbest-calisma' ||
    piece.category === 'Serbest Çalışma' ||
    piece.showcase_section === 'creative';
  const isPortfolio = !piece.is_shopier_product;
  const isArchive = piece.is_archived || piece.category === 'arsiv' || piece.category === 'Arşiv';
  const hasCraftDetails = piece.craft_details && piece.craft_details.length > 0;
  const hasSizeInfo = !!(piece.size_info?.trim() || piece.measurements?.trim());

  const badgeText = isArchive
    ? 'Arşiv / Tükendi'
    : isFreeWork
      ? 'Serbest Zanaat'
      : isPortfolio
        ? 'Atölye Portfolyosu'
        : 'Shopier Satışında';

  const badgeColor = isArchive
    ? 'var(--text-muted)'
    : isFreeWork
      ? 'var(--accent-terracotta)'
      : piece.is_shopier_product
        ? 'var(--accent-terracotta)'
        : 'var(--accent-sage)';

  const storyHeading = isFreeWork
    ? 'çalışmanın hikayesi & ilhamı'
    : isPortfolio
      ? 'tasarımın ve eserin hikayesi'
      : 'kumaşın ve giysinin hikayesi';

  const signatureText = isFreeWork
    ? 'rümeysa • atölye serbest denemesi'
    : isPortfolio
      ? 'rümeysa • atölyede elde üretildi'
      : 'rümeysa • atölyede elde dikildi';

  const categorySubhead = isFreeWork
    ? 'serbest zanaat • atölye portfolyosu'
    : isPortfolio
      ? `${piece.category} • atölye portfolyosu`
      : `${piece.category} • rümeysa atölye seçkisi`;

  const sectionHref = isArchive
    ? '/#arsiv'
    : isFreeWork
      ? '/#serbest'
      : piece.is_shopier_product
        ? '/#aski'
        : '/#atolye';

  const sectionLabel = isArchive
    ? 'arşiv'
    : isFreeWork
      ? 'craftlarım'
      : piece.is_shopier_product
        ? 'askıdakiler'
        : 'özel atölye';

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
    <main
      className="container-custom"
      style={{
        padding: '12px 24px 0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <JsonLd data={productJsonLd} />
      <Navbar />

      {/* Breadcrumb Yol Navigasyonu */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          marginBottom: '28px',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
        }}
      >
        <Link
          href="/"
          style={{
            color: 'var(--text-soft)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
        >
          rürü whimsical
        </Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>→</span>
        <Link
          href={sectionHref}
          style={{
            color: 'var(--text-soft)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s ease',
          }}
        >
          {sectionLabel}
        </Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>→</span>
        <span style={{ color: 'var(--accent-terracotta)', fontWeight: 600 }}>
          {piece.title}
        </span>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '56px',
          alignItems: 'start',
          flex: 1,
        }}
      >
        <div>
          <PieceGallery
            mainImage={piece.main_image_url}
            galleryUrls={piece.gallery_urls}
            title={piece.title}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <div>
            <span
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--accent-sage)',
                fontWeight: 600,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              {categorySubhead}
            </span>

            <h1
              className="font-editorial"
              style={{
                fontSize: '40px',
                fontWeight: 400,
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {piece.title}
            </h1>

            {piece.is_shopier_product && !isArchive && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px 0 4px',
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

          <div>
            <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '6px' }}>
              {storyHeading}
            </span>
            <p style={{ fontSize: '16.5px', color: 'var(--text-soft)', lineHeight: 1.85, margin: 0 }}>
              {piece.story}
            </p>
          </div>

          {(hasSizeInfo || hasCraftDetails) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <h3 className="font-editorial" style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 4px', color: 'var(--text-main)' }}>
                Atölye & Detay Notları
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr',
                  gap: '10px 24px',
                  alignItems: 'baseline',
                }}
              >
                {piece.size_info && (
                  <div style={{ display: 'contents' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.5 }}>
                      Beden & Kalıp
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.5 }}>
                      {piece.size_info}
                    </span>
                  </div>
                )}

                {piece.measurements && (
                  <div style={{ display: 'contents' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.5 }}>
                      Ölçüler (cm)
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.5 }}>
                      {piece.measurements}
                    </span>
                  </div>
                )}

                {hasCraftDetails &&
                  piece.craft_details!.map((detail, idx) => (
                    <div key={idx} style={{ display: 'contents' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.5 }}>
                        {detail.label}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {detail.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div style={{ paddingTop: '10px' }}>
            <span className="font-hand" style={{ fontSize: '20px', color: 'var(--accent-terracotta)' }}>
              {signatureText}
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
