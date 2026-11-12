import DbLegalPage from "@/components/legal/DbLegalPage";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Terms of Service", "The terms that apply when you use Safety GPS Tracker devices, apps and services.", "/terms");

/** The text lives in the admin panel (Pages → Terms of Service). */
export default async function TermsPage() {
  const page = await DbLegalPage({
    id: "terms",
    hero: { art: "van", eyebrow: "Legal & Compliance", title: "Terms of Service & Usage", titleHighlight: "Agreement", description: "Clear terms governing your subscription, tracking hardware ownership, service renewals, and lawful usage of the Safety GPS Tracker telematics platform." },
  });
  return page ?? <p className="mx-auto max-w-xl px-4 py-24 text-center text-body">This page is temporarily unavailable. Please try again shortly.</p>;
}
