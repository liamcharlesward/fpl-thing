import React from "react";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
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
  LuCheck,
  LuBriefcaseMedical,
  LuGavel,
  LuPlaneTakeoff,
  LuSwords,
  LuRotateCcw,
  LuBan,
  LuSparkle,
  LuShieldX,
  LuShieldEllipsis,
} from "react-icons/lu";
import { Badge } from "./Badge";
import { GiDefensiveWall, GiGoalKeeper, GiSoccerField, GiSoccerKick } from "react-icons/gi";
import type { StatBoxProps } from "./StatBox";
import { StatSection } from "./StatSection";
import type { FplHistory } from "../services/FplHistoryService";
import { getPlayerRemarks } from "../services/PlayerRemarkService";
import { PlayerRemarkBanner } from "./PlayerRemarkBanner";

interface PlayerDetailLayoutProps {
  player: ProcessedPlayer | null;
  playerHistory: FplHistory[];
  allPlayers: ProcessedPlayer[];
}

export const PlayerDetailLayout: React.FC<PlayerDetailLayoutProps> = ({ player, playerHistory, allPlayers }) => {
  if (!player) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "a":
        return <Badge icon={LuCheck} text="Available" className="text-emerald-600 bg-emerald-600/10" border />;
      case "i":
        return <Badge icon={LuBriefcaseMedical} text="Injured" className="text-rose-600 bg-rose-600/10" border />;
      case "s":
        return <Badge icon={LuGavel} text="Suspended" className="text-amber-600 bg-amber-600/10" border />;
      default:
        return <Badge icon={LuPlaneTakeoff} text="Unavailable" className="text-slate-600 bg-slate-600/10" border />;
    }
  };

  const getPositionBadge = (position: string) => {
    switch (position) {
      case "FWD":
        return (
          <Badge
            className="border-pink-400/30 bg-pink-500/10 text-pink-200"
            text="Forward"
            icon={GiSoccerKick}
            border
          />
        );
      case "MID":
        return (
          <Badge
            className="border-violet-400/30 bg-violet-500/10 text-violet-200"
            text="Midfielder"
            icon={GiSoccerField}
            border
          />
        );
      case "DEF":
        return (
          <Badge
            className="border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
            text="Defender"
            icon={GiDefensiveWall}
            border
          />
        );
      case "GKP":
        return (
          <Badge
            className="border-cyan-400/30 bg-cyan-500/10 text-cyan-200"
            text="Goalkeeper"
            icon={GiGoalKeeper}
            border
          />
        );
    }
  };

  // TODO: Merge with function in PlayerTable and move into standalone service file
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
        playerHistory.length > 0 ? `${((player.minutes / (playerHistory.length * 90)) * 100).toFixed(2)}%` : "0.00%",
    },
    { icon: LuShirt, label: "Starts", value: player.starts.toString() },
  ];

  return (
    <div>
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 gap-4 shadow-[0_12px_32px_rgba(15,23,42,0.35)] flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge teamColour={player.teamShort.toLowerCase()} text={player.teamName} border />
          {getPositionBadge(player.positionShort)}
          {getStatusBadge(player.status)}
        </div>

        {getPlayerRemarks(player, allPlayers).length != 0 && (
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {getPlayerRemarks(player, allPlayers).map((remark, index) => (
              <PlayerRemarkBanner key={index} {...remark} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatSection sectionTitle="Cost & Contribution" stats={costAndContributionStats} />
          <StatSection sectionTitle="Discipline & Availability" stats={disciplineAndAvailabilityStats} />
          <StatSection
            sectionTitle={`${player.positionName} Statistics`}
            stats={getPositionSpecificStats(player.positionShort)}
          />
        </div>
      </div>
    </div>
  );
};
