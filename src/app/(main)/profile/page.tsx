"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { getProfile, updateProfile } from "@/lib/actions/profile";
import { BottomNav } from "@/components/BottomNav";
import { AvatarPickerModal } from "@/components/ui/avatar-picker-modal";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
        const avatarUrl = result.data.avatar_url || null;
        reset({
          nickname: result.data.nickname || "",
          gender: result.data.gender,
          status: result.data.status || "",
          avatar_url: avatarUrl,
        });
        setSelectedAvatar(avatarUrl);
        setGender(result.data.gender);
      }
      setLoading(false);
    }
    loadProfile();
  }, [reset]);

  const handleAvatarChange = (url: string) => {
    setSelectedAvatar(url);
    setValue("avatar_url", url);
  };

  const onSubmit = async (data: ProfileInput) => {
    setServerError(null);
    setSuccessMessage(null);
    const result = await updateProfile(data);
    if (result?.error) {
      setServerError(result.error);
    } else if (result?.success) {
      setSuccessMessage("Updated successfully!");
    }
  };

  if (loading) {
    return (
      <div className="relative mx-auto min-h-screen max-w-[480px] w-full  overflow-hidden flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] w-full w-full  overflow-hidden flex flex-col text-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-primary/20 rounded-full"></div>
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
        <h1 className="text-lg font-bold uppercase tracking-wider">Profile</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-8 pb-12">
        {/* Current Avatar Display with Edit Button */}
        <div className="mb-6 text-center">
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            className="inline-block relative group cursor-pointer"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-800 p-[3px] shadow-xl shadow-primary/30">
              <Avatar
                src={selectedAvatar}
                alt="Current Avatar"
                gender={gender}
                size="lg"
                className="size-full border-2 border-background-dark"
              />
            </div>
            {/* Edit Icon Overlay */}
            <div className="absolute bottom-0 right-0 size-8 rounded-full bg-primary border-2 border-background-dark flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-sm">
                edit
              </span>
            </div>
          </button>
          <p className="text-xs text-gray-500 mt-2">Tap to change avatar</p>
        </div>

        {/* Avatar Picker Modal */}
        <AvatarPickerModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          value={selectedAvatar}
          onChange={handleAvatarChange}
        />

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
            <div
              className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
                errors.nickname
                  ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
                  : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
              }`}
            >
              <span className="material-symbols-outlined text-gray-500 text-xl">
                alternate_email
              </span>
              <input
                className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
                id="nickname"
                placeholder="Enter your nickname"
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
              Gender
            </label>
            <div
              className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
                errors.gender
                  ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
                  : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
              }`}
            >
              <span className="material-symbols-outlined text-gray-500 text-xl">
                wc
              </span>
              <select
                className="flex-1 bg-transparent py-4 text-white focus:outline-none appearance-none cursor-pointer"
                id="gender"
                {...register("gender")}
              >
                <option value="" className="">
                  Select gender
                </option>
                <option value="male" className="">
                  Male
                </option>
                <option value="female" className="">
                  Female
                </option>
                <option value="other" className="">
                  Other
                </option>
              </select>
              <span className="material-symbols-outlined text-gray-500 text-xl pointer-events-none">
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
            >Status</label>
            <div
              className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
                errors.status
                  ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
                  : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
              }`}
            >
              <span className="material-symbols-outlined text-gray-500 text-xl">
                edit_note
              </span>
              <input
                className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
                id="status"
                placeholder="e.g. Looking for partner, Ready to play..."
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
              Status will be visible to others
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
                {isSubmitting ? "Saving..." : "Save changes"}
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

      <BottomNav />
    </div>
  );
}
