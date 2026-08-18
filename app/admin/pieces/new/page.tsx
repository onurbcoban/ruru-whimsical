import Link from 'next/link';
import { PieceForm } from '@/components/admin/PieceForm';

export default function NewPiecePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Link href="/admin/pieces" style={{ fontSize: '13px', color: 'var(--accent-sage)', textDecoration: 'none' }}>
            Parçalar
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Yeni Ekle</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
          Yeni Parça / Giysi Ekle
        </h1>
      </div>

      <PieceForm />
    </div>
  );
}
