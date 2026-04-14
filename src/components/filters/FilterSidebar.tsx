"use client";

import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { getCategories } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { PriceBucket } from "@/lib/priceBuckets";
import { cn } from "@/lib/utils";

export type FilterSidebarProps = {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  priceBuckets: PriceBucket[];
  selectedPriceBucketIds: string[];
  onPriceBucketToggle: (id: string) => void;
  className?: string;
};

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceBuckets,
  selectedPriceBucketIds,
  onPriceBucketToggle,
  className,
}: FilterSidebarProps) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
  });

  return (
    <aside
      className={cn(
        "rounded-xl bg-app-bg p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 pb-4">
        <Filter className="size-4 text-app-accent" aria-hidden />
        <h2 className="text-base font-semibold text-app-text">Filters</h2>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-app-text">
          Product type
        </p>
        <ul className="mt-3 space-y-0">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange(null)}
              className={cn(
                "w-full border-b-2 py-2.5 text-left text-sm transition",
                selectedCategory === null
                  ? "border-app-accent font-semibold text-app-text"
                  : "border-transparent text-app-muted hover:text-app-text"
              )}
            >
              All products
            </button>
          </li>
          {isPending && (
            <li className="py-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-app-skeleton" />
            </li>
          )}
          {isError && (
            <li className="py-2 text-xs text-red-600" role="alert">
              {error instanceof Error
                ? error.message
                : "Failed to load categories."}
            </li>
          )}
          {data &&
            data.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  className={cn(
                    "w-full border-b-2 py-2.5 text-left text-sm capitalize transition",
                    selectedCategory === cat
                      ? "border-app-accent font-semibold text-app-text"
                      : "border-transparent text-app-muted hover:text-app-text"
                  )}
                >
                  {cat}
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div className="mt-8 border-t border-app-border pt-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-app-text">
          Price range
        </p>
        <ul className="mt-3 space-y-1">
          {priceBuckets.map((b) => (
            <li key={b.id}>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg py-2.5 pl-0 pr-1 hover:bg-app-surface/80">
                <span className="text-sm text-app-muted">{b.label}</span>
                <input
                  type="checkbox"
                  checked={selectedPriceBucketIds.includes(b.id)}
                  onChange={() => onPriceBucketToggle(b.id)}
                  className="size-4 accent-app-accent"
                />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
