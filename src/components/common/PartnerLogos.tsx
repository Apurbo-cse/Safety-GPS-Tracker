import Image from "next/image";

type Item = { name: string; logo: string };

const Logo = ({ p, small }: { p: Item; small?: boolean }) => (
  <li className={small ? "grid h-12 w-[6.5rem] shrink-0 place-items-center" : "grid h-16 w-32 shrink-0 place-items-center"}>
    <Image src={p.logo} alt={p.name} width={140} height={60} className={small ? "h-auto max-h-11 w-auto rounded-lg object-contain" : "h-auto max-h-14 w-auto rounded-lg object-contain"} />
  </li>
);

/** `left` = compact, left-aligned tiles (used in the footer). */
export default function PartnerLogos({ items, marquee = false, reverse = false, left = false }: { items: Item[]; marquee?: boolean; reverse?: boolean; left?: boolean }) {
  if (!marquee) return <ul className={left ? "flex flex-wrap items-center gap-2" : "flex flex-wrap items-center justify-center gap-3"}>{items.map((p) => <Logo key={p.name} p={p} small={left} />)}</ul>;
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee-mask group overflow-hidden" aria-label="Partner logos">
      <ul className={`marquee-track flex w-max gap-3 ${reverse ? "marquee-reverse" : ""}`}>
        {row.map((p, i) => <Logo key={`${p.name}-${i}`} p={p} />)}
      </ul>
    </div>
  );
}
