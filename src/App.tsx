import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useMatch } from "react-router-dom";
import "./App.css";
import { DashboardHeader } from "./components/DashboardHeader";
import { Filters } from "./components/Filters";
import { ValueFinderGraph } from "./components/ValueFinderGraph";
import { PlayerTable } from "./components/PlayerTable";
import type { SortField, SortDirection } from "./components/PlayerTable";
import { fetchBootstrapData } from "./services/FplBootstrapService";
import type { ProcessedPlayer } from "./services/FplBootstrapService";
import type { FplTeam, FplElementType } from "./services/FplBootstrapService";
import { Activity, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { PlayerPage } from "./pages/PlayerPage";
import { Card } from "./components/Card";
import { LuCompass } from "react-icons/lu";
import { GiSoccerBall } from "react-icons/gi";
import { getAverageMetric, getHighestMetricPlayer } from "./services/PlayerAveragesAndRecords";

function AppContent() {
  const navigate = useNavigate();
  const playerMatch = useMatch("/player/:id");
  const routePlayerId = playerMatch?.params.id ? Number(playerMatch.params.id) : null;

  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [players, setPlayers] = useState<ProcessedPlayer[]>([]);
  const [teams, setTeams] = useState<FplTeam[]>([]);
  const [positions, setPositions] = useState<FplElementType[]>([]);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(true);

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

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await fetchBootstrapData();
        setPlayers(result.players);
        setTeams(result.teams);
        setPositions(result.positions);
        setIsMock(result.isMock);
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

  // Stats computed from currently filtered set
  const stats = useMemo(() => {
    if (filteredPlayers.length === 0) {
      return {
        highestPpgName: "N/A",
        highestPpgValue: 0,
        avgPpg: 0,
      };
    }

    const highest = getHighestMetricPlayer(filteredPlayers, "pointsPerMatch");

    return {
      highestPpgName: highest.webName,
      highestPpgValue: highest.pointsPerMatch,
      avgPpg: getAverageMetric(filteredPlayers, "pointsPerMatch"),
    };
  }, [filteredPlayers]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <Activity size={42} className="animate-spin text-cyan-400" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-50">Loading FPL Player Data...</h3>
            <p className="text-sm text-slate-400">Fetching stats and rendering visualizations</p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardView = (
    <motion.div className="min-h-screen bg-slate-950 py-5 text-slate-100 px-4" layout>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4">
        {/* Header */}
        <DashboardHeader
          isMock={isMock}
          totalCount={filteredPlayers.length}
          highestPpgName={stats.highestPpgName}
          highestPpgValue={stats.highestPpgValue}
          avgPpg={stats.avgPpg}
        />

        {/* Warning banner for CORS fallback */}
        {/* FIXME: Mock FplData no longer exists. This fallback page should be a simple error page */}
        {isMock && (
          <div className="flex items-start gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-300" />
            <div>
              <strong>Demo Mode Enabled:</strong> The official FPL API lacks cross-origin (CORS) headers and was
              unreachable from the browser.
              {errorMsg && <span className="ml-2 text-amber-100/80">({errorMsg})</span>}
            </div>
          </div>
        )}

        {/* Filter Options*/}
        {/* TODO: RE-work filter UI */}
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
          visible={filtersVisible}
          visibilityToggle={toggleFilters}
        />

        {/* Main Grid: Visuals and Detail */}
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          {/* Left Column: Visual Graph */}
          <Card headerIcon={LuCompass} title="Player Value Graph">
            <ValueFinderGraph
              players={filteredPlayers}
              selectedPlayer={routePlayer}
              onSelectPlayer={(player) => navigate(`/player/${player.id}`)}
            />
          </Card>

          {/* Right Column: Sidebar Stats card */}
          {/* Player Leaderboard Table */}
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
