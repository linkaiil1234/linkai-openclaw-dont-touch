"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { TApiSuccess } from "@/types/api";
import { TLoginResponse, TSignupRequiredResponse } from "@/types/auth";
import { auth } from "@/services/firebase";

type AuthContextType = {
  session: {
    user: TLoginResponse | null;
    token: string | null;
    loading: boolean;
  };
  refreshSession: (updatedUser: TLoginResponse) => void;
  fetchUserData: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [session, setSession] = useState<AuthContextType["session"]>({
    user: null,
    token: null,
    loading: true,
  });

  const refreshSession = (updatedUser: TLoginResponse) => {
    setSession((prevSession) => ({
      ...prevSession,
      user: updatedUser,
      loading: false,
    }));
  };

  const fetchUserData = async (): Promise<void> => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      setSession({ user: null, token: null, loading: false });
      return;
    }

    try {
      const token = await firebaseUser.getIdToken(true);

      console.log(token);

      const response = (await api.get("/auth/login")) as TApiSuccess<
        TLoginResponse | TSignupRequiredResponse
      >;

      if (!response || !response.data) {
        throw new Error("No response or data");
      }

      // Check if user needs to complete signup
      if ("needs_signup" in response.data && response.data.needs_signup) {
        const name = response.data.name || firebaseUser.displayName || "";
        const isAuthTypeEmailPassword =
          response.data.auth_type === "email_password";
        const isEmailVerified = response.data.email_verified;

        if (isAuthTypeEmailPassword && !isEmailVerified) {
          // Email password user but email not verified yet
          router.replace("/verification-pending");
          setSession({ user: null, token, loading: false });
          return;
        }

        // For verified email password users or social login users, proceed to complete signup
        router.replace(`/complete-signup?name=${encodeURIComponent(name)}`);
        setSession({ user: null, token, loading: false });
        return;
      }

      console.log("[AuthProvider] User data received:", response.data);

      // Fallback to Firebase displayName if backend doesn't return a name
      const userData = response.data as TLoginResponse;
      if (!userData.name && firebaseUser.displayName) {
        userData.name = firebaseUser.displayName;
      }

      setSession({
        user: userData,
        token,
        loading: false,
      });
    } catch (e) {
      console.error("[AuthProvider] Error fetching user", e);
      router.replace("/login");
      toast.error("Something went wrong!");
      signOut(auth);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData();
      } else {
        setSession({ user: null, token: null, loading: false });
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSession({ user: null, token: null, loading: false });
      router.replace("/login");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        refreshSession,
        fetchUserData,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
