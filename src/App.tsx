import { useState, useEffect, useMemo } from 'react';
import './App.css';
import { DashboardHeader } from './components/DashboardHeader';
import { Filters } from './components/Filters';
import { VisualizerGraph } from './components/VisualizerGraph';
import { PlayerTable } from './components/PlayerTable';
import type { SortField, SortDirection } from './components/PlayerTable';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { fetchFplData } from './services/fplService';
import type { ProcessedPlayer } from './services/fplService';
import type { FplTeam, FplElementType } from './data/mockPlayers';
import { Activity, AlertTriangle } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [players, setPlayers] = useState<ProcessedPlayer[]>([]);
  const [teams, setTeams] = useState<FplTeam[]>([]);
  const [positions, setPositions] = useState<FplElementType[]>([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | 'all'>('all');
  const [selectedPosition, setSelectedPosition] = useState<number | 'all'>('all');
  const [minMinutes, setMinMinutes] = useState(0);
  const [maxPrice, setMaxPrice] = useState(16.0);

  // Sorting States
  const [sortField, setSortField] = useState<SortField>('pointsPerGame');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Selected Player State
  const [selectedPlayer, setSelectedPlayer] = useState<ProcessedPlayer | null>(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const result = await fetchFplData();
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
        console.error('Failed to load data in App', err);
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
    setSearch('');
    setSelectedTeam('all');
    setSelectedPosition('all');
    setMinMinutes(0);
    setMaxPrice(maxPriceInDataset);
  };

  // Sort Handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new sort column
    }
  };

  // Filtered Players
  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      // Name search
      const nameMatch =
        search.trim() === '' ||
        player.webName.toLowerCase().includes(search.toLowerCase()) ||
        player.firstName.toLowerCase().includes(search.toLowerCase()) ||
        player.lastName.toLowerCase().includes(search.toLowerCase());

      // Team filter
      const teamMatch = selectedTeam === 'all' || player.teamId === selectedTeam;

      // Position filter
      const posMatch = selectedPosition === 'all' || player.positionId === selectedPosition;

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
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Handle numeric comparisons
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredPlayers, sortField, sortDirection]);

  // Stats computed from currently filtered set
  const stats = useMemo(() => {
    if (filteredPlayers.length === 0) {
      return {
        highestPpgName: 'N/A',
        highestPpgValue: 0,
        avgPpg: 0
      };
    }

    let highest = filteredPlayers[0];
    let totalPpg = 0;

    filteredPlayers.forEach((p) => {
      totalPpg += p.pointsPerGame;
      if (p.pointsPerGame > highest.pointsPerGame) {
        highest = p;
      }
    });

    return {
      highestPpgName: highest.webName,
      highestPpgValue: highest.pointsPerGame,
      avgPpg: totalPpg / filteredPlayers.length
    };
  }, [filteredPlayers]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <Activity size={48} className="gradient-text-alt" style={{ animation: 'spin 2s linear infinite' }} />
        <h3 style={{ fontWeight: 600 }}>Loading FPL Player Data...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fetching stats and rendering visualizations</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <DashboardHeader
        isMock={isMock}
        totalCount={filteredPlayers.length}
        highestPpgName={stats.highestPpgName}
        highestPpgValue={stats.highestPpgValue}
        avgPpg={stats.avgPpg}
      />

      {/* Warning banner for CORS fallback */}
      {isMock && (
        <div className="notification-bar">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Demo Mode Enabled:</strong> The official FPL API lacks cross-origin (CORS) headers and was unreachable from the browser. 
            The app loaded a high-fidelity snapshot of Premier League players. 
            {errorMsg && <span style={{ opacity: 0.8, fontSize: '0.8rem', marginLeft: '0.5rem' }}>({errorMsg})</span>}
          </div>
        </div>
      )}

      {/* Filter Options */}
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

      {/* Main Grid: Visuals and Detail */}
      <div className="dashboard-grid">
        {/* Left Column: Visual Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <VisualizerGraph
            players={filteredPlayers}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={setSelectedPlayer}
          />
          
          {/* Player Leaderboard Table */}
          <PlayerTable
            players={sortedPlayers}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={setSelectedPlayer}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </div>

        {/* Right Column: Sidebar Stats card */}
        <div>
          <PlayerDetailModal player={selectedPlayer} />
        </div>
      </div>
    </div>
  );
}

export default App;
