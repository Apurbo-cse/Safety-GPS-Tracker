import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";

interface CartState { items: CartItem[] }
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(s, a: PayloadAction<Omit<CartItem, "qty">>) {
      const ex = s.items.find((i) => i.id === a.payload.id);
      if (ex) ex.qty += 1; else s.items.push({ ...a.payload, qty: 1 });
    },
    setQty(s, a: PayloadAction<{ id: string; qty: number }>) {
      const it = s.items.find((i) => i.id === a.payload.id);
      if (it) it.qty = Math.max(1, Math.min(50, a.payload.qty));
    },
    removeFromCart(s, a: PayloadAction<string>) { s.items = s.items.filter((i) => i.id !== a.payload); },
    clearCart(s) { s.items = []; },
    hydrateCart(s, a: PayloadAction<CartItem[]>) { s.items = a.payload; },
  },
});
export const { addToCart, setQty, removeFromCart, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
