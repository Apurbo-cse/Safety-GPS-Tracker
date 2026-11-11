"use client";
import StoreProvider from "@/store/StoreProvider";
import ThemeSync from "./ThemeSync";
import Preloader from "./Preloader";
import SpotlightEffect from "./SpotlightEffect";
import ScrollToTopOnNavigate from "./ScrollToTopOnNavigate";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ScrollToTopOnNavigate />
      {children}
      <ThemeSync />
      <Preloader />
      <SpotlightEffect />
    </StoreProvider>
  );
}
