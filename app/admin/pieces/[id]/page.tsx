import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPieceById } from '@/lib/supabase/queries';
import { PieceForm } from '@/components/admin/PieceForm';

interface EditPiecePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPiecePage({ params }: EditPiecePageProps) {
  const { id } = await params;
  const piece = await getPieceById(id);

  if (!piece) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Link href="/admin" style={{ fontSize: '13px', color: 'var(--text-soft)', textDecoration: 'none' }}>
            &larr; Yönetim Masası
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <Link href="/admin/pieces" style={{ fontSize: '13px', color: 'var(--accent-sage)', textDecoration: 'none' }}>
            Parçalar
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Düzenle</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
          &ldquo;{piece.title}&rdquo; Düzenleniyor
        </h1>
      </div>

      <PieceForm piece={piece} />
    </div>
  );
}
