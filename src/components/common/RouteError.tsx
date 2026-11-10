"use client";
import { TriangleAlert } from "lucide-react";
import { Button } from "./Button";

export default function RouteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600"><TriangleAlert className="h-6 w-6" /></span>
      <h2 className="mt-4 text-xl font-bold text-ink">Something went wrong</h2>
      <p className="mt-2 text-sm text-body">This section failed to load. Please try again.</p>
      <Button className="mt-5" onClick={reset}>Try again</Button>
    </div>
  );
}
