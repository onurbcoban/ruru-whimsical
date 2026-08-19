import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPieceById } from '@/lib/supabase/queries';
import { PieceForm } from '@/components/admin/PieceForm';
import { PortfolioForm } from '@/components/admin/PortfolioForm';

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

  const isShopier = piece.is_shopier_product;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Link href="/admin" style={{ fontSize: '13px', color: 'var(--text-soft)', textDecoration: 'none' }}>
            &larr; Yönetim Masası
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <Link
            href={isShopier ? '/admin/pieces' : '/admin/portfolio'}
            style={{ fontSize: '13px', color: 'var(--accent-sage)', textDecoration: 'none' }}
          >
            {isShopier ? 'Satıştaki Elbiseler' : 'Atölye Portfolyosu'}
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Düzenle</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
          &ldquo;{piece.title}&rdquo; Düzenleniyor
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
          {isShopier ? 'Satıştaki elbise detaylarını, fiyatını ve fotoğraflarını güncelleyebilirsiniz.' : 'Portfolyo eserinin hikayesini, detaylarını ve fotoğraflarını güncelleyebilirsiniz.'}
        </p>
      </div>

      {isShopier ? <PieceForm piece={piece} /> : <PortfolioForm piece={piece} />}
    </div>
  );
}
