"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";
import { Loading } from "@/components/ui/loading";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users (except anonymous) to dashboard
    if (
      !session.loading &&
      session.user &&
      session.user.auth_type !== "anonymous"
    ) {
      router.replace("/agents");
    }
  }, [session.loading, session.user, router]);

  if (session.loading) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loading size="lg" message="Checking authentication..." />
      </div>
    );
  }

  return children;
};

export default AuthLayout;
