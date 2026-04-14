const BASE = "https://fakestoreapi.com";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
};

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`);
  return parseJson<Product[]>(res);
}

export async function getProduct(id: string | number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`);
  return parseJson<Product>(res);
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/products/categories`);
  return parseJson<string[]>(res);
}
