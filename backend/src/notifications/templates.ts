/** Plain functions that turn an order into an email. No framework here, so they are easy to test. */

export interface MailOrder {
  id: string; status: string; payment: string; paymentStatus?: string;
  deviceTotal: number; discount: number; monthlyTotal: number; couponCode?: string;
  items: { name: string; qty: number; price: number; monthly?: number }[];
  contact: { name: string; phone: string; address: string; district?: string; thana?: string; area?: string; preferredDate: string };
}
export interface Mail { subject: string; html: string; text: string }

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const bdt = (n: number) => `৳${Math.round(n).toLocaleString("en-US")}`;
const place = (c: MailOrder["contact"]) => [c.address, c.thana, c.district, c.area && c.area !== "Outside Dhaka" ? `(${c.area})` : ""].filter(Boolean).join(", ");

const HEADLINE: Record<string, { subject: string; line: string }> = {
  pending: { subject: "We received your order", line: "Thank you! We received your order and our team will call you to confirm it." },
  confirmed: { subject: "Your order is confirmed", line: "Your order is confirmed. We will contact you to schedule the installation." },
  scheduled: { subject: "Installation scheduled", line: "Your installation is scheduled. A technician will visit on the date below." },
  delivered: { subject: "Your order is delivered", line: "Your order is delivered and your tracker is ready. Thank you for choosing us." },
  returned: { subject: "Your order was returned", line: "Your order is marked as returned." },
  refunded: { subject: "Your order was refunded", line: "Your order was refunded. If you paid online, the money goes back to the account you paid from." },
  cancelled: { subject: "Your order was cancelled", line: "Your order was cancelled. If this is a surprise, please call us." },
};

/** One email for an order: the first one when it is placed, then one per status change. */
export function orderMail(o: MailOrder, site: { name: string; url: string; phone?: string }): Mail {
  const h = HEADLINE[o.status] ?? { subject: `Order update: ${o.status}`, line: `Your order status is now ${o.status}.` };
  const due = o.deviceTotal - o.discount;
  const link = `${site.url.replace(/\/+$/, "")}/order/${encodeURIComponent(o.id)}`;
  const subject = `${h.subject} — ${o.id}`;
  const rows = o.items.map((i) => `<tr><td style="padding:6px 0">${esc(i.name)} × ${i.qty}</td><td style="padding:6px 0;text-align:right">${bdt(i.price * i.qty)}</td></tr>`).join("");
  const paid = o.paymentStatus === "paid" ? " (paid)" : o.paymentStatus === "refunded" ? " (refunded)" : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1b2733">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<p style="font-size:18px;font-weight:700;margin:0 0 16px">${esc(site.name)}</p>
<div style="background:#fff;border-radius:8px;padding:24px">
<h1 style="font-size:20px;margin:0 0 8px">${esc(h.subject)}</h1>
<p style="margin:0 0 16px;line-height:1.5">Hi ${esc(o.contact.name.split(" ")[0])}, ${esc(h.line)}</p>
<p style="margin:0 0 4px;font-size:13px;color:#667">Order <b style="color:#1b2733">${esc(o.id)}</b></p>
<table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px">${rows}
<tr><td style="padding:8px 0;border-top:1px solid #e3e8ee"><b>Due now (devices)</b></td><td style="padding:8px 0;border-top:1px solid #e3e8ee;text-align:right"><b>${bdt(due)}</b></td></tr>
${o.discount > 0 ? `<tr><td style="padding:2px 0;color:#667">Discount${o.couponCode ? ` (${esc(o.couponCode)})` : ""}</td><td style="padding:2px 0;text-align:right;color:#667">−${bdt(o.discount)}</td></tr>` : ""}
<tr><td style="padding:2px 0;color:#667">Monthly service</td><td style="padding:2px 0;text-align:right;color:#667">${bdt(o.monthlyTotal)}/mo</td></tr></table>
<p style="font-size:14px;line-height:1.6;margin:16px 0 0"><b>Payment:</b> ${esc(o.payment)}${paid}<br><b>Installation:</b> ${esc(o.contact.preferredDate)}<br><b>Address:</b> ${esc(place(o.contact))}</p>
<p style="margin:20px 0 0"><a href="${esc(link)}" style="display:inline-block;background:#e11d48;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-weight:700;font-size:14px">View your order</a></p>
</div>
<p style="font-size:12px;color:#889;margin:16px 0 0">${site.phone ? `Questions? Call ${esc(site.phone)}. ` : ""}This is an automatic message about your order.</p>
</div></body></html>`;
  const text = [`${h.subject} — ${o.id}`, "", `Hi ${o.contact.name.split(" ")[0]}, ${h.line}`, "", ...o.items.map((i) => `${i.name} × ${i.qty}  ${bdt(i.price * i.qty)}`),
    `Due now (devices): ${bdt(due)}`, `Monthly service: ${bdt(o.monthlyTotal)}/mo`, `Payment: ${o.payment}${paid}`, `Installation: ${o.contact.preferredDate}`, `Address: ${place(o.contact)}`, "", `View your order: ${link}`].join("\n");
  return { subject, html, text };
}
