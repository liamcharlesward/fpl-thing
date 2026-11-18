import React from "react";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { PlayerDetailLayout } from "./PlayerDetailLayout";
import type { FplHistory } from "../services/FplHistoryService";

interface ModalProps {
  selectedPlayer: ProcessedPlayer | null;
  playerHistory: FplHistory[] | null;
  allPlayers: ProcessedPlayer[];
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ selectedPlayer, playerHistory, allPlayers, onClose }) => {
  const history = playerHistory ?? [];

  return (
    <AnimatePresence mode="wait">
      {selectedPlayer && (
        <motion.div
          key={selectedPlayer.id}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
          onClick={onClose}
        >
          <div
            className="overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-3">
              {/* TODO: Componentise button */}
              <h3 className="mt-2 text-2xl font-bold text-slate-50">
                <span className="font-medium text-slate-300">{selectedPlayer.firstName}</span>{" "}
                <span>{selectedPlayer.lastName}</span>
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/90 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(96vh-57px)] overflow-y-auto px-4 py-4">
              <PlayerDetailLayout player={selectedPlayer} playerHistory={history} allPlayers={allPlayers} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
