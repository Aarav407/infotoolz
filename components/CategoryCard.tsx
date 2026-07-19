import Link from "next/link";
import {
  Monitor,
  Cpu,
  HardDrive,
  Laptop,
  Keyboard,
  Wifi,
  Box,
  Zap,
  MemoryStick,
  CircuitBoard,
  Network,
  Server,
} from "lucide-react";
import { Category } from "@/types/product";
import { getChildCategories } from "@/data/categories";

const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu className="h-7 w-7" />,
  gpu: <Monitor className="h-7 w-7" />,
  motherboard: <CircuitBoard className="h-7 w-7" />,
  memory: <MemoryStick className="h-7 w-7" />,
  storage: <HardDrive className="h-7 w-7" />,
  ssd: <HardDrive className="h-7 w-7" />,
  hdd: <HardDrive className="h-7 w-7" />,
  monitor: <Monitor className="h-7 w-7" />,
  psu: <Zap className="h-7 w-7" />,
  cabinet: <Box className="h-7 w-7" />,
  laptop: <Laptop className="h-7 w-7" />,
  peripheral: <Keyboard className="h-7 w-7" />,
  network: <Wifi className="h-7 w-7" />,
  switch: <Network className="h-7 w-7" />,
  nas: <HardDrive className="h-7 w-7" />,
  server: <Server className="h-7 w-7" />,
  desktop: <Monitor className="h-7 w-7" />,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const childCategories = getChildCategories(category.slug);

  return (
    <div className="group flex h-full flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center hover:border-[#00AFB9]/40 hover:shadow-md transition-all duration-200">
      <Link
        href={`/categories/${category.slug}`}
        className="flex flex-col items-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00AFB9]/10 text-[#00AFB9] group-hover:bg-[#00AFB9] group-hover:text-white transition-colors">
          {iconMap[category.icon]}
        </div>
        <h3 className="font-semibold text-slate-900 group-hover:text-[#00AFB9] transition-colors">
          {category.name}
        </h3>
        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{category.description}</p>
      </Link>

      {childCategories.length > 0 && (
        <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-1.5">
          {childCategories.map((child) => (
            <Link
              key={child.slug}
              href={`/categories/${child.slug}`}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#00AFB9] hover:bg-[#00AFB9]/10 hover:text-[#00AFB9]"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <Link
        href={`/categories/${category.slug}`}
        className="mt-2 text-xs font-medium text-[#00AFB9] hover:underline"
      >
        {category.productCount}+ Products
      </Link>
    </div>
  );
}
