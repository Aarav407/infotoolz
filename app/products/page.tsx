import { Suspense } from "react";
import { ProductGrid, SectionHeader } from "@/components/Sections";
import { products, searchProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductFilters } from "@/components/ProductFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete IT hardware catalog — processors, GPUs, laptops, storage, and more.",
};

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; category?: string; brand?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const categoryFilter = params.category ?? "";
  const brandFilter = params.brand ?? "";

  let filtered = query ? searchProducts(query) : [...products];

  if (categoryFilter) {
    filtered = filtered.filter((p) => p.categorySlug === categoryFilter);
  }

  if (brandFilter) {
    filtered = filtered.filter(
      (p) => p.brand.toLowerCase() === brandFilter.toLowerCase()
    );
  }

  const brands = [...new Set(products.map((p) => p.brand))].sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <SectionHeader
        title="All Products"
        subtitle={`Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <Suspense fallback={<div className="w-64 shrink-0" />}>
          <ProductFilters
            categories={categories}
            brands={brands}
            currentCategory={categoryFilter}
            currentBrand={brandFilter}
            currentQuery={query}
          />
        </Suspense>

        <div className="flex-1">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
