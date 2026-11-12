import InvoiceView from "@/components/account/InvoiceView";

export const metadata = { title: "Invoice", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InvoiceView id={id} />;
}
