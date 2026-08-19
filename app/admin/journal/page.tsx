import Link from 'next/link';
import Image from 'next/image';
import { getAllJournalNotes } from '@/lib/supabase/queries';
import { deleteJournalNoteAction } from '@/app/admin/actions';

export default async function AdminJournalPage() {
  const journalNotes = await getAllJournalNotes();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
            Atölye Günlüğü Yazıları
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
            Atölyeden notlar, kumaş felsefesi ve ilham alıntılarını buradan ekleyebilir, düzenleyebilir ve silebilirsiniz.
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

      {journalNotes.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-warm)',
            borderRadius: 'var(--radius-card)',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '15px', color: 'var(--text-soft)', margin: 0 }}>
            Henüz eklenmiş bir günlük notu bulunmuyor.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {journalNotes.map((note) => (
            <div
              key={note.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-warm)',
                borderRadius: 'var(--radius-card)',
                padding: '24px 28px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span
                    style={{
                      background: 'rgba(122, 138, 116, 0.15)',
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
                    {note.title}
                  </h3>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Yayın Tarihi: {new Date(note.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link
                    href={`/admin/journal/${note.id}`}
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--accent-terracotta)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: '1px solid var(--border-warm)',
                      background: 'var(--bg-main)',
                    }}
                  >
                    Düzenle ✎
                  </Link>

                  <form action={deleteJournalNoteAction.bind(null, note.id)}>
                    <button
                      type="submit"
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(229, 62, 62, 0.3)',
                        color: '#E53E3E',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      Sil
                    </button>
                  </form>
                </div>
              </div>

              {note.quote && (
                <blockquote
                  className="font-editorial"
                  style={{
                    fontStyle: 'italic',
                    fontSize: '16px',
                    color: 'var(--accent-terracotta)',
                    borderLeft: '3px solid var(--accent-terracotta)',
                    paddingLeft: '14px',
                    margin: '4px 0',
                  }}
                >
                  &ldquo;{note.quote}&rdquo;
                </blockquote>
              )}

              {note.content && (
                <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', lineHeight: 1.6, margin: 0 }}>
                  {note.content}
                </p>
              )}

              {note.photo_urls && note.photo_urls.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {note.photo_urls.map((photo, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-warm)',
                      }}
                    >
                      <Image src={photo} alt={`Not görseli ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
