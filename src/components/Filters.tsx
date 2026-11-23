import React from "react";
import { LuRotateCcw, LuCheck, LuChevronDown } from "react-icons/lu";
import type { FplTeam, FplElementType } from "../services/FplBootstrapService";
import { motion, AnimatePresence } from "motion/react";
import { DropdownMenu } from "radix-ui";
import { FilterSlider } from "./FilterSlider";

export interface FiltersProps {
  selectedTeams: number[];
  setSelectedTeams: (val: number[]) => void;
  selectedPositions: number[];
  setSelectedPositions: (val: number[]) => void;
  minMinutes: number;
  setMinMinutes: (val: number) => void;
  minPoints: number;
  setMinPoints: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  teams: FplTeam[];
  positions: FplElementType[];
  onReset: () => void;
  maxMinutesAvailable: number;
  highestPriceAvailable: number;
  maxPointsAvailable: number;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedTeams,
  setSelectedTeams,
  selectedPositions,
  setSelectedPositions,
  minMinutes,
  setMinMinutes,
  minPoints,
  setMinPoints,
  maxPrice,
  setMaxPrice,
  teams,
  positions,
  onReset,
  maxPointsAvailable = 100,
  maxMinutesAvailable = 3420,
  highestPriceAvailable = 15.5,
}) => {
  return (
    <motion.section className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)] backdrop-blur-lg w-2xl max-w-xl">
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {/* Dropdows */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* TEAMS */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <div className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-400 focus:outline-none flex flex-row items-center justify-between w-full cursor-pointer">
                  <span>{selectedTeams.length === teams.length ? "All Teams" : `${selectedTeams.length} Teams`}</span>
                  <LuChevronDown className="text-slate-400" size={16} />
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={6}
                  className="z-50 min-w-50 max-h-60 overflow-y-auto rounded-xl border border-slate-700/80 bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md outline-none"
                >
                  {teams.map((t) => (
                    <DropdownMenu.Item
                      key={t.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white"
                      onSelect={(e) => {
                        e.preventDefault();
                        setSelectedTeams(
                          selectedTeams.includes(t.id)
                            ? selectedTeams.filter((id) => id !== t.id)
                            : [...selectedTeams, t.id],
                        );
                      }}
                    >
                      <span>{t.name}</span>
                      {selectedTeams.includes(t.id) && <LuCheck className="text-cyan-400" size={16} />}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* POSITIONS */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <div className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-sm text-slate-100 focus:border-sky-400 focus:outline-none flex flex-row items-center justify-between w-full cursor-pointer">
                  <span>
                    {selectedPositions.length === positions.length
                      ? "All Positions"
                      : selectedPositions.length === 2
                        ? selectedPositions.map((p) => positions[p - 1].singular_name + "s").join(" and ")
                        : selectedPositions.map((p) => positions[p - 1].singular_name + "s").join(", ")}
                  </span>
                  <LuChevronDown className="text-slate-400" size={16} />
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={6}
                  className="z-50 min-w-50 max-h-60 overflow-y-auto rounded-xl border border-slate-700/80 bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md outline-none"
                >
                  {positions.map((p) => (
                    <DropdownMenu.Item
                      key={p.id}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white"
                      onSelect={(e) => {
                        e.preventDefault();
                        setSelectedPositions(
                          selectedPositions.includes(p.id)
                            ? selectedPositions.filter((id) => id !== p.id)
                            : [...selectedPositions, p.id],
                        );
                      }}
                    >
                      <span>{p.singular_name}</span>
                      {selectedPositions.includes(p.id) && <LuCheck className="text-cyan-400" size={16} />}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-4 pt-4 mt-4 border-t border-slate-700/70">
            {/* Min Minutes Slider */}
            <FilterSlider
              state={minMinutes}
              stateCallback={setMinMinutes}
              min={0}
              max={maxMinutesAvailable}
              step={90}
              sliderLabel="Minimum minutes played"
              suffix=" minutes"
            />

            {/* Min Points Slider */}
            <FilterSlider
              state={minPoints}
              stateCallback={setMinPoints}
              min={0}
              max={maxPointsAvailable}
              step={5}
              sliderLabel="Minimum points scored"
              suffix=" points"
            />

            {/* Max Price Slider */}
            <FilterSlider
              state={maxPrice}
              stateCallback={setMaxPrice}
              min={0}
              max={highestPriceAvailable}
              step={0.5}
              sliderLabel="Maximum price"
              prefix="£"
              suffix="m"
            />
          </div>

          <div className="mt-4 pt-4 border-t flex justify-end border-slate-700/70">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90 cursor-pointer"
            >
              <LuRotateCcw size={14} />
              Reset Filters
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
};
