export interface Piece {
  id: string;
  title: string;
  slug: string;
  category: 'keten' | 'yun' | 'ipek' | 'ozel-dikim' | 'serbest-calisma' | 'arsiv' | 'aksesuar' | string;
  story: string | null;
  main_image_url: string;
  gallery_urls: string[];
  craft_details?: Array<{ label: string; value: string }> | null;
  size_info?: string | null;
  measurements?: string | null;
  showcase_section?: 'shopier' | 'custom' | 'creative' | 'archive' | string;
  is_shopier_product: boolean;
  shopier_sku: string | null;
  shopier_url: string | null;
  price: number | null;
  is_archived: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface JournalNote {
  id: string;
  title: string;
  quote?: string | null;
  content?: string | null;
  photo_urls: string[];
  is_published?: boolean;
  published_at: string;
  created_at: string;
}

export interface SocialEmbed {
  id: string;
  platform: 'instagram-reels' | 'instagram-post' | 'tiktok';
  url: string;
  caption: string;
  thumbnail_url: string | null;
  order_index: number;
  created_at: string;
}

export interface HeroSettings {
  title: string;
  highlight: string;
  title_suffix: string;
  description: string;
  handwritten_note: string;
}

export interface Database {
  public: {
    Tables: {
      pieces: {
        Row: Piece;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category?: string;
          story?: string | null;
          main_image_url: string;
          gallery_urls?: string[];
          craft_details?: any;
          is_shopier_product?: boolean;
          shopier_sku?: string | null;
          shopier_url?: string | null;
          price?: number | null;
          is_archived?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string;
          story?: string | null;
          main_image_url?: string;
          gallery_urls?: string[];
          craft_details?: any;
          is_shopier_product?: boolean;
          shopier_sku?: string | null;
          shopier_url?: string | null;
          price?: number | null;
          is_archived?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journal_notes: {
        Row: JournalNote;
        Insert: {
          id?: string;
          title: string;
          quote: string;
          content: string;
          photo_urls?: string[];
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          quote?: string;
          content?: string;
          photo_urls?: string[];
          is_published?: boolean;
          published_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      social_embeds: {
        Row: SocialEmbed;
        Insert: {
          id?: string;
          platform: 'instagram-reels' | 'instagram-post' | 'tiktok';
          url: string;
          caption: string;
          thumbnail_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: 'instagram-reels' | 'instagram-post' | 'tiktok';
          url?: string;
          caption?: string;
          thumbnail_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
