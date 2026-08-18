interface SocialMetadata {
  platform: 'instagram-post' | 'instagram-reels' | 'tiktok';
  thumbnail_url: string;
  caption: string;
}

export async function fetchSocialMetadata(url: string, manualCaption?: string): Promise<SocialMetadata> {
  const cleanUrl = url.trim();

  // TikTok URL tespiti
  if (cleanUrl.includes('tiktok.com')) {
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
      const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        return {
          platform: 'tiktok',
          thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
          caption: manualCaption || data.title || 'TikTok Atölye Videosu',
        };
      }
    } catch {
      // Fallback
    }

    return {
      platform: 'tiktok',
      thumbnail_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
      caption: manualCaption || 'TikTok Atölye Videosu',
    };
  }

  // Instagram URL tespiti
  const isReels = cleanUrl.includes('/reel/') || cleanUrl.includes('/reels/');
  const platform = isReels ? 'instagram-reels' : 'instagram-post';

  return {
    platform,
    thumbnail_url: isReels
      ? 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    caption: manualCaption || (isReels ? 'Instagram Atölye Reels Videosu' : 'Instagram Gönderisi'),
  };
}
