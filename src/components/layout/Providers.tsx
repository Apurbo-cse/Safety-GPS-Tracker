"use client";
import StoreProvider from "@/store/StoreProvider";
import ThemeSync from "./ThemeSync";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <ThemeSync />
    </StoreProvider>
  );
}
