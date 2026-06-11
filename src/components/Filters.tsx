import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import type { FplTeam, FplElementType } from '../data/mockPlayers';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedTeam: number | 'all';
  setSelectedTeam: (val: number | 'all') => void;
  selectedPosition: number | 'all';
  setSelectedPosition: (val: number | 'all') => void;
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
    <motion.div className="glass-card">
      <div className='filter-section'>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filter & Refine</h3>
        <div onClick={visibilityToggle} style={{ cursor: "pointer" }}>{visible ? <ChevronUp /> : <ChevronDown />}</div>
      </div>
      <AnimatePresence initial={visible}>
        {visible &&
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.25 },
              opacity: { duration: 0.15 }
            }}
            style={{ overflow: 'hidden' }}
          >
            <div className="filter-section">
              <div className='custom-select-wrapper'>
                {/* Search */}
                <div className="search-input-wrapper">
                  <span className="search-icon">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by player name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Team Selector */}
              <div className="custom-select-wrapper">
                <select
                  className="custom-select"
                  value={selectedTeam}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedTeam(val === 'all' ? 'all' : parseInt(val));
                  }}
                >
                  <option value="all">All Teams</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Position Selector */}
              <div className="custom-select-wrapper">
                <div className="pills-container">
                  <button
                    className={`pill-button ${selectedPosition === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedPosition('all')}
                  >
                    All
                  </button>
                  {positions.map((p) => (
                    <button
                      key={p.id}
                      className={`pill-button ${selectedPosition === p.id ? 'active' : ''}`}
                      onClick={() => setSelectedPosition(p.id)}
                    >
                      {p.singular_name_short}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-section" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              {/* Minutes Slider */}
              <div className="range-slider-wrapper">
                <div className="custom-label">
                  <span>Min Minutes Played</span>
                  <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
                    {minMinutes} mins
                  </span>
                </div>
                <input
                  type="range"
                  className="range-slider"
                  min={0}
                  max={maxMinutesAvailable}
                  step={90}
                  value={minMinutes}
                  onChange={(e) => setMinMinutes(parseInt(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>0</span>
                  <span>{maxMinutesAvailable} mins</span>
                </div>
              </div>

              {/* Price Slider */}
              <div className="range-slider-wrapper">
                <div className="custom-label">
                  <span>Max Price (£)</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                    £{maxPrice.toFixed(1)}m
                  </span>
                </div>
                <input
                  type="range"
                  className="range-slider"
                  min={4.0}
                  max={highestPriceAvailable}
                  step={0.1}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>£4.0m</span>
                  <span>£{highestPriceAvailable.toFixed(1)}m</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="reset-button" onClick={onReset}>
                <RotateCcw size={14} />
                Reset Filters
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>
  );
};
