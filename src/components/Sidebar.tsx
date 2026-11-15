import React from "react";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { PlayerDetailLayout } from "./PlayerDetailLayout";
import type { FplHistory } from "../services/FplHistoryService";

interface SidebarProps {
  selectedPlayer: ProcessedPlayer | null;
  playerHistory: FplHistory[] | null;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedPlayer, playerHistory, onClose }) => {
  const history = playerHistory ?? [];

  return (
    <AnimatePresence mode="wait">
      {selectedPlayer && (
        <motion.aside
          key={selectedPlayer.id}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-xl border-l border-slate-700/80 bg-slate-950/95 shadow-[-18px_0_50px_rgba(2,6,23,0.6)] backdrop-blur-xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-3">
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Player Details</div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800/90"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-[calc(100vh-57px)] overflow-y-auto px-4 py-4">
            <PlayerDetailLayout player={selectedPlayer} playerHistory={history} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
