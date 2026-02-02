"use client";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import GridShape from "@/components/auth/grid-shape";
import { useFirebase } from "@/hooks/custom/use-firebase";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/linkai_favicon.jpeg";

const ResetPasswordPage = () => {
  const { sendPasswordReset, isPasswordResetLoading } = useFirebase();

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Form Section */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        <ResetPasswordForm
          sendPasswordReset={sendPasswordReset}
          isPasswordResetLoading={isPasswordResetLoading}
        />
      </div>

      {/* Grid Background Section */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
        {/* Grid Shape Background */}
        <div className="absolute inset-0 bg-[#161950] overflow-hidden m-8 rounded-4xl">
          <GridShape />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center max-w-xs px-6">
          <Link href="/" className="block mb-6">
            <Image
              width={80}
              height={80}
              src={logo}
              alt="Logo"
              className="rounded-lg"
            />
          </Link>
          <h2 className="text-white text-2xl font-semibold mb-3">LinkAI</h2>
          <p className="text-center text-gray-400 text-sm">
            Reset your password to regain access to your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
