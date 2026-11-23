import type { ProcessedPlayer } from "./FplBootstrapService";
import { getMetricPercentiles } from "./PlayerAveragesAndRecords";

export interface PlayerRemark {
  type: "positive" | "negative" | "information" | "gem";
  text: string;
}

// Minimum sample sizes so tiny minute counts don't produce misleading remarks
const MIN_MINUTES_FOR_RATES = 270; // ~3 full matches
const MIN_STARTS_FOR_CLEAN_SHEET_RATE = 3;

const per90 = (value: number, minutes: number) => (minutes > 0 ? (value / minutes) * 90 : 0);

// Shared by goalkeepers and defenders
const getGoalsConcededRemarks = (player: ProcessedPlayer): PlayerRemark[] => {
  const remarks: PlayerRemark[] = [];
  const xgc = Number(player.expectedGoalsConceded) || 0;

  if (player.goalsConceded < xgc) {
    remarks.push({ type: "positive", text: "Player outperforming xGC" });
  } else if (player.goalsConceded > xgc) {
    remarks.push({ type: "negative", text: "Player underperforming xGC" });
  }
  return remarks;
};

export const getGoalkeeperRemarks = (player: ProcessedPlayer): PlayerRemark[] => {
  const remarks = getGoalsConcededRemarks(player);

  if (player.starts >= MIN_STARTS_FOR_CLEAN_SHEET_RATE) {
    const csRate = player.cleanSheets / player.starts;
    if (csRate >= 0.4) {
      remarks.push({ type: "positive", text: "Keeps a clean sheet in 40%+ of starts" });
    } else if (csRate <= 0.15) {
      remarks.push({ type: "negative", text: "Keeps a clean sheet in 15% or fewer of starts" });
    }
  }

  return remarks;
};

export const getDefenderRemarks = (player: ProcessedPlayer): PlayerRemark[] => {
  return getGoalsConcededRemarks(player);
};

// Shared by midfielders and forwards
const getAttackingRemarks = (player: ProcessedPlayer, involvementThreshold: number): PlayerRemark[] => {
  const remarks: PlayerRemark[] = [];

  if (player.minutes >= MIN_MINUTES_FOR_RATES) {
    const involvementsPer90 = per90(player.goals + player.assists, player.minutes);

    if (involvementsPer90 >= involvementThreshold) {
      remarks.push({
        type: "positive",
        text: `Strong attacking output (${involvementsPer90.toFixed(2)} goal involvements per 90)`,
      });

      // High output but low ownership
      if (player.selectedByPercent < 5) {
        remarks.push({ type: "gem", text: "Differential: high output, owned by under 5% of managers" });
      }
    } else if (involvementsPer90 < involvementThreshold / 3) {
      remarks.push({ type: "negative", text: "Low attacking output for minutes played" });
    }
  }

  // Playing style
  if (player.goals + player.assists >= 4) {
    if (player.goals >= player.assists * 2) {
      remarks.push({ type: "information", text: "Mainly a goal threat" });
    } else if (player.assists >= player.goals * 2) {
      remarks.push({ type: "information", text: "Mainly a creator: assists outweigh goals" });
    }
  }

  // Suspension risk
  if (player.yellowCards >= 5) {
    remarks.push({ type: "negative", text: `Booking-prone (${player.yellowCards} yellow cards)` });
  }

  return remarks;
};

export const getPlayerRemarks = (currentPlayer: ProcessedPlayer, allPlayers: ProcessedPlayer[]): PlayerRemark[] | undefined=> {
  const playerRemarks: PlayerRemark[] = [];

  if (currentPlayer.news) {
    playerRemarks.push({ type: "information", text: currentPlayer.news });
  }

  // Percentiles - points
  const pointPercentiles = getMetricPercentiles(allPlayers, 'totalPoints');
  if (currentPlayer.totalPoints <= pointPercentiles.p25) {
    playerRemarks.push({type: "negative", text: "Bottom 25th percentile for total points"})
  } else if (currentPlayer.totalPoints >= pointPercentiles.p50 && currentPlayer.totalPoints < pointPercentiles.p99) {
    playerRemarks.push({type: "positive", text: "Has scored above median total points"})
  } else if (currentPlayer.totalPoints >= pointPercentiles.p99) {
    playerRemarks.push({type: "gem", text: "Top 99th percentile for total points"})
  }

  // Percentiles - PPM
  const ppmPercentiles = getMetricPercentiles(allPlayers, 'pointsPerMatch');
  if (currentPlayer.pointsPerMatch <= ppmPercentiles.p25) {
    playerRemarks.push({type: "negative", text: "Bottom 25th percentile for points per match"})
  } else if (currentPlayer.pointsPerMatch >= ppmPercentiles.p50 && currentPlayer.pointsPerMatch < ppmPercentiles.p99) {
    playerRemarks.push({type: "positive", text: "Has scored above median points per match"})
  } else if (currentPlayer.pointsPerMatch >= ppmPercentiles.p99) {
    playerRemarks.push({type: "gem", text: "Top 99th percentile for points per match"})
  }

  // Percentiles - PPM/Mil
  const ppmPerMilPercentiles = getMetricPercentiles(allPlayers, 'pointsPerMatchPerMil');
  if (currentPlayer.pointsPerMatchPerMil <= ppmPerMilPercentiles.p25) {
    playerRemarks.push({type: "negative", text: "Bottom 25th percentile for PPM/£m"})
  } else if (currentPlayer.pointsPerMatchPerMil >= ppmPerMilPercentiles.p50 && currentPlayer.pointsPerMatchPerMil < ppmPerMilPercentiles.p99) {
    playerRemarks.push({type: "positive", text: "Has scored above median PPM/£m"})
  } else if (currentPlayer.pointsPerMatchPerMil >= ppmPerMilPercentiles.p99) {
    playerRemarks.push({type: "gem", text: "Top 99th percentile for PPM/£m"})
  }

    // Position-specific remarks
  switch (currentPlayer.positionShort) {
    case "FWD":
      return playerRemarks.concat(getAttackingRemarks(currentPlayer, 0.6));
    case "MID":
      return playerRemarks.concat(getAttackingRemarks(currentPlayer, 0.4));
    case "DEF":
      return playerRemarks.concat(getDefenderRemarks(currentPlayer));
    case "GKP":
      return playerRemarks.concat(getGoalkeeperRemarks(currentPlayer));
    default:
      return playerRemarks;
    };
  }