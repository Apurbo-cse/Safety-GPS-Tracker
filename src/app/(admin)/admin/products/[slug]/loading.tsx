import { AdminHeader, AdminDetailSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <>
      <AdminHeader actions={2} />
      <AdminDetailSkeleton />
    </>
  );
}
