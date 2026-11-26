import {  LuSwords, LuRotateCcw, LuBan, LuSparkle, LuShieldX, LuShieldEllipsis, LuGoal, LuHandshake,} from "react-icons/lu"
import type { ProcessedPlayer } from "./FplBootstrapService";
import type { StatBoxProps } from "../components/StatBox";

export const getPositionSpecificStats = (position: string, player: ProcessedPlayer): StatBoxProps[] => {
    switch (position) {
      case "FWD":
        return [
          { icon: LuGoal, label: "Goals", value: player.goals_scored.toString() },
          { icon: LuHandshake, label: "Assists", value: player.assists.toString() },
          { icon: LuSparkle, label: "Clean Sheets", value: player.clean_sheets.toString() },
        ];

      case "MID":
        return [
          { icon: LuGoal, label: "Goals", value: player.goals_scored.toString() },
          { icon: LuHandshake, label: "Assists", value: player.assists.toString() },
          { icon: LuSwords, label: "Tackles", value: player.tackles.toString() },
          { icon: LuRotateCcw, label: "Recoveries", value: player.recoveries.toString() },
          { icon: LuSparkle, label: "Clean Sheets", value: player.clean_sheets.toString() },
        ];

      case "DEF":
        return [
          {
            icon: LuBan,
            label: "CBI",
            value: player.clearances_blocks_interceptions.toString(),
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
            icon: LuGoal,
            label: "Goals",
            value: player.goals_scored.toString(),
          },
          {
            icon: LuHandshake,
            label: "Assists",
            value: player.assists.toString(),
          },
          {
            icon: LuSparkle,
            label: "Clean Sheets",
            value: player.clean_sheets.toString(),
          },
          {
            icon: LuShieldX,
            label: "Goals Conceded",
            value: player.goals_conceded.toString(),
          },
          {
            icon: LuShieldEllipsis,
            label: "xGC",
            value: player.expected_goals_conceded.toString(),
          },
        ];

      case "GKP":
        return [
          { icon: LuSparkle, label: "Clean Sheets", value: player.clean_sheets.toString() },
          { icon: LuShieldX, label: "Goals Conceded", value: player.goals_conceded.toString() },
          { icon: LuShieldEllipsis, label: "xGC", value: player.expected_goals_conceded.toString() },
          { icon: LuBan, label: "Saves", value: player.saves.toString() },
          { icon: LuRotateCcw, label: "Recoveries", value: player.recoveries.toString() },
        ];

      default:
        return [];
    }
  };