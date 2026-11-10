import Link from "next/link";
import AuthShell from "@/components/forms/AuthShell";
import LoginForm from "@/components/forms/LoginForm";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta("Login", "Sign in to your Safety GPS Tracker account (demo).", "/login");

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your account." footer={<>New here? <Link href="/register" className="font-semibold text-brand-text">Create an account</Link></>}>
      <LoginForm />
    </AuthShell>
  );
}
