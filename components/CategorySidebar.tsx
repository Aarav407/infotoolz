"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";
import { categoryIconMap, allProductsIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

function CategoryLink({
  href,
  icon,
  label,
  count,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
        active
          ? "bg-[#00AFB9]/10 text-[#00AFB9] font-medium"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-slate-400">{count}</span>
      )}
    </Link>
  );
}

function CategoryNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Browse
      </p>
      <ul className="space-y-0.5">
        <li>
          <CategoryLink
            href="/products"
            icon={allProductsIcon}
            label="All Products"
            active={pathname === "/products"}
          />
        </li>
        {categories.map((cat) => {
          const href = `/categories/${cat.slug}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={cat.slug}>
              <CategoryLink
                href={href}
                icon={categoryIconMap[cat.icon]}
                label={cat.name}
                count={cat.productCount}
                active={active}
              />
            </li>
          );
        })}
        <li className="pt-2 mt-2 border-t border-slate-200">
          <CategoryLink
            href="/categories"
            icon={allProductsIcon}
            label="View All Categories"
            active={pathname === "/categories"}
          />
        </li>
      </ul>
    </nav>
  );
}

export function CategorySidebar() {
  return (
    <>
      {/* Mobile: collapsible category list */}
      <details className="lg:hidden border-b border-slate-200 bg-white">
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-slate-900 list-none">
          Browse Categories
          <span className="text-xs font-normal text-slate-500">Tap to expand</span>
        </summary>
        <div className="px-2 pb-3 max-h-64 overflow-y-auto">
          <CategoryNav />
        </div>
      </details>

      {/* Desktop: left sidebar */}
      <aside className="hidden lg:block w-56 xl:w-60 shrink-0 border-r border-slate-200 bg-white">
        <div className="sticky top-36 py-6 px-2 max-h-[calc(100vh-9rem)] overflow-y-auto">
          <CategoryNav />
        </div>
      </aside>
    </>
  );
}
