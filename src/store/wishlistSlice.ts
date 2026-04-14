import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type WishlistState = {
  ids: number[];
};

const initialState: WishlistState = {
  ids: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleId(state, action: PayloadAction<number>) {
      const id = action.payload;
      const i = state.ids.indexOf(id);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.push(id);
    },
    removeId(state, action: PayloadAction<number>) {
      state.ids = state.ids.filter((x) => x !== action.payload);
    },
    clearWishlist(state) {
      state.ids = [];
    },
  },
});

export const { toggleId, removeId, clearWishlist } = wishlistSlice.actions;

export const selectWishlistIds = (state: { wishlist: WishlistState }) =>
  state.wishlist.ids;

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.ids.length;

export const selectIsWishlisted =
  (id: number) => (state: { wishlist: WishlistState }) =>
    state.wishlist.ids.includes(id);

export default wishlistSlice.reducer;
