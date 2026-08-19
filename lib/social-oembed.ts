interface SocialMetadata {
  platform: 'instagram-post' | 'instagram-reels' | 'tiktok';
  thumbnail_url: string | null;
  caption: string;
}

export async function fetchSocialMetadata(
  url: string,
  manualCaption?: string
): Promise<SocialMetadata> {
  const cleanUrl = url.trim();

  // 1. TikTok URL tespiti & oEmbed
  if (cleanUrl.includes('tiktok.com')) {
    try {
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`;
      const res = await fetch(oembedUrl, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        return {
          platform: 'tiktok',
          thumbnail_url: data.thumbnail_url || null,
          caption: manualCaption || data.title || 'TikTok Atölye Videosu',
        };
      }
    } catch (err) {
      console.error('TikTok oEmbed error:', err);
    }

    return {
      platform: 'tiktok',
      thumbnail_url: null,
      caption: manualCaption || 'TikTok Atölye Videosu',
    };
  }

  // 2. Instagram URL tespiti (Canlı Embed / iframe için shortcode tespiti)
  const isReels = cleanUrl.includes('/reel/') || cleanUrl.includes('/reels/');
  const platform = isReels ? 'instagram-reels' : 'instagram-post';

  return {
    platform,
    thumbnail_url: null,
    caption: manualCaption || (isReels ? 'Instagram Reels Videosu' : 'Instagram Gönderisi'),
  };
}
