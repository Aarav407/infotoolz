import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  products,
  formatPrice,
  getDiscountPercent,
} from "@/data/products";
import { ArrowLeft, CheckCircle, XCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { company } from "@/data/company";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const discount = getDiscountPercent(product.price, product.mrp);
  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#00AFB9] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square rounded-2xl border border-slate-200 bg-white p-8">
          {discount > 0 && (
            <span className="absolute top-4 left-4 z-10 rounded-md bg-red-500 px-3 py-1 text-sm font-semibold text-white">
              -{discount}% OFF
            </span>
          )}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-8"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <Link
            href={`/categories/${product.categorySlug}`}
            className="text-sm font-medium text-[#00AFB9] hover:underline"
          >
            {product.category}
          </Link>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-1 text-slate-500">Brand: {product.brand}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(product.mrp)}
                </span>
                <span className="rounded-md bg-red-50 px-2 py-0.5 text-sm font-semibold text-red-600">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {product.inStock ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-600">In Stock</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium text-red-500">Currently Out of Stock</span>
              </>
            )}
          </div>

          <p className="mt-6 text-slate-600 leading-relaxed">{product.description}</p>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Interested in this product?</h3>
            <p className="text-sm text-slate-500 mb-4">
              Contact us for availability, bulk pricing, or technical consultation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-[#00AFB9] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#009AA3] transition-colors"
              >
                <Mail className="h-4 w-4" />
                Send Inquiry
              </Link>
              <a
                href={company.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#20BD5A] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`tel:+${company.phone}`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Specifications</h2>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([key, value], i) => (
                <tr
                  key={key}
                  className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}
                >
                  <td className="px-6 py-3 font-medium text-slate-600 w-1/3">
                    {key}
                  </td>
                  <td className="px-6 py-3 text-slate-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            More in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#00AFB9]/40 hover:shadow-md transition-all"
              >
                <div className="relative h-16 w-16 shrink-0">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                    {p.name}
                  </p>
                  <p className="text-sm font-bold text-[#00AFB9] mt-1">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
