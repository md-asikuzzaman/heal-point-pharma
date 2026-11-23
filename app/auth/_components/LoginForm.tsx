"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import z from "zod";
import SubmitButton from "./SubmitButton";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsPending(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result || result.error) {
        toast.error("Invalid email or password.");
        return;
      }

      // Retrieve authenticated session
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      if (!response.ok) {
        toast.error("Unable to retrieve your session.");
        return;
      }

      const session = await response.json();

      if (!session?.user) {
        toast.error("Unable to retrieve your session.");
        return;
      }

      // Role-based redirect
      const redirectPath =
        session.user.role === "ADMIN" ? "/admin" : callbackUrl;

      console.log(redirectPath);

      router.replace(redirectPath);
      router.refresh();
    } catch (error: unknown) {
      console.error("Login error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", {
        redirectTo: callbackUrl,
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Unable to login with Google.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-lg">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Login to your account</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center rounded-md border px-2 focus-within:ring-1 focus-within:ring-ring">
                      <MailIcon className="h-5 w-5 text-muted-foreground" />

                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        className="border-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center rounded-md border px-2 focus-within:ring-1 focus-within:ring-ring">
                      <LockIcon className="h-5 w-5 text-muted-foreground" />

                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        className="border-0 shadow-none focus-visible:ring-0"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="ml-2"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton
              text="Log In"
              loadingText="Logging in..."
              isPending={isPending}
            />
          </form>
        </Form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-sm uppercase text-muted-foreground">
            <span className="bg-white px-2">or</span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="flex w-full items-center justify-center gap-2"
          onClick={handleGoogleLogin}
          type="button"
        >
          <FcGoogle size={18} />
          Login with Google
        </Button>

        {/* Register */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
