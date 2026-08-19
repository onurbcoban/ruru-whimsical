import { getUnifiedShowcase } from '@/lib/portfolio';
import { getSocialEmbeds, getHeroSettings } from '@/lib/supabase/queries';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShopierShowcase } from '@/components/showcase/ShopierShowcase';
import { ArchiveShowcase } from '@/components/showcase/ArchiveShowcase';
import { CustomShowcase } from '@/components/showcase/CustomShowcase';
import { JournalSection } from '@/components/journal/JournalSection';
import { CreativeWorksShowcase } from '@/components/showcase/CreativeWorksShowcase';
import { SocialShowcase } from '@/components/showcase/SocialShowcase';

export default async function HomePage() {
  const [{ pieces, latestJournal, journals }, socialEmbeds, hero] = await Promise.all([
    getUnifiedShowcase(),
    getSocialEmbeds(),
    getHeroSettings(),
  ]);

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
      <Navbar />

      <section
        style={{
          maxWidth: '760px',
          margin: '24px auto 84px',
          textAlign: 'left',
          padding: '0 16px',
        }}
      >
        <div
          style={{
            borderLeft: '2px solid var(--accent-terracotta)',
            paddingLeft: '28px',
          }}
        >
          <h2
            className="font-editorial"
            style={{
              fontSize: '44px',
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: '18px',
              letterSpacing: '-0.5px',
            }}
          >
            {hero.title && (
              <>
                {hero.title}
                <br />
              </>
            )}
            {hero.highlight && (
              <em style={{ color: 'var(--accent-terracotta)', fontStyle: 'italic' }}>
                {hero.highlight}
              </em>
            )}{' '}
            {hero.title_suffix}
          </h2>

          {hero.description && (
            <p
              style={{
                fontSize: '16.5px',
                color: 'var(--text-soft)',
                lineHeight: 1.8,
                maxWidth: '620px',
                marginBottom: '20px',
              }}
            >
              {hero.description}
            </p>
          )}

          {hero.handwritten_note && (
            <div
              className="font-hand"
              style={{
                fontSize: '24px',
                color: 'var(--accent-terracotta)',
              }}
            >
              {hero.handwritten_note}
            </div>
          )}
        </div>
      </section>

      <ShopierShowcase pieces={pieces} />
      <ArchiveShowcase pieces={pieces} />
      <CustomShowcase pieces={pieces} />
      <CreativeWorksShowcase pieces={pieces} />
      <JournalSection journals={journals} journal={latestJournal} />
      <SocialShowcase embeds={socialEmbeds} />

      <Footer />
    </main>
  );
}
