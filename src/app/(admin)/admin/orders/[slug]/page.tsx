import AdminOrderView from "@/components/admin/AdminOrderView";

export const metadata = { title: "Order", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AdminOrderView id={slug} />;
}
