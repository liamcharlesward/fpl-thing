import type { ProcessedPlayer } from "../services/FplBootstrapService";
import type { FplHistory } from "../services/FplHistoryService";
import {
  LuStar,
  LuActivity,
  LuPoundSterling,
  LuGem,
  LuGauge,
  LuTriangleAlert,
  LuOctagonX,
  LuClock,
  LuPercent,
  LuShirt,
  LuGoal,
  LuHandshake,
  LuChartBarIncreasing,
  LuSwords,
  LuRotateCcw,
  LuBan,
  LuSparkle,
  LuShieldX,
  LuShieldEllipsis,
  LuLoader,
  LuArrowLeft,
} from "react-icons/lu";
import { Badge } from "../components/Badge";
import type { StatBoxProps } from "../components/StatBox";
import { PlayerRemarkBanner } from "../components/PlayerRemarkBanner";
import { StatSection } from "../components/StatSection";
import { getPlayerRemarks } from "../services/PlayerRemarkService";
import { useEffect, useState, type ReactNode } from "react";
import { fetchHistoryData } from "../services/FplHistoryService";
import { getStatusBadge, getPositionBadge } from "../services/PlayerBadgeService";

interface PlayerPageProps {
  playerId: number | null;
  allPlayers: ProcessedPlayer[];
  onBack: () => void;
}

interface PlayerPageLayoutProps {
  children: ReactNode | ReactNode[];
  onBack: () => void;
  header: string;
}

const PlayerPageLayout = ({ children, onBack, header }: PlayerPageLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-950 px-4 py-4">
      <div className="flex w-full flex-1 flex-col gap-5">
        <div className="flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            <LuArrowLeft size={16} />
          </button>
          <h1 className="text-2xl">{header}</h1>
        </div>

        <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.35)] h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export const PlayerPage = ({ playerId, allPlayers, onBack }: PlayerPageProps) => {
  const player = playerId !== null ? allPlayers.find((p) => p.id === playerId) : null;

  const [playerHistory, setPlayerHistory] = useState<FplHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!player) {
      return;
    }

    let cancelled = false;

    async function loadPlayerHistory(id: number) {
      try {
        const { history } = await fetchHistoryData(id);
        if (!cancelled) {
          setPlayerHistory(Array.isArray(history) ? history : []);
        }
      } catch (err) {
        console.warn("Player historical stats unavailable", err);
        if (!cancelled) {
          setPlayerHistory([]);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadPlayerHistory(player.id);

    return () => {
      cancelled = true;
    };
  }, [player]);

  if (!player) {
    return (
      <PlayerPageLayout onBack={onBack} header="Player not found.">
        <LuTriangleAlert size={48} />
        <p>
          Either something has gone wrong, or you've entered an invalid player id in the url bar. Either way, there's
          nothing to see here.
        </p>
      </PlayerPageLayout>
    );
  }

  const getPositionSpecificStats = (position: string): StatBoxProps[] => {
    switch (position) {
      case "FWD":
      case "MID":
        // Forwards & midfielders
        return [
          { icon: LuGoal, label: "Goals Scored", value: player.goals.toString() },
          { icon: LuHandshake, label: "Assists", value: player.assists.toString() },
        ];
      case "DEF":
        // Defenders
        return [
          {
            icon: LuBan,
            label: "CBI",
            value: player.clearancesBlocksInterceptions.toString(),
          },
          {
            icon: LuSwords,
            label: "Tackles",
            value: player.tackles.toString(),
          },
          {
            icon: LuRotateCcw,
            label: "Recoveries",
            value: player.recoveries.toString(),
          },
          {
            icon: LuSparkle,
            label: "Clean Sheets",
            value: player.cleanSheets.toString(),
          },
          {
            icon: LuShieldX,
            label: "Goals Conceded (GC)",
            value: player.goalsConceded.toString(),
          },
          {
            icon: LuShieldEllipsis,
            label: "xGC",
            value: player.expectedGoalsConceded.toString(),
          },
        ];
      default:
        // Goalkeepers
        return [];
    }
  };

  const costAndContributionStats: StatBoxProps[] = [
    { icon: LuPoundSterling, label: "Cost", value: `£${player.cost.toFixed(1)}m` },
    { icon: LuStar, label: "Total Points", value: player.totalPoints.toString() },
    { icon: LuActivity, label: "Points / Match (PPM)", value: player.pointsPerMatch.toFixed(1) },
    { icon: LuGem, label: "Points / £Million", value: player.pointsPerMillion.toFixed(1) },
    { icon: LuGauge, label: "PPM / £Million", value: player.pointsPerMatchPerMil.toString() },
    { icon: LuChartBarIncreasing, label: "ICT Index", value: player.ictIndex.toString() },
  ];

  const disciplineAndAvailabilityStats: StatBoxProps[] = [
    { icon: LuTriangleAlert, label: "Yellow Cards", value: player.yellowCards.toString() },
    { icon: LuOctagonX, label: "Red Cards", value: player.redCards.toString() },
    { icon: LuClock, label: "Minutes Played", value: player.minutes.toString() },
    {
      icon: LuPercent,
      label: "Played",
      value:
        playerHistory && playerHistory.length > 0
          ? `${((player.minutes / (playerHistory.length * 90)) * 100).toFixed(2)}%`
          : "0.00%",
    },
    { icon: LuShirt, label: "Starts", value: player.starts.toString() },
  ];

  const remarks = getPlayerRemarks(player, allPlayers);

  if (loading) {
    return (
      <PlayerPageLayout onBack={onBack} header={`${player.firstName} ${player.lastName}`}>
        <div className="flex flex-1 items-center justify-center">
          <LuLoader size={48} className="animate-spin" />
        </div>
      </PlayerPageLayout>
    );
  }

  return (
    <PlayerPageLayout onBack={onBack} header={`${player.firstName} ${player.lastName}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge teamColour={player.teamShort.toLowerCase()} text={player.teamName} border />
        {getPositionBadge({ position: player.positionShort, hasBorder: true, hasIcon: true, longPosName: true })}
        {getStatusBadge(player.status)}
      </div>

      {remarks != undefined && (
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {remarks.map((remark, index) => (
            <PlayerRemarkBanner key={index} {...remark} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatSection sectionTitle="Cost & Contribution" stats={costAndContributionStats} />
        <StatSection sectionTitle="Discipline & Availability" stats={disciplineAndAvailabilityStats} />
        <StatSection
          sectionTitle={`${player.positionName} Statistics`}
          stats={getPositionSpecificStats(player.positionShort)}
        />
      </div>
    </PlayerPageLayout>
  );
};
