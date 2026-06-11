import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import type { ProcessedPlayer } from '../services/fplService';
import { Compass } from 'lucide-react';

interface VisualizerGraphProps {
  players: ProcessedPlayer[];
  selectedPlayer: ProcessedPlayer | null;
  onSelectPlayer: (player: ProcessedPlayer) => void;
}

export const ValueFinderGraph: React.FC<VisualizerGraphProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer
}) => {

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

  const handleScatterClick = (node: any) => {
    if (node && node.payload) {
      onSelectPlayer(node.payload);
    }
  };

  const CustomPoint = (props: any) => {
    const { cx, cy, payload } = props;

    const isSelected = selectedPlayer?.id === payload.id;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={isSelected ? 4 : 3}
        fill={getPositionColor(payload.positionId)}
        stroke={isSelected ? '#fff' : 'rgba(0,0,0,0.3)'}
        strokeWidth={isSelected ? 2 : 1}
        style={{
          transition: 'all 0.2s ease',
          filter: isSelected
            ? 'drop-shadow(0px 0px 8px var(--color-accent))'
            : 'none',
        }}
      />
    );
  };

  return (
    <div className="glass-card visualization-area">
      <div className="chart-header">
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={20} className="gradient-text-alt" />
            Value Finder (Cost vs. PPG)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Top-left players represent high-value targets (low cost, high PPG).
          </p>
        </div>
      </div>

      <div className="chart-container" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
        {players.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            No player data fits the current filters. Please broaden your filters.
          </div>
        ) : (
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
                shape={<CustomPoint />}
              />
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
        )}
      </div>
    </div>
  );
};
