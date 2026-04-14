"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/cartSlice";
import { toggleId } from "@/store/wishlistSlice";
import { ExclusiveAccordion } from "@/components/ui/Accordion";
import { ProductImageGallery } from "./ProductImageGallery";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import { RelatedProducts } from "./RelatedProducts";

type Props = {
  productId: string;
};

const pageEnter = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

function formatCategory(slug: string): string {
  return slug
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function ProductDetail({ productId }: Props) {
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState(1);
  const [addFeedback, setAddFeedback] = useState(false);
  const [wishlistFlash, setWishlistFlash] = useState<"add" | "remove" | null>(
    null
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.product(productId),
    queryFn: () => getProduct(productId),
  });

  const inWishlist = useAppSelector((state) =>
    data ? state.wishlist.ids.includes(data.id) : false
  );

  const galleryImages = useMemo(() => {
    if (!data?.image) return [];
    return Array.from({ length: 4 }, () => data.image);
  }, [data?.image]);

  const listPrice = useMemo(() => {
    if (!data) return 0;
    return Math.round(data.price * 1.12 * 100) / 100;
  }, [data]);

  const handleAdd = () => {
    if (!data) return;
    dispatch(
      addItem({
        id: data.id,
        title: data.title,
        price: data.price,
        image: data.image,
        qty,
      })
    );
    setAddFeedback(true);
    window.setTimeout(() => setAddFeedback(false), 450);
    toast.success(
      qty > 1 ? `${qty} items added to cart` : "Added to cart"
    );
  };

  const decQty = () => setQty((q) => Math.max(1, q - 1));
  const incQty = () => setQty((q) => Math.min(99, q + 1));

  return (
    <motion.main
      initial={pageEnter.initial}
      animate={pageEnter.animate}
      transition={pageEnter.transition}
      className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:py-10"
    >
      {isPending && <ProductDetailSkeleton />}

      {isError && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
          role="alert"
        >
          {error instanceof Error ? error.message : "Product not found."}
        </div>
      )}

      {data && !isPending && (
        <>
          <nav
            className="mb-8 text-sm text-app-muted"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
              <li>
                <Link href="/" className="transition hover:text-app-accent">
                  Home
                </Link>
              </li>
              <li className="flex items-center" aria-hidden>
                <ChevronRight className="mx-0.5 size-3.5 text-app-border" />
              </li>
              <li>
                <Link
                  href="/#catalog"
                  className="transition hover:text-app-accent"
                >
                  Inventory
                </Link>
              </li>
              <li className="flex items-center" aria-hidden>
                <ChevronRight className="mx-0.5 size-3.5 text-app-border" />
              </li>
              <li className="max-w-[min(100%,36rem)] truncate font-medium text-app-text">
                {data.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="min-w-0">
              <ProductImageGallery images={galleryImages} alt={data.title} />
            </div>

            <div className="flex min-w-0 flex-col">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-app-accent sm:text-4xl">
                {data.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-app-muted sm:text-lg">
                {data.description}
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold tabular-nums text-app-text sm:text-4xl">
                  ${data.price.toFixed(2)}
                </span>
                <span className="text-lg text-app-muted line-through tabular-nums">
                  ${listPrice.toFixed(2)}
                </span>
              </div>

              <p className="mt-4 text-sm text-app-muted">
                <span className="font-medium text-app-text">
                  ★ {data.rating.rate.toFixed(1)}
                </span>
                <span className="text-app-border"> · </span>
                {data.rating.count} reviews
                <span className="text-app-border"> · </span>
                <span className="capitalize">{formatCategory(data.category)}</span>
                <span className="text-app-border"> · </span>
                In stock
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-app-text">
                  {formatCategory(data.category)}
                </span>
                {data.rating.rate >= 4.5 && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                    Top rated
                  </span>
                )}
              </div>

              <div className="mt-8 flex w-full flex-wrap items-stretch gap-3">
                <div className="inline-flex shrink-0 items-center rounded-xl border border-app-border bg-app-bg">
                  <button
                    type="button"
                    onClick={decQty}
                    className="touch-manipulation flex min-h-11 min-w-11 items-center justify-center rounded-l-xl text-app-text transition hover:bg-app-surface"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm font-semibold tabular-nums text-app-text">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={incQty}
                    className="touch-manipulation flex min-h-11 min-w-11 items-center justify-center rounded-r-xl text-app-text transition hover:bg-app-surface"
                    aria-label="Increase quantity"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <motion.button
                  type="button"
                  onClick={() => {
                    if (!data) return;
                    const next = !inWishlist;
                    dispatch(toggleId(data.id));
                    setWishlistFlash(next ? "add" : "remove");
                    window.setTimeout(() => setWishlistFlash(null), 450);
                    toast.message(
                      next ? "Saved to wishlist" : "Removed from wishlist"
                    );
                  }}
                  whileTap={{ scale: 0.985 }}
                  animate={
                    wishlistFlash
                      ? { scale: [1, 1.05, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.42, ease: "easeOut" }}
                  className={cn(
                    "touch-manipulation inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-[colors,box-shadow]",
                    inWishlist
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-app-border bg-app-bg text-app-text hover:bg-app-surface",
                    wishlistFlash === "add" &&
                      "ring-2 ring-rose-200/90 ring-offset-2 ring-offset-app-bg",
                    wishlistFlash === "remove" &&
                      "ring-2 ring-app-border/60 ring-offset-2 ring-offset-app-bg"
                  )}
                  aria-pressed={inWishlist}
                >
                  <Heart
                    className={cn("size-5 shrink-0", inWishlist && "fill-current")}
                    aria-hidden
                  />
                  Wishlist
                </motion.button>
              </div>

              <motion.button
                type="button"
                onClick={handleAdd}
                whileTap={{ scale: 0.995 }}
                animate={addFeedback ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "mt-4 w-full rounded-xl py-4 text-sm font-semibold text-white shadow-sm transition-colors",
                  "bg-app-accent hover:opacity-95",
                  addFeedback && "bg-emerald-700 hover:bg-emerald-700"
                )}
              >
                Add to cart
              </motion.button>

              <div className="mt-10 text-sm">
                <div className="flex justify-between gap-4 py-3 first:pt-0">
                  <span className="text-app-muted">SKU</span>
                  <span className="font-medium tabular-nums text-app-text">
                    NM-{String(data.id).padStart(5, "0")}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <span className="text-app-muted">Product ID</span>
                  <span className="font-medium tabular-nums text-app-text">
                    {data.id}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <span className="text-app-muted">Location</span>
                  <span className="max-w-[60%] text-right font-medium text-app-text">
                    NextMart Fulfillment · Jakarta
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-app-border/80">
                <ExclusiveAccordion
                  items={[
                    {
                      id: "additional",
                      title: "Additional info",
                      children: (
                        <p>
                          Shipped from authorized Fake Store API partners.
                          Authenticity per seller policy. Returns within 7 days
                          for manufacturing defects.
                        </p>
                      ),
                    },
                    {
                      id: "details",
                      title: "Details",
                      children: (
                        <p className="whitespace-pre-wrap">{data.description}</p>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <RelatedProducts productId={data.id} category={data.category} />
        </>
      )}
    </motion.main>
  );
}
