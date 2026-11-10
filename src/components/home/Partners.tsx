import Container from "@/components/common/Container";
import PartnerLogos from "@/components/common/PartnerLogos";
import { DEVICE_PARTNER_LOGOS, TELECOM_PARTNER_LOGOS } from "@/lib/site";

export default function Partners() {
  return (
    <section className="border-b border-line bg-surface py-9" aria-label="Partners">
      <Container className="space-y-6">
        <div><p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Our device partners</p><PartnerLogos items={DEVICE_PARTNER_LOGOS} marquee /></div>
        <div><p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Our telecom partners</p><PartnerLogos items={TELECOM_PARTNER_LOGOS} marquee reverse /></div>
      </Container>
    </section>
  );
}
