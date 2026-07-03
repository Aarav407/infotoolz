"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Category } from "@/types/product";

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  currentCategory: string;
  currentBrand: string;
  currentQuery: string;
}

export function ProductFilters({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentQuery,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    updateFilter("q", q);
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          name="q"
          defaultValue={currentQuery}
          placeholder="Search products..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Category</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <button
              onClick={() => updateFilter("category", "")}
              className={`w-full text-left rounded-md px-2 py-1.5 transition-colors ${
                !currentCategory
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <button
                onClick={() => updateFilter("category", cat.slug)}
                className={`w-full text-left rounded-md px-2 py-1.5 transition-colors ${
                  currentCategory === cat.slug
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Brand</h3>
        <ul className="space-y-1 text-sm max-h-48 overflow-y-auto">
          <li>
            <button
              onClick={() => updateFilter("brand", "")}
              className={`w-full text-left rounded-md px-2 py-1.5 transition-colors ${
                !currentBrand
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Brands
            </button>
          </li>
          {brands.map((brand) => (
            <li key={brand}>
              <button
                onClick={() => updateFilter("brand", brand)}
                className={`w-full text-left rounded-md px-2 py-1.5 transition-colors ${
                  currentBrand.toLowerCase() === brand.toLowerCase()
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {brand}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
