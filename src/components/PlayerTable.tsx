import React, { useState, useEffect } from 'react';
import type { ProcessedPlayer } from '../services/fplService';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

export type SortField = 'webName' | 'teamShort' | 'positionShort' | 'pointsPerGame' | 'totalPoints' | 'cost' | 'value';
export type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 50;

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
  onSort
}) => {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the underlying player list changes (filter / sort)
  useEffect(() => {
    setPage(1);
  }, [players]);

  const totalPages = Math.max(1, Math.ceil(players.length / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const pagePlayers = players.slice(startIdx, startIdx + PAGE_SIZE);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} style={{ marginLeft: 4, opacity: 0.5 }} />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp size={12} style={{ marginLeft: 4, color: 'var(--color-secondary)' }} />
      : <ArrowDown size={12} style={{ marginLeft: 4, color: 'var(--color-secondary)' }} />;
  };

  const getPositionBadgeStyle = (posShort: string) => {
    switch (posShort) {
      case 'GKP': return { color: 'var(--color-secondary)', background: 'rgba(6, 182, 212, 0.1)' };
      case 'DEF': return { color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.1)' };
      case 'MID': return { color: 'var(--color-primary)', background: 'rgba(168, 85, 247, 0.1)' };
      case 'FWD': return { color: 'var(--color-accent)', background: 'rgba(236, 72, 153, 0.1)' };
      default: return {};
    }
  };

  /** Build the list of page numbers / ellipsis tokens to display. */
  const buildPageNumbers = (): (number | '…')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '…')[] = [1];
    if (page > 3) pages.push('…');
    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="glass-card flex flex-col gap-4" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Player Leaderboard</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {players.length} players
        </span>
      </div>

      <div className="table-area">
        {players.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No players match the criteria
          </div>
        ) : (
          <table className="players-table">
            <thead>
              <tr>
                <th onClick={() => onSort('webName')}>
                  Player {renderSortIcon('webName')}
                </th>
                <th onClick={() => onSort('teamShort')}>
                  Team {renderSortIcon('teamShort')}
                </th>
                <th onClick={() => onSort('positionShort')}>
                  Pos {renderSortIcon('positionShort')}
                </th>
                <th onClick={() => onSort('pointsPerGame')} style={{ textAlign: 'right' }}>
                  PPG {renderSortIcon('pointsPerGame')}
                </th>
                <th onClick={() => onSort('cost')} style={{ textAlign: 'right' }}>
                  Price {renderSortIcon('cost')}
                </th>
                <th onClick={() => onSort('totalPoints')} style={{ textAlign: 'right' }}>
                  Total Pts {renderSortIcon('totalPoints')}
                </th>
                <th onClick={() => onSort('value')} style={{ textAlign: 'right' }}>
                  Pts per Million {renderSortIcon('value')}
                </th>
              </tr>
            </thead>
            <tbody>
              {pagePlayers.map((p) => {
                const isSelected = selectedPlayer?.id === p.id;
                return (
                  <tr
                    key={p.id}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => onSelectPlayer(p)}
                    style={{ cursor: 'pointer' }}
                  >
                    {p.webName == p.lastName
                      ? <td>{p.firstName}<span style={{ fontWeight: 600 }}> {p.lastName}</span></td>
                      : <td style={{ fontWeight: 600 }}>{p.webName}</td>
                    }
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {p.teamShort}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.4rem',
                          borderRadius: 4,
                          ...getPositionBadgeStyle(p.positionShort)
                        }}
                      >
                        {p.positionShort}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-secondary)' }}>
                      {p.pointsPerGame.toFixed(1)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      £{p.cost.toFixed(1)}m
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {p.totalPoints}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-accent)' }}>
                      {p.value.toFixed(1)}
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
              <ChevronLeft size={15} />
            </button>

            {buildPageNumbers().map((item, i) =>
              item === '…' ? (
                <span key={`ellipsis-${i}`} className="page-btn ellipsis">…</span>
              ) : (
                <button
                  key={item}
                  className={`page-btn${page === item ? ' active' : ''}`}
                  onClick={() => setPage(item as number)}
                >
                  {item}
                </button>
              )
            )}

            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
