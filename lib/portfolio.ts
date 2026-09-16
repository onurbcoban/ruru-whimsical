import { getPieces, getAllJournalNotes, getLatestJournalNote, getSocialEmbeds } from './supabase/queries';
import { getShopierProducts, type ShopierProduct } from './shopier';
import type { Piece, JournalNote, SocialEmbed } from '@/types/database';

export interface UnifiedPiece extends Piece {
  liveStock?: number;
  inStock?: boolean;
}

export async function getUnifiedShowcase(): Promise<{
  pieces: UnifiedPiece[];
  shopierProducts: ShopierProduct[];
  latestJournal: JournalNote | null;
  journals: JournalNote[];
  socialEmbeds: SocialEmbed[];
}> {
  const [pieces, shopierProducts, journals, latestJournal, socialEmbeds] = await Promise.all([
    getPieces(),
    getShopierProducts(),
    getAllJournalNotes(),
    getLatestJournalNote(),
    getSocialEmbeds(),
  ]);

  const enrichedPieces: UnifiedPiece[] = pieces.map((piece) => {
    if (piece.is_shopier_product && piece.shopier_sku) {
      const matchedProduct = shopierProducts.find(
        (sp) => sp.sku.toLowerCase() === piece.shopier_sku?.toLowerCase()
      );

      if (matchedProduct) {
        return {
          ...piece,
          price: matchedProduct.price || piece.price,
          liveStock: matchedProduct.stockQuantity,
          inStock: matchedProduct.inStock,
          shopier_url: matchedProduct.productUrl || piece.shopier_url,
        };
      }
    }

    return piece;
  });

  return {
    pieces: enrichedPieces,
    shopierProducts,
    latestJournal,
    journals,
    socialEmbeds,
  };
}
