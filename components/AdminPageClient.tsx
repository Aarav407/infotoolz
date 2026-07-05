"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Upload, CheckCircle, ArrowLeft, ImageIcon, Save } from "lucide-react";
import { categories } from "@/data/categories";

export interface EditableProduct {
  name: string;
  slug: string;
  image: string;
  category: string;
  categorySlug: string;
}

interface AdminPageClientProps {
  initialProducts: EditableProduct[];
}

export default function AdminPageClient({ initialProducts }: AdminPageClientProps) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<EditableProduct[]>([]);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [products, setProducts] = useState<EditableProduct[]>(initialProducts);
  const [draftNames, setDraftNames] = useState<Record<string, string>>(
    Object.fromEntries(initialProducts.map((product) => [product.slug, product.name]))
  );
  const [savingSlug, setSavingSlug] = useState("");
  const [editMessage, setEditMessage] = useState("");

  async function loadProducts() {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Could not load products.");
    }

    const loadedProducts: EditableProduct[] = data.products || [];
    setProducts(loadedProducts);
    setDraftNames(
      Object.fromEntries(loadedProducts.map((product) => [product.slug, product.name]))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setError("");
    setResults([]);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setResults(data.products || []);
      setSelectedFiles([]);
      form.reset();
      await loadProducts();
    } catch {
      setError("Upload failed. Please make sure the local dev server is running and try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleNameSave(slug: string) {
    setSavingSlug(slug);
    setEditMessage("");
    setError("");

    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: draftNames[slug] || "" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save product name.");
        return;
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.slug === slug ? { ...product, ...data.product } : product
        )
      );
      setEditMessage(`Saved "${data.product.name}".`);
    } catch {
      setError("Could not save product name. Please try again.");
    } finally {
      setSavingSlug("");
    }
  }

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#00AFB9] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mb-6 rounded-2xl border border-[#00AFB9]/20 bg-[#00AFB9]/5 p-4">
        <h1 className="text-2xl font-bold text-slate-900">Admin: Upload & Edit Products</h1>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href="#upload-products"
            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:text-[#00AFB9]"
          >
            1. Upload photos
          </a>
          <a
            href="#edit-product-names"
            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:text-[#00AFB9]"
          >
            2. Edit product names
          </a>
        </div>
      </div>

      <div id="upload-products" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00AFB9]/10 text-[#00AFB9]">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">1. Upload Product Photos</h2>
            <p className="text-sm text-slate-500">Choose category first, then upload photos</p>
          </div>
        </div>

        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
          Upload your product photos here - any filename is fine (e.g.{" "}
          <strong>IMG_001.png</strong>). Products are added as{" "}
          <strong>Product 1</strong>, <strong>Product 2</strong>, etc. You can rename
          them later. No pricing needed.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="categorySlug" className="block text-sm font-semibold text-slate-900 mb-2">
              Choose where these photos should appear
            </label>
            <select
              id="categorySlug"
              name="categorySlug"
              defaultValue="processors"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">
              Example: choose Processors first, then upload all processor photos together.
            </p>
          </div>

          <label
            htmlFor="files"
            className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-[#00AFB9]/50 transition-colors"
          >
            <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <span className="text-sm font-semibold text-[#00AFB9] hover:underline">
              Tap or click here to choose photos
            </span>
            <input
              id="files"
              name="files"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple
              required
              className="sr-only"
              onChange={(event) =>
                setSelectedFiles(Array.from(event.target.files || []).map((file) => file.name))
              }
            />
            <p className="mt-2 text-xs text-slate-400">PNG, JPG, WebP - multiple files OK</p>
          </label>

          {selectedFiles.length > 0 && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                {selectedFiles.length} selected photo{selectedFiles.length !== 1 ? "s" : ""}
              </p>
              <ul className="mt-2 max-h-28 overflow-y-auto space-y-1 text-xs text-slate-500">
                {selectedFiles.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-lg bg-[#00AFB9] py-3.5 text-sm font-semibold text-white hover:bg-[#009AA3] disabled:opacity-50 transition-colors"
          >
            {uploading ? "Uploading..." : "Upload & Add to Catalog"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">{error}</p>
        )}

        {results.length > 0 && (
          <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
              <CheckCircle className="h-5 w-5" />
              {results.length} photo{results.length !== 1 ? "s" : ""} added to the catalog!
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/products/${r.slug}`} className="hover:underline">
                    {r.name} - {r.category} →
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={results[0]?.categorySlug ? `/categories/${results[0].categorySlug}` : "/products"}
              className="inline-block mt-4 text-sm font-semibold text-[#00AFB9] hover:underline"
            >
              View uploaded category →
            </Link>
            <a
              href="#edit-product-names"
              className="ml-4 inline-block mt-4 text-sm font-semibold text-[#00AFB9] hover:underline"
            >
              Rename uploaded products →
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <strong>Note:</strong> Photos sent in chat are not saved automatically. Use this
        page to upload your actual product images - they will appear on the website immediately.
      </div>

      <div id="edit-product-names" className="scroll-mt-24 mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">2. Edit Product Names</h2>
          <p className="mt-1 text-sm text-slate-500">
            Rename uploaded items like Product 1 after checking the photo.
          </p>
        </div>

        {editMessage && (
          <p className="mb-4 rounded-lg bg-green-50 text-green-700 text-sm px-4 py-3">
            {editMessage}
          </p>
        )}

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.slug}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {product.category}
                  </p>
                  <input
                    value={draftNames[product.slug] ?? product.name}
                    onChange={(event) =>
                      setDraftNames((current) => ({
                        ...current,
                        [product.slug]: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleNameSave(product.slug)}
                      disabled={savingSlug === product.slug}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#00AFB9] px-3 py-2 text-xs font-semibold text-white hover:bg-[#009AA3] disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {savingSlug === product.slug ? "Saving..." : "Save name"}
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs font-semibold text-[#00AFB9] hover:underline"
                    >
                      View product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
