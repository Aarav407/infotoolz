import { Suspense } from "react";
import { ProductGrid, SectionHeader } from "@/components/Sections";
import { getProducts, searchProducts } from "@/data/catalog";
import { ProductFilters } from "@/components/ProductFilters";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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

  const allProducts = getProducts();
  let filtered = query ? searchProducts(query) : [...allProducts];

  if (categoryFilter) {
    filtered = filtered.filter((p) => p.categorySlug === categoryFilter);
  }

  if (brandFilter) {
    filtered = filtered.filter(
      (p) => p.brand.toLowerCase() === brandFilter.toLowerCase()
    );
  }

  const brands = [...new Set(allProducts.map((p) => p.brand))].sort();

  return (
    <div className="px-4 py-8">
      <SectionHeader
        title="All Products"
        subtitle={`Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
      />

      <Suspense fallback={null}>
        <ProductFilters
          brands={brands}
          currentBrand={brandFilter}
          currentQuery={query}
        />
      </Suspense>

      <ProductGrid products={filtered} />
    </div>
  );
}
