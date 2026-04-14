"use client";

import { Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function CatalogSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <label htmlFor="catalog-search" className="sr-only">
        Cari produk
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-app-muted" />
      <input
        id="catalog-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari berdasarkan nama produk…"
        autoComplete="off"
        className="min-h-12 w-full touch-manipulation rounded-xl border border-app-border bg-app-bg py-3 pl-11 pr-11 text-sm text-app-text placeholder:text-app-muted focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/20"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-lg text-app-muted hover:bg-app-surface hover:text-app-text"
          aria-label="Hapus pencarian"
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
}
