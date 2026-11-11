import OrdersView from "@/components/account/OrdersView";
import { pageMeta } from "@/lib/metadata";

export const metadata = { ...pageMeta("My Orders", "Track your Safety GPS Tracker orders and installation progress.", "/orders"), robots: { index: false } };

export default function Page() {
  return <OrdersView />;
}
