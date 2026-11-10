import { LinkButton } from "@/components/common/Button";
import Logo from "@/components/common/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <div className="flex justify-center"><Logo /></div>
        <p className="mt-8 text-6xl font-extrabold text-brand-text">404</p>
        <h1 className="mt-2 text-xl font-bold text-ink">Page not found</h1>
        <p className="mt-1 text-sm text-body">The page you are looking for does not exist.</p>
        <div className="mt-5 flex justify-center gap-3"><LinkButton href="/">Go home</LinkButton><LinkButton href="/pricing" variant="outline">View pricing</LinkButton></div>
      </div>
    </div>
  );
}
