import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { filename, contentType, folder = 'portfolio' } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Dosya adı (filename) ve içerik türü (contentType) zorunludur.' },
        { status: 400 }
      );
    }

    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanName = filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .substring(0, 40);
    const key = `${folder}/${Date.now()}-${cleanName}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error: any) {
    console.error('Presigned URL oluşturma hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Presigned URL oluşturulamadı.' },
      { status: 500 }
    );
  }
}
