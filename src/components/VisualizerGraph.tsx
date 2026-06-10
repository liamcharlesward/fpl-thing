import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import type { ProcessedPlayer } from '../services/fplService';
import { BarChart2, Compass } from 'lucide-react';

interface VisualizerGraphProps {
  players: ProcessedPlayer[];
  selectedPlayer: ProcessedPlayer | null;
  onSelectPlayer: (player: ProcessedPlayer) => void;
}

type GraphTab = 'scatter' | 'bar';

export const VisualizerGraph: React.FC<VisualizerGraphProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer
}) => {
  const [activeTab, setActiveTab] = useState<GraphTab>('scatter');

  // Position color mapping
  const getPositionColor = (positionId: number) => {
    switch (positionId) {
      case 1: return 'var(--color-secondary)'; // GK - Cyan
      case 2: return 'var(--color-success)';   // DEF - Emerald
      case 3: return 'var(--color-primary)';   // MID - Purple
      case 4: return 'var(--color-accent)';    // FWD - Pink
      default: return '#9ca3af';
    }
  };

  // Custom Scatter Tooltip
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const player: ProcessedPlayer = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-player-name">{player.webName}</div>
          <div className="tooltip-player-meta">
            {player.teamShort} • {player.positionShort}
          </div>
          <div className="tooltip-stat-row">
            <span>Points Per Game:</span>
            <span className="tooltip-stat-val">{player.pointsPerGame.toFixed(1)}</span>
          </div>
          <div className="tooltip-stat-row">
            <span>Cost:</span>
            <span style={{ fontWeight: 600 }}>£{player.cost.toFixed(1)}m</span>
          </div>
          <div className="tooltip-stat-row">
            <span>Total Points:</span>
            <span>{player.totalPoints} pts</span>
          </div>
          <div className="tooltip-stat-row">
            <span>Value (Pts/£m):</span>
            <span style={{ color: 'var(--color-accent)' }}>{player.value.toFixed(1)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Bar Tooltip
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const player: ProcessedPlayer = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <div className="tooltip-player-name">{player.webName}</div>
          <div className="tooltip-player-meta">
            {player.teamName} • {player.positionName}
          </div>
          <div className="tooltip-stat-row">
            <span>Points Per Game:</span>
            <span className="tooltip-stat-val">{player.pointsPerGame.toFixed(1)}</span>
          </div>
          <div className="tooltip-stat-row">
            <span>Total Points:</span>
            <span>{player.totalPoints} pts</span>
          </div>
          <div className="tooltip-stat-row">
            <span>Minutes Played:</span>
            <span>{player.minutes} mins</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Top 12 players sorted by Points Per Game for the Bar Chart
  const topPlayers = [...players]
    .sort((a, b) => b.pointsPerGame - a.pointsPerGame)
    .slice(0, 12);

  const handleScatterClick = (node: any) => {
    if (node && node.payload) {
      onSelectPlayer(node.payload);
    }
  };

  const handleBarClick = (node: any) => {
    if (node && node.payload) {
      onSelectPlayer(node.payload);
    }
  };

  return (
    <div className="glass-card visualization-area">
      <div className="chart-header">
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {activeTab === 'scatter' ? (
              <>
                <Compass size={20} className="gradient-text-alt" />
                Value Finder (Cost vs. PPG)
              </>
            ) : (
              <>
                <BarChart2 size={20} className="gradient-text" />
                Top Performers (Points Per Game)
              </>
            )}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {activeTab === 'scatter'
              ? 'Top-left players represent high-value targets (low cost, high PPG)'
              : 'Top 12 players ordered by average points scored per match'}
          </p>
        </div>

        <div className="chart-tabs">
          <button
            className={`chart-tab ${activeTab === 'scatter' ? 'active' : ''}`}
            onClick={() => setActiveTab('scatter')}
          >
            Scatter Plot
          </button>
          <button
            className={`chart-tab ${activeTab === 'bar' ? 'active' : ''}`}
            onClick={() => setActiveTab('bar')}
          >
            Bar Chart
          </button>
        </div>
      </div>

      <div className="chart-container" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
        {players.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            No player data fits the current filters. Please broaden your filters.
          </div>
        ) : activeTab === 'scatter' ? (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" />
              <XAxis
                type="number"
                dataKey="cost"
                name="Cost"
                unit="m"
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                stroke="var(--text-muted)"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                label={{ value: 'Player Price (£m)', position: 'bottom', offset: 0, fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}
              />
              <YAxis
                type="number"
                dataKey="pointsPerGame"
                name="Points Per Game"
                domain={[0, 'dataMax + 0.5']}
                stroke="var(--text-muted)"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                label={{ value: 'Points Per Game (PPG)', angle: -90, position: 'insideLeft', offset: 10, fill: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} />
              <Scatter
                name="Players"
                data={players}
                onClick={handleScatterClick}
                cursor="pointer"
              >
                {players.map((entry, index) => {
                  const isSelected = selectedPlayer?.id === entry.id;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={getPositionColor(entry.positionId)}
                      stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.3)'}
                      strokeWidth={isSelected ? 3 : 1}
                      r={isSelected ? 11 : 6.5}
                      style={{
                        transition: 'all 0.2s ease',
                        filter: isSelected ? 'drop-shadow(0px 0px 8px var(--color-accent))' : 'none'
                      }}
                    />
                  );
                })}
              </Scatter>
              <Legend
                verticalAlign="top"
                height={36}
                content={() => (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-secondary)', display: 'inline-block' }}></span>
                      Goalkeeper
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }}></span>
                      Defender
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)', display: 'inline-block' }}></span>
                      Midfielder
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }}></span>
                      Forward
                    </div>
                  </div>
                )}
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topPlayers}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 'dataMax + 0.5']}
                stroke="var(--text-muted)"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="webName"
                stroke="var(--text-muted)"
                tick={{ fill: '#f3f4f6', fontSize: 12, fontWeight: 500 }}
                width={85}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.05)' }} />
              <Bar
                dataKey="pointsPerGame"
                radius={[0, 4, 4, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              >
                {topPlayers.map((entry, index) => {
                  const isSelected = selectedPlayer?.id === entry.id;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isSelected ? 'var(--color-accent)' : getPositionColor(entry.positionId)}
                      opacity={isSelected ? 1 : 0.8}
                      style={{
                        transition: 'all 0.2s ease',
                        filter: isSelected ? 'drop-shadow(0px 0px 8px var(--color-accent))' : 'none'
                      }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
