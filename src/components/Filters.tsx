import React from "react";
import { LuSearch, LuRotateCcw, LuChevronDown, LuChevronUp } from "react-icons/lu";
import type { FplTeam, FplElementType } from "../services/FplBootstrapService";
import { motion, AnimatePresence } from "motion/react";

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedTeam: number | "all";
  setSelectedTeam: (val: number | "all") => void;
  selectedPosition: number | "all";
  setSelectedPosition: (val: number | "all") => void;
  minMinutes: number;
  setMinMinutes: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  teams: FplTeam[];
  positions: FplElementType[];
  onReset: () => void;
  maxMinutesAvailable: number;
  highestPriceAvailable: number;
  visible: boolean;
  visibilityToggle: () => void;
}

export const Filters: React.FC<FiltersProps> = ({
  search,
  setSearch,
  selectedTeam,
  setSelectedTeam,
  selectedPosition,
  setSelectedPosition,
  minMinutes,
  setMinMinutes,
  maxPrice,
  setMaxPrice,
  teams,
  positions,
  onReset,
  maxMinutesAvailable = 3420,
  highestPriceAvailable = 15.5,
  visible,
  visibilityToggle,
}) => {
  return (
    <motion.section className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Filter & Refine</h3>
        </div>
        <button
          type="button"
          onClick={visibilityToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90"
          aria-label="Toggle filters"
        >
          {visible ? <LuChevronUp size={18} /> : <LuChevronDown size={18} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.9fr_1.4fr]">
              <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5">
                <LuSearch size={16} className="text-slate-400" />
                <input
                  type="text"
                  className="w-full border-0 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  placeholder="Search player name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-400 focus:outline-none"
                value={selectedTeam}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTeam(val === "all" ? "all" : parseInt(val));
                }}
              >
                <option value="all">All teams</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    selectedPosition === "all"
                      ? "border-sky-400 bg-sky-500/15 text-sky-200"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                  }`}
                  onClick={() => setSelectedPosition("all")}
                >
                  All
                </button>
                {positions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selectedPosition === p.id
                        ? "border-violet-400 bg-violet-500/15 text-violet-200"
                        : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                    }`}
                    onClick={() => setSelectedPosition(p.id)}
                  >
                    {p.singular_name_short}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 border-t border-slate-700/70 pt-5 lg:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Min minutes played</span>
                  <span className="font-medium text-cyan-300">{minMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxMinutesAvailable}
                  step={90}
                  value={minMinutes}
                  onChange={(e) => setMinMinutes(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>0</span>
                  <span>{maxMinutesAvailable} mins</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Max price (£)</span>
                  <span className="font-medium text-fuchsia-300">£{maxPrice.toFixed(1)}m</span>
                </div>
                <input
                  type="range"
                  min={4.0}
                  max={highestPriceAvailable}
                  step={0.1}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>£4.0m</span>
                  <span>£{highestPriceAvailable.toFixed(1)}m</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90"
              >
                <LuRotateCcw size={14} />
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
