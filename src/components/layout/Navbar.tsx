"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bike,
  Bus,
  Car,
  ChevronDown,
  Cpu,
  CreditCard,
  Fuel,
  HardHat,
  Info,
  LogOut,
  Menu,
  Mic,
  Navigation,
  Phone,
  Shield,
  ShoppingCart,
  Truck,
  User,
  Video,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { announceNavigation } from "@/lib/navigate";
import Logo from "@/components/common/Logo";
import ThemeToggle from "./ThemeToggle";
import Container from "@/components/common/Container";
import { LinkButton, Button } from "@/components/common/Button";
import { SITE } from "@/lib/site";
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
  const mobileNavOpen = useAppSelector((s) => s.ui.mobileNavOpen);

  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setActiveMenu(null);
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const closeMenu = () => setActiveMenu(null);

  const signOut = () => {
    dispatch(logout());
    dispatch(setMobileNav(false));
    toast.success("Signed out (demo)");
    announceNavigation();
    router.push("/");
  };

  return (
    <header
      ref={headerRef}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "sticky top-0 z-50 border-b border-line/80 bg-surface/95 backdrop-blur-xl transition-all duration-300",
        scrolled ? "shadow-md shadow-black/5 dark:shadow-black/25" : ""
      )}
    >
      <Container
        className={cn(
          "flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-14" : "h-14 lg:h-16"
        )}
      >
        {/* Left: Brand Logo (Proportionate size) */}
        <div className="flex items-center gap-6">
          <Logo className="h-6 sm:h-7 md:h-7.5" />
        </div>

        {/* Center: Desktop Navigation */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main Navigation"
        >
          {/* 1. Features */}
          <button
            type="button"
            onMouseEnter={() => handleMouseEnter("Features")}
            onClick={() => setActiveMenu(activeMenu === "Features" ? null : "Features")}
            aria-expanded={activeMenu === "Features"}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition-all xl:text-sm",
              activeMenu === "Features" || pathname.startsWith("/features")
                ? "bg-soft text-brand-text font-bold"
                : "text-body-strong hover:bg-soft/70 hover:text-brand-text"
            )}
          >
            <span>Features</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                activeMenu === "Features" && "rotate-180 text-brand-text"
              )}
            />
          </button>

          {/* 2. Devices */}
          <button
            type="button"
            onMouseEnter={() => handleMouseEnter("Devices")}
            onClick={() => setActiveMenu(activeMenu === "Devices" ? null : "Devices")}
            aria-expanded={activeMenu === "Devices"}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition-all xl:text-sm",
              activeMenu === "Devices" || pathname.startsWith("/devices")
                ? "bg-soft text-brand-text font-bold"
                : "text-body-strong hover:bg-soft/70 hover:text-brand-text"
            )}
          >
            <span>Devices</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                activeMenu === "Devices" && "rotate-180 text-brand-text"
              )}
            />
          </button>

          {/* 3. Solutions */}
          <button
            type="button"
            onMouseEnter={() => handleMouseEnter("Solutions")}
            onClick={() => setActiveMenu(activeMenu === "Solutions" ? null : "Solutions")}
            aria-expanded={activeMenu === "Solutions"}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition-all xl:text-sm",
              activeMenu === "Solutions" || pathname.startsWith("/solutions")
                ? "bg-soft text-brand-text font-bold"
                : "text-body-strong hover:bg-soft/70 hover:text-brand-text"
            )}
          >
            <span>Solutions</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                activeMenu === "Solutions" && "rotate-180 text-brand-text"
              )}
            />
          </button>

          {/* 4. Pricing (Direct Link) */}
          <Link
            href="/pricing"
            onMouseEnter={() => handleMouseEnter("Pricing")}
            className={cn(
              "relative whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition-colors xl:text-sm",
              pathname === "/pricing"
                ? "text-brand-text font-bold"
                : "text-body-strong hover:bg-soft/70 hover:text-brand-text"
            )}
          >
            <span>Pricing</span>
            {pathname === "/pricing" && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-brand-600"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </Link>

          {/* 5. Company */}
          <button
            type="button"
            onMouseEnter={() => handleMouseEnter("Company")}
            onClick={() => setActiveMenu(activeMenu === "Company" ? null : "Company")}
            aria-expanded={activeMenu === "Company"}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition-all xl:text-sm",
              activeMenu === "Company" || ["/about", "/contact", "/pay-bill"].some((p) => pathname.startsWith(p))
                ? "bg-soft text-brand-text font-bold"
                : "text-body-strong hover:bg-soft/70 hover:text-brand-text"
            )}
          >
            <span>Company</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                activeMenu === "Company" && "rotate-180 text-brand-text"
              )}
            />
          </button>
        </nav>

        {/* Right: Actions, Theme, Cart & Auth */}
        <div className="flex items-center gap-2">
        
          <ThemeToggle />

          {/* Cart Icon */}
          <button
            onClick={() => dispatch(setCartOpen(true))}
            aria-label={`Cart, ${cartCount} items`}
            className="relative grid h-9 w-9 place-items-center rounded-md text-body-strong transition-colors hover:bg-softer"
          >
            <ShoppingCart className="h-4.5 w-4.5" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth State (Desktop) */}
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <span className="flex items-center gap-1.5 text-xs font-medium text-body-strong">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </span>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <LinkButton href="/login" variant="ghost" size="sm">
                  Login
                </LinkButton>
                <LinkButton href="/register" size="sm">
                  Get Started
                </LinkButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => dispatch(setMobileNav(!mobileNavOpen))}
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid h-9 w-9 place-items-center rounded-md text-body-strong transition-colors hover:bg-softer lg:hidden"
          >
            {mobileNavOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {/* ===================================================================
          SIMPLE SUBMENU DROPDOWN (Strictly inside Navbar Container Width)
         =================================================================== */}
      <AnimatePresence>
        {activeMenu && activeMenu !== "Pricing" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            className="absolute inset-x-0 top-full z-40 border-b border-line bg-surface/98 shadow-xl backdrop-blur-2xl"
          >
            <Container className="py-6">
              {/* 1. Features Panel */}
              {activeMenu === "Features" && (
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-text">
                        Telematics Features
                      </p>
                      <p className="text-xs text-slate-500">
                        10-second updates, live traffic, and BTRC-approved telematics.
                      </p>
                    </div>
                    <Link
                      href="/features"
                      onClick={closeMenu}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-text hover:underline"
                    >
                      <span>View all 40+ features</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                      href="/features#all-features"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-500/10 text-brand-text group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Navigation className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                          Live GNSS Tracking
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Real-time location, 10s intervals, Google Street View.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/features#all-features"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                          Remote Engine Lock
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Solid-state immobilizer relay, tamper and SOS alerts.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/features#all-features"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <Fuel className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                          Fuel Ultrasonic Rods
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          99.5% accuracy fuel monitoring & theft prevention.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/features#all-features"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                          Geofence & Curfew
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Boundary perimeter alerts and over-speed detection.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}

              {/* 2. Devices Panel */}
              {activeMenu === "Devices" && (
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-text">
                        Tracking Hardware & Sensors
                      </p>
                      <p className="text-xs text-slate-500">
                        BTRC approved genuine Concox, Teltonika and SinoTrack GPS terminals.
                      </p>
                    </div>
                    <Link
                      href="/devices"
                      onClick={closeMenu}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-text hover:underline"
                    >
                      <span>Explore all devices</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                      href="/devices"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-500/10 text-brand-text group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                            4G GPS Trackers
                          </p>
                          <span className="rounded bg-brand-500/10 px-1 py-0.2 font-mono text-[9px] font-bold text-brand-text">
                            Concox
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Heavy duty 4G telemetry with solid-state relay kit.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/devices"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                            OBD-II Plug & Play
                          </p>
                          <span className="rounded bg-cyan-500/10 px-1 py-0.2 font-mono text-[9px] font-bold text-cyan-600">
                            10s
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          No wire cutting. Plugs directly into vehicle OBD port.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/devices"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Video className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                            AI Dual Dashcam
                          </p>
                          <span className="rounded bg-amber-500/10 px-1 py-0.2 font-mono text-[9px] font-bold text-amber-600">
                            ADAS
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Live road video streaming and in-cabin IR camera.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/devices"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                            Voice Monitoring
                          </p>
                          <span className="rounded bg-emerald-500/10 px-1 py-0.2 font-mono text-[9px] font-bold text-emerald-600">
                            Audio
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Live acoustic surveillance for passenger vehicles.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}

              {/* 3. Solutions Panel */}
              {activeMenu === "Solutions" && (
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-text">
                        Industry Solutions
                      </p>
                      <p className="text-xs text-slate-500">
                        Tailored GPS tracking for private cars, logistics fleets, and motorcycles.
                      </p>
                    </div>
                    <Link
                      href="/solutions"
                      onClick={closeMenu}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-text hover:underline"
                    >
                      <span>Browse all solutions</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <Link
                      href="/solutions#private-cars"
                      onClick={closeMenu}
                      className="group flex flex-col items-center rounded-md border border-line/60 bg-soft/40 p-3 text-center transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-brand-500/10 text-brand-text group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Car className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-ink group-hover:text-brand-text">
                        Private Cars
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Theft recovery
                      </p>
                    </Link>

                    <Link
                      href="/solutions#logistics"
                      onClick={closeMenu}
                      className="group flex flex-col items-center rounded-md border border-line/60 bg-soft/40 p-3 text-center transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Truck className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-ink group-hover:text-brand-text">
                        Logistics
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Cargo & dispatch
                      </p>
                    </Link>

                    <Link
                      href="/solutions#motorcycles"
                      onClick={closeMenu}
                      className="group flex flex-col items-center rounded-md border border-line/60 bg-soft/40 p-3 text-center transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <Bike className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-ink group-hover:text-brand-text">
                        Motorcycles
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Bikes & couriers
                      </p>
                    </Link>

                    <Link
                      href="/solutions#construction"
                      onClick={closeMenu}
                      className="group flex flex-col items-center rounded-md border border-line/60 bg-soft/40 p-3 text-center transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <HardHat className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-ink group-hover:text-brand-text">
                        Construction
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Heavy machinery
                      </p>
                    </Link>

                    <Link
                      href="/solutions#public-transport"
                      onClick={closeMenu}
                      className="group flex flex-col items-center rounded-md border border-line/60 bg-soft/40 p-3 text-center transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Bus className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-ink group-hover:text-brand-text">
                        Public Buses
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Route compliance
                      </p>
                    </Link>

                    <Link
                      href="/solutions#cng"
                      onClick={closeMenu}
                      className="group flex flex-col items-center rounded-md border border-line/60 bg-soft/40 p-3 text-center transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-rose-500/10 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        <Fuel className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-bold text-ink group-hover:text-brand-text">
                        CNG Autos
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Rental drivers
                      </p>
                    </Link>
                  </div>
                </div>
              )}

              {/* 4. Company Panel */}
              {activeMenu === "Company" && (
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-line/60 pb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-text">
                        Company & Customer Support
                      </p>
                      <p className="text-xs text-slate-500">
                        Founded in Dhaka. 24/7 dedicated helpline and police dispatch assistance.
                      </p>
                    </div>
                    <a
                      href={`tel:${SITE.phone}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-text hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Direct Helpline: {SITE.phone}</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Link
                      href="/about"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-500/10 text-brand-text group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Info className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                          About Safety GPS
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Our Dhaka engineering lab, BTRC compliance and nationwide fleet.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                          Contact & Dispatch Desk
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          24/7 control room at Shukrabad, Dhanmondi, Dhaka.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/pay-bill"
                      onClick={closeMenu}
                      className="group flex items-start gap-3 rounded-md border border-line/60 bg-soft/40 p-3.5 transition-colors hover:border-brand-500/50 hover:bg-soft"
                    >
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink group-hover:text-brand-text">
                          Pay Subscription Bill
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                          Instant online monthly recharge via bKash and Nagad.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
