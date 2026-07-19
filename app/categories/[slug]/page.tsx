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
        <div className="mb-8 rounded-2xl border border-[#00AFB9]/20 bg-[#00AFB9]/5 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Under {category.name}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {childCategories.map((childCategory) => (
              <Link
                key={childCategory.slug}
                href={`/categories/${childCategory.slug}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-800 hover:border-[#00AFB9] hover:text-[#00AFB9]"
              >
                <span className="block">{childCategory.name}</span>
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  {childCategory.productCount} product
                  {childCategory.productCount === 1 ? "" : "s"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ProductGrid products={categoryProducts} />
    </div>
  );
}
