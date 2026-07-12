export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
  parentSlug?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  price?: number;
  mrp?: number;
  inStock: boolean;
  description: string;
  specs: Record<string, string>;
  image: string;
  featured?: boolean;
  tags?: string[];
}
