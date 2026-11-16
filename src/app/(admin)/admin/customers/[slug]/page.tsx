import AdminCustomerView from "@/components/admin/AdminCustomerView";

export const metadata = { title: "Customer", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AdminCustomerView id={slug} />;
}
