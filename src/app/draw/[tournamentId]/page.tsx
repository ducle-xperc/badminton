import { notFound } from "next/navigation";
import { getTournament } from "@/lib/actions/tournament";
import {
  getParticipantRegistration,
  getAvailableTeams,
  getTotalTeamsCount,
} from "@/lib/actions/draw";
import { DrawClient } from "./DrawClient";

interface PageProps {
  params: Promise<{ tournamentId: string }>;
}

export default async function DrawPage({ params }: PageProps) {
  const { tournamentId } = await params;

  const { data: tournament, error } = await getTournament(tournamentId);
  if (error || !tournament) {
    notFound();
  }

  const { data: registration } = await getParticipantRegistration(tournamentId);
  const { data: availableTeams } = await getAvailableTeams(tournamentId);
  const { data: totalTeams } = await getTotalTeamsCount(tournamentId);

  return (
    <DrawClient
      tournament={tournament}
      initialRegistration={registration}
      availableTeamsCount={availableTeams?.length ?? 0}
      totalTeamsCount={totalTeams ?? 0}
    />
  );
}
