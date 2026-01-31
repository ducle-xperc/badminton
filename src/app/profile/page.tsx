"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { getProfile, updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/types/database";

export default function ProfilePage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function loadProfile() {
      const result = await getProfile();
      if (result.error) {
        setServerError(result.error);
      } else if (result.data) {
        reset({
          nickname: result.data.nickname || "",
          gender: result.data.gender,
          status: result.data.status || "",
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileInput) => {
    setServerError(null);
    setSuccessMessage(null);
    const result = await updateProfile(data);
    if (result?.error) {
      setServerError(result.error);
    } else if (result?.success) {
      setSuccessMessage("Cập nhật thành công!");
    }
  };

  if (loading) {
    return (
      <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex flex-col text-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <span className="material-symbols-outlined text-[300px]">
            person
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 pt-8">
        <Link
          href="/dashboard"
          className="size-10 rounded-xl bg-card-dark/50 border border-white/5 flex items-center justify-center hover:bg-card-dark transition-colors"
        >
          <span className="material-symbols-outlined text-gray-400">
            arrow_back
          </span>
        </Link>
        <h1 className="text-lg font-bold uppercase tracking-wider">Hồ Sơ</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-8 pb-12">
        {/* Profile Icon */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-primary to-blue-700 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-white text-5xl font-light">
              account_circle
            </span>
          </div>
        </div>

        {/* Error Message */}
        {serverError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
            {serverError}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm text-center">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Nickname */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="nickname"
            >
              Nickname
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                alternate_email
              </span>
              <input
                className={`w-full bg-navy-deep/50 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none transition-all backdrop-blur-sm ${
                  errors.nickname
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                    : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
                }`}
                id="nickname"
                placeholder="Nhập nickname của bạn"
                type="text"
                {...register("nickname")}
              />
            </div>
            {errors.nickname && (
              <p className="text-red-400 text-xs ml-1">
                {errors.nickname.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="gender"
            >
              Giới tính
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                wc
              </span>
              <select
                className={`w-full bg-navy-deep/50 border rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none transition-all backdrop-blur-sm appearance-none cursor-pointer ${
                  errors.gender
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                    : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
                }`}
                id="gender"
                {...register("gender")}
              >
                <option value="" className="bg-background-dark">
                  Chọn giới tính
                </option>
                <option value="male" className="bg-background-dark">
                  Nam
                </option>
                <option value="female" className="bg-background-dark">
                  Nữ
                </option>
                <option value="other" className="bg-background-dark">
                  Khác
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl pointer-events-none">
                expand_more
              </span>
            </div>
            {errors.gender && (
              <p className="text-red-400 text-xs ml-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="status"
            >
              Trạng thái
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                edit_note
              </span>
              <input
                className={`w-full bg-navy-deep/50 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none transition-all backdrop-blur-sm ${
                  errors.status
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                    : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
                }`}
                id="status"
                placeholder="VD: Đang tìm đối, Sẵn sàng chiến..."
                type="text"
                {...register("status")}
              />
            </div>
            {errors.status && (
              <p className="text-red-400 text-xs ml-1">
                {errors.status.message}
              </p>
            )}
            <p className="text-xs text-gray-500 ml-1">
              Trạng thái sẽ hiển thị cho người khác
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              className="group relative w-full bg-primary hover:bg-blue-600 text-white font-extrabold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/40 text-lg uppercase tracking-wider overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              <span className="relative z-10">
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </span>
              {!isSubmitting && (
                <span className="material-symbols-outlined relative z-10 text-[24px] group-hover:translate-x-1 transition-transform">
                  save
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </form>

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
