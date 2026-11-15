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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "a":
        return <span style={{ color: "var(--color-success)", fontSize: "0.8rem", fontWeight: 600 }}>● Available</span>;
      case "i":
        return <span style={{ color: "var(--color-danger)", fontSize: "0.8rem", fontWeight: 600 }}>● Injured</span>;
      case "s":
        return <span style={{ color: "var(--color-warning)", fontSize: "0.8rem", fontWeight: 600 }}>● Suspended</span>;
      default:
        return <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>● Unavailable</span>;
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
    <div>
      <div className="detail-header" id="detail-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: "1.5rem",
              color: "#fff",
            }}
          >
            <span style={{ fontWeight: 400 }}>{player.firstName}</span>{" "}
            <span style={{ fontWeight: 700 }}>{player.lastName}</span>
          </h3>
        </div>
        <div
          style={{
            marginTop: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Badge colour={player.teamShort.toLowerCase()} text={player.teamName} border />
            {getPositionBadge(player.positionShort)}
            {getStatusBadge(player.status)}
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>FPL Asset ID: {player.id}</span>
        </div>
        {player.news && (
          <div
            className="notification-bar error"
            style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", fontSize: "0.8rem" }}
          >
            <LuShieldAlert size={14} style={{ flexShrink: 0 }} />
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
