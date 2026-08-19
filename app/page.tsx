import { getUnifiedShowcase } from '@/lib/portfolio';
import { getSocialEmbeds } from '@/lib/supabase/queries';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShopierShowcase } from '@/components/showcase/ShopierShowcase';
import { ArchiveShowcase } from '@/components/showcase/ArchiveShowcase';
import { CustomShowcase } from '@/components/showcase/CustomShowcase';
import { JournalSection } from '@/components/journal/JournalSection';
import { CreativeWorksShowcase } from '@/components/showcase/CreativeWorksShowcase';
import { SocialShowcase } from '@/components/showcase/SocialShowcase';

export default async function HomePage() {
  const [{ pieces, latestJournal, journals }, socialEmbeds] = await Promise.all([
    getUnifiedShowcase(),
    getSocialEmbeds(),
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
            merhaba, ben rümeysa.<br />
            <em style={{ color: 'var(--accent-terracotta)', fontStyle: 'italic' }}>
              neşenizi ön plana çıkaran
            </em>{' '}
            giysiler dikiyorum.
          </h2>

          <p
            style={{
              fontSize: '16.5px',
              color: 'var(--text-soft)',
              lineHeight: 1.8,
              maxWidth: '620px',
              marginBottom: '20px',
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
        </div>
      </section>

      <ShopierShowcase pieces={pieces} />
      <ArchiveShowcase pieces={pieces} />
      <CustomShowcase pieces={pieces} />
      <JournalSection journals={journals} journal={latestJournal} />
      <CreativeWorksShowcase pieces={pieces} />
      <SocialShowcase embeds={socialEmbeds} />

      <Footer />
    </main>
  );
}
