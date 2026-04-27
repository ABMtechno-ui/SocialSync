"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDemoBearerToken, setStoredAuthToken } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nextPath = useMemo(
    () => searchParams.get("next") || "/",
    [searchParams]
  );

  async function handleDemoLogin() {
    const token = getDemoBearerToken();
    if (!token) {
      setError("NEXT_PUBLIC_DEBUG_BEARER_TOKEN is not configured.");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      setStoredAuthToken(token);
      router.replace(nextPath);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to store the demo token."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fff9ea_0%,#f7f2ea_55%,#efe6d7_100%)] px-6 py-10">
      <section className="w-full max-w-[460px] rounded-[30px] border border-[#ece2d2] bg-white/95 p-8 shadow-[0_22px_60px_rgba(24,24,24,0.08)] backdrop-blur">
        {/* ...your existing JSX unchanged... */}
      </section>
    </main>
  );
}
