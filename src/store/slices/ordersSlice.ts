import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";

export type PaymentMethod = "bKash" | "Nagad" | "Rocket" | "Card" | "Cash on installation";
export type OrderStatus = "received" | "confirmed" | "scheduled" | "active" | "cancelled";

export interface OrderContact {
  name: string;
  phone: string;
  email: string;
  address: string;
  division: string;
  vehicleReg: string;
  vehicleType: string;
  preferredDate: string;
  note?: string;
}

export interface Order {
  id: string;
  createdAt: string; // ISO
  items: CartItem[];
  deviceTotal: number;
  monthlyTotal: number;
  payment: PaymentMethod;
  contact: OrderContact;
  status: OrderStatus;
}

interface OrdersState { list: Order[] }
const initialState: OrdersState = { list: [] };

/** Demo order history — saved in this browser only (see StoreProvider). */
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    hydrateOrders(s, a: PayloadAction<Order[]>) { s.list = a.payload; },
    placeOrder(s, a: PayloadAction<Order>) { s.list.unshift(a.payload); },
    cancelOrder(s, a: PayloadAction<string>) {
      const o = s.list.find((x) => x.id === a.payload);
      if (o && o.status === "received") o.status = "cancelled";
    },
  },
});

export const { hydrateOrders, placeOrder, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
