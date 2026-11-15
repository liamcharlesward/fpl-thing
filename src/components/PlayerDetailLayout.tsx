import React from "react";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
import {
  LuShieldAlert,
  LuStar,
  LuActivity,
  LuPoundSterling,
  LuShield,
  LuGem,
  LuGauge,
  LuTriangleAlert,
  LuOctagonX,
  LuClock,
  LuPercent,
  LuShirt,
  LuGoal,
  LuHandshake,
} from "react-icons/lu";
import { Badge } from "./Badge";
import { GiGoalKeeper, GiSoccerField, GiSoccerKick } from "react-icons/gi";
import type { StatBoxProps } from "./StatBox";
import { StatSection } from "./StatSection";
import type { FplHistory } from "../services/FplHistoryService";

interface PlayerDetailLayoutProps {
  player: ProcessedPlayer | null;
  playerHistory: FplHistory[];
}

export const PlayerDetailLayout: React.FC<PlayerDetailLayoutProps> = ({ player, playerHistory }) => {
  if (!player) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "a":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">● Available</span>
        );
      case "i":
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300">● Injured</span>;
      case "s":
        return <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">● Suspended</span>;
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">● Unavailable</span>
        );
    }
  };

  const getPositionBadge = (position: string) => {
    switch (position) {
      case "FWD":
        return <Badge colour="accent" text="Forward" icon={GiSoccerKick} border />;
      case "MID":
        return <Badge colour="primary" text="Midfielder" icon={GiSoccerField} border />;
      case "DEF":
        return <Badge colour="success" text="Defender" icon={LuShield} border />;
      case "GKP":
        return <Badge colour="secondary" text="Goalkeeper" icon={GiGoalKeeper} border />;
    }
  };

  const getPositionSpecificStats = (position: string): StatBoxProps[] => {
    switch (position) {
      case "FWD":
      case "MID":
        return [
          { icon: LuGoal, label: "Goals Scored", value: player.goals.toString() },
          { icon: LuHandshake, label: "Assists", value: player.assists.toString() },
        ];
      default:
        return [];
    }
  };

  const costAndContributionStats: StatBoxProps[] = [
    { icon: LuPoundSterling, label: "Cost", value: `£${player.cost.toFixed(1)}m` },
    { icon: LuStar, label: "Total Points", value: player.totalPoints.toString() },
    { icon: LuActivity, label: "Points / Match (PPM)", value: player.pointsPerMatch.toFixed(1) },
    { icon: LuGem, label: "Points / £Million", value: player.pointsPerMillion.toFixed(1) },
    { icon: LuGauge, label: "PPM / £Million", value: player.pointsPerMatchPerMil.toString() },
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
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{player.teamShort}</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-50">
              <span className="font-medium text-slate-300">{player.firstName}</span> <span>{player.lastName}</span>
            </h3>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            ID {player.id}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge colour={player.teamShort.toLowerCase()} text={player.teamName} border />
          {getPositionBadge(player.positionShort)}
          {getStatusBadge(player.status)}
        </div>

        {player.news && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            <LuShieldAlert size={14} className="mt-0.5 shrink-0 text-rose-300" />
            <span>{player.news}</span>
          </div>
        )}
      </div>

      <StatSection sectionTitle="Cost & Contribution" stats={costAndContributionStats} />
      <StatSection sectionTitle="Discipline & Availability" stats={disciplineAndAvailabilityStats} />
      <StatSection
        sectionTitle={`${player.positionName} Statistics`}
        stats={getPositionSpecificStats(player.positionShort)}
      />
    </div>
  );
};
