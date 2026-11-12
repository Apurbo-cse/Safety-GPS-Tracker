"use client";
import { createContext, useContext } from "react";
import { SITE, type SiteInfo } from "@/lib/site";

const SiteContext = createContext<SiteInfo>(SITE);

/** Company details (name, phone, email, address…) as saved in the admin panel, available to every client component. */
export default function SiteProvider({ site, children }: { site: SiteInfo; children: React.ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
