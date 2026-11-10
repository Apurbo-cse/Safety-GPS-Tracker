export const SITE = {
  name: "Safety GPS Tracker",
  tagline: "Real-time GPS vehicle tracking solution",
  phone: "01713546487",
  email: "info@imprssivebd.com",
  address: "Meem Tower, 4th Floor, 104 Shukrabad Main Road, Dhaka, Bangladesh",
  url: "https://safetygpstracker.example",
  referenceUrl: "https://safetygpstracker.com.bd/",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/devices", label: "Tracking Devices" },
  { href: "/solutions", label: "Solutions" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export const DEVICE_PARTNER_LOGOS = [
  { name: "Concox", logo: "/img/partners/concox.png" },
  { name: "Teltonika", logo: "/img/partners/teltonika.png" },
  { name: "Coban", logo: "/img/partners/coban.png" },
  { name: "Benway", logo: "/img/partners/benway.png" },
  { name: "SinoTrack", logo: "/img/partners/sinotrack.png" },
  { name: "iTrack", logo: "/img/partners/itrack.png" },
];

export const TELECOM_PARTNER_LOGOS = [
  { name: "Grameenphone", logo: "/img/partners/grameenphone.png" },
  { name: "Banglalink", logo: "/img/partners/banglalink.png" },
  { name: "Robi", logo: "/img/partners/robi.png" },
  { name: "Wherever SIM", logo: "/img/partners/wherever-sim.png" },
];

export const DEVICE_PARTNERS = DEVICE_PARTNER_LOGOS.map((p) => p.name);
export const TELECOM_PARTNERS = TELECOM_PARTNER_LOGOS.map((p) => p.name);

export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.safetygpsrackerclient.android&hl=en";
