import { redirect } from "next/navigation";

/** Old address — the order page now lives at /order/<slug>. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/order/${encodeURIComponent(id)}`);
}
