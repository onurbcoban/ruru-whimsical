import { MetadataRoute } from 'next';
import { getPublishedPieces } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ruruwhimsical.com';
  const pieces = await getPublishedPieces();

  const pieceEntries: MetadataRoute.Sitemap = pieces.map((piece) => ({
    url: `${baseUrl}/parca/${piece.slug}`,
    lastModified: piece.updated_at ? new Date(piece.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: piece.is_shopier_product ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gunluk`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...pieceEntries,
  ];
}
