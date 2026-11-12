import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ApiOrder, OrderStatus, PaymentMethod } from "@/lib/api";

export type { OrderStatus, PaymentMethod };
export type Order = ApiOrder;

interface OrdersState { list: Order[]; status: "idle" | "loading" | "error"; loaded: boolean }
const initialState: OrdersState = { list: [], status: "idle", loaded: false };

/** The signed-in customer's orders, loaded from the API. */
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersLoading(s) { s.status = "loading"; },
    ordersFailed(s) { s.status = "error"; },
    setOrders(s, a: PayloadAction<Order[]>) { s.list = a.payload; s.status = "idle"; s.loaded = true; },
    addOrder(s, a: PayloadAction<Order>) { s.list.unshift(a.payload); },
    replaceOrder(s, a: PayloadAction<Order>) { const i = s.list.findIndex((o) => o.id === a.payload.id); if (i >= 0) s.list[i] = a.payload; },
    clearOrders() { return initialState; },
  },
});

export const { ordersLoading, ordersFailed, setOrders, addOrder, replaceOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
