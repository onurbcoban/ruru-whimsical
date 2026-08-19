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
  const [{ pieces, latestJournal }, socialEmbeds] = await Promise.all([
    getUnifiedShowcase(),
    getSocialEmbeds(),
  ]);

  return (
    <main className="container-custom" style={{ padding: '24px 24px 100px' }}>
      <Navbar />

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

      <ShopierShowcase pieces={pieces} />
      <ArchiveShowcase pieces={pieces} />
      <CustomShowcase pieces={pieces} />
      <JournalSection journal={latestJournal} />
      <CreativeWorksShowcase pieces={pieces} />
      <SocialShowcase embeds={socialEmbeds} />

      <Footer />
    </main>
  );
}
