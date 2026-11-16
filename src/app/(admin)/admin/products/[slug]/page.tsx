import AdminProductView from "@/components/admin/AdminProductView";

export const metadata = { title: "Product", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AdminProductView id={slug} />;
}
