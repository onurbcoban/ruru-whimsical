import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJournalNoteById } from '@/lib/supabase/queries';
import { JournalForm } from '@/components/admin/JournalForm';

interface AdminJournalEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminJournalEditPage({ params }: AdminJournalEditPageProps) {
  const { id } = await params;
  const note = await getJournalNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Link href="/admin" style={{ fontSize: '13px', color: 'var(--text-soft)', textDecoration: 'none' }}>
            &larr; Yönetim Masası
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <Link href="/admin/journal" style={{ fontSize: '13px', color: 'var(--accent-sage)', textDecoration: 'none' }}>
            Atölye Günlüğü
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Düzenle</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
          Günlük Notunu Düzenle
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
          Yazının başlığını, vurgulanan alıntısını, içeriğini ve fotoğraflarını güncelleyebilirsiniz.
        </p>
      </div>

      <JournalForm initialData={note} />
    </div>
  );
}
