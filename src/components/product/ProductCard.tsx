"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

type Layout = "grid" | "list";

type Props = {
  product: Product;
  index?: number;
  layout?: Layout;
};

function StarRating({ rate }: { rate: number }) {
  const full = Math.min(5, Math.round(rate));
  return (
    <div
      className="flex gap-0.5 text-amber-400"
      aria-label={`Rating ${rate} of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "text-[13px] leading-none",
            i < full ? "text-amber-400" : "text-app-border"
          )}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function getBadge(product: Product): {
  label: string;
  className: string;
} | null {
  if (product.price < 100)
    return { label: "ECO", className: "bg-emerald-600 text-white" };
  if (product.rating.rate >= 4.5 && product.price < 50) {
    return { label: "BEST DEAL", className: "bg-amber-500 text-white" };
  }
  if (product.price >= 200) {
    return { label: "PREMIUM", className: "bg-app-accent text-white" };
  }
  return null;
}

export function ProductCard({
  product,
  index = 0,
  layout = "grid",
}: Props) {
  const isList = layout === "list";
  const badge = getBadge(product);

  const body = (
    <>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden bg-app-surface",
          isList
            ? "aspect-4/3 w-full rounded-t-xl sm:w-48 sm:rounded-l-xl sm:rounded-tr-none"
            : "aspect-4/3 w-full rounded-t-xl"
        )}
      >
        {badge && (
          <span
            className={cn(
              "absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              badge.className
            )}
          >
            {badge.label}
          </span>
        )}
        <Image
          src={product.image}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]",
            isList
              ? "rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
              : "rounded-t-xl"
          )}
          sizes={
            isList
              ? "(max-width: 639px) 100vw, 192px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col p-5",
          isList && "justify-between py-4 sm:py-5"
        )}
      >
        <div>
          <StarRating rate={product.rating.rate} />
          <h3 className="mt-2 line-clamp-2 text-base font-bold text-app-text">
            {product.title}
          </h3>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-app-muted">
            {product.category}
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-app-muted">
            {product.description}
          </p>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-app-border/60 pt-4">
          <div>
            <p className="text-xs text-app-muted">Starting at</p>
            <p className="text-xl font-bold tabular-nums text-app-text">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <span className="text-sm font-semibold text-app-accent">
            View &gt;
          </span>
        </div>
      </div>
    </>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        delay: index * 0.035,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "group overflow-hidden rounded-xl border border-app-border bg-app-bg shadow-sm",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-md"
      )}
    >
      <Link
        href={`/product/${product.id}`}
        className={cn(
          "flex min-w-0 flex-1 flex-col",
          isList && "flex-col sm:flex-row"
        )}
      >
        {body}
      </Link>
    </motion.article>
  );
}
