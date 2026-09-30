import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminUsers } from '@/lib/queries';
import { UserManagement } from '@/components/admin/UserManagement';

export default async function AdminUsersPage() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    redirect('/admin/login');
  }

  const users = await getAdminUsers();

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="font-editorial" style={{ fontSize: '32px', fontWeight: 600, margin: '0 0 6px 0' }}>
          Hesap ve Yöneticiler
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-soft)' }}>
          Şifrenizi güncelleyin ve atölye yönetim yetkisine sahip hesapları yönetin.
        </p>
      </div>

      <UserManagement currentUserId={currentAdmin.sub} users={users} />
    </div>
  );
}
