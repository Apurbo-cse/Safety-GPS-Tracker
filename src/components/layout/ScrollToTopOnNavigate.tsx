"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures the viewport scrolls to the top upon route navigation,
 * while honoring anchor elements if a hash (#section) is specified.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    // If there is an anchor hash in the URL, scroll to that element
    if (window.location.hash) {
      const hashId = decodeURIComponent(window.location.hash.slice(1));
      const targetElement = document.getElementById(hashId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Otherwise, immediately scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
