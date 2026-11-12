"use client";
import { Mail, Phone } from "lucide-react";
import { useSite } from "@/components/providers/SiteProvider";
import Container from "@/components/common/Container";

export default function TopBar() {
  const site = useSite();
  const items = [
    { label: "Corporate Sales", value: site.phone },
    { label: "Sales", value: site.phone },
    { label: "Support", value: site.phone },
  ];
  return (
    <div className="hidden bg-navy-950 text-xs text-slate-300 md:block">
      <Container className="flex h-9 items-center justify-between">
        <div className="flex items-center gap-5">
          {items.map((i) => (
            <a key={i.label} href={`tel:${i.value}`} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3 w-3 text-brand-400" />
              <span className="text-slate-400">{i.label}:</span> {i.value}
            </a>
          ))}
        </div>
        <a href={`mailto:${site.email}`} className="flex items-center gap-1.5 hover:text-white">
          <Mail className="h-3 w-3 text-brand-400" /> {site.email}
        </a>
      </Container>
    </div>
  );
}
