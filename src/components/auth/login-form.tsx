"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft01Icon,
  ViewIcon,
  ViewOffIcon,
  AnonymousIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormProps = {
  googleSignIn: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  emailPasswordSignIn: (
    email: string,
    password: string,
  ) => Promise<void | "verification_required">;
  isGooglSigninLoading: boolean;
  isEmailPasswordLoading: boolean;
};

export function LoginForm({
  googleSignIn,
  signInAnonymously,
  emailPasswordSignIn,
  isGooglSigninLoading,
  isEmailPasswordLoading,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const isSubmitting = isGooglSigninLoading || isEmailPasswordLoading;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await emailPasswordSignIn(values.email, values.password);
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 mr-1" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-sm mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 text-center">
            <h1
              className="mb-2 font-semibold text-foreground text-3xl"
              style={{ fontFamily: "sans-serif" }}
            >
              Sign In
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in!
            </p>
          </div>
          <div className="w-full">
            <div className="w-full">
              <button
                type="button"
                onClick={googleSignIn}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-3 py-3 text-sm font-normal transition-colors bg-muted border rounded-lg hover:bg-accent/30 cursor-pointer disabled:opacity-50 w-full"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                {/* <span className="p-2 text-muted-foreground bg-background sm:px-5 sm:py-2">
                  Or
                </span> */}
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>
                      Email <span className="text-destructive">*</span>{" "}
                    </Label>
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="info@gmail.com"
                              className="border"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Password <span className="text-destructive">*</span>{" "}
                    </Label>
                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="border pr-10"
                                disabled={isSubmitting}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-3 top-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? (
                                  <HugeiconsIcon
                                    icon={ViewIcon}
                                    className="size-5"
                                  />
                                ) : (
                                  <HugeiconsIcon
                                    icon={ViewOffIcon}
                                    className="size-5"
                                  />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          setIsChecked(checked as boolean)
                        }
                      />
                      <label className="text-sm font-normal cursor-pointer select-none">
                        Keep me logged in
                      </label>
                    </div>
                    <Link
                      href="/reset-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div>
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isEmailPasswordLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </div>
                  {/* <div>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      disabled={isSubmitting}
                      onClick={signInAnonymously}
                    >
                      <HugeiconsIcon
                        icon={AnonymousIcon}
                        className="size-5 mr-2"
                      />
                      {isGooglSigninLoading
                        ? "Starting guest session..."
                        : "Continue as guest"}
                    </Button>
                  </div> */}
                </div>
              </form>
            </Form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-muted-foreground sm:text-start">
                Don&apos;t have an account?{" "}
                <Link
                  href="/create-account"
                  className="text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
