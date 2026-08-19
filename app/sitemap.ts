import { MetadataRoute } from 'next';
import { getPublishedPieces, getAllJournalNotes } from '@/lib/supabase/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ruruwhimsical.com';
  const [pieces, journals] = await Promise.all([
    getPublishedPieces(),
    getAllJournalNotes(),
  ]);

  const pieceEntries: MetadataRoute.Sitemap = pieces.map((piece) => ({
    url: `${baseUrl}/parca/${piece.slug}`,
    lastModified: piece.updated_at ? new Date(piece.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: piece.is_shopier_product ? 0.9 : 0.8,
  }));

  const journalEntries: MetadataRoute.Sitemap = journals.map((note) => ({
    url: `${baseUrl}/gunluk/${note.id}`,
    lastModified: note.published_at ? new Date(note.published_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
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
    ...journalEntries,
  ];
}
