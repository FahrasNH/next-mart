"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ItemProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

/** Accordion tunggal (bisa dipakai di tempat lain) */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: ItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-app-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full touch-manipulation items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-app-text transition hover:text-app-accent sm:px-5"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-app-muted transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-0 text-sm leading-relaxed text-app-muted sm:px-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

type GroupProps = {
  children: ReactNode;
  className?: string;
};

export function AccordionGroup({ children, className }: GroupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-app-border bg-app-bg",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Satu panel terbuka; yang lain tertutup. Chevron kanan = tutup, bawah = buka. Tanpa border luar. */
export function ExclusiveAccordion({
  items,
  className,
}: {
  items: { id: string; title: string; children: ReactNode }[];
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={cn("divide-y divide-app-border", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full touch-manipulation items-center justify-between gap-3 py-4 text-left text-sm font-semibold text-app-text transition hover:text-app-accent"
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              {isOpen ? (
                <ChevronDown
                  className="size-5 shrink-0 text-app-muted"
                  aria-hidden
                />
              ) : (
                <ChevronRight
                  className="size-5 shrink-0 text-app-muted"
                  aria-hidden
                />
              )}
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-4 text-sm leading-relaxed text-app-muted">
                  {item.children}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
