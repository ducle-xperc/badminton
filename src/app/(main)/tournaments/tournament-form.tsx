"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tournamentFormSchema, type TournamentFormData, type AchievementTierInput } from "@/lib/validations/tournament";
import { createTournament, updateTournament } from "@/lib/actions/tournament";
import type { Tournament } from "@/types/database";
import { AchievementTiersSection } from "./components/AchievementTiersSection";
import { DatePicker } from "@/components/ui/date-picker";

// TournamentFormData is now imported from validations

interface TournamentFormProps {
  tournament?: Tournament;
  mode: "create" | "edit";
  existingTiers?: AchievementTierInput[];
}

export function TournamentForm({ tournament, mode, existingTiers }: TournamentFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema) as Resolver<TournamentFormData>,
    defaultValues: tournament
      ? {
          name: tournament.name,
          description: tournament.description || "",
          start_date: tournament.start_date,
          end_date: tournament.end_date,
          registration_deadline: tournament.registration_deadline || "",
          location: tournament.location,
          max_participants: tournament.max_participants,
          team_size: tournament.team_size || 2,
          entry_fee: tournament.entry_fee,
          prize_pool: tournament.prize_pool || "",
          banner_url: tournament.banner_url || "",
          categories: tournament.categories,
          achievement_tiers: existingTiers || [],
        }
      : {
          max_participants: 32,
          team_size: 2,
          entry_fee: 0,
          categories: [],
          achievement_tiers: [],
        },
  });

  const onSubmit = async (data: TournamentFormData) => {
    setServerError(null);
    const { achievement_tiers, ...tournamentData } = data;

    const result =
      mode === "create"
        ? await createTournament(tournamentData, achievement_tiers)
        : await updateTournament(tournament!.id, tournamentData, achievement_tiers);

    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm text-center">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
          htmlFor="name"
        >
          Tournament Name *
        </label>
        <div
          className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
            errors.name
              ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
              : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
          }`}
        >
          <span className="material-symbols-outlined text-gray-500 text-xl">
            emoji_events
          </span>
          <input
            className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
            id="name"
            placeholder="Enter tournament name"
            type="text"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-red-400 text-xs ml-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className={`w-full bg-navy-deep/50 border rounded-xl py-4 px-4 text-white placeholder:text-gray-600 focus:outline-none transition-all backdrop-blur-sm resize-none ${
            errors.description
              ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
              : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
          }`}
          id="description"
          placeholder="Describe your tournament..."
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-400 text-xs ml-1">{errors.description.message}</p>
        )}
      </div>

      {/* Dates Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <div className="space-y-2">
          <label
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
            htmlFor="start_date"
          >
            Start Date *
          </label>
          <DatePicker
            name="start_date"
            control={control}
            placeholder="Select start date"
            error={!!errors.start_date}
          />
          {errors.start_date && (
            <p className="text-red-400 text-xs ml-1">{errors.start_date.message}</p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
            htmlFor="end_date"
          >
            End Date *
          </label>
          <DatePicker
            name="end_date"
            control={control}
            placeholder="Select end date"
            error={!!errors.end_date}
          />
          {errors.end_date && (
            <p className="text-red-400 text-xs ml-1">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      {/* Registration Deadline */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
          htmlFor="registration_deadline"
        >
          Registration Deadline
        </label>
        <DatePicker
          name="registration_deadline"
          control={control}
          placeholder="Select deadline"
          error={!!errors.registration_deadline}
        />
        {errors.registration_deadline && (
          <p className="text-red-400 text-xs ml-1">{errors.registration_deadline.message}</p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
          htmlFor="location"
        >
          Location *
        </label>
        <div
          className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
            errors.location
              ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
              : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
          }`}
        >
          <span className="material-symbols-outlined text-gray-500 text-xl">
            location_on
          </span>
          <input
            className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
            id="location"
            placeholder="Enter venue location"
            type="text"
            {...register("location")}
          />
        </div>
        {errors.location && (
          <p className="text-red-400 text-xs ml-1">{errors.location.message}</p>
        )}
      </div>

      {/* Participants, Team Size & Entry Fee Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Max Participants */}
        <div className="space-y-2">
          <label
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
            htmlFor="max_participants"
          >Participants</label>
          <input
            className={`w-full bg-navy-deep/50 border rounded-xl py-4 px-4 text-white focus:outline-none transition-all backdrop-blur-sm ${
              errors.max_participants
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
            }`}
            id="max_participants"
            type="number"
            min={2}
            max={256}
            {...register("max_participants")}
          />
          {errors.max_participants && (
            <p className="text-red-400 text-xs ml-1">{errors.max_participants.message}</p>
          )}
        </div>

        {/* Team Size */}
        <div className="space-y-2">
          <label
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
            htmlFor="team_size"
          >Type</label>
          <select
            className={`w-full bg-navy-deep/50 border rounded-xl py-4 px-4 text-white focus:outline-none transition-all backdrop-blur-sm appearance-none cursor-pointer ${
              errors.team_size
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
            }`}
            id="team_size"
            {...register("team_size")}
          >
            <option value={1}>Singles</option>
            <option value={2}>Doubles</option>
          </select>
          {errors.team_size && (
            <p className="text-red-400 text-xs ml-1">{errors.team_size.message}</p>
          )}
        </div>

        {/* Entry Fee */}
        <div className="space-y-2">
          <label
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
            htmlFor="entry_fee"
          >Fee (VND)</label>
          <input
            className={`w-full bg-navy-deep/50 border rounded-xl py-4 px-4 text-white focus:outline-none transition-all backdrop-blur-sm ${
              errors.entry_fee
                ? "border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50"
                : "border-white/10 focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50"
            }`}
            id="entry_fee"
            type="number"
            min={0}
            step={1000}
            {...register("entry_fee")}
          />
          {errors.entry_fee && (
            <p className="text-red-400 text-xs ml-1">{errors.entry_fee.message}</p>
          )}
        </div>
      </div>

      {/* Prize Pool */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
          htmlFor="prize_pool"
        >
          Prize Pool
        </label>
        <div
          className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
            errors.prize_pool
              ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
              : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
          }`}
        >
          <span className="material-symbols-outlined text-gray-500 text-xl">
            payments
          </span>
          <input
            className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
            id="prize_pool"
            placeholder="e.g., 10,000,000 VND"
            type="text"
            {...register("prize_pool")}
          />
        </div>
        {errors.prize_pool && (
          <p className="text-red-400 text-xs ml-1">{errors.prize_pool.message}</p>
        )}
      </div>

      {/* Banner URL */}
      <div className="space-y-2">
        <label
          className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
          htmlFor="banner_url"
        >
          Banner Image URL
        </label>
        <div
          className={`flex items-center gap-3 bg-navy-deep/50 border rounded-xl px-4 transition-all backdrop-blur-sm ${
            errors.banner_url
              ? "border-red-500/50 focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50"
              : "border-white/10 focus-within:border-gold-accent/50 focus-within:ring-1 focus-within:ring-gold-accent/50"
          }`}
        >
          <span className="material-symbols-outlined text-gray-500 text-xl">
            image
          </span>
          <input
            className="flex-1 bg-transparent py-4 text-white placeholder:text-gray-600 focus:outline-none"
            id="banner_url"
            placeholder="https://example.com/image.jpg"
            type="url"
            {...register("banner_url")}
          />
        </div>
        {errors.banner_url && (
          <p className="text-red-400 text-xs ml-1">{errors.banner_url.message}</p>
        )}
      </div>

      {/* Achievement Tiers */}
      <div className="pt-4 border-t border-white/10">
        <AchievementTiersSection control={control} register={register} />
      </div>

      {/* Submit Button */}
      <button
        className="group relative w-full bg-primary hover:bg-blue-600 text-white font-extrabold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/40 text-lg uppercase tracking-wider overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isSubmitting}
      >
        <span className="relative z-10">
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Updating..."
            : mode === "create"
              ? "Create Tournament"
              : "Update Tournament"}
        </span>
        {!isSubmitting && (
          <span className="material-symbols-outlined relative z-10 text-[24px] group-hover:translate-x-1 transition-transform">
            {mode === "create" ? "add" : "save"}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </button>
    </form>
  );
}
