import Link from 'next/link';
import { JournalForm } from '@/components/admin/JournalForm';

export default function NewJournalPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/admin/journal" style={{ fontSize: '13px', color: 'var(--accent-sage)', textDecoration: 'none' }}>
            Atölye Günlüğü
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Yeni Yazı</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
          Yeni Günlük Notu Yayınla
        </h1>
      </div>

      <JournalForm />
    </div>
  );
}
