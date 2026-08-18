'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface ImageUploaderProps {
  label: string;
  value?: string | string[];
  multiple?: boolean;
  bucketName?: 'portfolio' | 'journal';
  onChange: (urls: string | string[]) => void;
}

export function ImageUploader({
  label,
  value,
  multiple = false,
  bucketName = 'portfolio',
  onChange,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const currentImages: string[] = Array.isArray(value)
    ? value
    : value
    ? [value]
    : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [...currentImages];

    const supabase = createClient();
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-project');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (isSupabaseConfigured) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

          if (!uploadError) {
            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            if (data?.publicUrl) {
              uploadedUrls.push(data.publicUrl);
              continue;
            }
          }
        } catch (err) {
          console.warn('Storage fallback', err);
        }
      }

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      uploadedUrls.push(dataUrl);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (multiple) {
      onChange(uploadedUrls);
    } else {
      onChange(uploadedUrls[uploadedUrls.length - 1] || '');
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (multiple) {
      const updated = currentImages.filter((_, idx) => idx !== indexToRemove);
      onChange(updated);
    } else {
      onChange('');
    }
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '1.5px dashed var(--border-warm)',
            background: 'var(--bg-main)',
            borderRadius: 'var(--radius-sm)',
            padding: '22px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.2s ease',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-terracotta)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: '0 auto 6px', display: 'block' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>

          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
            {uploading
              ? 'Görseller Yükleniyor...'
              : multiple
              ? 'Cihazdan Fotoğrafları Seçin (Birden Fazla)'
              : 'Cihazdan Fotoğraf Seçin'}
          </span>
          <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            PNG, JPG, WEBP formatları desteklenir
          </span>
        </div>

        {currentImages.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '12px',
              marginTop: '8px',
            }}
          >
            {currentImages.map((url, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  height: '110px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-warm)',
                  background: 'var(--bg-card-alt)',
                }}
              >
                <Image
                  src={url}
                  alt={`Yüklenen görsel ${idx + 1}`}
                  fill
                  sizes="120px"
                  style={{ objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
