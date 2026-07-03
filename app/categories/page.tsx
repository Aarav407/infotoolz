import { CategoryGrid, SectionHeader } from "@/components/Sections";
import { categories } from "@/data/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse IT hardware by category — processors, GPUs, laptops, storage, and more.",
};

export default function CategoriesPage() {
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
