import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  qty: number;
};

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

export type ProductPayload = {
  id: number;
  title: string;
  price: number;
  image: string;
  /** Jumlah yang ditambahkan (default 1) */
  qty?: number;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<ProductPayload>) {
      const { id, title, price, image, qty: addQty = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        existing.qty += addQty;
      } else {
        state.items.push({ id, title, price, image, qty: addQty });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    increment(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },
    decrement(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      item.qty -= 1;
      if (item.qty <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
    setQty(
      state,
      action: PayloadAction<{ id: number; qty: number }>
    ) {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (!item) return;
      if (qty <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        item.qty = qty;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  increment,
  decrement,
  setQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((n, i) => n + i.qty, 0);

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
