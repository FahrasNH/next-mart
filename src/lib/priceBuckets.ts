export type PriceBucket = {
  id: string;
  label: string;
  min: number;
  max: number;
};

export function buildPriceBuckets(
  globalMin: number,
  globalMax: number,
  count = 4
): PriceBucket[] {
  if (
    !Number.isFinite(globalMin) ||
    !Number.isFinite(globalMax) ||
    globalMax <= globalMin
  ) {
    return [];
  }
  const span = globalMax - globalMin;
  const step = span / count;
  const buckets: PriceBucket[] = [];
  for (let i = 0; i < count; i++) {
    const lo = Math.floor(globalMin + step * i);
    const hi =
      i === count - 1
        ? Math.ceil(globalMax)
        : Math.floor(globalMin + step * (i + 1));
    buckets.push({
      id: `bucket-${i}`,
      label: `$${lo.toLocaleString("en-US")} - $${hi.toLocaleString("en-US")}`,
      min: lo,
      max: Math.max(lo, hi),
    });
  }
  return buckets;
}
