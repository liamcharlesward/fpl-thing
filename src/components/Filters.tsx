import React from "react";
import { LuRotateCcw } from "react-icons/lu";
import type { FplTeam, FplElementType } from "../services/FplBootstrapService";
import { motion, AnimatePresence } from "motion/react";
import { FilterSlider } from "./FilterSlider";
import { DropdownMultiSelect, type DropdownMultiSelectOption } from "./DropdownMultiSelect";

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
  const teamMultiSelectOptions: DropdownMultiSelectOption[] = teams.map((team) => ({
    id: team.id,
    name: team.name,
  }));

  const positionMultiSelectOptions: DropdownMultiSelectOption[] = positions.map((position) => ({
    id: position.id,
    name: position.singular_name,
  }));

  return (
    <motion.section className="rounded-2xl border border-slate-700/80 bg-slate-900/85 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.35)] backdrop-blur-lg w-xl">
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          {/* Dropdowns */}
          <div className="grid gap-4 lg:grid-cols-2">
            <DropdownMultiSelect
              options={teamMultiSelectOptions}
              selected={selectedTeams}
              showAllOption
              label="Teams"
              setSelected={setSelectedTeams}
            />

            <DropdownMultiSelect
              options={positionMultiSelectOptions}
              selected={selectedPositions}
              label="Positions"
              setSelected={setSelectedPositions}
            />
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
              accent="slate"
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
              accent="cyan"
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
              accent="pink"
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
