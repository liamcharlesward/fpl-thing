import { Filters } from "../components/Filters";
import { PlayerScatterChart } from "../components/PlayerScatterChart";
import { PlayerTable } from "../components/PlayerTable";
import type { SortField, SortDirection } from "../components/PlayerTable";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { LuFilter, LuSearch, LuDiff, LuGauge } from "react-icons/lu";
import { GiSoccerBall } from "react-icons/gi";
import { Popover } from "radix-ui";
import type { ProcessedPlayer, FplTeam, FplElementType } from "../services/FplBootstrapService";

interface DashboardPageProps {
  search: string;
  setSearch: (value: string) => void;
  selectedTeams: number[];
  setSelectedTeams: (value: number[]) => void;
  selectedPositions: number[];
  setSelectedPositions: (value: number[]) => void;
  minMinutes: number;
  setMinMinutes: (value: number) => void;
  minPoints: number;
  setMinPoints: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  teams: FplTeam[];
  positions: FplElementType[];
  onResetFilters: () => void;
  maxMinutesAvailable: number;
  highestPriceAvailable: number;
  maxPointsAvailable: number;
  filteredPlayers: ProcessedPlayer[];
  sortedPlayers: ProcessedPlayer[];
  routePlayer: ProcessedPlayer | null;
  onSelectPlayer: (player: ProcessedPlayer) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const DashboardPage = (props: DashboardPageProps) => (
  <div className="min-h-screen bg-slate-950 py-5 text-slate-100 px-4">
    <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
      {/* header */}
      <header className="flex flex-row items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/85 p-5">
        <div className="flex h-full flex-1 items-center">
          <h1>FPL StatViewer</h1>
          <div className="ml-4 flex flex-1 pl-4 border-l border-slate-700/70">
            <div className="flex flex-1 items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5">
              <LuSearch size={16} className="text-slate-400" />
              <input
                type="text"
                className="w-full border-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                placeholder="Search player name..."
                value={props.search}
                onChange={(event) => props.setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="ml-4 flex h-full flex-row gap-4 border-l border-slate-700/70 pl-4">
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button>
                <LuFilter size={16} />
                <span>Filters</span>
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content sideOffset={8} align="end" className="z-10">
                <Filters
                  selectedTeams={props.selectedTeams}
                  setSelectedTeams={props.setSelectedTeams}
                  selectedPositions={props.selectedPositions}
                  setSelectedPositions={props.setSelectedPositions}
                  minMinutes={props.minMinutes}
                  setMinMinutes={props.setMinMinutes}
                  minPoints={props.minPoints}
                  setMinPoints={props.setMinPoints}
                  maxPrice={props.maxPrice}
                  setMaxPrice={props.setMaxPrice}
                  teams={props.teams}
                  positions={props.positions}
                  onReset={props.onResetFilters}
                  maxMinutesAvailable={props.maxMinutesAvailable}
                  highestPriceAvailable={props.highestPriceAvailable}
                  maxPointsAvailable={props.maxPointsAvailable}
                />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="flex flex-col gap-y-4">
          <Card
            headerIcon={LuGauge}
            title="Player Value"
            subtitle="Players in the top left demonstrate best value for money."
          >
            <PlayerScatterChart
              players={props.filteredPlayers}
              selectedPlayer={props.routePlayer}
              onSelectPlayer={props.onSelectPlayer}
              xAxisMetric="cost"
              xAxisLabel="Player Price (£m)"
              yAxisMetric="points_per_game"
              yAxisLabel="Points per Match (PPM)"
            />
          </Card>

          <Card
            headerIcon={LuDiff}
            title="Differentials"
            subtitle="Players in the top left are most likely to make a difference."
          >
            <PlayerScatterChart
              players={props.filteredPlayers}
              selectedPlayer={props.routePlayer}
              onSelectPlayer={props.onSelectPlayer}
              yAxisMetric="total_points"
              yAxisLabel="Total Points Scored"
              xAxisMetric="selected_by_percent"
              xAxisLabel="Selected (%)"
            />
          </Card>
        </div>

        <Card headerIcon={GiSoccerBall} title="Player Leaderboard">
          <PlayerTable
            players={props.sortedPlayers}
            selectedPlayer={props.routePlayer}
            onSelectPlayer={props.onSelectPlayer}
            sortField={props.sortField}
            sortDirection={props.sortDirection}
            onSort={props.onSort}
          />
        </Card>
      </div>
    </div>
  </div>
);
