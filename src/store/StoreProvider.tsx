"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";
import { hydrateCart } from "./slices/cartSlice";
import { signOut, bootstrapSession } from "./thunks";
import { UNAUTHORIZED_EVENT } from "@/lib/api";

const CART_KEY = "sgt:cart:v1";

/**
 * Redux store. The cart is remembered in this browser; everything else (account, orders, settings)
 * lives on the server and is restored from the saved log-in token.
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    // restore after mount so the server HTML and the first client render match
    try {
      localStorage.removeItem("sgt:state:v1"); // old demo storage (orders/profile now come from the API)
      const raw = localStorage.getItem(CART_KEY);
      if (raw) { const items = JSON.parse(raw); if (Array.isArray(items)) store.dispatch(hydrateCart(items)); }
    } catch { /* storage blocked or corrupt */ }
    void store.dispatch(bootstrapSession());

    let t: ReturnType<typeof setTimeout> | undefined;
    const unsub = store.subscribe(() => {
      clearTimeout(t);
      t = setTimeout(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(store.getState().cart.items)); } catch { /* ignore */ } }, 250);
    });
    const onUnauthorized = () => { void store.dispatch(signOut()); };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => { clearTimeout(t); unsub(); window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized); };
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
