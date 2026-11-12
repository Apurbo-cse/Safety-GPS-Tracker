/** Bare layout for printable documents: no navigation, so the page prints as just the invoice. */
export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">{children}</main>;
}
