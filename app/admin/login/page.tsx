'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAdminAction } from '@/app/admin/actions';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('password', password);

    try {
      await loginAdminAction(formData);
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Girdiğiniz atölye şifresi hatalı.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg-main)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-warm)',
          borderRadius: 'var(--radius-card)',
          padding: '40px 32px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="font-hand" style={{ fontSize: '24px', color: 'var(--accent-terracotta)', display: 'block', marginBottom: '6px' }}>
            rümeysa • atölye
          </span>
          <h1 className="font-editorial" style={{ fontSize: '30px', fontWeight: 400, margin: 0 }}>
            Yönetim Masası
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-soft)', marginTop: '8px' }}>
            Vitrini ve atölye günlüğünü yönetmek için şifrenizi girin
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'rgba(196, 98, 67, 0.1)',
              border: '1px solid var(--accent-terracotta)',
              color: 'var(--accent-terracotta)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '20px',
              lineHeight: 1.5,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}
            >
              Atölye Şifresi
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '13px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-warm)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: password ? '2px' : 'normal',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--accent-terracotta)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '30px',
              padding: '13px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '6px',
              boxShadow: '0 4px 14px rgba(196, 98, 67, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Masaya Giriş Yap →'}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', borderTop: '1px dashed var(--border-warm)', paddingTop: '18px' }}>
          <Link
            href="/"
            style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            ← Vitrine Geri Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
