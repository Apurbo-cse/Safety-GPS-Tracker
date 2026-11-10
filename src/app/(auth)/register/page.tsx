import Link from "next/link";
import AuthShell from "@/components/forms/AuthShell";
import RegisterForm from "@/components/forms/RegisterForm";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Create Account", "Register for the Safety GPS Tracker account (demo).", "/register");

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Get started with GPS vehicle tracking." footer={<>Already registered? <Link href="/login" className="font-semibold text-brand-text">Login</Link></>}>
      <RegisterForm />
    </AuthShell>
  );
}
