"use client";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";
import { hydrateOrders } from "./slices/ordersSlice";
import { hydrateAccount } from "./slices/accountSlice";
import { hydrateCart } from "./slices/cartSlice";
import { loginSuccess } from "./slices/authSlice";

const KEY = "sgt:state:v1";

/** Redux store + per-browser persistence of cart, orders, profile, settings and log-in (demo data only). */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    // restore after mount so the server HTML and first client render match
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved.orders)) store.dispatch(hydrateOrders(saved.orders));
        if (saved.account) store.dispatch(hydrateAccount(saved.account));
        if (Array.isArray(saved.cart)) store.dispatch(hydrateCart(saved.cart));
        if (saved.user) store.dispatch(loginSuccess(saved.user));
      }
    } catch { /* storage blocked or corrupt — start fresh */ }

    let t: ReturnType<typeof setTimeout> | undefined;
    const unsub = store.subscribe(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        const s = store.getState();
        try {
          localStorage.setItem(KEY, JSON.stringify({ orders: s.orders.list, account: s.account, cart: s.cart.items, user: s.auth.user }));
        } catch { /* ignore quota / private mode */ }
      }, 250);
    });
    return () => { clearTimeout(t); unsub(); };
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
