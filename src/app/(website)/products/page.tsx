import DeviceShop from "@/components/devices/DeviceShop";
import { getShopPage } from "@/lib/catalog.server";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("GPS Tracking Products", "GPS, voice monitoring and video & voice monitoring devices and vehicle GPS hardware.", "/products");

/** Shop-style product catalogue. Previous layout: <PageHero /> + <DevicesExplorer /> + <ContactCta />. */
export default async function ProductsPage() {
  return <DeviceShop initial={await getShopPage()} />;
}
