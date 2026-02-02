"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
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
});

type ResetPasswordFormProps = {
  sendPasswordReset: (email: string) => Promise<boolean>;
  isPasswordResetLoading: boolean;
};

export function ResetPasswordForm({
  sendPasswordReset,
  isPasswordResetLoading,
}: ResetPasswordFormProps) {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await sendPasswordReset(values.email);
    if (success) {
      setEmailSent(true);
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 mr-1" />
          Back to login
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-sm mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 text-center">
            <h1
              className="mb-2 font-semibold text-foreground text-3xl"
              style={{ fontFamily: "sans-serif" }}
            >
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              {emailSent
                ? "Check your email for a password reset link."
                : "Enter your email address and we'll send you a password reset link."}
            </p>
          </div>

          {!emailSent ? (
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
                              disabled={isPasswordResetLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isPasswordResetLoading}
                    >
                      {isPasswordResetLoading
                        ? "Sending..."
                        : "Send Reset Link"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  We've sent a password reset link to your email address. Please
                  check your inbox and follow the instructions to reset your
                  password.
                </p>
              </div>
              <div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                >
                  Send Another Link
                </Button>
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-muted-foreground sm:text-start">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
