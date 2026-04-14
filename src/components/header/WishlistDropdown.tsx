"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { getProducts, type Product } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectHasRehydrated } from "@/store/rehydration";
import { removeId, selectWishlistIds } from "@/store/wishlistSlice";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WishlistDropdown({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const rehydrated = useAppSelector(selectHasRehydrated);
  const ids = useAppSelector(selectWishlistIds);

  const { data: allProducts, isPending } = useQuery({
    queryKey: queryKeys.products,
    queryFn: getProducts,
    enabled: open && ids.length > 0,
  });

  const items = useMemo(() => {
    if (!allProducts?.length || ids.length === 0) return [];
    const map = new Map(allProducts.map((p) => [p.id, p]));
    return ids
      .map((id) => map.get(id))
      .filter((p): p is Product => p != null);
  }, [allProducts, ids]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="wishlist-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wishlist-dropdown-title"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full z-60 mt-2 w-[min(22rem,calc(100vw-1.5rem))] origin-top-right overflow-hidden rounded-2xl border border-app-border bg-app-bg shadow-xl"
        >
          <div className="flex items-center gap-2 border-b border-app-border/80 px-4 py-3">
            <Heart
              className="size-5 shrink-0 text-app-accent"
              strokeWidth={1.75}
              aria-hidden
            />
            <h2
              id="wishlist-dropdown-title"
              className="text-sm font-semibold text-app-text"
            >
              Wishlist
            </h2>
            {rehydrated && ids.length > 0 && (
              <span className="ml-auto rounded-full bg-app-surface px-2 py-0.5 text-xs font-medium tabular-nums text-app-muted">
                {ids.length}
              </span>
            )}
          </div>

          <div className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain px-2 py-2">
            {!rehydrated && ids.length > 0 ? (
              <ul className="space-y-2" aria-hidden>
                {ids.slice(0, 4).map((id) => (
                  <li
                    key={id}
                    className="flex gap-3 rounded-xl border border-transparent p-2"
                  >
                    <div className="size-14 shrink-0 animate-pulse rounded-lg bg-app-skeleton" />
                    <div className="min-w-0 flex-1 space-y-2 py-0.5">
                      <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-app-skeleton" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : ids.length === 0 ? (
              <div className="px-4 py-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-app-surface">
                    <Heart className="size-6 text-app-muted" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-semibold text-app-text">
                    Your wishlist is empty
                  </p>
                  <p className="mt-2 max-w-60 text-xs leading-relaxed text-app-muted">
                    Save products from any product page — they&apos;ll appear
                    here.
                  </p>
                </div>
                <Link
                  href="/#catalog"
                  onClick={onClose}
                  className="mt-6 flex min-h-11 w-full items-center justify-center rounded-xl bg-app-accent px-4 text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Browse catalog
                </Link>
              </div>
            ) : isPending ? (
              <ul className="space-y-2" aria-hidden>
                {ids.slice(0, 4).map((id) => (
                  <li
                    key={id}
                    className="flex gap-3 rounded-xl border border-transparent p-2"
                  >
                    <div className="size-14 shrink-0 animate-pulse rounded-lg bg-app-skeleton" />
                    <div className="min-w-0 flex-1 space-y-2 py-0.5">
                      <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-app-skeleton" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm leading-relaxed text-app-muted">
                Some items could not be loaded. Try removing stale entries from
                your wishlist.
              </p>
            ) : (
              <ul className="space-y-1">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="group flex gap-2 rounded-xl border border-transparent p-2 transition hover:border-app-border/80 hover:bg-app-surface/80"
                  >
                    <Link
                      href={`/product/${item.id}`}
                      onClick={onClose}
                      className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-app-surface"
                    >
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${item.id}`}
                        onClick={onClose}
                        className="line-clamp-2 text-left text-sm font-medium leading-snug text-app-text hover:text-app-accent"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-xs tabular-nums text-app-muted">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch(removeId(item.id))}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-app-muted opacity-80 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      aria-label={`Remove from wishlist: ${item.title}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {rehydrated && ids.length > 0 && items.length > 0 && (
            <div className="border-t border-app-border/80 bg-app-surface/50 px-3 py-2.5">
              <Link
                href="/#catalog"
                onClick={onClose}
                className="flex min-h-10 w-full items-center justify-center rounded-xl text-xs font-semibold text-app-accent transition hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
