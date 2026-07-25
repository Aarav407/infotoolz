import { CategoryGrid, SectionHeader } from "@/components/Sections";
import { getCategoriesWithCounts } from "@/data/catalog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse IT hardware by category — processors, GPUs, laptops, storage, and more.",
};

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts();
  return (
    <div className="px-4 py-8">
      <SectionHeader
        title="Product Categories"
        subtitle="Explore our full range of IT hardware"
      />
      <CategoryGrid categories={categories} />
    </div>
  );
}
