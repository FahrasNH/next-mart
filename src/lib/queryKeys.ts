export const queryKeys = {
  products: ["products"] as const,
  product: (id: string | number) => ["product", String(id)] as const,
  categories: ["categories"] as const,
};
