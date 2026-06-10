import { mockFplData } from '../data/mockPlayers';
import type { FplBootstrapData, FplTeam, FplElementType } from '../data/mockPlayers';

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
  pointsPerGame: number;
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
  value: number; // Points per Million
}

export interface FplDataResult {
  players: ProcessedPlayer[];
  teams: FplTeam[];
  positions: FplElementType[];
  isMock: boolean;
  error?: string;
}

export async function fetchFplData(): Promise<FplDataResult> {
  let data: FplBootstrapData;
  let isMock = false;
  let errorMsg: string | undefined;

  try {
    const response = await fetch('/api/bootstrap-static/');
    if (!response.ok) {
      throw new Error(`FPL API responded with status ${response.status}`);
    }
    data = await response.json();
    console.log('Successfully fetched live FPL data!');
  } catch (err) {
    console.warn('FPL API fetch failed, falling back to mock data:', err);
    data = mockFplData;
    isMock = true;
    errorMsg = err instanceof Error ? err.message : String(err);
  }

  // Create lookups
  const teamMap = new Map<number, FplTeam>();
  data.teams.forEach(t => teamMap.set(t.id, t));

  const positionMap = new Map<number, FplElementType>();
  data.element_types.forEach(et => positionMap.set(et.id, et));

  // Process players
  const players: ProcessedPlayer[] = data.elements.map(el => {
    const team = teamMap.get(el.team);
    const position = positionMap.get(el.element_type);
    const cost = el.now_cost / 10;
    const pointsPerGame = parseFloat(el.points_per_game) || 0;
    
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
      pointsPerGame,
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
      value: cost > 0 ? Math.round((el.total_points / cost) * 100) / 100 : 0
    };
  });

  return {
    players,
    teams: data.teams,
    positions: data.element_types,
    isMock,
    error: errorMsg
  };
}
