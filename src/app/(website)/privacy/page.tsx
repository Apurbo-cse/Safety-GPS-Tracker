import DbLegalPage from "@/components/legal/DbLegalPage";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Privacy Policy", "How Safety GPS Tracker collects, uses and protects your personal and vehicle data.", "/privacy");

/** The text lives in the admin panel (Pages → Privacy Policy). */
export default async function PrivacyPage() {
  const page = await DbLegalPage({
    id: "privacy",
    hero: { art: "car", eyebrow: "Data Protection", title: "Privacy Policy & Vehicle", titleHighlight: "Data Protection", description: "How Safety GPS Tracker collects, processes, and protects your personal credentials, vehicle telematics, and real-time location records." },
  });
  return page ?? <p className="mx-auto max-w-xl px-4 py-24 text-center text-body">This page is temporarily unavailable. Please try again shortly.</p>;
}
