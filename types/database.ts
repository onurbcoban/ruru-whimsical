export interface Piece {
  id: string;
  title: string;
  slug: string;
  category: 'keten' | 'yun' | 'ipek' | 'ozel-dikim' | 'serbest-calisma' | 'arsiv' | 'aksesuar' | string;
  story: string | null;
  main_image_url: string;
  gallery_urls: string[];
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
  quote: string;
  content: string;
  photo_urls: string[];
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

export interface Database {
  public: {
    Tables: {
      pieces: {
        Row: Piece;
        Insert: Omit<Piece, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Piece, 'id'>>;
      };
      journal_notes: {
        Row: JournalNote;
        Insert: Omit<JournalNote, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<JournalNote, 'id'>>;
      };
      social_embeds: {
        Row: SocialEmbed;
        Insert: Omit<SocialEmbed, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<SocialEmbed, 'id'>>;
      };
    };
  };
}
