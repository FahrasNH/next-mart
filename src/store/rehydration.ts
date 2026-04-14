/**
 * redux-persist menyisipkan `_persist` di root state setelah `persistReducer`.
 * Pakai untuk menunda UI yang bergantung pada cart dari storage (badge, total, dsb.).
 */
export function selectHasRehydrated(state: {
  _persist?: { rehydrated?: boolean };
}): boolean {
  return state._persist?.rehydrated === true;
}
