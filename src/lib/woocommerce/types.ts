// WooCommerce REST API v3 Types

export interface WooImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WooAttribute {
  id: number;
  name: string;
  option: string;
}

export interface WooProductVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  attributes: WooAttribute[];
  image?: WooImage;
}

export interface WooProductMeta {
  id: number;
  key: string;
  value: string;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: 'simple' | 'variable' | 'grouped' | 'external';
  status: 'publish' | 'draft' | 'pending' | 'private';
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  categories: WooCategory[];
  images: WooImage[];
  attributes: {
    id: number;
    name: string;
    options: string[];
    variation: boolean;
  }[];
  variations: number[];
  meta_data: WooProductMeta[];
  date_created: string;
  date_modified: string;
}

// Helper type for product with loaded variations
export interface WooProductWithVariations extends WooProduct {
  loaded_variations?: WooProductVariation[];
}

// Query parameters for listing products
export interface WooProductListParams {
  page?: number;
  per_page?: number;
  search?: string;
  slug?: string;
  status?: 'publish' | 'draft' | 'pending' | 'private' | 'any';
  category?: number;
  tag?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'id' | 'title' | 'slug' | 'price' | 'popularity' | 'rating';
}
