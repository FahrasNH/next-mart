"use client";

import { cn } from "@/lib/utils";

type Props = {
  count: number;
  className?: string;
};

/** Badge angka inline untuk teks menu (mis. Cart) */
export function NavTextBadge({ count, className }: Props) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-app-accent px-1.5 text-[10px] font-bold leading-none text-white tabular-nums",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
