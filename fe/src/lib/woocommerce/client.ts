import type { WooProduct, WooProductListParams, WooProductVariation } from './types';

const WOO_API_URL = import.meta.env.PUBLIC_WOO_API_URL || 'https://admin.madmultitude.com';
const WOO_CONSUMER_KEY = import.meta.env.WOO_CONSUMER_KEY;
const WOO_CONSUMER_SECRET = import.meta.env.WOO_CONSUMER_SECRET;

/**
 * WooCommerce REST API Client
 * Uses Consumer Key/Secret authentication for server-side requests
 */
class WooCommerceClient {
  private baseUrl: string;
  private auth: string;

  constructor() {
    this.baseUrl = `${WOO_API_URL}/wp-json/wc/v3`;
    this.auth = Buffer.from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`).toString('base64');
  }

  private async fetch<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${this.auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * List products with optional filters
   */
  async listProducts(params?: WooProductListParams): Promise<WooProduct[]> {
    return this.fetch<WooProduct[]>('/products', {
      per_page: params?.per_page ?? 100,
      page: params?.page ?? 1,
      status: params?.status ?? 'publish',
      order: params?.order ?? 'desc',
      orderby: params?.orderby ?? 'date',
      search: params?.search,
      slug: params?.slug,
      category: params?.category,
      tag: params?.tag,
    });
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: number): Promise<WooProduct> {
    return this.fetch<WooProduct>(`/products/${id}`);
  }

  /**
   * Get a single product by slug
   */
  async getProductBySlug(slug: string): Promise<WooProduct | null> {
    const products = await this.listProducts({ slug });
    return products[0] || null;
  }

  /**
   * Get variations for a variable product
   */
  async getProductVariations(productId: number): Promise<WooProductVariation[]> {
    return this.fetch<WooProductVariation[]>(`/products/${productId}/variations`, {
      per_page: 100,
    });
  }

  /**
   * Get product with its variations loaded
   */
  async getProductWithVariations(productId: number): Promise<WooProduct & { loaded_variations: WooProductVariation[] }> {
    const [product, variations] = await Promise.all([
      this.getProduct(productId),
      this.getProductVariations(productId),
    ]);
    
    return {
      ...product,
      loaded_variations: variations,
    };
  }
}

// Export singleton instance
export const woo = new WooCommerceClient();
