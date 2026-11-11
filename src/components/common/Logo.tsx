import Image from "next/image";
import Link from "next/link";

/** Official Safety GPS Tracker logo (from the company website). Used everywhere. */
export default function Logo({
  className = "h-7 sm:h-7.5 md:h-8",
}: {
  className?: string;
}) {
  return (
    <Link
      href="/"
      className="inline-flex items-center shrink-0 transition-opacity hover:opacity-90"
      aria-label="Safety GPS Tracker home"
    >
      <Image
        src="/logo.png"
        alt="Safety GPS Tracker Service"
        width={1200}
        height={252}
        priority
        className={`${className} w-auto object-contain`}
      />
    </Link>
  );
}
