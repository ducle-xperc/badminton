import Link from "next/link";

interface RegistrationButtonProps {
  tournamentId: string;
  isRegistered: boolean;
  teamNumber: number | null;
  tournamentStatus: string;
}

export function RegistrationButton({
  tournamentId,
  isRegistered,
  teamNumber,
  tournamentStatus,
}: RegistrationButtonProps) {
  if (tournamentStatus !== "upcoming") {
    return null;
  }

  if (isRegistered) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-green-500">
          check_circle
        </span>
        <span className="text-green-400 flex-1">You have registered</span>
        {teamNumber ? (
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">
            Team {teamNumber}
          </span>
        ) : (
          <Link
            href={`/draw/${tournamentId}`}
            className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold hover:bg-primary/30 transition-colors"
          >
            Draw number now
          </Link>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/draw/${tournamentId}`}
      className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
    >
      <span className="material-symbols-outlined">how_to_reg</span>
      Register & Draw
    </Link>
  );
}
