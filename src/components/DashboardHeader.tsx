import React from "react";
import { LuTrendingUp, LuUsers, LuActivity } from "react-icons/lu";

interface DashboardHeaderProps {
  isMock: boolean;
  totalCount: number;
  highestPpgName: string;
  highestPpgValue: number;
  avgPpg: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalCount,
  highestPpgName,
  highestPpgValue,
  avgPpg,
}) => {
  return (
    <header className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-5 shadow-[0_12px_34px_rgba(15,23,42,0.45)] backdrop-blur-sm">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-indigo-500 shadow-lg shadow-cyan-500/20">
            <LuActivity size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-50 sm:text-[2rem]">FPL StatViewer</h1>
            <p className="text-sm text-slate-400">Points Per Match & Value Tracker</p>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-[760px]">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-cyan-300">
              <LuUsers size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">Players</div>
              <div className="text-xl font-bold text-slate-50">{totalCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fuchsia-500/10 text-fuchsia-300">
              <LuTrendingUp size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">High PPM</div>
              <div className="truncate text-base font-bold text-slate-50">
                {highestPpgName} <span className="text-fuchsia-300">({highestPpgValue.toFixed(1)})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-300">
              <LuActivity size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">Avg PPM</div>
              <div className="text-xl font-bold text-slate-50">{avgPpg.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
