"use client";

import { PackageSearch } from "lucide-react";

type Props = {
  hasSearch: boolean;
  onClearSearch?: () => void;
};

export function CatalogEmptyState({ hasSearch, onClearSearch }: Props) {
  return (
    <div
      className="box-border w-full min-w-0 max-w-none rounded-2xl border border-dashed border-app-border bg-linear-to-b from-app-surface to-app-bg px-6 py-14 text-center"
      role="status"
    >
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-app-surface">
        <PackageSearch className="size-8 text-app-muted" />
      </div>
      <h3 className="text-lg font-semibold text-app-text">
        {hasSearch ? "No products match your search" : "No products found"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-app-muted">
        {hasSearch
          ? "Try a different keyword or clear the search to see all products."
          : "Adjust category or price filters, then try again."}
      </p>
      {hasSearch && onClearSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-6 min-h-11 rounded-full border border-app-border bg-app-bg px-6 text-sm font-medium text-app-text transition hover:bg-app-surface"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
