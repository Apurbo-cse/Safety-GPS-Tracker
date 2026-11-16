"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { useSite } from "@/components/providers/SiteProvider";
import { mediaUrl } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { errorMessage, useMyOrderQuery } from "@/store/apiSlice";
import { formatBDT } from "@/utils/format";
import { LoginGate } from "./AccountShell";

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** Printable invoice for one of the signed-in customer's orders (Print → Save as PDF). */
export default function InvoiceView({ id }: { id: string }) {
  const site = useSite();
  const user = useAppSelector((s) => s.auth.user);
  const ready = useAppSelector((s) => s.auth.ready);
  const q = useMyOrderQuery(id, { skip: !user });
  const sheet = useRef<HTMLElement>(null);
  const [making, setMaking] = useState(false);

  /** Draws the invoice (pictures included) onto A4 pages and saves it as a PDF — nothing is sent anywhere. */
  const downloadPdf = async () => {
    if (!sheet.current || !q.data) return;
    setMaking(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
      const node = sheet.current;
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true, windowWidth: Math.max(node.scrollWidth, 760) });
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight(), margin = 8;
      const w = pageW - margin * 2;
      const pxPerMm = canvas.width / w;
      const sliceH = Math.floor((pageH - margin * 2) * pxPerMm);
      for (let y = 0, page = 0; y < canvas.height; y += sliceH, page++) {
        const part = document.createElement("canvas");
        part.width = canvas.width; part.height = Math.min(sliceH, canvas.height - y);
        part.getContext("2d")!.drawImage(canvas, 0, y, canvas.width, part.height, 0, 0, canvas.width, part.height);
        if (page > 0) pdf.addPage();
        pdf.addImage(part.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, w, part.height / pxPerMm);
      }
      pdf.save(`invoice-${q.data.id}.pdf`);
    } catch { toast.error("Could not make the PDF. Use Print / Save as PDF instead."); }
    finally { setMaking(false); }
  };

  if (!ready) return <p className="p-10 text-center text-sm text-slate-500">Loading…</p>;
  if (!user) return <div className="mx-auto max-w-xl px-4"><LoginGate what="this invoice" next={`/orders/${id}/invoice`} /></div>;
  if (q.isLoading) return <p className="p-10 text-center text-sm text-slate-500">Loading invoice…</p>;
  if (q.isError || !q.data) return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-xl font-black text-slate-900">Invoice not found</h1>
      <p className="mt-1 text-sm text-slate-600">{q.error ? errorMessage(q.error) : "We couldn't find this order."}</p>
      <Link href="/orders" className="mt-4 inline-block font-semibold text-brand-600 hover:underline">Back to my orders</Link>
    </div>
  );

  const o = q.data;
  const b = o.billing;
  const lines = o.items.map((i) => ({ ...i, device: i.price * i.qty, monthly: (i.monthly ?? 0) * i.qty }));
  return (
    <div className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />My orders</Link>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-100 px-3.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 sm:h-10 sm:text-sm"><Printer className="h-4 w-4" />Print</button>
          <button onClick={() => void downloadPdf()} disabled={making} className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-500 px-4 text-xs font-bold text-white hover:bg-brand-600 disabled:opacity-60 sm:h-10 sm:px-5 sm:text-sm"><Download className="h-4 w-4" />{making ? "Making PDF…" : "Download PDF"}</button>
        </div>
      </div>

      <article ref={sheet} className="rounded-lg bg-white p-8 text-slate-900 shadow-sm print:rounded-none print:p-0 print:shadow-none sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xl font-black tracking-tight">{site.name}</p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-600">{site.address}<br />{site.phone} · {site.email}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black uppercase tracking-wide text-slate-300">Invoice</p>
            <dl className="mt-1 space-y-0.5 text-sm">
              <div className="flex justify-end gap-2"><dt className="text-slate-500">No.</dt><dd className="font-mono font-bold">{o.id}</dd></div>
              <div className="flex justify-end gap-2"><dt className="text-slate-500">Date</dt><dd className="font-semibold">{date(o.createdAt)}</dd></div>
              <div className="flex justify-end gap-2"><dt className="text-slate-500">Payment</dt><dd className="font-semibold">{o.payment}</dd></div>
            </dl>
          </div>
        </header>

        <section className="grid gap-6 py-6 text-sm sm:grid-cols-2">
          <div>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Bill to</h2>
            <p className="font-bold">{b.name}</p>
            {b.company && <p>{b.company}</p>}
            <p className="text-slate-700">{b.address}, {b.district ?? b.division}{b.postcode ? ` ${b.postcode}` : ""}</p>
            <p className="text-slate-700">{b.phone} · {b.email}</p>
            {b.taxId && <p className="mt-1 text-slate-700">BIN / TIN: <b>{b.taxId}</b></p>}
          </div>
          <div>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">Installation</h2>
            <p className="font-bold">{o.contact.name}</p>
            <p className="text-slate-700">{o.contact.address}, {o.contact.district ?? o.contact.division}{o.contact.thana ? ` · ${o.contact.thana}` : ""}{o.contact.postcode ? ` ${o.contact.postcode}` : ""}{o.contact.area && o.contact.area !== "Outside Dhaka" ? ` (${o.contact.area})` : ""}</p>
            <p className="text-slate-700">{o.contact.vehicleType} · {o.contact.vehicleReg}</p>
            <p className="text-slate-700">Preferred date: {o.contact.preferredDate}</p>
          </div>
        </section>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-2.5 pr-3">Item</th><th className="px-3 py-2.5 text-right">Qty</th><th className="px-3 py-2.5 text-right">Device price</th><th className="px-3 py-2.5 text-right">Monthly</th><th className="py-2.5 pl-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 align-top">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-3">
                    {l.image && (
                      // a plain <img> (not next/image) so the PDF capture sees it
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaUrl(l.image)} alt="" crossOrigin="anonymous" className="h-12 w-12 shrink-0 rounded border border-slate-200 bg-white object-contain p-0.5" />
                    )}
                    <span><span className="font-semibold">{l.name}</span><span className="block text-xs text-slate-500">{l.kind === "plan" ? "Package" : "Device"}</span></span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{l.qty}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatBDT(l.price)}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{l.monthly ? `${formatBDT(l.monthly / l.qty)}/mo` : "—"}</td>
                <td className="py-2.5 pl-3 text-right font-semibold tabular-nums">{formatBDT(l.device)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="ml-auto mt-5 w-full max-w-xs space-y-1.5 text-sm">
          {o.discount > 0 && <div className="flex justify-between"><dt className="text-slate-600">Devices</dt><dd className="tabular-nums">{formatBDT(o.deviceTotal)}</dd></div>}
          {o.discount > 0 && <div className="flex justify-between"><dt className="text-slate-600">Discount{o.couponCode ? ` (${o.couponCode})` : ""}</dt><dd className="font-semibold tabular-nums text-green-700">−{formatBDT(o.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-slate-600">Due now (devices)</dt><dd className="font-bold tabular-nums">{formatBDT(o.deviceTotal - o.discount)}</dd></div>
          <div className="flex justify-between"><dt className="text-slate-600">Monthly service</dt><dd className="font-bold tabular-nums">{formatBDT(o.monthlyTotal)}/mo</dd></div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base"><dt className="font-bold">First-month total</dt><dd className="font-black tabular-nums">{formatBDT(o.deviceTotal - o.discount + o.monthlyTotal)}</dd></div>
        </dl>

        <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <p>Status: <b className="capitalize text-slate-700">{o.status}</b>. The monthly service charge is billed each month while the package is active. Questions? Call {site.phone}.</p>
        </footer>
      </article>
    </div>
  );
}
