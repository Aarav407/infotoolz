import Link from "next/link";
import { ArrowRight, Shield, Truck, Headphones, BadgeCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-[#00AFB9] blur-3xl" />
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-[#00AFB9] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-[#00AFB9]/20 border border-[#00AFB9]/30 px-4 py-1 text-sm font-medium text-[#00AFB9] mb-6">
            Authorized IT Hardware Reseller
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Your Complete IT Hardware{" "}
            <span className="text-[#00AFB9]">Catalog</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Browse our extensive range of processors, graphics cards, laptops,
            storage, monitors, and more — all genuine products from top global brands.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-[#00AFB9] px-6 py-3 font-semibold hover:bg-[#009AA3] transition-colors"
            >
              Browse All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold hover:bg-white/10 transition-colors"
            >
              View Categories
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BadgeCheck, label: "Genuine Products", sub: "100% Authentic" },
            { icon: Shield, label: "Authorized Dealer", sub: "Brand Partners" },
            { icon: Truck, label: "Pan-India Supply", sub: "Bulk & Retail" },
            { icon: Headphones, label: "Expert Support", sub: "IT Specialists" },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="rounded-xl bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
            >
              <Icon className="h-6 w-6 text-[#00AFB9] mb-2" />
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
