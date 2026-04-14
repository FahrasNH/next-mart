"use client";

import type { ReactNode } from "react";
import type { Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export type ProductGridLayout = "grid" | "grid-compact" | "list";

type Props = {
  products: Product[];
  layout?: ProductGridLayout;
};

/** Wrapper layout sama untuk grid produk, skeleton, dan empty state — lebar konsisten. */
export function ProductGridContainer({
  layout = "grid",
  children,
}: {
  layout?: ProductGridLayout;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        layout === "list"
          ? "flex min-w-0 w-full flex-col gap-3"
          : layout === "grid-compact"
            ? "grid min-h-0 w-full min-w-0 grid-cols-1 justify-items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-2"
            : "grid min-h-0 w-full min-w-0 grid-cols-1 justify-items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}

/**
 * §6 — grid 3 kolom desktop, 1–2 kolom mobile; opsi list view
 */
export function ProductGrid({ products, layout = "grid" }: Props) {
  const cardLayout = layout === "list" ? "list" : "grid";

  return (
    <ProductGridContainer layout={layout}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          index={i}
          layout={cardLayout}
        />
      ))}
    </ProductGridContainer>
  );
}
