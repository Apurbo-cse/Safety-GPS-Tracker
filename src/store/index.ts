import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import pricing from "./slices/pricingSlice";
import cart from "./slices/cartSlice";
import ui from "./slices/uiSlice";
import wishlist from "./slices/wishlistSlice";
import { baseApi } from "./apiSlice";
import account from "./slices/accountSlice";

export const makeStore = () =>
  configureStore({
    reducer: { auth, pricing, cart, ui, wishlist, account, [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
