import { woo, type WooProduct, type WooProductListParams, type WooProductWithVariations } from '../woocommerce';

export type SortOptions = 'price_asc' | 'price_desc' | 'date';

/**
 * List all products
 */
export async function listProducts(params?: WooProductListParams): Promise<WooProduct[]> {
  return woo.listProducts(params);
}

/**
 * Get a single product by slug with full details
 */
export async function getProductBySlug(slug: string): Promise<WooProductWithVariations | null> {
  const product = await woo.getProductBySlug(slug);
  
  if (!product) return null;
  
  // If it's a variable product, load variations
  if (product.type === 'variable' && product.variations.length > 0) {
    const variations = await woo.getProductVariations(product.id);
    return { ...product, loaded_variations: variations };
  }
  
  return product;
}

/**
 * Get a single product by ID with full details
 */
export async function getProductById(id: number): Promise<WooProductWithVariations | null> {
  try {
    const product = await woo.getProduct(id);
    
    // If it's a variable product, load variations
    if (product.type === 'variable' && product.variations.length > 0) {
      const variations = await woo.getProductVariations(product.id);
      return { ...product, loaded_variations: variations };
    }
    
    return product;
  } catch {
    return null;
  }
}

/**
 * List products with sorting
 */
export async function listProductsWithSort({
  page = 1,
  perPage = 12,
  sortBy = 'date',
}: {
  page?: number;
  perPage?: number;
  sortBy?: SortOptions;
}): Promise<{ products: WooProduct[]; hasMore: boolean }> {
  let order: 'asc' | 'desc' = 'desc';
  let orderby: 'date' | 'price' = 'date';
  
  switch (sortBy) {
    case 'price_asc':
      orderby = 'price';
      order = 'asc';
      break;
    case 'price_desc':
      orderby = 'price';
      order = 'desc';
      break;
    case 'date':
    default:
      orderby = 'date';
      order = 'desc';
  }
  
  const products = await woo.listProducts({
    page,
    per_page: perPage + 1, // Fetch one extra to check if there are more
    order,
    orderby,
  });
  
  const hasMore = products.length > perPage;
  
  return {
    products: hasMore ? products.slice(0, perPage) : products,
    hasMore,
  };
}

/**
 * Get product metadata value by key
 */
export function getProductMeta(product: WooProduct, key: string): string | undefined {
  return product.meta_data.find(m => m.key === key)?.value;
}

/**
 * Get the display price for a product
 */
export function getProductPrice(product: WooProductWithVariations): number {
  // For variable products, get the lowest variation price
  if (product.type === 'variable' && product.loaded_variations?.length) {
    const prices = product.loaded_variations
      .map(v => parseFloat(v.price))
      .filter(p => !isNaN(p));
    return Math.min(...prices);
  }
  
  return parseFloat(product.price) || 0;
}
