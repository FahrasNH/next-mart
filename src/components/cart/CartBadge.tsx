"use client";

import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cartSlice";
import { selectHasRehydrated } from "@/store/rehydration";
import { HeaderIconBadge } from "@/components/header/HeaderIconBadge";

export function CartBadge() {
  const rehydrated = useAppSelector(selectHasRehydrated);
  const count = useAppSelector(selectCartCount);

  if (!rehydrated) return null;

  return <HeaderIconBadge count={count} />;
}
