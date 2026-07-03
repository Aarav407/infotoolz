import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { categories } from "@/data/categories";
import { company } from "@/data/company";

const brands = [
  "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Dell", "Lenovo",
  "Samsung", "Corsair", "Logitech", "LG", "TP-Link",
];

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-[1600px] px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src={company.logo}
                alt={company.name}
                width={160}
                height={48}
                className="h-10 w-auto brightness-0 invert opacity-90"
              />
            </Link>
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
                    className="hover:text-[#00AFB9] transition-colors"
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
                <Link href="/products" className="hover:text-[#00AFB9] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-[#00AFB9] transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#00AFB9] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#00AFB9] transition-colors">
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
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#00AFB9]" />
                <a href={`tel:+${company.phone}`} className="hover:text-[#00AFB9]">
                  {company.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0 text-[#25D366]" />
                <a
                  href={company.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366]"
                >
                  WhatsApp: {company.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#00AFB9]" />
                <a href={`mailto:${company.email}`} className="hover:text-[#00AFB9]">
                  {company.email}
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
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved. Genuine IT hardware only.</p>
        </div>
      </div>
    </footer>
  );
}
