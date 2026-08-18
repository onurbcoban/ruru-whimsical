import Link from 'next/link';
import Image from 'next/image';
import { getLatestJournalNote } from '@/lib/supabase/queries';

export default async function AdminJournalPage() {
  const latestJournal = await getLatestJournalNote();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
            Atölye Günlüğü Yazıları
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
            Atölyeden notlar, kumaş felsefesi ve ilham alıntılarını buradan yönetebilirsiniz.
          </p>
        </div>

        <Link
          href="/admin/journal/new"
          style={{
            background: 'var(--accent-terracotta)',
            color: '#FFFFFF',
            padding: '10px 22px',
            borderRadius: '30px',
            fontSize: '13.5px',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(196, 98, 67, 0.25)',
          }}
        >
          + Yeni Günlük Notu Yaz
        </Link>
      </div>

      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {latestJournal ? (
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span
                  style={{
                    background: 'var(--bg-linen-tag)',
                    color: 'var(--accent-sage)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Yayında
                </span>
                <h3 className="font-editorial" style={{ fontSize: '24px', fontWeight: 400, marginTop: '8px', marginBottom: '4px' }}>
                  {latestJournal.title}
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Yayın Tarihi: {new Date(latestJournal.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <Link
                href="/gunluk"
                target="_blank"
                style={{
                  fontSize: '12.5px',
                  color: 'var(--accent-sage)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border-warm)',
                  background: 'var(--bg-main)',
                }}
              >
                Sitede Görüntüle ↗
              </Link>
            </div>

            <blockquote
              className="font-editorial"
              style={{
                fontStyle: 'italic',
                fontSize: '17px',
                color: 'var(--accent-terracotta)',
                borderLeft: '3px solid var(--accent-terracotta)',
                paddingLeft: '16px',
                margin: '8px 0',
              }}
            >
              &ldquo;{latestJournal.quote}&rdquo;
            </blockquote>

            <p style={{ fontSize: '14.5px', color: 'var(--text-soft)', lineHeight: 1.75, margin: 0 }}>
              {latestJournal.content}
            </p>

            {latestJournal.photo_urls && latestJournal.photo_urls.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                {latestJournal.photo_urls.map((url, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '90px',
                      height: '90px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-warm)',
                    }}
                  >
                    <Image src={url} alt={`Atölye görseli ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Henüz yayınlanmış bir günlük notu bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
