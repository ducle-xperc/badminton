import { notFound } from "next/navigation";
import { getTournament } from "@/lib/actions/tournament";
import { getParticipantRegistration } from "@/lib/actions/draw";
import { TournamentHeader } from "./components/TournamentHeader";
import { TabGroup } from "./components/TabGroup";
import { InfoTab } from "./components/InfoTab";
import { ParticipantTab } from "./components/ParticipantTab";
import { TeamTab } from "./components/TeamTab";
import { MatchTab } from "./components/MatchTab";
import { MVPTab } from "./components/MVPTab";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TABS = [
  { id: "info", label: "Info", icon: "info" },
  { id: "participant", label: "Participants", icon: "groups" },
  { id: "team", label: "Teams", icon: "group_work" },
  { id: "match", label: "Matches", icon: "sports" },
  { id: "mvp", label: "MVP", icon: "leaderboard" },
];

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { data: tournament, error } = await getTournament(id);

  if (error || !tournament) {
    notFound();
  }

  const { data: registration } = await getParticipantRegistration(id);

  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex flex-col">
      <TournamentHeader tournament={tournament} />

      <div className="relative z-10 flex-1 -mt-8">
        <TabGroup tabs={TABS} defaultTab="info">
          <InfoTab
            tournament={tournament}
            isRegistered={!!registration}
            teamNumber={registration?.team_number ?? null}
          />
          <ParticipantTab tournamentId={id} />
          <TeamTab tournamentId={id} />
          <MatchTab tournamentId={id} />
          <MVPTab tournamentId={id} />
        </TabGroup>
      </div>
    </div>
  );
}
