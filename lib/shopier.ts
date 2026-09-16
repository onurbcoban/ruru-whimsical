export interface ShopierProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  stockQuantity: number;
  inStock: boolean;
  imageUrl: string;
  productUrl: string;
  sku: string;
  category: string;
  description: string;
}

const MOCK_SHOPIER_PRODUCTS: ShopierProduct[] = [
  {
    id: 'shp-101',
    title: 'Tirşe Keten Gömlek Elbise',
    price: 2850,
    currency: 'TRY',
    stockQuantity: 3,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://shopier.com',
    sku: 'RURU-KTS-01',
    category: 'keten',
    description: 'Yıkanmış saf keten kumaş, sedef düğmeler ve geniş cepler.',
  },
  {
    id: 'shp-102',
    title: 'Gece Mavisi Yün Kaşe Pelerin',
    price: 4200,
    currency: 'TRY',
    stockQuantity: 1,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://shopier.com',
    sku: 'RURU-YUN-02',
    category: 'yun',
    description: 'Saf yün dokuma, pirinç agraflar ve ipek astar.',
  },
  {
    id: 'shp-103',
    title: 'Pudra Vual Askılı Yazlık Elbise',
    price: 2450,
    currency: 'TRY',
    stockQuantity: 2,
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    productUrl: 'https://shopier.com',
    sku: 'RURU-VUL-03',
    category: 'ipek',
    description: 'Hafif pamuk vual kumaş, el büzgüsü göğüs detayı.',
  },
];

export async function getShopierProducts(): Promise<ShopierProduct[]> {
  const token = process.env.SHOPIER_PERSONAL_TOKEN;
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Canlı Shopier Token'ı varsa API'den gerçek veriyi çek
  if (token) {
    try {
      const response = await fetch('https://api.shopier.com/v1/products', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 300,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      if (Array.isArray(data?.data)) {
        return data.data.map((item: any) => ({
          id: String(item.id),
          title: item.title || item.name || '',
          price: Number(item.price || 0),
          currency: item.currency || 'TRY',
          stockQuantity: Number(item.stock_quantity || item.stock || 0),
          inStock: Number(item.stock_quantity || item.stock || 0) > 0,
          imageUrl: item.media?.[0]?.url || item.image || '',
          productUrl: item.url || `https://shopier.com/${item.id}`,
          sku: item.sku || '',
          category: item.category || 'giyim',
          description: item.description || '',
        }));
      }

      return [];
    } catch {
      return [];
    }
  }

  // 2. Canlı ortamdaysak ve token yoksa: Sahte veri ASLA gösterme, boş liste dön
  if (isProduction) {
    return [];
  }

  // 3. Yerel geliştirme ortamındaysak (Local Dev): Arayüzü test edebilmemiz için mock verileri dön
  return MOCK_SHOPIER_PRODUCTS;
}
