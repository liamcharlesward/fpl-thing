import React from "react";
import { LuRotateCcw, LuCheck, LuChevronDown } from "react-icons/lu";
import type { FplTeam, FplElementType } from "../services/FplBootstrapService";
import { motion, AnimatePresence } from "motion/react";
import { DropdownMenu, Slider } from "radix-ui";

interface FiltersProps {
  selectedTeams: number[];
  setSelectedTeams: (val: number[]) => void;
  selectedPositions: number[];
  setSelectedPositions: (val: number[]) => void;
  minMinutes: number;
  setMinMinutes: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  teams: FplTeam[];
  positions: FplElementType[];
  onReset: () => void;
  maxMinutesAvailable: number;
  highestPriceAvailable: number;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedTeams,
  setSelectedTeams,
  selectedPositions,
  setSelectedPositions,
  minMinutes,
  setMinMinutes,
  maxPrice,
  setMaxPrice,
  teams,
  positions,
  onReset,
  maxMinutesAvailable = 3420,
  highestPriceAvailable = 15.5,
}) => {
  return (
    <motion.section className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)] backdrop-blur-lg w-2xl max-w-2xl">
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
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Min minutes played</span>
                <span className="font-medium text-cyan-300">{minMinutes} mins</span>
              </div>
              <Slider.Root
                value={[minMinutes]}
                onValueChange={([val]) => setMinMinutes(val)}
                min={0}
                max={maxMinutesAvailable}
                step={90}
                className="relative flex w-full touch-none select-none items-center py-1 cursor-pointer"
              >
                <Slider.Track className="relative h-2 grow rounded-full bg-slate-800 border border-slate-700/80">
                  <Slider.Range className="absolute h-full rounded-full bg-cyan-400" />
                </Slider.Track>
                <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-cyan-400 bg-slate-950 shadow-md transition-colors hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900" />
              </Slider.Root>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0</span>
                <span>{maxMinutesAvailable} mins</span>
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Max price (£)</span>
                <span className="font-medium text-fuchsia-300">£{maxPrice.toFixed(1)}m</span>
              </div>
              <Slider.Root
                value={[maxPrice]}
                onValueChange={([val]) => setMaxPrice(val)}
                min={4.0}
                max={highestPriceAvailable}
                step={0.1}
                className="relative flex w-full touch-none select-none items-center py-1 cursor-pointer"
              >
                <Slider.Track className="relative h-2 grow rounded-full bg-slate-800 border border-slate-700/80">
                  <Slider.Range className="absolute h-full rounded-full bg-fuchsia-400" />
                </Slider.Track>
                <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-fuchsia-400 bg-slate-950 shadow-md transition-colors hover:scale-110 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-slate-900" />
              </Slider.Root>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>£4.0m</span>
                <span>£{highestPriceAvailable.toFixed(1)}m</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-end border-slate-700/70">
            <button
              type="button"
              onClick={onReset}
              className="w-1/4 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/90 cursor-pointer"
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
