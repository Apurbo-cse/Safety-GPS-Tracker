import { Mail, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import Container from "@/components/common/Container";

const items = [
  { label: "Corporate Sales", value: SITE.phone },
  { label: "Sales", value: SITE.phone },
  { label: "Support", value: SITE.phone },
];

export default function TopBar() {
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
        <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 hover:text-white">
          <Mail className="h-3 w-3 text-brand-400" /> {SITE.email}
        </a>
      </Container>
    </div>
  );
}
