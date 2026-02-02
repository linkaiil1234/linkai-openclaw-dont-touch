import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  linkWithPopup,
  signInAnonymously,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCredential,
  signInWithPopup,
  signOut,
  verifyPasswordResetCode,
} from "firebase/auth";
import { toast } from "sonner";

import { FIREBASE_ERROR_CODES_MESSAGES } from "@/constants/common";
import type { TFirebaseErrorCodes } from "@/constants/common";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { auth } from "@/services/firebase";

export const useFirebase = () => {
  const router = useRouter();
  const { fetchUserData } = useAuth();
  const [isGooglSigninLoading, setIsGoogleSigninLoading] = useState(false);
  const [isEmailPasswordLoading, setIsEmailPasswordLoading] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);

  return {
    signInAnonymously: async () => {
      setIsGoogleSigninLoading(true);
      try {
        // Check if user is already signed in anonymously
        if (auth.currentUser?.isAnonymous) {
          // User is already signed in anonymously, just redirect
          router.push("/agents");
          toast.success("Continuing as guest");
          return;
        }

        // Only create new anonymous user if none exists
        await signInAnonymously(auth);
        // Redirect anonymous users to agents page
        router.push("/agents");
        toast.success("Signed in as guest");
      } catch (error: unknown) {
        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Failed to sign in anonymously",
        );
      } finally {
        setIsGoogleSigninLoading(false);
      }
    },
    googleSignIn: async () => {
      setIsGoogleSigninLoading(true);
      const provider = new GoogleAuthProvider();
      const anonymousUser = auth.currentUser?.isAnonymous
        ? auth.currentUser
        : null;
      const anonymousIdToken = anonymousUser
        ? await anonymousUser.getIdToken()
        : null;

      try {
        if (anonymousUser) {
          await linkWithPopup(anonymousUser, provider);
          await auth.currentUser?.getIdToken(true);
          await api.post("/auth/sync");
          await fetchUserData();
          toast.success("Account upgraded successfully!");
          return;
        }

        await signInWithPopup(auth, provider);
        // Auth provider will handle redirect based on signup status
        toast.success("Successfully signed in!");
      } catch (error: unknown) {
        const errorCode = (error as { code?: string })?.code;

        // If the Google account is already linked to another Firebase user,
        // linkWithPopup fails. Fallback: sign in with that Google credential,
        // then ask backend to merge the anonymous user's data into this account.
        if (
          anonymousUser &&
          anonymousIdToken &&
          errorCode === "auth/credential-already-in-use"
        ) {
          const credential = GoogleAuthProvider.credentialFromError(
            error as never,
          );
          if (!credential) throw error;

          await signInWithCredential(auth, credential);
          await auth.currentUser?.getIdToken(true);
          await api.post("/auth/merge", {
            anonymous_id_token: anonymousIdToken,
          });
          await fetchUserData();
          toast.success("Signed in successfully!");
          router.push("/agents");
          return;
        }

        // Handle account exists with different credential (email/password exists, trying Google)
        if (
          errorCode === "auth/account-exists-with-different-credential" ||
          errorCode === "auth/email-already-in-use"
        ) {
          console.log("Email already in use, attempting to link accounts...");

          try {
            // For auth/account-exists-with-different-credential, credential is in error
            const credential = GoogleAuthProvider.credentialFromError(
              error as never,
            );

            const email = (error as { customData?: { email?: string } })
              ?.customData?.email;

            console.log("Credential from error:", credential);
            console.log("Email from error:", email);

            // If we have the credential, use it to sign in
            if (credential) {
              const userCredential = await signInWithCredential(
                auth,
                credential,
              );
              console.log(
                "Signed in with credential:",
                userCredential.user.uid,
              );

              await fetchUserData();
              toast.success("Successfully signed in with Google!");
              router.push("/agents");
              return;
            }

            // For auth/email-already-in-use, credential is not provided by Firebase
            // We need to handle this by signing out and retrying the popup
            console.log("No credential in error, retrying sign in...");

            // Sign out any existing session first
            if (auth.currentUser) {
              await signOut(auth);
            }

            // Retry the Google sign-in popup
            const result = await signInWithPopup(auth, provider);
            console.log("Signed in with popup retry:", result.user.uid);

            // Backend will handle account linking based on email
            await fetchUserData();

            toast.success("Successfully signed in with Google!");
            router.push("/agents");
            return;
          } catch (linkError: unknown) {
            console.error("Error linking accounts:", linkError);
            console.error(
              "Error code:",
              (linkError as { code?: string })?.code,
            );

            // If retry also fails with same error, show helpful message
            if (
              (linkError as { code?: string })?.code ===
                "auth/email-already-in-use" ||
              (linkError as { code?: string })?.code ===
                "auth/account-exists-with-different-credential"
            ) {
              toast.error(
                "This email is already registered with email/password. Firebase settings prevent automatic linking. Please contact support.",
                { duration: 6000 },
              );
            } else {
              toast.error(
                `Failed to sign in: ${
                  (linkError as { message?: string })?.message ||
                  "Unknown error"
                }`,
              );
            }
            return;
          }
        }

        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Failed to sign in with Google",
        );
      } finally {
        setIsGoogleSigninLoading(false);
      }
    },
    emailPasswordSignIn: async (
      email: string,
      password: string,
    ): Promise<void | "verification_required"> => {
      setIsEmailPasswordLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          // Sign out the user since they haven't verified their email
          await sendEmailVerification(userCredential.user);
          toast.success("Email verification sent! Please check your inbox.");
          // Return 'verification_required' to let the caller handle redirect
          return "verification_required";
        }

        // Auth provider will handle redirect based on signup status
        toast.success("Successfully signed in!");
      } catch (error: unknown) {
        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Failed to sign in",
        );
      } finally {
        setIsEmailPasswordLoading(false);
      }
    },
    emailPasswordSignUp: async (email: string, password: string) => {
      setIsEmailPasswordLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await sendEmailVerification(userCredential.user);
        toast.success("Verification email sent! Please check your inbox.");
      } catch (error: unknown) {
        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Failed to create account",
        );
        throw error;
      } finally {
        setIsEmailPasswordLoading(false);
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
        toast.success("Successfully signed out");
      } catch (error: unknown) {
        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Failed to sign out",
        );
      }
    },
    sendPasswordReset: async (email: string) => {
      setIsPasswordResetLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);

        toast.success("Password reset email sent! Please check your inbox.");
        return true;
      } catch (error: unknown) {
        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Failed to send password reset email",
        );
        return false;
      } finally {
        setIsPasswordResetLoading(false);
      }
    },
    verifyResetCode: async (actionCode: string) => {
      try {
        const email = await verifyPasswordResetCode(auth, actionCode);
        return { success: true, email };
      } catch (error: unknown) {
        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Invalid or expired reset code",
        );
        return { success: false, email: null };
      }
    },
    confirmPasswordReset: async (actionCode: string, newPassword: string) => {
      setIsPasswordResetLoading(true);
      try {
        await confirmPasswordReset(auth, actionCode, newPassword);

        toast.success(
          "Password reset successful! You can now login with your new password.",
        );
        return true;
      } catch (error: unknown) {
        toast.error(
          FIREBASE_ERROR_CODES_MESSAGES[
            (error as { code: TFirebaseErrorCodes }).code
          ] || "Failed to reset password",
        );
        return false;
      } finally {
        setIsPasswordResetLoading(false);
      }
    },
    isGooglSigninLoading,
    isEmailPasswordLoading,
    isPasswordResetLoading,
  };
};
