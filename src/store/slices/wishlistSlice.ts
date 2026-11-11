import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Device ids the visitor has hearted (kept for the session, like the cart). */
interface WishlistState { ids: string[] }
const initialState: WishlistState = { ids: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(s, a: PayloadAction<string>) {
      s.ids = s.ids.includes(a.payload) ? s.ids.filter((x) => x !== a.payload) : [...s.ids, a.payload];
    },
  },
});
export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
