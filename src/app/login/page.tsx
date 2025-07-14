
"use client";

// This page is no longer used for the primary login flow.
// The login logic is now handled directly in the header of the main map view.
// This file can be removed or kept as a fallback. For now, we'll just
// make it redirect to the main page.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Always redirect to the main page, which now handles the auth state.
    router.push("/");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
