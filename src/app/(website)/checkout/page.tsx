import CheckoutView from "@/components/account/CheckoutView";
import { pageMeta } from "@/lib/metadata";

export const metadata = { ...pageMeta("Checkout", "Confirm your details, installation and payment to place your GPS tracking order.", "/checkout"), robots: { index: false } };

export default function Page() {
  return <CheckoutView />;
}
