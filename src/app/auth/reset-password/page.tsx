"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { resetPassword } from "@/lib/actions/auth";

export default function ResetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    const result = await resetPassword(data);
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] w-full  overflow-hidden flex flex-col items-center justify-center px-8 py-12 text-white">
      {/* Main Content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 shadow-xl shadow-green-500/20 mb-6">
            <span className="material-symbols-outlined text-white text-4xl font-light">
              password
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight uppercase">
            Reset Password
          </h1>
          <p className="text-gray-400 text-sm mt-2">Enter your new password</p>
        </div>

        {/* Error Message */}
        {serverError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="password"
            >
              New Password
            </label>
            <div
              className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
                errors.password
                  ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
                  : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
              }`}
            >
              <span className="material-symbols-outlined text-gray-500 text-xl">
                lock
              </span>
              <input
                className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
                id="password"
                placeholder="Enter new password (min 6 chars)"
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <div
              className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
                errors.confirmPassword
                  ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
                  : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
              }`}
            >
              <span className="material-symbols-outlined text-gray-500 text-xl">
                lock
              </span>
              <input
                className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
                id="confirmPassword"
                placeholder="Confirm new password"
                type="password"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              className="group relative w-full bg-primary hover:bg-blue-600 text-white font-extrabold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/40 text-lg uppercase tracking-wider overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              <span className="relative z-10">
                {isSubmitting ? "Updating..." : "Update Password"}
              </span>
              {!isSubmitting && (
                <span className="material-symbols-outlined relative z-10 text-[24px] group-hover:translate-x-1 transition-transform">
                  check
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Back to Login
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4">
            <div className="h-1 w-8 bg-gold-accent/30 rounded-full"></div>
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
            <div className="h-1 w-8 bg-gold-accent/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
