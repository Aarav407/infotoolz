import Link from "next/link";
import {
  Phone,
  Mail,
  Search,
  Menu,
  MessageCircle,
} from "lucide-react";
import { company } from "@/data/company";
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-slate-900 text-white text-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2">
          <p className="hidden sm:block">
            Authorized IT Hardware Reseller — Genuine Products Only
          </p>
          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:+${company.phone}`}
              className="flex items-center gap-1.5 hover:text-[#00AFB9] transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{company.phoneDisplay}</span>
            </a>
            <a
              href={company.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a
              href={`mailto:${company.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-[#00AFB9] transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{company.email}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
          <Logo />

          <form action="/products" method="get" className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                placeholder="Search processors, GPUs, laptops..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-[#00AFB9] focus:outline-none focus:ring-2 focus:ring-[#00AFB9]/20"
              />
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link href="/products" className="hover:text-[#00AFB9] transition-colors">
              All Products
            </Link>
            <Link href="/categories" className="hover:text-[#00AFB9] transition-colors">
              Categories
            </Link>
            <Link href="/about" className="hover:text-[#00AFB9] transition-colors">
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-lg bg-[#00AFB9] px-4 py-2 text-white hover:bg-[#009AA3] transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <details className="lg:hidden relative">
            <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-slate-100">
              <Menu className="h-6 w-6 text-slate-700 open:hidden" />
              <span className="sr-only">Open menu</span>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg p-4 z-50">
              <nav className="flex flex-col gap-3 text-sm font-medium">
                <Link href="/products" className="py-2 hover:text-[#00AFB9]">All Products</Link>
                <Link href="/categories" className="py-2 hover:text-[#00AFB9]">Categories</Link>
                <Link href="/about" className="py-2 hover:text-[#00AFB9]">About</Link>
                <Link href="/contact" className="py-2 text-[#00AFB9] font-semibold">Contact Us</Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
