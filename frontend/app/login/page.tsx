import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Login — SocialSync" };

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fff9ea_0%,#f7f2ea_55%,#efe6d7_100%)]">
        <div className="font-mono text-xs uppercase tracking-[0.1em] text-[#b38d35]">
          Loading...
        </div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
