"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { ProductCard } from "./ProductCard";

type Props = {
  productId: number;
  category: string;
};

export function RelatedProducts({ productId, category }: Props) {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.products,
    queryFn: getProducts,
  });

  const related = useMemo(() => {
    if (!data?.length) return [];
    return data
      .filter((p) => p.category === category && p.id !== productId)
      .slice(0, 3);
  }, [data, category, productId]);

  if (isPending) {
    return (
      <section className="mt-16 border-t border-app-border pt-12 lg:mt-20 lg:pt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="h-8 w-48 animate-pulse rounded bg-app-skeleton" />
          <div className="h-5 w-28 animate-pulse rounded bg-app-skeleton" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-app-border bg-app-bg"
            >
              <div className="aspect-[4/3] animate-pulse bg-app-skeleton" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-app-skeleton" />
                <div className="h-8 w-24 animate-pulse rounded bg-app-skeleton" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-app-border pt-12 lg:mt-20 lg:pt-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight text-app-text sm:text-2xl">
          You might also like
        </h2>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-semibold text-app-accent transition hover:underline"
        >
          Browse catalog
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
