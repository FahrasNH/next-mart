"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  decrement,
  increment,
  removeItem,
  selectCartItems,
  selectCartTotal,
} from "@/store/cartSlice";
import { selectHasRehydrated } from "@/store/rehydration";

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Right sidebar mini-cart */
export function MiniCartDrawer({ open, onClose }: Props) {
  const rehydrated = useAppSelector(selectHasRehydrated);
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="mini-cart-backdrop"
            role="presentation"
            className="fixed inset-0 z-[100] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            key="mini-cart-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mini-cart-title"
            className="fixed inset-y-0 right-0 z-[101] flex w-full max-w-md flex-col border-l border-app-border bg-app-bg shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 380 }}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-app-border px-4 py-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-5 text-app-accent" />
                <h2
                  id="mini-cart-title"
                  className="text-base font-semibold text-app-text"
                >
                  Cart
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-app-muted transition hover:bg-app-surface"
                aria-label="Close cart"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
              {!rehydrated ? (
                <div className="space-y-3 py-4" aria-hidden>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="size-16 shrink-0 animate-pulse rounded-lg bg-app-skeleton" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
                        <div className="h-4 w-1/3 animate-pulse rounded bg-app-skeleton" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-app-surface">
                    <ShoppingBag className="size-7 text-app-muted" />
                  </div>
                  <p className="text-sm font-medium text-app-text">
                    Your cart is empty
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-app-muted">
                    Add items from the catalog — they&apos;ll show up here.
                  </p>
                  <Link
                    href="/"
                    onClick={onClose}
                    className="mt-5 flex min-h-11 items-center justify-center rounded-full bg-app-accent px-6 text-sm font-medium text-white"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-app-border p-2"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-app-surface">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${item.id}`}
                          onClick={onClose}
                          className="line-clamp-2 text-sm font-medium text-app-text"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-app-muted">
                          ${item.price.toFixed(2)} × {item.qty}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            className="min-h-9 min-w-9 rounded-md border border-app-border text-sm text-app-text"
                            onClick={() => dispatch(decrement(item.id))}
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm tabular-nums text-app-text">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            className="min-h-9 min-w-9 rounded-md border border-app-border text-sm text-app-text"
                            onClick={() => dispatch(increment(item.id))}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="ml-auto text-xs text-red-600"
                            onClick={() => dispatch(removeItem(item.id))}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {rehydrated && items.length > 0 && (
              <div className="shrink-0 border-t border-app-border bg-app-surface px-4 py-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-app-muted">Subtotal</span>
                  <span className="text-lg font-semibold tabular-nums text-app-text">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-app-accent text-sm font-semibold text-white transition hover:opacity-95"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
