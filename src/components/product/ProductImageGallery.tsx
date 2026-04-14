"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
  className?: string;
};

export function ProductImageGallery({ images, alt, className }: Props) {
  const safe = images.length > 0 ? images : [""];
  const [index, setIndex] = useState(0);
  const last = Math.max(0, safe.length - 1);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        const n = i + dir;
        if (n < 0) return last;
        if (n > last) return 0;
        return n;
      });
    },
    [last]
  );

  useEffect(() => {
    if (index > last) setIndex(0);
  }, [index, last]);

  const active = safe[Math.min(index, last)]!;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-app-border bg-app-surface lg:aspect-square">
        <Image
          src={active}
          alt={alt}
          fill
          className="object-contain p-4 sm:p-8"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-app-border bg-app-bg/95 text-app-text shadow-sm backdrop-blur transition hover:bg-app-surface"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-app-border bg-app-bg/95 text-app-text shadow-sm backdrop-blur transition hover:bg-app-surface"
          aria-label="Next image"
        >
          <ChevronRight className="size-5" />
        </button>

        <span className="absolute bottom-4 right-4 rounded-md bg-app-text/80 px-2.5 py-1 text-xs font-medium tabular-nums text-white">
          {index + 1} / {safe.length}
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
        {safe.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-app-surface transition sm:h-24 sm:w-24",
              "border-2 border-app-border",
              i === index &&
                "border-app-text shadow-[inset_0_0_0_2px_#ffffff]"
            )}
            aria-label={`View image ${i + 1}`}
            aria-current={i === index}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-contain p-1.5"
              sizes="96px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
