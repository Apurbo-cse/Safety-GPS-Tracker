"use client";
import StoreProvider from "@/store/StoreProvider";
import ThemeSync from "./ThemeSync";
import Preloader from "./Preloader";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <ThemeSync />
      <Preloader />
    </StoreProvider>
  );
}
