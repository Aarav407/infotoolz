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
} from "lucide-react";
import { Category } from "@/types/product";

const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu className="h-7 w-7" />,
  gpu: <Monitor className="h-7 w-7" />,
  motherboard: <CircuitBoard className="h-7 w-7" />,
  memory: <MemoryStick className="h-7 w-7" />,
  storage: <HardDrive className="h-7 w-7" />,
  monitor: <Monitor className="h-7 w-7" />,
  psu: <Zap className="h-7 w-7" />,
  cabinet: <Box className="h-7 w-7" />,
  laptop: <Laptop className="h-7 w-7" />,
  peripheral: <Keyboard className="h-7 w-7" />,
  network: <Wifi className="h-7 w-7" />,
  desktop: <Monitor className="h-7 w-7" />,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center hover:border-blue-300 hover:shadow-md transition-all duration-200"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {iconMap[category.icon]}
      </div>
      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
        {category.name}
      </h3>
      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{category.description}</p>
      <p className="mt-2 text-xs font-medium text-blue-600">
        {category.productCount}+ Products
      </p>
    </Link>
  );
}
