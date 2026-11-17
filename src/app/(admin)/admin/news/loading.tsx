import { AdminHeader, AdminTableSkeleton } from "@/components/common/Skeletons";

export default function Loading() {
  return (
    <>
      <AdminHeader />
      <AdminTableSkeleton tabs={false} thumbs />
    </>
  );
}
