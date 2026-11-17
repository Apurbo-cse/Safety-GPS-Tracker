"use client";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import Container from "@/components/common/Container";

export default function TopBar() {
  const site = useSite();
  return (
    <div className="hidden bg-navy-950 text-[11px] font-medium uppercase tracking-wide text-slate-300 md:block">
      <Container className="flex h-9 items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-5">
          <span className="flex shrink-0 items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-brand-400" />BTRC approved hardware</span>
          <span className="flex min-w-0 items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0 text-brand-400" /><span className="truncate">Head office: {site.address}</span></span>
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <a href={`tel:${site.phone}`} className="flex items-center gap-1.5 hover:text-white"><Phone className="h-3 w-3 text-brand-400" />24/7 helpline: {site.phone}</a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 normal-case hover:text-white"><Mail className="h-3 w-3 text-brand-400" />{site.email}</a>
        </div>
      </Container>
    </div>
  );
}
