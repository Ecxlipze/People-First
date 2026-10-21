import { requireStaff } from "@/app/cms/session";

/* Blog authors have no access to this section; Django enforces it too. */
export default async function StaffOnlyLayout({ children }: { children: React.ReactNode }) {
  await requireStaff();
  return children;
}
