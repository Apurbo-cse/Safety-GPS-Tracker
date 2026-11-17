import Container from "@/components/common/Container";

const S = ({ className = "" }: { className?: string }) => <div className={`skeleton ${className}`} />;

/** Hero band + card grid: the default shape for marketing pages. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="bg-soft py-12 sm:py-16">
        <Container className="space-y-4">
          <S className="h-4 w-24" />
          <S className="h-10 w-3/4 max-w-xl" />
          <S className="h-4 w-full max-w-2xl" />
          <S className="h-4 w-2/3 max-w-lg" />
        </Container>
      </div>
      <Container className="py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <S key={i} className="h-48 rounded-2xl" />)}
        </div>
      </Container>
    </div>
  );
}

/** Product / article / order detail: media on the left, text blocks on the right. */
export function DetailSkeleton() {
  return (
    <Container className="py-10" >
      <div aria-busy="true" aria-label="Loading" className="grid gap-8 lg:grid-cols-2">
        <S className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <S className="h-4 w-28" />
          <S className="h-9 w-3/4" />
          <S className="h-5 w-1/3" />
          <S className="h-4 w-full" />
          <S className="h-4 w-full" />
          <S className="h-4 w-2/3" />
          <S className="mt-4 h-12 w-full rounded-xl" />
        </div>
      </div>
    </Container>
  );
}

/** Heading + stacked rows: orders, profile, settings, checkout. */
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Container className="max-w-4xl py-10">
      <div aria-busy="true" aria-label="Loading" className="space-y-4">
        <S className="h-8 w-48" />
        {Array.from({ length: rows }, (_, i) => <S key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    </Container>
  );
}

/** Admin pages: title row, stat cards and a table. */
export function AdminSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <S className="h-8 w-48" />
        <S className="h-9 w-28 rounded-lg" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <S key={i} className="h-24 rounded-xl" />)}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => <S key={i} className="h-14 w-full rounded-lg" />)}
      </div>
    </div>
  );
}

/** Login / register card. */
export function AuthSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-4">
      <S className="mx-auto h-10 w-40" />
      <S className="h-12 w-full rounded-xl" />
      <S className="h-12 w-full rounded-xl" />
      <S className="h-12 w-full rounded-xl" />
    </div>
  );
}

/** Printable invoice sheet. */
export function InvoiceSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto max-w-3xl space-y-4 rounded-xl bg-white p-8">
      <S className="h-8 w-40" />
      <S className="h-4 w-1/2" />
      {Array.from({ length: 5 }, (_, i) => <S key={i} className="h-10 w-full" />)}
      <S className="ml-auto h-8 w-40" />
    </div>
  );
}
