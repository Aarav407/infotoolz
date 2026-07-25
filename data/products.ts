import seedCatalog from "./products.json";
import { Product } from "@/types/product";
import { categories, getChildCategories } from "./categories";

/** Seed catalog (safe for client + generateStaticParams). */
export const products: Product[] = seedCatalog as unknown as Product[];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const childSlugs = getChildCategories(categorySlug).map((category) => category.slug);
  const categorySlugs = [categorySlug, ...childSlugs];
  return products.filter((p) => categorySlugs.includes(p.categorySlug));
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

export function getCategoriesWithCounts() {
  return categories
    .filter((cat) => !cat.parentSlug)
    .map((cat) => {
      const childSlugs = getChildCategories(cat.slug).map((category) => category.slug);
      const categorySlugs = [cat.slug, ...childSlugs];

      return {
        ...cat,
        productCount: products.filter((p) => categorySlugs.includes(p.categorySlug)).length,
      };
    });
}

export function getAllCategoriesWithCounts() {
  return categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.categorySlug === cat.slug).length,
  }));
}

export function hasPricing(product: Product): boolean {
  return product.price != null && product.price > 0;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function getDiscountPercent(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
