"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { performDraw, registerForTournament } from "@/lib/actions/draw";
import type { Tournament, TournamentParticipant } from "@/types/database";

interface DrawClientProps {
  tournament: Tournament;
  initialRegistration: TournamentParticipant | null | undefined;
  availableTeamsCount: number;
  totalTeamsCount: number;
}

export function DrawClient({
  tournament,
  initialRegistration,
  availableTeamsCount,
  totalTeamsCount,
}: DrawClientProps) {
  const [isPending, startTransition] = useTransition();
  const [drawnNumber, setDrawnNumber] = useState<number | null>(
    initialRegistration?.team_number ?? null
  );
  const [isRegistered, setIsRegistered] = useState(!!initialRegistration);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<string>(
    initialRegistration?.team_number?.toString() ?? "--"
  );
  const [error, setError] = useState<string | null>(null);

  const hasDrawn = drawnNumber !== null;
  const canDraw = !hasDrawn && availableTeamsCount > 0;

  const handleRegisterAndDraw = () => {
    setError(null);
    setIsSpinning(true);

    // Animate random numbers with slowing effect
    let spinCount = 0;
    const maxSpins = 30;
    let currentInterval = 80;

    const spin = () => {
      setDisplayNumber(
        Math.floor(Math.random() * totalTeamsCount + 1).toString()
      );
      spinCount++;

      if (spinCount >= maxSpins) {
        // Final delay before showing result
        setTimeout(() => {
          startTransition(async () => {
            // Register first if not registered
            if (!isRegistered) {
              const regResult = await registerForTournament(tournament.id);
              if (regResult.error) {
                setError(regResult.error);
                setIsSpinning(false);
                setDisplayNumber("--");
                return;
              }
              setIsRegistered(true);
            }

            // Then perform draw
            const result = await performDraw(tournament.id);
            setIsSpinning(false);

            if (result.error) {
              setError(result.error);
              setDisplayNumber("--");
            } else if (result.data) {
              setDrawnNumber(result.data.team_number);
              setDisplayNumber(result.data.team_number?.toString() ?? "--");
            }
          });
        }, 300);
        return;
      }

      // Gradually slow down the animation
      if (spinCount > maxSpins * 0.6) {
        currentInterval += 30;
      } else if (spinCount > maxSpins * 0.8) {
        currentInterval += 50;
      }

      setTimeout(spin, currentInterval);
    };

    spin();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-background-dark" />
        {tournament.banner_url && (
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url("${tournament.banner_url}")` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/80 to-background-dark" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full min-h-screen max-w-[480px] mx-auto w-full">
        {/* TopAppBar */}
        <div className="flex items-center p-4 justify-between bg-navy-deep/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
          <Link
            href={`/tournaments/${tournament.id}`}
            className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </Link>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center truncate px-2">
            {tournament.name}
          </h2>
          <div className="size-12" />
        </div>

        {/* Main Display Stage */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
          {/* HeadlineText */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <span
                className={`w-2 h-2 rounded-full ${isSpinning ? "bg-primary animate-pulse" : hasDrawn ? "bg-green-500" : "bg-primary"}`}
              />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                {isSpinning
                  ? "Spinning..."
                  : hasDrawn
                    ? "Already drawn"
                    : "Ready"}
              </span>
            </div>
            <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">
              {hasDrawn ? "Your Team Number" : "Lucky Draw"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {hasDrawn
                ? "You've been assigned to a team!"
                : "Click to draw team number"}
            </p>
          </div>

          {/* Number Display Card */}
          <div className="w-full relative group">
            {/* Glow effects behind */}
            <div
              className={`absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 ${isSpinning ? "animate-pulse" : ""} group-hover:opacity-50 transition duration-1000`}
            />
            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-card-dark border border-white/10 shadow-xl overflow-hidden min-h-[280px]">
              {/* Decorative background inside card */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="material-symbols-outlined text-6xl rotate-12">
                  sports_tennis
                </span>
              </div>

              {/* The Number */}
              <div className="flex flex-col items-center z-10">
                <span
                  className={`text-[120px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary to-blue-400 drop-shadow-sm font-display tabular-nums ${isSpinning ? "animate-bounce" : ""}`}
                  style={{ textShadow: "0 0 40px rgba(19, 91, 236, 0.2)" }}
                >
                  {displayNumber}
                </span>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mt-2 rounded-full opacity-50" />
              </div>

              {/* Status Badge */}
              {hasDrawn && (
                <div className="mt-8 flex items-center justify-between w-full px-4 border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      Team Number
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      Team {drawnNumber}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                      Status
                    </span>
                    <span className="text-sm font-bold text-green-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        check_circle
                      </span>
                      Team assigned
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center w-full">
              {error}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="p-4 pt-2 bg-gradient-to-t from-background-dark via-background-dark to-transparent sticky bottom-0 z-40 w-full">
          {canDraw ? (
            <button
              onClick={handleRegisterAndDraw}
              disabled={isPending || isSpinning}
              className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 bg-primary text-white gap-3 px-6 shadow-[0_0_20px_rgba(19,91,236,0.4)] hover:shadow-[0_0_30px_rgba(19,91,236,0.6)] hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
              <span
                className={`material-symbols-outlined text-[28px] ${isSpinning ? "animate-spin" : ""}`}
              >
                cached
              </span>
              <span className="text-lg font-bold tracking-wider">
                {isSpinning ? "SPINNING..." : "DRAW NOW"}
              </span>
            </button>
          ) : hasDrawn ? (
            <Link
              href={`/tournaments/${tournament.id}`}
              className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 bg-primary text-white gap-3 px-6 shadow-lg hover:bg-blue-600 transition-all"
            >
              <span className="material-symbols-outlined text-[28px]">
                sports
              </span>
              <span className="text-lg font-bold tracking-wider">
                VIEW TOURNAMENT
              </span>
            </Link>
          ) : (
            <button
              disabled
              className="group relative flex w-full items-center justify-center rounded-xl h-16 bg-gray-600 text-white gap-3 px-6 opacity-50 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[28px]">
                block
              </span>
              <span className="text-lg font-bold tracking-wider">
                NO SLOTS
              </span>
            </button>
          )}
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
