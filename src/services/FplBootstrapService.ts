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

export interface FplElement {
  id: number;
  first_name: string;
  second_name: string;
  web_name: string;
  team: number;
  element_type: number;
  points_per_game: string;
  total_points: number;
  now_cost: number;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  yellow_cards: number;
  red_cards: number;
  selected_by_percent: string;
  status: string;
  news: string;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  starts: number;
  clearances_blocks_interceptions: number;
  recoveries: number;
  tackles: number;
  defensive_contribution: number;
  goals_conceded: number;
  expected_goals_conceded: number;
  saves: number;
}

export interface FplBootstrapData {
  teams: FplTeam[];
  element_types: FplElementType[];
  elements: FplElement[];
}

export interface ProcessedPlayer {
  id: number;
  firstName: string;
  lastName: string;
  webName: string;
  teamId: number;
  teamName: string;
  teamShort: string;
  positionId: number;
  positionName: string;
  positionShort: string;
  pointsPerMatch: number;
  totalPoints: number;
  cost: number; // in Millions, e.g. 15.2
  minutes: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  selectedByPercent: number;
  status: string;
  news: string;
  ictIndex: number;
  pointsPerMillion: number;
  pointsPerMatchPerMil: number;
  starts: number;
  clearancesBlocksInterceptions: number;
  recoveries: number;
  tackles: number;
  defensiveContribution: number;
  goalsConceded: number;
  expectedGoalsConceded: number;
  saves: number;
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
    const pointsPerMillion = cost > 0 ? Math.round((el.total_points / cost) * 100) / 100 : 0;
    const pointsPerMatchPerMil = Math.round(((pointsPerMatch / cost) + Number.EPSILON) * 1000) / 1000;

    return {
      id: el.id,
      firstName: el.first_name,
      lastName: el.second_name,
      webName: el.web_name,
      teamId: el.team,
      teamName: team ? team.name : 'Unknown',
      teamShort: team ? team.short_name : 'UNK',
      positionId: el.element_type,
      positionName: position ? position.singular_name : 'Unknown',
      positionShort: position ? position.singular_name_short : 'UNK',
      pointsPerMatch,
      totalPoints: el.total_points,
      cost,
      minutes: el.minutes,
      goals: el.goals_scored,
      assists: el.assists,
      cleanSheets: el.clean_sheets,
      yellowCards: el.yellow_cards,
      redCards: el.red_cards,
      selectedByPercent: parseFloat(el.selected_by_percent) || 0,
      status: el.status,
      news: el.news,
      ictIndex: parseFloat(el.ict_index) || 0,
      pointsPerMillion,
      pointsPerMatchPerMil,
      starts: el.starts,
      clearancesBlocksInterceptions: el.clearances_blocks_interceptions,
      recoveries: el.recoveries,
      tackles: el.tackles,
      defensiveContribution: el.defensive_contribution,
      goalsConceded: el.goals_conceded,
      expectedGoalsConceded: el.expected_goals_conceded,
      saves: el.saves
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
