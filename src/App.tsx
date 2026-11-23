import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useMatch } from "react-router-dom";
import "./App.css";
import { Filters } from "./components/Filters";
import { ValueFinderGraph } from "./components/ValueFinderGraph";
import { PlayerTable } from "./components/PlayerTable";
import type { SortField, SortDirection } from "./components/PlayerTable";
import { fetchBootstrapData } from "./services/FplBootstrapService";
import type { ProcessedPlayer } from "./services/FplBootstrapService";
import type { FplTeam, FplElementType } from "./services/FplBootstrapService";
import { motion } from "motion/react";
import { PlayerPage } from "./pages/PlayerPage";
import { Card } from "./components/Card";
import { LuCompass, LuLoader, LuTriangleAlert, LuFilter } from "react-icons/lu";
import { GiSoccerBall } from "react-icons/gi";
import { Popover } from "radix-ui";

function AppContent() {
  const navigate = useNavigate();
  const playerMatch = useMatch("/player/:id");
  const routePlayerId = playerMatch?.params.id ? Number(playerMatch.params.id) : null;

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [players, setPlayers] = useState<ProcessedPlayer[]>([]);
  const [teams, setTeams] = useState<FplTeam[]>([]);
  const [positions, setPositions] = useState<FplElementType[]>([]);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | "all">("all");
  const [selectedPosition, setSelectedPosition] = useState<number | "all">("all");
  const [minMinutes, setMinMinutes] = useState(0);
  const [maxPrice, setMaxPrice] = useState(16.0);

  // Sorting States
  const [sortField, setSortField] = useState<SortField>("pointsPerMatchPerMil");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const routePlayer = useMemo(() => {
    if (!routePlayerId || Number.isNaN(routePlayerId)) return null;
    return players.find((p) => p.id === routePlayerId) ?? null;
  }, [players, routePlayerId]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await fetchBootstrapData();
        setPlayers(result.players);
        setTeams(result.teams);
        setPositions(result.positions);
        setErrorMsg(result.error);

        // Calculate max price dynamically if players loaded
        if (result.players.length > 0) {
          const maxP = Math.max(...result.players.map((p) => p.cost));
          setMaxPrice(maxP);
        }
      } catch (err) {
        console.error("Failed to load data in App", err);
      } finally {
        setLoading(false);
      }
    }
    document.title = "FPL StatViewer";
    loadData();
  }, []);

  // Find max bounds in the dataset for sliders
  const maxMinutesInDataset = useMemo(() => {
    if (players.length === 0) return 3420;
    return Math.max(...players.map((p) => p.minutes), 90);
  }, [players]);

  const maxPriceInDataset = useMemo(() => {
    if (players.length === 0) return 16.0;
    return Math.max(...players.map((p) => p.cost), 10.0);
  }, [players]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearch("");
    setSelectedTeam("all");
    setSelectedPosition("all");
    setMinMinutes(0);
    setMaxPrice(maxPriceInDataset);
  };

  // Sort Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new sort column
    }
  };

  // Filtered Players
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // Name search
      const nameMatch =
        search.trim() === "" ||
        player.webName.toLowerCase().includes(search.toLowerCase()) ||
        player.firstName.toLowerCase().includes(search.toLowerCase()) ||
        player.lastName.toLowerCase().includes(search.toLowerCase());

      // Team filter
      const teamMatch = selectedTeam === "all" || player.teamId === selectedTeam;

      // Position filter
      const posMatch = selectedPosition === "all" || player.positionId === selectedPosition;

      // Minutes filter
      const minMatch = player.minutes >= minMinutes;

      // Cost filter
      const costMatch = player.cost <= maxPrice;

      return nameMatch && teamMatch && posMatch && minMatch && costMatch;
    });
  }, [players, search, selectedTeam, selectedPosition, minMinutes, maxPrice]);

  // Sorted Players
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle string comparisons
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      // Handle numeric comparisons
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;

      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredPlayers, sortField, sortDirection]);

  // Show whilst loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <LuLoader size={42} className="animate-spin text-cyan-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-50">Loading FPL Player Data...</h3>
            <p className="text-sm text-slate-400">Fetching stats and rendering visualizations</p>
          </div>
        </div>
      </div>
    );
  }

  // Return early if there was an error getting data from FPL API
  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <LuTriangleAlert size={42} className="text-cyan-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-50">Something went wrong.</h3>
            <p className="text-sm text-slate-400">
              An error occurred, and StatViewer was not able to load data from the FPL API. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardView = (
    <motion.div className="min-h-screen bg-slate-950 py-5 text-slate-100 px-4" layout>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        {/* Header  */}
        <header className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1>FPL StatViewer</h1>
            </div>
            <div className="flex flex-row gap-4">
              {/* Filters */}
              <Popover.Root>
                <Popover.Trigger asChild>
                  <LuFilter size={16} className="cursor-pointer" onClick={(e) => e.preventDefault} />
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content>
                    <Filters
                      search={search}
                      setSearch={setSearch}
                      selectedTeam={selectedTeam}
                      setSelectedTeam={setSelectedTeam}
                      selectedPosition={selectedPosition}
                      setSelectedPosition={setSelectedPosition}
                      minMinutes={minMinutes}
                      setMinMinutes={setMinMinutes}
                      maxPrice={maxPrice}
                      setMaxPrice={setMaxPrice}
                      teams={teams}
                      positions={positions}
                      onReset={handleResetFilters}
                      maxMinutesAvailable={maxMinutesInDataset}
                      highestPriceAvailable={maxPriceInDataset}
                    />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>
        </header>

        {/* Main Grid: Visuals and Detail */}
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          {/* Left Column: Visual Graph */}
          {/* TODO: Componentise graphs */}
          <Card headerIcon={LuCompass} title="Player Value Graph">
            <ValueFinderGraph
              players={filteredPlayers}
              selectedPlayer={routePlayer}
              onSelectPlayer={(player) => navigate(`/player/${player.id}`)}
            />
          </Card>

          <Card headerIcon={GiSoccerBall} title="Player Leaderboard">
            <PlayerTable
              players={sortedPlayers}
              selectedPlayer={routePlayer}
              onSelectPlayer={(player) => navigate(`/player/${player.id}`)}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Routes>
      <Route path="/" element={dashboardView} />
      <Route
        path="/player/:id"
        element={<PlayerPage playerId={routePlayerId} allPlayers={players} onBack={() => navigate("/")} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
