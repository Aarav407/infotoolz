import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid, SectionHeader } from "@/components/Sections";
import { getCategoryBySlug, categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryProducts = getProductsByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All Categories
      </Link>

      <SectionHeader
        title={category.name}
        subtitle={`${category.description} — ${categoryProducts.length} product${categoryProducts.length !== 1 ? "s" : ""} listed`}
      />

      <ProductGrid products={categoryProducts} />
    </div>
  );
}
