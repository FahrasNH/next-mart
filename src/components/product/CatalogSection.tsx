"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts, type Product } from "@/lib/api";
import { buildPriceBuckets } from "@/lib/priceBuckets";
import { queryKeys } from "@/lib/queryKeys";
import { CatalogEmptyState } from "@/components/catalog/CatalogEmptyState";
import { CatalogHero } from "@/components/catalog/CatalogHero";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { ProductGrid, ProductGridContainer } from "./ProductGrid";
import { ProductGridSkeleton } from "./ProductSkeleton";
import { SortBar, type SortValue, type ViewMode } from "./SortBar";

const PAGE_SIZE = 12;
const SKELETON_COUNT = 12;

function sortProducts(products: Product[], sort: SortValue): Product[] {
  const copy = [...products];
  if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  else copy.sort((a, b) => b.rating.rate - a.rating.rate);
  return copy;
}

function formatSectionTitle(category: string | null): string {
  if (!category) return "All products";
  const words = category.split(" ");
  const titled = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return `${titled} products`;
}

export function CatalogSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortValue>("price-asc");
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [globalPriceMin, setGlobalPriceMin] = useState(0);
  const [globalPriceMax, setGlobalPriceMax] = useState(1000);
  const [selectedPriceBucketIds, setSelectedPriceBucketIds] = useState<string[]>(
    []
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.products,
    queryFn: getProducts,
  });

  const priceBuckets = useMemo(
    () => buildPriceBuckets(globalPriceMin, globalPriceMax, 4),
    [globalPriceMin, globalPriceMax]
  );

  useEffect(() => {
    if (!data?.length) return;
    const prices = data.map((p) => p.price);
    const mn = Math.floor(Math.min(...prices));
    const mx = Math.ceil(Math.max(...prices));
    setGlobalPriceMin(mn);
    setGlobalPriceMax(mx);
    setSelectedPriceBucketIds([]);
  }, [data]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, sort, selectedPriceBucketIds, view, searchParams]);

  const handlePriceBucketToggle = useCallback((id: string) => {
    setSelectedPriceBucketIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }, []);

  const sorted = useMemo(
    () => (data ? sortProducts(data, sort) : []),
    [data, sort]
  );

  const filtered = useMemo(() => {
    let list = sorted;
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedPriceBucketIds.length > 0) {
      const selectedBuckets = priceBuckets.filter((bucket) =>
        selectedPriceBucketIds.includes(bucket.id)
      );
      list = list.filter((p) =>
        selectedBuckets.some(
          (bucket) => p.price >= bucket.min && p.price <= bucket.max
        )
      );
    }
    const q = (searchParams.get("q") ?? "").trim().toLowerCase();
    if (q.length > 0) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    return list;
  }, [sorted, selectedCategory, selectedPriceBucketIds, priceBuckets, searchParams]);

  const visibleProducts = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const hasMore = visibleCount < filtered.length;
  const sectionTitle = formatSectionTitle(selectedCategory);

  const searchActive = (searchParams.get("q") ?? "").trim().length > 0;

  const clearSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const qs = params.toString();
    router.replace(qs.length > 0 ? `/?${qs}#catalog` : "/#catalog");
  }, [router, searchParams]);

  const filterProps = {
    selectedCategory,
    onCategoryChange: (category: string | null) => {
      setSelectedCategory(category);
      setMobileFiltersOpen(false);
    },
    priceBuckets,
    selectedPriceBucketIds,
    onPriceBucketToggle: handlePriceBucketToggle,
  };

  return (
    <>
      <CatalogHero />

      <div
        id="catalog"
        className="mx-auto w-full min-w-0 max-w-7xl scroll-mt-24 px-4 pb-10 pt-8 sm:px-6 xl:min-w-7xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <h2 className="text-lg font-semibold text-app-text">
            {sectionTitle}
          </h2>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="touch-manipulation inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-app-border bg-app-bg px-4 py-2.5 text-sm font-medium text-app-text"
          >
            <SlidersHorizontal className="size-4" />
            Filter
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-20">
              <FilterSidebar {...filterProps} />
            </div>
          </div>

          <div className="min-w-0 flex-1 basis-0">
            <div className="mb-6 hidden flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex">
              <h2 className="text-xl font-semibold text-app-text">
                {sectionTitle}
              </h2>
              <SortBar
                sort={sort}
                onSortChange={setSort}
                view={view}
                onViewChange={setView}
              />
            </div>

            <div className="mb-6 flex flex-col gap-4 lg:hidden">
              <SortBar
                sort={sort}
                onSortChange={setSort}
                view={view}
                onViewChange={setView}
              />
            </div>

            {isPending && (
              <ProductGridSkeleton count={SKELETON_COUNT} layout={view} />
            )}

            {isError && (
              <div
                className="w-full min-w-0 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
                role="alert"
              >
                {error instanceof Error
                  ? error.message
                  : "Gagal memuat produk."}
              </div>
            )}

            {!isPending && !isError && data && (
              <>
                {filtered.length === 0 ? (
                  <ProductGridContainer layout={view}>
                    <div
                      className={
                        view === "grid" || view === "grid-compact"
                          ? "col-span-full min-w-0 self-stretch"
                          : "min-w-0 self-stretch"
                      }
                    >
                      <CatalogEmptyState
                        hasSearch={searchActive}
                        onClearSearch={
                          searchActive ? clearSearch : undefined
                        }
                      />
                    </div>
                  </ProductGridContainer>
                ) : (
                  <>
                    <ProductGrid
                      products={visibleProducts}
                      layout={view}
                    />
                    {hasMore && (
                      <div className="mt-10 flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleCount((c) => c + PAGE_SIZE)
                          }
                          className="touch-manipulation min-h-12 rounded-full border border-app-border bg-app-bg px-10 text-sm font-medium text-app-text transition hover:bg-app-surface"
                        >
                          Show more products
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              key="filter-backdrop"
              role="presentation"
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="filter-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filters-title"
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[min(85vh,520px)] flex-col rounded-t-2xl border border-app-border bg-app-bg shadow-2xl lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 380 }}
            >
              <div className="flex shrink-0 justify-center pb-1 pt-3">
                <span className="h-1.5 w-12 rounded-full bg-app-border" />
              </div>
              <div className="flex items-center justify-between border-b border-app-border px-4 pb-3 pt-1">
                <h2
                  id="mobile-filters-title"
                  className="text-base font-semibold text-app-text"
                >
                  Filters
                </h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="touch-manipulation flex min-h-11 min-w-11 items-center justify-center rounded-lg text-app-muted hover:bg-app-surface"
                  aria-label="Tutup"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-2">
                <FilterSidebar
                  {...filterProps}
                  className="border-0 shadow-none"
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
