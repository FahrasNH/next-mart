"use client";

import { useAppSelector } from "@/store/hooks";
import { selectHasRehydrated } from "@/store/rehydration";
import { selectWishlistCount } from "@/store/wishlistSlice";
import { HeaderIconBadge } from "@/components/header/HeaderIconBadge";

export function WishlistBadge() {
  const rehydrated = useAppSelector(selectHasRehydrated);
  const count = useAppSelector(selectWishlistCount);

  if (!rehydrated) return null;

  return <HeaderIconBadge count={count} />;
}

