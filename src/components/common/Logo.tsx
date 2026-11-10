import Image from "next/image";
import Link from "next/link";

/** Official Safety GPS Tracker logo (from the company website). Used everywhere. */
export default function Logo({ className = "h-9" }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="Safety GPS Tracker home">
      <Image src="/logo.png" alt="Safety GPS Tracker Service" width={1200} height={252} priority className={`${className} w-auto`} />
    </Link>
  );
}
