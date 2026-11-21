import Image from "next/image";
import HighlightText from "./HighlightText";
import { Product } from "@prisma/client";

interface Props {
  product: Product;
  query?: string;
  active?: boolean;
  onSelect: (product: Product) => void;
  onHover?: () => void;
}

const SearchResultItem = ({
  product,
  query = "",
  active = false,
  onSelect,
  onHover,
}: Props) => {
  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={onHover}
      className={`
        flex cursor-pointer items-center gap-3 px-4 py-3
        transition-colors
        ${active ? "bg-green-100" : "hover:bg-gray-50"}
      `}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-800">
          <HighlightText text={product.title} query={query} />
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="truncate text-xs text-gray-500">
            {product.brand}
          </span>

          <span className="text-xs text-gray-300">•</span>

          <span className="truncate text-xs text-gray-500">
            {product.medicineType}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-green-600">
          ৳{product.price.toFixed(2)}
        </p>

        {product.stock <= 0 ? (
          <span className="text-xs text-red-500">Out of stock</span>
        ) : product.stock < 10 ? (
          <span className="text-xs text-orange-500">{product.stock} left</span>
        ) : (
          <span className="text-xs text-green-600">In stock</span>
        )}
      </div>
    </div>
  );
};

export default SearchResultItem;
