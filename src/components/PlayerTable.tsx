import React, { useState, useEffect } from "react";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
import { LuArrowUpDown, LuArrowUp, LuArrowDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Badge } from "./Badge";
import { getPositionBadge } from "../services/PlayerBadgeService";

export type SortField =
  | "webName"
  | "teamShort"
  | "positionShort"
  | "pointsPerMatch"
  | "totalPoints"
  | "cost"
  | "pointsPerMillion"
  | "pointsPerMatchPerMil";
export type SortDirection = "asc" | "desc";

const PAGE_SIZE = 25;

interface PlayerTableProps {
  players: ProcessedPlayer[];
  selectedPlayer: ProcessedPlayer | null;
  onSelectPlayer: (player: ProcessedPlayer) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  selectedPlayer,
  onSelectPlayer,
  sortField,
  sortDirection,
  onSort,
}) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = window.setTimeout(() => setPage(1), 0);
    return () => clearTimeout(id);
  }, [players]);

  const totalPages = Math.max(1, Math.ceil(players.length / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const pagePlayers = players.slice(startIdx, startIdx + PAGE_SIZE);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <LuArrowUpDown size={12} className="ml-1 opacity-60" />;
    }
    return sortDirection === "asc" ? (
      <LuArrowUp size={12} className="ml-1 text-cyan-300" />
    ) : (
      <LuArrowDown size={12} className="ml-1 text-cyan-300" />
    );
  };

  // TODO: Merge with function in PlayerDetailLayout and move into standalone service file
  // const getPositionBadgeStyle = (posShort: string) => {
  //   switch (posShort) {
  //     case "GKP":
  //       return "border border-cyan-400/30 bg-cyan-500/10 text-cyan-200";
  //     case "DEF":
  //       return "border border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  //     case "MID":
  //       return "border border-violet-400/30 bg-violet-500/10 text-violet-200";
  //     case "FWD":
  //       return "border border-pink-400/30 bg-pink-500/10 text-pink-200";
  //     default:
  //       return "border border-slate-600 bg-slate-700 text-slate-200";
  //   }
  // };

  const buildPageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40">
        {players.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">No players match the criteria</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-200">
              <thead className="bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="cursor-pointer px-3 py-3 font-medium" onClick={() => onSort("webName")}>
                    Player {renderSortIcon("webName")}
                  </th>
                  <th className="cursor-pointer px-3 py-3 font-medium" onClick={() => onSort("teamShort")}>
                    Team {renderSortIcon("teamShort")}
                  </th>
                  <th className="cursor-pointer px-3 py-3 font-medium" onClick={() => onSort("positionShort")}>
                    Pos {renderSortIcon("positionShort")}
                  </th>
                  <th
                    className="cursor-pointer px-3 py-3 text-right font-medium"
                    onClick={() => onSort("pointsPerMatch")}
                  >
                    PPM {renderSortIcon("pointsPerMatch")}
                  </th>
                  <th className="cursor-pointer px-3 py-3 text-right font-medium" onClick={() => onSort("cost")}>
                    Price {renderSortIcon("cost")}
                  </th>
                  <th className="cursor-pointer px-3 py-3 text-right font-medium" onClick={() => onSort("totalPoints")}>
                    Total {renderSortIcon("totalPoints")}
                  </th>
                  <th
                    className="cursor-pointer px-3 py-3 text-right font-medium"
                    onClick={() => onSort("pointsPerMillion")}
                  >
                    Pts/£m {renderSortIcon("pointsPerMillion")}
                  </th>
                  <th
                    className="cursor-pointer px-3 py-3 text-right font-medium"
                    onClick={() => onSort("pointsPerMatchPerMil")}
                  >
                    PPM/£m {renderSortIcon("pointsPerMatchPerMil")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagePlayers.map((p) => {
                  const isSelected = selectedPlayer?.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      className={`cursor-pointer transition hover:bg-slate-800/70 ${isSelected ? "bg-sky-500/10" : "bg-transparent"}`}
                      onClick={() => onSelectPlayer(p)}
                    >
                      <td className="border-t border-slate-800 px-3 py-2.5 font-medium text-slate-100">
                        {p.webName === p.lastName ? (
                          <>
                            {p.firstName} <span className="font-semibold">{p.lastName}</span>
                          </>
                        ) : (
                          p.webName
                        )}
                      </td>
                      <td className="border-t border-slate-800 px-3 py-2.5">
                        <Badge text={p.teamShort} teamColour={p.teamShort.toLowerCase()} />
                      </td>
                      <td className="border-t border-slate-800 px-3 py-2.5">
                        <span>
                          {getPositionBadge({
                            position: p.positionShort,
                            hasBorder: true,
                            hasIcon: false,
                            longPosName: false,
                          })}
                        </span>
                      </td>
                      <td className="border-t border-slate-800 px-3 py-2.5 text-right font-semibold text-cyan-300">
                        {p.pointsPerMatch.toFixed(1)}
                      </td>
                      <td className="border-t border-slate-800 px-3 py-2.5 text-right font-medium text-slate-200">
                        £{p.cost.toFixed(1)}m
                      </td>
                      <td className="border-t border-slate-800 px-3 py-2.5 text-right text-slate-300">
                        {p.totalPoints}
                      </td>
                      <td className="border-t border-slate-800 px-3 py-2.5 text-right font-medium text-fuchsia-300">
                        {p.pointsPerMillion.toFixed(1)}
                      </td>
                      <td className="border-t border-slate-800 px-3 py-2.5 text-right font-medium text-fuchsia-300">
                        {p.pointsPerMatchPerMil.toString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
          <span>
            Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, players.length)} of {players.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <LuChevronLeft size={14} />
            </button>

            {buildPageNumbers().map((item, i) =>
              item === "…" ? (
                <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-slate-500">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold ${
                    page === item
                      ? "border-sky-400 bg-sky-500/15 text-sky-200"
                      : "border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500"
                  }`}
                  onClick={() => setPage(item as number)}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <LuChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
