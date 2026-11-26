import { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useMatch } from "react-router-dom";
import "./App.css";
import type { SortField, SortDirection } from "./components/PlayerTable";
import { fetchBootstrapData } from "./services/FplBootstrapService";
import type { ProcessedPlayer } from "./services/FplBootstrapService";
import type { FplTeam, FplElementType } from "./services/FplBootstrapService";
import { DashboardPage } from "./pages/DashboardPage";
import { PlayerPage } from "./pages/PlayerPage";
import { LuLoader, LuTriangleAlert } from "react-icons/lu";

const AppContent = () => {
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
  const [selectedTeams, setSelectedTeams] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ]);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([1, 2, 3, 4]);
  const [minMinutes, setMinMinutes] = useState(0);
  const [minPoints, setMinPoints] = useState(1);
  const [maxPrice, setMaxPrice] = useState(16.0);

  // Sorting States
  const [sortField, setSortField] = useState<SortField>("points_per_game_per_million");
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

  const maxPointsInDataset = useMemo(() => {
    if (players.length === 0) return 3420;
    return Math.max(...players.map((p) => p.total_points), 1);
  }, [players]);

  const maxPriceInDataset = useMemo(() => {
    if (players.length === 0) return 16.0;
    return Math.max(...players.map((p) => p.cost), 10.0);
  }, [players]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearch("");
    setSelectedTeams([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    setSelectedPositions([1, 2, 3, 4]);
    setMinMinutes(0);
    setMaxPrice(maxPriceInDataset);
    setMinPoints(1);
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
        player.web_name.toLowerCase().includes(search.toLowerCase()) ||
        player.first_name.toLowerCase().includes(search.toLowerCase()) ||
        player.second_name.toLowerCase().includes(search.toLowerCase());

      // Team filter
      const teamMatch = selectedTeams.includes(player.team);

      // Position filter
      const posMatch = selectedPositions.includes(player.position_id);

      // Points filter
      const pointsMatch = player.total_points >= minPoints;

      // Minutes filter
      const minMatch = player.minutes >= minMinutes;

      // Cost filter
      const costMatch = player.cost <= maxPrice;

      return nameMatch && teamMatch && posMatch && minMatch && pointsMatch && costMatch;
    });
  }, [players, search, selectedTeams, selectedPositions, minMinutes, minPoints, maxPrice]);

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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage
            search={search}
            setSearch={setSearch}
            selectedTeams={selectedTeams}
            setSelectedTeams={setSelectedTeams}
            selectedPositions={selectedPositions}
            setSelectedPositions={setSelectedPositions}
            minMinutes={minMinutes}
            setMinMinutes={setMinMinutes}
            minPoints={minPoints}
            setMinPoints={setMinPoints}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            teams={teams}
            positions={positions}
            onResetFilters={handleResetFilters}
            maxMinutesAvailable={maxMinutesInDataset}
            highestPriceAvailable={maxPriceInDataset}
            maxPointsAvailable={maxPointsInDataset}
            filteredPlayers={filteredPlayers}
            sortedPlayers={sortedPlayers}
            routePlayer={routePlayer}
            onSelectPlayer={(player) => navigate(`/player/${player.id}`)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        }
      />
      <Route
        path="/player/:id"
        element={<PlayerPage playerId={routePlayerId} allPlayers={players} onBack={() => navigate("/")} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
