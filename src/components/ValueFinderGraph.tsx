import React from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
import { Compass } from "lucide-react";

interface VisualizerGraphProps {
  players: ProcessedPlayer[];
  selectedPlayer: ProcessedPlayer | null;
  onSelectPlayer: (player: ProcessedPlayer) => void;
}

interface ScatterTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ProcessedPlayer }>;
}

interface ScatterPointProps {
  cx?: number;
  cy?: number;
  payload?: ProcessedPlayer;
}

const getPositionColor = (positionId: number) => {
  switch (positionId) {
    case 1:
      return "#67e8f9";
    case 2:
      return "#4ade80";
    case 3:
      return "#a78bfa";
    case 4:
      return "#f472b6";
    default:
      return "#94a3b8";
  }
};

const CustomScatterTooltip = ({ active, payload }: ScatterTooltipProps) => {
  const player = payload?.[0]?.payload;

  if (!active || !player) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3 shadow-2xl">
      <div className="text-sm font-bold text-slate-50">{player.webName}</div>
      <div className="mb-2 text-[11px] text-slate-400">
        {player.teamShort} • {player.positionShort}
      </div>
      <div className="space-y-1 text-xs text-slate-300">
        <div className="flex items-center justify-between gap-4">
          <span>Points / match</span>
          <span className="font-semibold text-cyan-300">{player.pointsPerMatch.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Cost</span>
          <span className="font-semibold text-slate-50">£{player.cost.toFixed(1)}m</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Total</span>
          <span>{player.totalPoints} pts</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Pts / £m</span>
          <span className="font-semibold text-fuchsia-300">{player.pointsPerMillion.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export const ValueFinderGraph: React.FC<VisualizerGraphProps> = ({ players, selectedPlayer, onSelectPlayer }) => {
  const handleScatterClick = (node: { payload?: ProcessedPlayer } | undefined) => {
    if (node && node.payload) {
      onSelectPlayer(node.payload);
    }
  };

  const CustomPoint = (props: ScatterPointProps) => {
    const payload = props.payload;
    if (!payload || typeof props.cx !== "number" || typeof props.cy !== "number") return null;

    const isSelected = selectedPlayer?.id === payload.id;

    return (
      <circle
        cx={props.cx}
        cy={props.cy}
        r={isSelected ? 5 : 3.5}
        fill={getPositionColor(payload.positionId)}
        stroke={isSelected ? "#f8fafc" : "rgba(15,23,42,0.8)"}
        strokeWidth={isSelected ? 2 : 1}
        style={{
          transition: "all 0.2s ease",
          filter: isSelected ? "drop-shadow(0 0 10px rgba(168, 184, 255, 0.7))" : "none",
        }}
      />
    );
  };

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
          <Compass size={18} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Value Finder</h3>
          <p className="text-xs text-slate-400">Cost vs. points per match</p>
        </div>
      </div>

      <div className="h-105 w-full rounded-xl border border-slate-800 bg-slate-950/40 p-2">
        {players.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No player data fits the current filters.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 16, bottom: 24, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
              <XAxis
                type="number"
                dataKey="cost"
                name="Cost"
                unit="m"
                domain={["dataMin - 0.5", "dataMax + 0.5"]}
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                label={{ value: "Player Price (£m)", position: "bottom", offset: 0, fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="pointsPerMatch"
                name="Points Per Match"
                domain={[0, "dataMax + 0.5"]}
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                label={{
                  value: "Points Per Game (PPG)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
              />
              <Tooltip
                content={<CustomScatterTooltip />}
                cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.18)" }}
              />
              <Scatter
                name="Players"
                data={players}
                onClick={handleScatterClick}
                cursor="pointer"
                shape={CustomPoint}
              />
              <Legend
                verticalAlign="top"
                height={36}
                content={() => (
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                      Goalkeeper
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                      Defender
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
                      Midfielder
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-pink-400" />
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
