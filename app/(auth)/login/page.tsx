"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useAuth } from "@/app/provider/AuthProvider";
import { apiCient } from "@/app/lib/apiClient";

export type LoginType = {
  error?: string;
  success?: boolean;
};

const LoginPage = () => {
  const { login } = useAuth();

  const [state, loginAction, isPending] = useActionState(
    async (prevState: LoginType, formData: FormData): Promise<LoginType> => {
      const email = formData.get("email")?.toString().trim() ?? "";
      const password = formData.get("password")?.toString() ?? "";

      // Validation

      if (!email) {
        return { success: false, error: "Email is required." };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return { success: false, error: "Please enter a valid email." };
      }

      if (password.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters.",
        };
      }

      try {
        await apiCient.login(email, password);
        window.location.href = "/dashboard";
        return { success: true };
      } catch (error) {
        return {
          error:
            error instanceof Error ? error.message : "Registeration Failed!",
        };
      }
    },
    { error: undefined, success: undefined },
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-slate-400">Sign in to your account</p>
        </div>

        <form action={loginAction} className="space-y-5">
          {state.error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
