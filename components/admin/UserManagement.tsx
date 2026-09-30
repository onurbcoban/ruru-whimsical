'use client';

import { useState } from 'react';
import { changePasswordAction, createAdminUserAction, deleteAdminUserAction } from '@/app/admin/actions';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface UserManagementProps {
  currentUserId: string;
  users: AdminUser[];
}

export function UserManagement({ currentUserId, users }: UserManagementProps) {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New admin state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdMsg(null);

    const formData = new FormData();
    formData.append('current_password', currentPassword);
    formData.append('new_password', newPassword);
    formData.append('new_password_confirm', newPasswordConfirm);

    try {
      await changePasswordAction(formData);
      setPwdMsg({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err: any) {
      setPwdMsg({ type: 'error', text: err?.message || 'Şifre değiştirilemedi.' });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    setUserMsg(null);

    const formData = new FormData();
    formData.append('name', newName);
    formData.append('email', newEmail);
    formData.append('password', newUserPassword);

    try {
      await createAdminUserAction(formData);
      setUserMsg({ type: 'success', text: 'Yeni yönetici hesabı başarıyla eklendi.' });
      setNewName('');
      setNewEmail('');
      setNewUserPassword('');
    } catch (err: any) {
      setUserMsg({ type: 'error', text: err?.message || 'Kullanıcı eklenemedi.' });
    } finally {
      setUserLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`${name} yöneticisini silmek istediğinize emin misiniz?`)) {
      return;
    }

    setDeletingId(userId);
    try {
      await deleteAdminUserAction(userId);
    } catch (err: any) {
      alert(err?.message || 'Yönetici silinemedi.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', maxWidth: '850px' }}>
      {/* 1. Mevcut Yöneticiler */}
      <section
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
        }}
      >
        <h2 className="font-editorial" style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 16px 0' }}>
          Atölye Yöneticileri
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-soft)', marginTop: '-8px', marginBottom: '20px' }}>
          Yönetim masasına erişim yetkisi olan tüm hesaplar.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;
            return (
              <div
                key={u.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {u.name}
                    </span>
                    {isSelf && (
                      <span
                        style={{
                          fontSize: '11px',
                          background: 'rgba(196, 98, 67, 0.1)',
                          color: 'var(--accent-terracotta)',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontWeight: 600,
                        }}
                      >
                        Siz
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                    {u.email}
                  </span>
                </div>

                {!isSelf && (
                  <button
                    type="button"
                    disabled={deletingId === u.id || users.length <= 1}
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-warm)',
                      color: 'var(--text-muted)',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12.5px',
                      cursor: deletingId === u.id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {deletingId === u.id ? 'Siliniyor...' : 'Sil'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Şifremi Değiştir */}
      <section
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
        }}
      >
        <h2 className="font-editorial" style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 16px 0' }}>
          Şifremi Değiştir
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-soft)', marginTop: '-8px', marginBottom: '20px' }}>
          Mevcut hesabınızın giriş şifresini güncelleyin.
        </p>

        {pwdMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '16px',
              background: pwdMsg.type === 'success' ? 'rgba(74, 102, 79, 0.1)' : 'rgba(196, 98, 67, 0.1)',
              border: `1px solid ${pwdMsg.type === 'success' ? 'var(--accent-sage)' : 'var(--accent-terracotta)'}`,
              color: pwdMsg.type === 'success' ? 'var(--accent-sage)' : 'var(--accent-terracotta)',
            }}
          >
            {pwdMsg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
              Mevcut Şifre
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
              Yeni Şifre (En az 6 karakter)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
              Yeni Şifre Tekrar
            </label>
            <input
              type="password"
              required
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
            <button
              type="submit"
              disabled={pwdLoading}
              style={{
                background: 'var(--accent-terracotta)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                padding: '10px 22px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: pwdLoading ? 'not-allowed' : 'pointer',
                opacity: pwdLoading ? 0.7 : 1,
              }}
            >
              {pwdLoading ? 'Kaydediliyor...' : 'Şifremi Güncelle'}
            </button>
          </div>
        </form>
      </section>

      {/* 3. Yeni Yönetici Ekle */}
      <section
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '28px',
        }}
      >
        <h2 className="font-editorial" style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 16px 0' }}>
          Yeni Yönetici Ekle
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-soft)', marginTop: '-8px', marginBottom: '20px' }}>
          Atölye yönetimine yeni bir ekip üyesi dahil edin.
        </p>

        {userMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '16px',
              background: userMsg.type === 'success' ? 'rgba(74, 102, 79, 0.1)' : 'rgba(196, 98, 67, 0.1)',
              border: `1px solid ${userMsg.type === 'success' ? 'var(--accent-sage)' : 'var(--accent-terracotta)'}`,
              color: userMsg.type === 'success' ? 'var(--accent-sage)' : 'var(--accent-terracotta)',
            }}
          >
            {userMsg.text}
          </div>
        )}

        <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
              Ad Soyad
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Örn: Onur"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
              E-posta
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="ornek@ruruwhimsical.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
              Geçici Şifre (En az 6 karakter)
            </label>
            <input
              type="password"
              required
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '4px' }}>
            <button
              type="submit"
              disabled={userLoading}
              style={{
                background: 'var(--accent-sage)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                padding: '10px 22px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: userLoading ? 'not-allowed' : 'pointer',
                opacity: userLoading ? 0.7 : 1,
              }}
            >
              {userLoading ? 'Ekleniyor...' : 'Yöneticiyi Ekle'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
