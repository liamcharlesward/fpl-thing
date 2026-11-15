export interface FplHistory {
  opponent_team: number;
  total_points: number;
  goals_scored: number;
  assists: number;
  goals_conceded: number;
  own_goals: number;
  clearances_blocks_interceptions: number;
  recoveries: number;
  tackles: number;
  defensive_contribution: number;
  expected_goals: number;
  expected_assists: number;
  expected_goals_conceded: number;
}

export interface FplHistoryResult {
  history: FplHistory[];
}

export async function fetchHistoryData(elementId: number): Promise<FplHistoryResult> {
  try {
    const response = await fetch(`/api/element-summary/${elementId}`);
    if (!response.ok) {
      throw new Error(`Could not get history data for player ID: ${elementId}`);
    }

    const payload: unknown = await response.json();

    if (
      !payload ||
      typeof payload !== "object" ||
      !("history" in payload) ||
      !Array.isArray((payload as { history?: unknown }).history)
    ) {
      throw new Error(`Invalid history payload for player ID: ${elementId}`);
    }

    return payload as FplHistoryResult;
  } catch (err) {
    console.warn("Player historical stats unavailable", err);
    return { history: [] };
  }
}