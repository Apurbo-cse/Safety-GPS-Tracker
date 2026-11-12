/** Company details used when none have been saved yet (the values the website shipped with). */
export const DEFAULT_SITE = {
  name: "Safety GPS Tracker",
  tagline: "Real-time GPS vehicle tracking solution",
  phone: "01713546487",
  email: "info@imprssivebd.com",
  address: "Meem Tower, 4th Floor, 104 Shukrabad Main Road, Dhaka, Bangladesh",
  hours: "Sat–Thu, 9:00 AM – 8:00 PM · 24×7 helpline",
  facebook: "",
  youtube: "",
  linkedin: "",
  instagram: "",
};
export type SiteDetails = typeof DEFAULT_SITE;

/** Pages that exist from the start and can't be deleted (they are linked from the checkout and footer). */
export const SYSTEM_PAGES = ["privacy", "terms"] as const;
