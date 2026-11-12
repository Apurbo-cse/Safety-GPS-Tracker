import { redirect } from "next/navigation";

/** The catalogue tabs are now separate pages (see the sidebar). */
export default function Page() { redirect("/admin/categories"); }
