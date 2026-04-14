"use client";

export function ProductDetailSkeleton() {
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-app-skeleton" />
        <div className="h-4 w-2 animate-pulse rounded bg-app-skeleton" />
        <div className="h-4 w-10 animate-pulse rounded bg-app-skeleton" />
        <div className="h-4 w-2 animate-pulse rounded bg-app-skeleton" />
        <div className="h-4 w-48 max-w-full animate-pulse rounded bg-app-skeleton" />
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-app-border bg-app-surface lg:aspect-square">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-app-skeleton to-app-border" />
          </div>
          <div className="flex gap-2 sm:gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-app-skeleton sm:h-24 sm:w-24"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5 pt-1">
          <div className="h-10 w-full max-w-xl animate-pulse rounded-lg bg-app-skeleton" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
            <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-app-skeleton" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-32 animate-pulse rounded-lg bg-app-skeleton" />
            <div className="h-11 w-24 animate-pulse rounded-lg bg-app-skeleton" />
          </div>
          <div className="h-14 w-full max-w-[11rem] animate-pulse rounded-xl bg-app-skeleton" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-app-skeleton" />
          <div className="space-y-3 border-t border-app-border pt-8">
            <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
            <div className="h-4 w-full animate-pulse rounded bg-app-skeleton" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-app-skeleton" />
          </div>
          <div className="h-32 animate-pulse rounded-xl bg-app-skeleton" />
        </div>
      </div>

      <div className="mt-16 border-t border-app-border pt-12">
        <div className="mb-8 h-8 w-56 animate-pulse rounded bg-app-skeleton" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-app-border bg-app-bg"
            >
              <div className="aspect-[4/3] animate-pulse bg-app-skeleton" />
              <div className="space-y-2 p-5">
                <div className="h-4 w-3/4 animate-pulse rounded bg-app-skeleton" />
                <div className="h-8 w-24 animate-pulse rounded bg-app-skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
