"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";
import { announceNavigation } from "@/lib/navigate";
import Logo from "@/components/common/Logo";
import ThemeToggle from "./ThemeToggle";
import Container from "@/components/common/Container";
import { LinkButton, Button } from "@/components/common/Button";
import { NAV_LINKS } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartOpen, setMobileNav } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { cn } from "@/utils/format";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const cartCount = useAppSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const signOut = () => {
    dispatch(logout());
    dispatch(setMobileNav(false));
    toast.success("Signed out (demo)");
    announceNavigation();
    router.push("/");
  };

  return (
    <header className={cn("sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-xl transition-shadow duration-300", scrolled && " ")}>
      <Container className={cn("flex items-center justify-between transition-[height] duration-300", scrolled ? "h-14" : "h-14 lg:h-16")}>
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href}
                className={cn("relative whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "text-brand-text" : "text-body-strong hover:text-brand-text")}>
                {l.label}
                {active && <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2"> 
     
          <ThemeToggle />
          <button onClick={() => dispatch(setCartOpen(true))} aria-label={`Cart, ${cartCount} items`}
            className="relative grid h-10 w-10 place-items-center rounded-lg text-body-strong hover:bg-softer">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">{cartCount}</span>}
          </button>
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <span className="flex items-center gap-1.5 text-sm font-medium text-body-strong"><User className="h-4 w-4" />{user.name}</span>
                <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" />Logout</Button>
              </>
            ) : (
              <>
                <LinkButton href="/login" variant="ghost" size="sm">Login</LinkButton>
                <LinkButton href="/register" size="sm">Get Started</LinkButton>
              </>
            )}
          </div>
        </div>
      </Container>

    </header>
  );
}
