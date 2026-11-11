import ProfileView from "@/components/account/ProfileView";
import { pageMeta } from "@/lib/metadata";

export const metadata = { ...pageMeta("My Profile", "Manage your Safety GPS Tracker account details.", "/profile"), robots: { index: false } };

export default function Page() {
  return <ProfileView />;
}
