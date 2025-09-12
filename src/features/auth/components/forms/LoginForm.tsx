"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useLogin from "@/features/auth/hooks/useLogin";
import { LoginVerificationStage } from "@/types/enum";
import { Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LoginForm() {
  const { form, isLoading, onSubmit, data } = useLogin();

  const isOtpSent =
    (form.getValues("stage") || data?.stage) ===
    LoginVerificationStage.OTPVerify;

  return (
    <div className="h-full max-h-fit space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Log In</h1>
        <p className="text-muted-foreground">
          Enter your Email and OTP to login
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      disabled={isLoading || isOtpSent}
                      placeholder="Your Email"
                      {...field}
                    />
                  </FormControl>
                  {isOtpSent && (
                    <Button
                      type="button"
                      asChild
                      onClick={() => {
                        form.reset();
                        setTimeout(() => {
                          window.location.reload();
                        }, 100);
                      }}
                      variant={"ghost"}
                      size="icon"
                    >
                      <Link replace href={"/auth/login"}>
                        <Pencil />
                      </Link>
                    </Button>
                  )}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <React.Fragment key={`${isOtpSent}`}>
            {isOtpSent && (
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="******"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit OTP sent to your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </React.Fragment>
          <Button disabled={isLoading} spinner type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>

      <Button variant="link" asChild>
        <Link href="/auth/sign-up">
          Don&apos;t have an account?
          <strong className="mx-1">Sign up</strong>
        </Link>
      </Button>
    </div>
  );
}
