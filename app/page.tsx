import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { getUnifiedShowcase } from '@/lib/portfolio';
import { getSocialEmbeds } from '@/lib/supabase/queries';
import { ShopierShowcase } from '@/components/showcase/ShopierShowcase';
import { ArchiveShowcase } from '@/components/showcase/ArchiveShowcase';
import { CustomShowcase } from '@/components/showcase/CustomShowcase';
import { JournalSection } from '@/components/journal/JournalSection';
import { CreativeWorksShowcase } from '@/components/showcase/CreativeWorksShowcase';
import { SocialShowcase } from '@/components/showcase/SocialShowcase';

export default async function HomePage() {
  const [{ pieces, latestJournal }, socialEmbeds] = await Promise.all([
    getUnifiedShowcase(),
    getSocialEmbeds(),
  ]);

  return (
    <main className="container-custom" style={{ padding: '24px 24px 100px' }}>
      {/* Sticky Header Navigation Bar */}
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
          marginBottom: '60px',
        }}
      >
        <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1
            className="font-editorial"
            style={{
              fontSize: '24px',
              fontStyle: 'italic',
              fontWeight: 600,
              letterSpacing: '-0.3px',
              lineHeight: 1,
              margin: 0,
            }}
          >
            rürü whimsical
          </h1>
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
        </a>

        {/* Quick Nav Anchor Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <a
            href="#aski"
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
            href="#arsiv"
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
            href="#atolye"
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
          <a
            href="#gunluk"
            style={{
              fontSize: '13.5px',
              fontWeight: 500,
              color: 'var(--text-soft)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            günlük
          </a>
          <a
            href="#serbest"
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
            href="#sosyal"
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

        {/* Actions */}
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

      {/* Hero Welcome */}
      <section
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '48px',
          boxShadow: 'var(--shadow-card)',
          maxWidth: '820px',
          margin: '0 auto 80px',
        }}
      >

        <h2
          className="font-editorial"
          style={{
            fontSize: '44px',
            fontWeight: 400,
            lineHeight: 1.15,
            marginBottom: '20px',
          }}
        >
          merhaba, ben rümeysa.<br />
          <em style={{ color: 'var(--accent-terracotta)', fontStyle: 'italic' }}>
            neşenizi ön plana çıkaran
          </em>{' '}
          giysiler dikiyorum.
        </h2>

        <p
          style={{
            fontSize: '16px',
            color: 'var(--text-soft)',
            lineHeight: 1.75,
            marginBottom: '28px',
          }}
        >
          rürü whimsical; çocukluk düşlerinin, dokunmaya kıyılamayan ketenlerin ve atölyemdeki küçük neşelerin bir toplamı.
        </p>

        <div
          className="font-hand"
          style={{
            fontSize: '24px',
            color: 'var(--accent-terracotta)',
          }}
        >
          sevgilerle, rümeysa
        </div>
      </section>

      {/* 1. BÖLÜM: Hemen Alınabilecek Hazır Parçalar (Shopier) */}
      <ShopierShowcase pieces={pieces} />

      {/* 2. BÖLÜM: Arşiv & Sahiplerine Ulaşanlar (Hemen altında, kapalı / katlanabilir) */}
      <ArchiveShowcase pieces={pieces} />

      {/* 3. BÖLÜM: Atölye Seçkisi & Tasarım Parçaları */}
      <CustomShowcase pieces={pieces} />

      {/* 4. BÖLÜM: Atölye Günlüğü & Kumaş Felsefesi */}
      <JournalSection journal={latestJournal} />

      {/* 5. BÖLÜM: Serbest Çalışmalar & Zanaat (Dikiş Dışı Sanat) */}
      <CreativeWorksShowcase pieces={pieces} />

      {/* 6. BÖLÜM: Instagram & TikTok Sosyal Akış Vitrini */}
      <SocialShowcase embeds={socialEmbeds} />

      {/* Footer */}
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
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} rürü whimsical • Tüm hakları saklıdır.
        </span>
        <span className="font-hand" style={{ fontSize: '18px', color: 'var(--accent-sage)' }}>
          neşe dokulu üretimler
        </span>
      </footer>
    </main>
  );
}
