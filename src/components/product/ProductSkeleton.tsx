"use client";

import { cn } from "@/lib/utils";
import { ProductGridContainer } from "./ProductGrid";
import type { ViewMode } from "./SortBar";

export function ProductSkeleton({
  className,
  layout = "grid",
}: {
  className?: string;
  layout?: ViewMode;
}) {
  const isList = layout === "list";

  if (isList) {
    return (
      <div
        className={cn(
          "flex flex-col gap-0 overflow-hidden rounded-xl border border-app-border bg-app-bg sm:flex-row",
          className
        )}
      >
        <div className="aspect-4/3 w-full shrink-0 animate-pulse bg-app-skeleton sm:w-48" />
        <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-app-skeleton" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-app-skeleton" />
            <div className="h-3 w-16 animate-pulse rounded bg-app-skeleton" />
            <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
          </div>
          <div className="mt-4 flex justify-between border-t border-app-border pt-4">
            <div className="h-8 w-24 animate-pulse rounded bg-app-skeleton" />
            <div className="h-4 w-14 animate-pulse rounded bg-app-skeleton" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-app-border bg-app-bg",
        className
      )}
    >
      <div className="aspect-4/3 animate-pulse rounded-t-xl bg-app-skeleton" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-app-skeleton" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-app-skeleton" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-app-skeleton" />
        <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
        <div className="mt-4 flex justify-between border-t border-app-border pt-4">
          <div className="h-10 w-28 animate-pulse rounded bg-app-skeleton" />
          <div className="h-4 w-16 animate-pulse rounded bg-app-skeleton" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 12,
  layout = "grid",
}: {
  count?: number;
  layout?: ViewMode;
}) {
  return (
    <ProductGridContainer layout={layout}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} layout={layout} />
      ))}
    </ProductGridContainer>
  );
}
