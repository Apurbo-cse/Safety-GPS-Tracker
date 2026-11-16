import { orderMail, type MailOrder } from "./templates";

const order = (over: Partial<MailOrder> = {}): MailOrder => ({
  id: "SGT-ABC234", status: "pending", payment: "bKash", paymentStatus: "unpaid", deviceTotal: 16000, discount: 1000, couponCode: "WELCOME", monthlyTotal: 500,
  items: [{ name: "Video & Voice <Monitoring>", qty: 2, price: 8000, monthly: 250 }],
  contact: { name: "Rahim Uddin", phone: "01712345678", address: "House 1, Road 2", district: "Dhaka", thana: "Gulshan", area: "DNCC", preferredDate: "2026-12-01" },
  ...over,
});
const site = { name: "Safety GPS", url: "http://localhost:3000/", phone: "096XX" };

describe("orderMail", () => {
  it("names the order and the step in the subject", () => {
    expect(orderMail(order(), site).subject).toBe("We received your order — SGT-ABC234");
    expect(orderMail(order({ status: "delivered" }), site).subject).toBe("Your order is delivered — SGT-ABC234");
    expect(orderMail(order({ status: "refunded" }), site).subject).toContain("refunded");
  });

  it("links to the order page without a double slash", () => {
    const m = orderMail(order(), site);
    expect(m.html).toContain('href="http://localhost:3000/order/SGT-ABC234"');
    expect(m.text).toContain("http://localhost:3000/order/SGT-ABC234");
  });

  it("shows what is due now (after the discount), the monthly charge and the address", () => {
    const m = orderMail(order(), site);
    expect(m.text).toContain("Due now (devices): ৳15,000");
    expect(m.text).toContain("Monthly service: ৳500/mo");
    expect(m.text).toContain("House 1, Road 2, Gulshan, Dhaka, (DNCC)");
    expect(m.html).toContain("WELCOME");
  });

  it("escapes anything a customer typed", () => {
    const m = orderMail(order({ contact: { ...order().contact, name: '<script>alert(1)</script> Bob', address: '"><img src=x>' } }), site);
    expect(m.html).not.toContain("<script>");
    expect(m.html).not.toContain("<img src=x>");
    expect(m.html).toContain("Video &amp; Voice &lt;Monitoring&gt;");
  });

  it("falls back gracefully for an unknown status", () => {
    expect(orderMail(order({ status: "weird" }), site).subject).toBe("Order update: weird — SGT-ABC234");
  });
});
