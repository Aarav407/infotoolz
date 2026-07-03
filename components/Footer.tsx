import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { categories } from "@/data/categories";

const brands = [
  "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Dell", "Lenovo",
  "Samsung", "Corsair", "Logitech", "LG", "TP-Link",
];

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                IT
              </div>
              <span className="text-lg font-bold text-white">InfoToolz</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted partner for IT hardware. We deal in genuine computer
              components, laptops, peripherals, and networking equipment from
              leading global brands.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-blue-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-blue-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                <span>123 Tech Park, Business District, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-400" />
                <a href="tel:+919876543210" className="hover:text-blue-400">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                <a href="mailto:info@infotoolz.com" className="hover:text-blue-400">
                  info@infotoolz.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Authorized Partner Brands
          </p>
          <div className="flex flex-wrap gap-3">
            {brands.map((brand) => (
              <span
                key={brand}
                className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} InfoToolz. All rights reserved. Genuine IT hardware only.</p>
        </div>
      </div>
    </footer>
  );
}
