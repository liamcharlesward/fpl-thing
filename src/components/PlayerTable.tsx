import React, { useState, useEffect } from "react";
import type { ProcessedPlayer } from "../services/FplBootstrapService";
import { LuArrowUpDown, LuArrowUp, LuArrowDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Badge } from "./Badge";

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

  // Reset to page 1 whenever the underlying player list changes (filter / sort)
  useEffect(() => {
    const id = window.setTimeout(() => setPage(1), 0);
    return () => clearTimeout(id);
  }, [players]);

  const totalPages = Math.max(1, Math.ceil(players.length / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const pagePlayers = players.slice(startIdx, startIdx + PAGE_SIZE);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <LuArrowUpDown size={12} style={{ marginLeft: 4, opacity: 0.5 }} />;
    }
    return sortDirection === "asc" ? (
      <LuArrowUp size={12} style={{ marginLeft: 4, color: "var(--color-secondary)" }} />
    ) : (
      <LuArrowDown size={12} style={{ marginLeft: 4, color: "var(--color-secondary)" }} />
    );
  };

  const getPositionBadgeStyle = (posShort: string) => {
    switch (posShort) {
      case "GKP":
        return { color: "var(--color-secondary)", background: "var(--color-secondary-bg)" };
      case "DEF":
        return { color: "var(--color-success)", background: "var(--color-success-bg)" };
      case "MID":
        return { color: "var(--color-primary)", background: "var(--color-primary-bg)" };
      case "FWD":
        return { color: "var(--color-accent)", background: "var(--color-accent-bg)" };
      default:
        return {};
    }
  };

  /** Build the list of page numbers / ellipsis tokens to display. */
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
    <div className="glass-card flex flex-col gap-4" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Player Leaderboard</h3>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{players.length} players</span>
      </div>

      <div className="table-area">
        {players.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
            No players match the criteria
          </div>
        ) : (
          <table className="players-table">
            <thead>
              <tr>
                <th onClick={() => onSort("webName")}>Player {renderSortIcon("webName")}</th>
                <th onClick={() => onSort("teamShort")}>Team {renderSortIcon("teamShort")}</th>
                <th onClick={() => onSort("positionShort")}>Pos {renderSortIcon("positionShort")}</th>
                <th onClick={() => onSort("pointsPerMatch")} style={{ textAlign: "right" }}>
                  Pts per Match {renderSortIcon("pointsPerMatch")}
                </th>
                <th onClick={() => onSort("cost")} style={{ textAlign: "right" }}>
                  Price {renderSortIcon("cost")}
                </th>
                <th onClick={() => onSort("totalPoints")} style={{ textAlign: "right" }}>
                  Total Pts {renderSortIcon("totalPoints")}
                </th>
                <th onClick={() => onSort("pointsPerMillion")} style={{ textAlign: "right" }}>
                  Pts per Million {renderSortIcon("pointsPerMillion")}
                </th>
                <th onClick={() => onSort("pointsPerMatchPerMil")} style={{ textAlign: "right" }}>
                  PPM/£Mil {renderSortIcon("pointsPerMatchPerMil")}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagePlayers.map((p) => {
                const isSelected = selectedPlayer?.id === p.id;
                return (
                  <tr
                    key={p.id}
                    className={isSelected ? "selected" : ""}
                    onClick={() => onSelectPlayer(p)}
                    style={{ cursor: "pointer" }}
                  >
                    {p.webName == p.lastName ? (
                      <td>
                        {p.firstName}
                        <span style={{ fontWeight: 600 }}> {p.lastName}</span>
                      </td>
                    ) : (
                      <td style={{ fontWeight: 600 }}>{p.webName}</td>
                    )}
                    <td>
                      <Badge text={p.teamShort} colour={p.teamShort.toLowerCase()} />
                    </td>
                    <td>
                      {/* TODO: Replace with badge */}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.4rem",
                          borderRadius: 4,
                          ...getPositionBadgeStyle(p.positionShort),
                        }}
                      >
                        {p.positionShort}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "var(--color-secondary)" }}>
                      {p.pointsPerMatch.toFixed(1)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600 }}>£{p.cost.toFixed(1)}m</td>
                    <td style={{ textAlign: "right" }}>{p.totalPoints}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "var(--color-accent)" }}>
                      {p.pointsPerMillion.toFixed(1)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "var(--color-accent)" }}>
                      {p.pointsPerMatchPerMil.toString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls — only shown when there is more than one page */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <span className="pagination-info">
            Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, players.length)} of {players.length}
          </span>
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <LuChevronLeft size={15} />
            </button>

            {buildPageNumbers().map((item, i) =>
              item === "…" ? (
                <span key={`ellipsis-${i}`} className="page-btn ellipsis">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  className={`page-btn${page === item ? " active" : ""}`}
                  onClick={() => setPage(item as number)}
                >
                  {item}
                </button>
              ),
            )}

            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <LuChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
