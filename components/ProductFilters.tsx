"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface ProductFiltersProps {
  brands: string[];
  currentBrand: string;
  currentQuery: string;
}

export function ProductFilters({
  brands,
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
    <div className="mb-6 space-y-4">
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          name="q"
          defaultValue={currentQuery}
          placeholder="Search products..."
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
        />
      </form>

      <div>
        <p className="text-sm font-semibold text-slate-900 mb-2">Filter by Brand</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("brand", "")}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              !currentBrand
                ? "bg-[#00AFB9] text-white font-medium"
                : "bg-white border border-slate-200 text-slate-600 hover:border-[#00AFB9]/40"
            }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => updateFilter("brand", brand)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                currentBrand.toLowerCase() === brand.toLowerCase()
                  ? "bg-[#00AFB9] text-white font-medium"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#00AFB9]/40"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
