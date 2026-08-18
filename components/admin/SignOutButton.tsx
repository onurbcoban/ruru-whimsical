'use client';

import { useRouter } from 'next/navigation';
import { logoutAdminAction } from '@/app/admin/actions';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logoutAdminAction();
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      style={{
        fontSize: '12px',
        fontWeight: 600,
        color: '#E53E3E',
        background: 'rgba(229, 62, 62, 0.08)',
        border: '1px solid rgba(229, 62, 62, 0.25)',
        padding: '6px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      Çıkış
    </button>
  );
}
