"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { signIn } from "@/lib/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const urlError = searchParams.get("error");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setServerError(null);
    const result = await signIn(data);
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] w-full  overflow-hidden flex flex-col items-center justify-center px-8 py-12 text-white">
      {/* Main Content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-primary to-blue-700 shadow-xl shadow-primary/20 mb-6">
            <span className="material-symbols-outlined text-white text-4xl font-light">
              emoji_events
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gold-accent font-bold tracking-[0.3em] text-xs uppercase">
              Official App
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase leading-none">
              XPERC <br />
              <span className="text-primary italic">BADMINTON</span> <br />
              <span className="text-white">WORLD CUP</span>
            </h1>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm text-center">
            {message}
          </div>
        )}
        {(urlError || serverError) && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
            {urlError || serverError}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                mail
              </span>
              <input
                className={`w-full bg-navy-deep/50 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none transition-all backdrop-blur-sm ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                    : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
                }`}
                id="email"
                placeholder="Enter your email"
                type="email"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                lock
              </span>
              <input
                className={`w-full bg-navy-deep/50 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none transition-all backdrop-blur-sm ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                    : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
                }`}
                id="password"
                placeholder="Enter your password"
                type="password"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-400 hover:text-gold-accent transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              className="group relative w-full bg-primary hover:bg-blue-600 text-white font-extrabold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/40 text-lg uppercase tracking-wider overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              <span className="relative z-10">
                {isSubmitting ? "Signing in..." : "Login"}
              </span>
              {!isSubmitting && (
                <span className="material-symbols-outlined relative z-10 text-[24px] group-hover:translate-x-1 transition-transform">
                  login
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:text-blue-400 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-tighter">
            Join the elite circle of world class badminton
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="h-1 w-8 bg-gold-accent/30 rounded-full"></div>
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
            <div className="h-1 w-8 bg-gold-accent/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="relative mx-auto min-h-screen max-w-[480px] w-full  overflow-hidden flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
