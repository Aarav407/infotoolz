import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid, SectionHeader } from "@/components/Sections";
import { getCategoryBySlug, categories, getChildCategories } from "@/data/categories";
import { getAllCategoriesWithCounts, getProductsByCategory } from "@/data/products";
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
  const allCategories = getAllCategoriesWithCounts();
  const childCategories = getChildCategories(slug)
    .map((childCategory) =>
      allCategories.find((categoryWithCount) => categoryWithCount.slug === childCategory.slug)
    )
    .filter((childCategory) => childCategory !== undefined);

  return (
    <div className="px-4 py-8">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#00AFB9] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All Categories
      </Link>

      <SectionHeader
        title={category.name}
        subtitle={`${category.description} — ${categoryProducts.length} product${categoryProducts.length !== 1 ? "s" : ""} listed`}
      />

      {childCategories.length > 0 && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Choose a {category.name} vertical
          </p>
          <div className="flex flex-wrap gap-3">
            {childCategories.map((childCategory) => (
              <Link
                key={childCategory.slug}
                href={`/categories/${childCategory.slug}`}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#00AFB9] hover:text-[#00AFB9]"
              >
                {childCategory.name} ({childCategory.productCount})
              </Link>
            ))}
          </div>
        </div>
      )}

      <ProductGrid products={categoryProducts} />
    </div>
  );
}
