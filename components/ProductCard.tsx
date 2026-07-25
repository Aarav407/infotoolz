import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg hover:border-[#00AFB9]/40 transition-all duration-200"
    >
      <div className="relative aspect-square bg-slate-50 p-4">
        {!product.inStock && (
          <span className="absolute top-3 right-3 z-10 rounded-md bg-slate-600 px-2 py-0.5 text-xs font-semibold text-white">
            Out of Stock
          </span>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-[#00AFB9] mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-[#00AFB9] transition-colors mb-2">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 mb-3">{product.category}</p>

        <div className="mt-auto">
          {product.inStock ? (
            <p className="text-xs text-green-600 font-medium">Available — contact for quote</p>
          ) : (
            <p className="text-xs text-red-500 font-medium">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
