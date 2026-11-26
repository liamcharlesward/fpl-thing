export interface FplTeam {
  id: number;
  name: string;
  short_name: string;
  code: number;
}

export interface FplElementType {
  id: number;
  singular_name: string;
  singular_name_short: string;
}

// TODO: Trim unneccessary fields
export interface FplElement {
  price_change_locked_until: number | null;
  price_change_calibrating: boolean;
  dreamteam_count: number;
  element_type: number;
  ep_next: string;
  ep_this: string;
  event_points: number;
  first_name: string;
  form: string;
  id: number;
  in_dreamteam: boolean;
  news: string;
  news_added: string | null;
  now_cost: number;
  photo: string;
  points_per_game: string;
  removed: boolean;
  second_name: string;
  selected_by_percent: string;
  special: boolean;
  squad_number: number | null;
  status: string;
  team: number;
  team_code: number;
  total_points: number;
  transfers_in: number;
  transfers_in_event: number;
  transfers_out: number;
  transfers_out_event: number;
  value_form: string;
  value_season: string;
  web_name: string;
  known_name: string;
  region: number;
  team_join_date: string;
  birth_date: string;
  has_temporary_code: boolean;
  opta_code: string;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  goals_conceded: number;
  own_goals: number;
  penalties_saved: number;
  penalties_missed: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  clearances_blocks_interceptions: number;
  recoveries: number;
  tackles: number;
  defensive_contribution: number;
  starts: number;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  expected_goals_conceded: string;
  corners_and_indirect_freekicks_order: number | null;
  corners_and_indirect_freekicks_text: string;
  direct_freekicks_order: number | null;
  direct_freekicks_text: string;
  penalties_order: number | null;
  penalties_text: string;
  scout_risks: string[];
  scout_news_link: string;
  influence_rank: number;
  influence_rank_type: number;
  creativity_rank: number;
  creativity_rank_type: number;
  threat_rank: number;
  threat_rank_type: number;
  ict_index_rank: number;
  ict_index_rank_type: number;
  expected_goals_per_90: number;
  saves_per_90: number;
  expected_assists_per_90: number;
  expected_goal_involvements_per_90: number;
  expected_goals_conceded_per_90: number;
  goals_conceded_per_90: number;
  now_cost_rank: number;
  now_cost_rank_type: number;
  form_rank: number;
  form_rank_type: number;
  points_per_game_rank: number;
  points_per_game_rank_type: number;
  selected_rank: number;
  selected_rank_type: number;
  starts_per_90: number;
  clean_sheets_per_90: number;
  defensive_contribution_per_90: number;
}

export interface FplBootstrapData {
  teams: FplTeam[];
  element_types: FplElementType[];
  elements: FplElement[];
}

export interface ProcessedPlayer
  extends Omit<FplElement, 'points_per_game' | 'selected_by_percent' | 'ict_index'> {
  cost: number;
  points_per_game: number;
  selected_by_percent: number;
  ict_index: number;
  points_per_million: number;
  points_per_game_per_million: number;
  team_name: string;
  team_short: string;
  position_id: number;
  position_name: string;
  position_short: string;
}

export interface FplDataResult {
  players: ProcessedPlayer[];
  teams: FplTeam[];
  positions: FplElementType[];
  isMock: boolean;
  error?: string;
}

export async function fetchBootstrapData(): Promise<FplDataResult> {
  let data: FplBootstrapData | undefined;
  let isMock = false;
  let errorMsg: string | undefined;

  try {
    const response = await fetch('/api/bootstrap-static/');
    if (!response.ok) {
      throw new Error(`FPL API responded with status ${response.status}`);
    }
    data = (await response.json()) as FplBootstrapData;
    console.log('Successfully fetched live FPL data!');
  } catch (err) {
    console.warn('FPL API fetch failed, falling back to mock data:', err);
    isMock = true;
    errorMsg = err instanceof Error ? err.message : String(err);
    data = { teams: [], element_types: [], elements: [] };
  }

  const teamMap = new Map<number, FplTeam>();
  data.teams.forEach(t => teamMap.set(t.id, t));

  const positionMap = new Map<number, FplElementType>();
  data.element_types.forEach(et => positionMap.set(et.id, et));

  const players: ProcessedPlayer[] = data.elements.map(el => {
    const team = teamMap.get(el.team);
    const position = positionMap.get(el.element_type);
    const cost = el.now_cost / 10;
    const pointsPerMatch = parseFloat(el.points_per_game) || 0;

    return {
      ...el,
      team_name: team ? team.name : 'Unknown',
      team_short: team ? team.short_name : 'UNK',
      position_id: position.id,
      position_name: position ? position.singular_name : 'Unknown',
      position_short: position ? position.singular_name_short : 'UNK',
      cost: cost,
      points_per_game: pointsPerMatch,
      points_per_million: cost > 0 ? Math.round((el.total_points / cost) * 100) / 100 : 0,
      points_per_game_per_million: Math.round(((pointsPerMatch / cost) + Number.EPSILON) * 1000) / 1000,
      selected_by_percent: parseFloat(el.selected_by_percent) || 0,
      ict_index: parseFloat(el.ict_index) || 0,
    };
  });

  return {
    players,
    teams: data.teams,
    positions: data.element_types,
    isMock,
    error: errorMsg,
  };
}
