/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ProcessedPlayer } from "./FplBootstrapService";
import { getMetricPercentiles } from "./PlayerAveragesAndRecords";

export interface PlayerRemark {
  type: "positive" | "negative" | "information" | "gem";
  text: string;
}

// export const getGoalkeeperRemarks = (player: ProcessedPlayer): PlayerRemark[] => {
//   return [];
// }

export const getDefenderRemarks = (player: ProcessedPlayer): PlayerRemark[] => {
  const defRemarks: PlayerRemark[] = [];

  // xGC
  if (player.goalsConceded < player.expectedGoalsConceded) {
    defRemarks.push({ type: "positive", text: "Player outperforming xGC" })
  } else if (player.goalsConceded > player.expectedGoalsConceded) {
    defRemarks.push({ type: "negative", text: "Player underperforming xGC" })
  }

  return defRemarks;
}

// export const getMidfielderRemarks = (player: ProcessedPlayer): PlayerRemark[] => {
//   return [];
// }

// export const getForwardRemarks = (player: ProcessedPlayer): PlayerRemark[] => {
//   return [];
// }

export const getPlayerRemarks = (currentPlayer: ProcessedPlayer, allPlayers: ProcessedPlayer[]): PlayerRemark[] => {
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
      // return playerRemarks.concat(getForwardRemarks(currentPlayer));
      break;
    case "MID":
      // return playerRemarks.concat(getMidfielderRemarks(currentPlayer));
      break;
    case "DEF":
      return playerRemarks.concat(getDefenderRemarks(currentPlayer));
    case "GKP":
      // return playerRemarks.concat(getGoalkeeperRemarks(currentPlayer));
      break;
  }
};