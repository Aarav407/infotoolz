import { Hero } from "@/components/Hero";
import { SectionHeader, ProductGrid, CategoryGrid } from "@/components/Sections";
import { getFeaturedProducts, getCategoriesWithCounts } from "@/data/products";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const categories = getCategoriesWithCounts();

  return (
    <>
      <Hero />

      <section className="px-4 py-16">
        <SectionHeader
          title="Shop by Category"
          subtitle="Find the right hardware for your needs"
          href="/categories"
          linkText="All Categories"
        />
        <CategoryGrid categories={categories} />
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="px-4 py-16">
          <SectionHeader
            title="Featured Products"
            subtitle="Top picks from our catalog"
            href="/products"
            linkText="View All Products"
          />
          <ProductGrid products={featuredProducts} />
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#00AFB9]"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 text-white text-center border border-[#00AFB9]/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need a Quote or Bulk Order?
          </h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            We supply IT hardware for businesses, resellers, and individual
            customers. Get in touch for pricing, availability, and expert advice.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00AFB9] px-6 py-3 font-semibold text-white hover:bg-[#009AA3] transition-colors"
          >
            Contact Us for Inquiry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
