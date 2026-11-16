import OrderDetailView from "@/components/account/OrderDetailView";

export const metadata = { title: "Order details", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OrderDetailView id={slug} />;
}
