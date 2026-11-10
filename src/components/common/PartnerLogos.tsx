import Image from "next/image";

type Item = { name: string; logo: string };

const Logo = ({ p }: { p: Item }) => (
  <li className="grid h-14 w-32 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-white px-2 shadow-sm">
    <Image src={p.logo} alt={p.name} width={140} height={60} className="h-auto max-h-11 w-auto object-contain" />
  </li>
);

export default function PartnerLogos({ items, marquee = false, reverse = false }: { items: Item[]; marquee?: boolean; reverse?: boolean }) {
  if (!marquee) return <ul className="flex flex-wrap items-center justify-center gap-3">{items.map((p) => <Logo key={p.name} p={p} />)}</ul>;
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee-mask group overflow-hidden" aria-label="Partner logos">
      <ul className={`marquee-track flex w-max gap-3 ${reverse ? "marquee-reverse" : ""}`}>
        {row.map((p, i) => <Logo key={`${p.name}-${i}`} p={p} />)}
      </ul>
    </div>
  );
}
