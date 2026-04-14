"use client";

import { cn } from "@/lib/utils";

type Props = {
  count: number;
  className?: string;
};

/** Badge bulat navy di pojok kanan atas ikon (search / love / cart) */
export function HeaderIconBadge({ count, className }: Props) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        "pointer-events-none absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-app-accent px-1 text-[10px] font-bold leading-none text-white tabular-nums",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
