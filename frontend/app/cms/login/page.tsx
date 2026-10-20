import { redirect } from "next/navigation";
import { hasSession } from "@/app/cms/session";
import LoginForm from "@/app/cms/login/LoginForm";

export default async function LoginPage() {
  if (await hasSession()) redirect("/cms");

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-2xl bg-white p-7 shadow-[0_18px_44px_-24px_rgba(45,6,75,0.35)] sm:mt-16 sm:p-9">
      <h1 className="font-display text-2xl font-extrabold text-[#171922]">Sign in</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Use the username and password you were given to manage blog posts.
      </p>
      <div className="mt-7">
        <LoginForm />
      </div>
    </div>
  );
}
