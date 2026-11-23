import type { ProcessedPlayer } from "./FplBootstrapService";

export type NumericProcessedPlayerKey = {
  [K in keyof ProcessedPlayer]: ProcessedPlayer[K] extends number ? K : never;
} [keyof ProcessedPlayer]

export interface Percentiles {
  p25: number;
  p50: number;
  p75: number;
  p99: number;
}

// Given a list of players, and a given metric, return the average value of that metric across given list of players
export const getAverageMetric = (players: ProcessedPlayer[], metric: NumericProcessedPlayerKey) => {
  const total = players.reduce((sum, player) => sum + player[metric], 0);
  return total / players.length;
}

export const getMetricPercentiles = (players: ProcessedPlayer[], metric: NumericProcessedPlayerKey) => {
  if (players.length === 0) {
    return { p25: 0, p50: 0, p75: 0, p99: 0 };
  }

  const values = players.map((player) => player[metric]).sort((a, b) => a - b);

  const getPercentile = (p: number) => {
    const index = (p / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return values[lower] * (1 - weight) + values[upper] * weight;
  };

  return {
    p25: getPercentile(25),
    p50: getPercentile(50),
    p75: getPercentile(75),
    p99: getPercentile(99),
  };
};

// Given a list of players, and a given metric, return the player with the highest value of that metric
export const getHighestMetricPlayer = (players: ProcessedPlayer[], metric: NumericProcessedPlayerKey): ProcessedPlayer => {
  return players.reduce((highest, player) =>
    player[metric] > highest[metric] ? player : highest
  );
};