import Link from 'next/link';
import { PortfolioForm } from '@/components/admin/PortfolioForm';

export default function NewPortfolioPiecePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Link href="/admin" style={{ fontSize: '13px', color: 'var(--text-soft)', textDecoration: 'none' }}>
            &larr; Yönetim Masası
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <Link href="/admin/portfolio" style={{ fontSize: '13px', color: 'var(--accent-sage)', textDecoration: 'none' }}>
            Atölye Portfolyosu
          </Link>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Yeni Eser Ekle</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 400, margin: 0 }}>
          Yeni Portfolyo & Sanat Eseri Ekle
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--text-soft)', marginTop: '4px' }}>
          Satış amacı olmayan özel dikim giysilerinizi veya serbest zanaat işlerinizi ekleyin.
        </p>
      </div>

      <PortfolioForm />
    </div>
  );
}
