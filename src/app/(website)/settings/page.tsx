import SettingsView from "@/components/account/SettingsView";
import { pageMeta } from "@/lib/metadata";

export const metadata = { ...pageMeta("Settings", "Alert, appearance, security and privacy settings.", "/settings"), robots: { index: false } };

export default function Page() {
  return <SettingsView />;
}
