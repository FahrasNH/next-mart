"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Search,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cartSlice";
import { selectHasRehydrated } from "@/store/rehydration";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";
import { NavTextBadge } from "./NavTextBadge";
import { WishlistDropdown } from "./WishlistDropdown";
import { WishlistBadge } from "./WishlistBadge";
const PREMIUM_STORAGE_KEY = "nextmart-hide-premium-banner";

function navLinkClass(active: boolean) {
  return cn(
    "text-sm font-medium transition-colors",
    active
      ? "font-semibold text-app-accent"
      : "text-app-muted hover:text-app-text"
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const wishlistWrapRef = useRef<HTMLDivElement | null>(null);
  const [showPremium, setShowPremium] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const searchValue = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const rehydrated = useAppSelector(selectHasRehydrated);
  const cartCount = useAppSelector(selectCartCount);

  useEffect(() => {
    try {
      if (localStorage.getItem(PREMIUM_STORAGE_KEY) === "1") {
        setShowPremium(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const t = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!wishlistOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = wishlistWrapRef.current;
      if (el && !el.contains(e.target as Node)) {
        setWishlistOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWishlistOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [wishlistOpen]);

  const dismissPremium = () => {
    setShowPremium(false);
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const setSearchQuery = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = next.trim();
    if (trimmed.length === 0) params.delete("q");
    else params.set("q", trimmed);

    // selalu arahkan ke katalog saat searching
    const qs = params.toString();
    router.replace(qs.length > 0 ? `/?${qs}#catalog` : "/#catalog");
  };

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/product");

  return (
    <>
      <div className="sticky top-0 z-50">
        {showPremium && (
          <div className="border-b border-app-border/80 bg-app-surface">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-2 px-4 py-2.5 sm:grid-cols-[auto_1fr_auto] sm:gap-4 sm:px-6">
              <button
                type="button"
                onClick={dismissPremium}
                className="touch-manipulation cursor-pointer justify-self-start rounded p-1 text-app-muted transition hover:text-app-text sm:justify-self-auto"
                aria-label="Close announcement"
              >
                <X className="size-4" />
              </button>
              <p className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-center text-xs text-app-text sm:text-sm">
                <span className="font-semibold text-app-accent">
                  Premium Selection
                </span>
                <span className="text-app-muted">—</span>
                <span className="text-app-text">
                  Curated products with trusted quality
                </span>
              </p>
              <Link
                href="/#catalog"
                className="inline-flex items-center justify-center gap-0.5 justify-self-center text-xs font-semibold text-app-accent transition hover:underline sm:justify-self-end sm:text-sm"
              >
                Browse inventory
                <ChevronRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        )}

        <header className="border-b border-app-border bg-app-bg/95 backdrop-blur">
          <div className="mx-auto flex min-h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-6 lg:gap-10">
              <Link
                href="/"
                className="shrink-0 text-lg font-bold tracking-tight text-app-accent"
              >
                NextMart
              </Link>
              <nav
                className="hidden items-center gap-6 lg:flex"
                aria-label="Menu utama"
              >
                <Link href="/" className={navLinkClass(isHome && !isShop)}>
                  Home
                </Link>
                <Link href="/#catalog" className={navLinkClass(isShop)}>
                  Shop
                </Link>
                <button
                  type="button"
                  onClick={() => setMiniCartOpen(true)}
                  className={cn(
                    navLinkClass(false),
                    "relative inline-flex cursor-pointer items-center gap-1.5"
                  )}
                  aria-label="Open cart"
                  aria-expanded={miniCartOpen}
                >
                  <span>Cart</span>
                  {rehydrated && <NavTextBadge count={cartCount} />}
                </button>
                <Link href="/#contact" className={navLinkClass(false)}>
                  Contact
                </Link>
              </nav>
            </div>

            <AnimatePresence initial={false}>
              {searchOpen && (
                <motion.div
                  key="header-search"
                  initial={{ opacity: 0, scaleX: 0.85 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.85 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="hidden min-w-0 flex-1 origin-right sm:block"
                >
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-app-muted" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      role="search"
                      enterKeyHint="search"
                      value={searchValue}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products by name…"
                      autoComplete="off"
                      className="min-h-11 w-full rounded-xl border border-app-border bg-app-bg py-2.5 pl-11 pr-10 text-sm text-app-text placeholder:text-app-muted focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                    />
                    {searchValue.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-app-muted hover:text-app-text"
                        aria-label="Clear search"
                      >
                        <X className="size-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <nav
              className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1"
              aria-label="Aksi"
            >
              <button
                type="button"
                onClick={() => setSearchOpen((o) => !o)}
                className={cn(
                  "touch-manipulation flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-app-accent transition"
                )}
                aria-label="Search products"
                aria-expanded={searchOpen}
              >
                <Search className="size-5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="touch-manipulation flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-app-accent transition"
                aria-label="Account"
              >
                <User className="size-5" strokeWidth={1.75} />
              </button>
              <div ref={wishlistWrapRef} className="relative">
                <button
                  type="button"
                  onClick={() => setWishlistOpen((o) => !o)}
                  className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-app-accent transition"
                  aria-label="Wishlist"
                  aria-expanded={wishlistOpen}
                  aria-haspopup="dialog"
                >
                  <Heart className="size-5" strokeWidth={1.75} />
                  <WishlistBadge />
                </button>
                <WishlistDropdown
                  open={wishlistOpen}
                  onClose={() => setWishlistOpen(false)}
                />
              </div>
            </nav>
          </div>

          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                key="mobile-search"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="border-t border-app-border/60 bg-app-bg/95 backdrop-blur sm:hidden"
              >
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-app-muted" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      role="search"
                      enterKeyHint="search"
                      value={searchValue}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products by name…"
                      autoComplete="off"
                      className="min-h-12 w-full touch-manipulation rounded-xl border border-app-border bg-app-bg py-3 pl-11 pr-11 text-sm text-app-text placeholder:text-app-muted focus:border-app-accent focus:outline-none focus:ring-2 focus:ring-app-accent/20"
                    />
                    {searchValue.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-app-muted hover:text-app-text"
                        aria-label="Clear search"
                      >
                        <X className="size-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-app-border/60 px-4 py-2.5 lg:hidden"
            aria-label="Menu utama"
          >
            <Link href="/" className={navLinkClass(isHome && !isShop)}>
              Home
            </Link>
            <Link href="/#catalog" className={navLinkClass(isShop)}>
              Shop
            </Link>
            <button
              type="button"
              onClick={() => setMiniCartOpen(true)}
              className={cn(
                navLinkClass(false),
                "relative inline-flex cursor-pointer items-center gap-1.5"
              )}
              aria-label="Open cart"
              aria-expanded={miniCartOpen}
            >
              <span>Cart</span>
              {rehydrated && <NavTextBadge count={cartCount} />}
            </button>
            <Link href="/#contact" className={navLinkClass(false)}>
              Contact
            </Link>
          </nav>
        </header>
      </div>

      <MiniCartDrawer
        open={miniCartOpen}
        onClose={() => setMiniCartOpen(false)}
      />
    </>
  );
}
