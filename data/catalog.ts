import "server-only";

import { Product } from "@/types/product";
import { categories, getChildCategories } from "./categories";
import { loadCatalogProducts } from "@/lib/import-product";
import { products as seedProducts } from "./products";

/** Live catalog: seed demo products + local admin uploads. Server-only. */
export function getProducts(): Product[] {
  try {
    return loadCatalogProducts();
  } catch {
    return seedProducts;
  }
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const childSlugs = getChildCategories(categorySlug).map((category) => category.slug);
  const categorySlugs = [categorySlug, ...childSlugs];
  return getProducts().filter((p) => categorySlugs.includes(p.categorySlug));
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((p) => p.featured);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  const all = getProducts();
  if (!q) return all;
  return all.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

export function getCategoriesWithCounts() {
  const all = getProducts();
  return categories
    .filter((cat) => !cat.parentSlug)
    .map((cat) => {
      const childSlugs = getChildCategories(cat.slug).map((category) => category.slug);
      const categorySlugs = [cat.slug, ...childSlugs];

      return {
        ...cat,
        productCount: all.filter((p) => categorySlugs.includes(p.categorySlug)).length,
      };
    });
}

export function getAllCategoriesWithCounts() {
  const all = getProducts();
  return categories.map((cat) => ({
    ...cat,
    productCount: all.filter((p) => p.categorySlug === cat.slug).length,
  }));
}
