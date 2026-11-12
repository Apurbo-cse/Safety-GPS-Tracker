// Orders are fetched and cached by RTK Query (`useMyOrdersQuery` in store/apiSlice.ts); only the types live here.
import type { ApiOrder, OrderStatus, PaymentMethod } from "@/lib/api";

export type { OrderStatus, PaymentMethod };
export type Order = ApiOrder;
