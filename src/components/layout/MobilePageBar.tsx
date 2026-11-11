"use client";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setPalette } from "@/store/slices/uiSlice";
import { announceNavigation } from "@/lib/navigate";

const TITLES: Record<string, string> = {
  "/features": "Features",
  "/mobile-app": "Mobile App",
  "/pricing": "Pricing",
  "/products": "Products",
  "/solutions": "Solutions",
  "/about": "About Us",
  "/contact": "Contact",
  "/pay-bill": "Pay Bill",
  "/faq": "FAQ",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
};

/** App-style top bar for inner pages on phones/tablets (the full navbar shows only on the home page there). */
export default function MobilePageBar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  if (pathname === "/") return null;

  const title = TITLES[Object.keys(TITLES).find((k) => pathname.startsWith(k)) ?? ""] ?? "Safety GPS Tracker";
  const back = () => {
    announceNavigation();
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-line/70 bg-surface/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 lg:hidden">
      <div className="flex h-12 items-center gap-1 px-1.5">
        <button onClick={back} aria-label="Go back" className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors active:bg-softer">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-base font-bold text-ink">{title}</p>
        <button onClick={() => dispatch(setPalette(true))} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-body transition-colors active:bg-softer">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
