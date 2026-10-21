import { cmsFetch, requireSession } from "@/app/cms/session";
import ProfileForms from "@/app/cms/profile/ProfileForms";
import type { CmsProfile } from "@/app/cms/types";

export default async function ProfilePage() {
  await requireSession();
  const profile = await cmsFetch<CmsProfile>("/api/profile/", {}, { render: "/cms/profile" });

  return (
    <>
      <h1 className="font-display text-3xl font-extrabold text-[#171922]">My profile</h1>
      <p className="mt-1 text-sm text-zinc-600">Manage how you appear in the Content Studio and keep your account secure.</p>
      <ProfileForms profile={profile} />
    </>
  );
}
