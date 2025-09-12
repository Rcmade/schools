"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useSignUp from "@/features/auth/hooks/useSignUp";
import Link from "next/link";

export default function SignUpForm() {
  const { form, isLoading, onSubmit } = useSignUp();

  return (
    <div className="max-h-fit space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Enter your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    type="tel"
                    placeholder="Your Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} spinner type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </Form>

      {/* "Don't have an account? Sign up" */}
      <Button variant="link" asChild>
        <Link href="/auth/login">
          Already have an account? <strong className="mx-1">Sign In</strong>
        </Link>
      </Button>
    </div>
  );
}
