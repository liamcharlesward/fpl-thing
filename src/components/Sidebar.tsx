import React from "react";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
import { motion, AnimatePresence } from "motion/react";
import { FaX } from "react-icons/fa6";
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
          className="fixed top-0 right-0 h-full min-w-1/3 max-w-1/2 bg-gray-800 z-50 overflow-y-auto flex-8 shadow-3xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex w-full justify-end bg-gray-900 p-2">
            <button type="button" onClick={onClose} aria-label="Close sidebar">
              <FaX className="text-xl text-white cursor-pointer" />
            </button>
          </div>

          <div className="p-2">
            <PlayerDetailLayout player={selectedPlayer} playerHistory={history} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
