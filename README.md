# NextMart — Shopping Catalog (Fake Store API)

Aplikasi katalog belanja **NextMart** dengan Next.js (App Router), TanStack Query, Redux Toolkit + redux-persist, dan UI responsif.

## Deliverables (§13)

| Item | Keterangan |
|------|------------|
| **Repository** | *[Github](https://github.com/FahrasNH/next-mart)* |
| **Live URL** | *[Vercel](next-mart-three.vercel.app)* |

---

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Data produk:** TanStack Query — `GET /products`, `GET /products/{id}` (Fake Store API)
- **Cart:** Redux Toolkit + **redux-persist** (`localStorage`)
- **UI:** Tailwind CSS, Framer Motion, Lucide icons, Sonner (toast)

## Instalasi

Prasyarat: Node.js 18+ dan **pnpm** (disarankan; proyek memakai `pnpm-lock.yaml`).

```bash
cd next-mart
pnpm install
```

## Menjalankan

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000). Build produksi:

```bash
pnpm build
pnpm start
```

---

## Hydration & cart persistence (Next.js)

**Masalah:** Server tidak bisa membaca `localStorage`. Render pertama bisa memakai cart “kosong”, lalu setelah rehydrate dari storage cart berisi — risiko badge/total yang “melompat” dan peringatan hydration mismatch.

**Pendekatan di proyek ini (gabungan):**

1. **`PersistGate` (redux-persist)** — Di `src/providers/Providers.tsx`, subtree aplikasi dibungkus `PersistGate` sehingga UI yang bergantung pada Redux (termasuk cart dari persist) tidak dianggap final sampai proses rehydrate dari `localStorage` selesai.

2. **Flag rehydrate (`selectHasRehydrated`)** — Selector di `src/store/rehydration.ts` membaca `state._persist.rehydrated`. Komponen seperti **`CartBadge`** dan **`CartLines`** menunggu `rehydrated === true` sebelum menampilkan jumlah atau daftar, sehingga tidak menampilkan “kosong” palsu atau angka yang salah di satu frame pertama.

3. **`layout.tsx` sebagai Server Component** — Tidak ada akses `localStorage` di server; logika persist hanya di client (`"use client"` pada `Providers` dan store).

Dengan kombinasi ini, cart tetap persist setelah refresh, dan UX badge/keranjang tetap konsisten tanpa kedipan menyalahkan server.

---

## API

- Base URL: `https://fakestoreapi.com`
- Contoh: `GET /products`, `GET /products/:id`, `GET /products/categories`
