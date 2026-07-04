"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle, ArrowLeft, ImageIcon } from "lucide-react";

interface UploadResult {
  name: string;
  slug: string;
  image: string;
}

export default function AdminUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState("");

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
      form.reset();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
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

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00AFB9]/10 text-[#00AFB9]">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Upload Product Photos</h1>
            <p className="text-sm text-slate-500">Infotoolz Admin</p>
          </div>
        </div>

        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
          Upload your product photos here — any filename is fine (e.g.{" "}
          <strong>IMG_001.png</strong>). Products are added as{" "}
          <strong>Product 1</strong>, <strong>Product 2</strong>, etc. You can rename
          them later. No pricing needed.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-[#00AFB9]/50 transition-colors">
            <ImageIcon className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <label htmlFor="files" className="cursor-pointer">
              <span className="text-sm font-semibold text-[#00AFB9] hover:underline">
                Choose photos
              </span>
              <span className="text-sm text-slate-500"> or drag and drop</span>
              <input
                id="files"
                name="files"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                required
                className="hidden"
              />
            </label>
            <p className="mt-2 text-xs text-slate-400">PNG, JPG, WebP — multiple files OK</p>
          </div>

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
                    {r.name} →
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="inline-block mt-4 text-sm font-semibold text-[#00AFB9] hover:underline"
            >
              View all products →
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
        <strong>Note:</strong> Photos sent in chat are not saved automatically. Use this
        page to upload your actual product images — they will appear on the website immediately.
      </div>
    </div>
  );
}
