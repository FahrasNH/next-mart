"use client";

import { ChevronDown, Grid2x2, LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortValue = "price-asc" | "price-desc" | "rating";
export type ViewMode = "grid" | "grid-compact" | "list";

type Props = {
  sort: SortValue;
  onSortChange: (v: SortValue) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
};

export function SortBar({ sort, onSortChange, view, onViewChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="inline-flex min-w-0 items-center gap-1.5 text-sm text-app-text">
        <div className="relative inline-flex min-h-9 items-center">
          <label htmlFor="catalog-sort" className="sr-only">
            Sort products
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortValue)}
            className={cn(
              "touch-manipulation cursor-pointer appearance-none bg-transparent py-1.5 pl-1 pr-7",
              "text-sm font-medium text-app-text",
              "min-h-9 min-w-0 max-w-[min(100vw-8rem,16rem)] truncate sm:max-w-none",
              "border-0 outline-none focus:ring-0"
            )}
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-app-text"
            aria-hidden
          />
        </div>
      </div>

      <div
        className="flex items-stretch overflow-hidden rounded-lg border border-app-border"
        role="group"
        aria-label="View"
      >
        <button
          type="button"
          onClick={() => onViewChange("grid")}
          className={cn(
            "touch-manipulation flex min-h-8 min-w-8 cursor-pointer items-center justify-center px-2.5 transition",
            view === "grid"
              ? "bg-slate-100 text-app-accent"
              : "bg-transparent text-app-muted hover:text-app-text"
          )}
          aria-pressed={view === "grid"}
          aria-label="Grid — 3 columns"
        >
          <LayoutGrid className="size-4" strokeWidth={1.75} />
        </button>
        <span
          className="w-px shrink-0 bg-app-border"
          aria-hidden
        />
        <button
          type="button"
          onClick={() => onViewChange("grid-compact")}
          className={cn(
            "touch-manipulation flex min-h-8 min-w-8 cursor-pointer items-center justify-center px-2.5 transition",
            view === "grid-compact"
              ? "bg-slate-100 text-app-accent"
              : "bg-transparent text-app-muted hover:text-app-text"
          )}
          aria-pressed={view === "grid-compact"}
          aria-label="Grid — 2 columns"
        >
          <Grid2x2 className="size-4" strokeWidth={1.75} />
        </button>
        <span className="w-px shrink-0 bg-app-border" aria-hidden />
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={cn(
            "touch-manipulation flex min-h-8 min-w-8 cursor-pointer items-center justify-center px-2.5 transition",
            view === "list"
              ? "bg-slate-100 text-app-accent"
              : "bg-transparent text-app-muted hover:text-app-text"
          )}
          aria-pressed={view === "list"}
          aria-label="List"
        >
          <LayoutList className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
