"use client";

import { apiCient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";

export type RegisterType = {
  error?: string;
  success?: boolean;
};

const RegisterPage = () => {
  const [state, registerAction, isPending] = useActionState(
    async (
      prevState: RegisterType,
      formData: FormData,
    ): Promise<RegisterType> => {
      const name = formData.get("name")?.toString().trim() ?? "";
      const email = formData.get("email")?.toString().trim() ?? "";
      const password = formData.get("password")?.toString() ?? "";
      const teamCode = formData.get("teamCode")?.toString().trim() ?? "";

      // Validation
      if (!name) {
        return { success: false, error: "Name is required." };
      }

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
        await apiCient.register({
          name,
          email,
          password,
          teamCode: teamCode || undefined,
        });
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
    <div className=" bg-slate-800 mx-auto bg-slate-700 text-white mt-10 max-w-md rounded-lg border p-6 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-bold">Create Account</h1>

      <form action={registerAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="teamCode" className="mb-1 block text-sm font-medium">
            Team Code (Optional)
          </label>

          <input
            id="teamCode"
            name="teamCode"
            type="text"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-white-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
