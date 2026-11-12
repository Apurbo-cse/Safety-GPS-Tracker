import Link from "next/link";
import AuthShell from "@/components/forms/AuthShell";
import ForgotForm from "@/components/forms/ForgotForm";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Forgot Password", "Reset your Safety GPS Tracker account password.", "/forgot-password");

export default function ForgotPage() {
  return (
    <AuthShell title="Forgot password?" subtitle="Enter your email or mobile number and we'll send reset instructions." footer={<Link href="/login" className="font-semibold text-brand-text">Back to login</Link>}>
      <ForgotForm />
    </AuthShell>
  );
}
