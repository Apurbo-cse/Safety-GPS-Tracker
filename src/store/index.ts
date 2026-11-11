import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import pricing from "./slices/pricingSlice";
import cart from "./slices/cartSlice";
import ui from "./slices/uiSlice";
import wishlist from "./slices/wishlistSlice";

export const makeStore = () =>
  configureStore({
    reducer: { auth, pricing, cart, ui, wishlist },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
